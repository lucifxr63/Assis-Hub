"use client"

/**
 * DashboardScreen — Pantalla de inicio (reemplaza summary genérico)
 *
 * DATA SOURCE
 * ───────────
 * GET /api/agent/status  →  estado, uptime, tokensToday, lastActivity
 * GET /api/agent/config  →  briefingTime (próxima alarma del briefing)
 *
 * MOCK MODE
 * ─────────
 * Ambas llamadas retornan datos de lib/mock.ts con 650ms de delay simulado.
 * Al enchufar el backend real, solo cambia NEXT_PUBLIC_USE_MOCK=false.
 */

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Activity,
  Clock,
  Zap,
  Settings,
  MessageSquare,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getAgentStatus, getAgentConfig } from "@/lib/api"
import type { AgentStatus, AgentConfig, AgentStatusValue } from "@/lib/types"
import type { ClientScreen } from "../../../client-app"

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns a human-readable relative time string in Spanish. */
function relativeTime(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime()
  const minutes = Math.floor(diffMs / 60_000)
  if (minutes < 1) return "hace un momento"
  if (minutes < 60) return `hace ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `hace ${hours}h`
  return `hace ${Math.floor(hours / 24)}d`
}

/** Returns the next occurrence of a "HH:MM" briefing time as a display string. */
function nextBriefing(briefingTime: string): string {
  const [h, m] = briefingTime.split(":").map(Number)
  const now = new Date()
  const next = new Date(now)
  next.setHours(h, m, 0, 0)
  if (next <= now) next.setDate(next.getDate() + 1)
  const diffMin = Math.round((next.getTime() - now.getTime()) / 60_000)
  if (diffMin < 60) return `en ${diffMin} min`
  const diffH = Math.floor(diffMin / 60)
  return diffH < 24 ? `en ${diffH}h` : "mañana"
}

const STATUS_STYLES: Record<AgentStatusValue, { label: string; dot: string; text: string }> = {
  active:   { label: "Activo",   dot: "bg-green-500",  text: "text-green-600 dark:text-green-400" },
  inactive: { label: "Inactivo", dot: "bg-yellow-500", text: "text-yellow-600 dark:text-yellow-400" },
  error:    { label: "Error",    dot: "bg-destructive", text: "text-destructive" },
}

// ─── Component ────────────────────────────────────────────────────────────────

interface DashboardScreenProps {
  userName: string
  onNavigate: (screen: ClientScreen) => void
}

export function ClientSummaryScreen({ userName, onNavigate }: DashboardScreenProps) {
  const [agent, setAgent] = useState<AgentStatus | null>(null)
  const [config, setConfig] = useState<AgentConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  async function fetchData() {
    setLoading(true)
    setError(false)
    try {
      // Both calls in parallel
      const [statusRes, configRes] = await Promise.all([
        getAgentStatus(),
        getAgentConfig(),
      ])
      setAgent(statusRes.agent)
      setConfig(configRes.config)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="p-5 space-y-5 animate-pulse">
          <div className="pt-2 space-y-2">
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-7 w-40 bg-muted rounded" />
          </div>
          <div className="h-32 bg-muted rounded-2xl" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-24 bg-muted rounded-2xl" />
            <div className="h-24 bg-muted rounded-2xl" />
          </div>
          <div className="h-20 bg-muted rounded-2xl" />
        </div>
      </div>
    )
  }

  // ── Error state ─────────────────────────────────────────────────────────────
  if (error || !agent) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 p-5">
        <AlertCircle className="h-10 w-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground text-center">
          No se pudo conectar con el agente.
        </p>
        <Button variant="outline" size="sm" onClick={fetchData} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Reintentar
        </Button>
      </div>
    )
  }

  const statusStyle = STATUS_STYLES[agent.status]

  // ── Main render ─────────────────────────────────────────────────────────────
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-5 space-y-5">

        {/* Header */}
        <div className="pt-2 flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Bienvenido</p>
            <h1 className="text-2xl font-semibold text-foreground">{userName}</h1>
          </div>
          <button
            onClick={fetchData}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Actualizar"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {/* Agent status card */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-muted-foreground">Tu agente</p>
                <p className="font-semibold text-foreground">{agent.name}</p>
              </div>
              {/* Status badge */}
              <div className={cn("flex items-center gap-1.5 text-xs font-medium", statusStyle.text)}>
                <span className={cn("h-2 w-2 rounded-full", statusStyle.dot)} />
                {statusStyle.label}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Última actividad</p>
                  <p className="font-medium text-foreground text-xs">{relativeTime(agent.lastActivity)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Activity className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Uptime</p>
                  <p className="font-medium text-foreground text-xs">{agent.uptime}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Tokens today */}
          <Card className="bg-primary/5 border-0">
            <CardContent className="p-4">
              <Zap className="h-5 w-5 text-primary mb-2" />
              <p className="text-2xl font-bold text-primary">
                {agent.tokensToday.toLocaleString("es")}
              </p>
              <p className="text-[11px] text-muted-foreground">Tokens hoy</p>
            </CardContent>
          </Card>

          {/* Next briefing */}
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <Clock className="h-5 w-5 text-muted-foreground mb-2" />
              <p className="text-2xl font-bold text-foreground">
                {config ? config.briefingTime : "—"}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Briefing · {config ? nextBriefing(config.briefingTime) : "—"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick actions */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1 mb-3">
            Accesos rápidos
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-14 flex-col gap-1 rounded-2xl border-border"
              onClick={() => onNavigate("config")}
            >
              <Settings className="h-5 w-5" />
              <span className="text-xs">Configurar</span>
            </Button>
            <Button
              variant="outline"
              className="h-14 flex-col gap-1 rounded-2xl border-border opacity-50 cursor-not-allowed"
              disabled
            >
              <MessageSquare className="h-5 w-5" />
              <span className="text-xs">Chat · Fase 2</span>
            </Button>
          </div>
        </div>

        {/* Model info */}
        <p className="text-center text-[10px] text-muted-foreground">
          Modelo: {agent.model}
        </p>

      </div>
    </div>
  )
}
