"use client"

/**
 * ConfigScreen — Configuración del agente (reemplaza perfil genérico)
 *
 * DATA SOURCE
 * ───────────
 * GET   /api/agent/config  →  carga la configuración actual del agente
 * PATCH /api/agent/config  →  guarda solo los campos editables
 *
 * CAMPOS EDITABLES (según el middleware)
 * ──────────────────────────────────────
 * briefingTime → actualiza el cron del agente
 * timezone     → preferencia de zona horaria
 * language     → idioma de las respuestas (es | en)
 * agentName    → actualiza IDENTITY.md del agente
 * tone         → actualiza SOUL.md del agente (formal | casual | directo)
 *
 * CAMPOS READ-ONLY (MVP)
 * ──────────────────────
 * channels.whatsapp / telegram → solo visualización
 *
 * MOCK MODE
 * ─────────
 * getAgentConfig() y updateAgentConfig() retornan datos de lib/mock.ts.
 * Al enchufar el backend real, solo cambia NEXT_PUBLIC_USE_MOCK=false.
 */

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Check,
  X,
  Save,
  RefreshCw,
  AlertCircle,
  LogOut,
  Clock,
  Globe,
  MessageSquare,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getAgentConfig, updateAgentConfig, logout } from "@/lib/api"
import type { AgentConfig, Tone } from "@/lib/types"

// ─── Static options ───────────────────────────────────────────────────────────

const TONE_OPTIONS: { value: Tone; label: string; description: string }[] = [
  { value: "formal",   label: "Formal",   description: "Profesional y estructurado" },
  { value: "casual",   label: "Casual",   description: "Amigable y natural" },
  { value: "directo",  label: "Directo",  description: "Breve y al punto" },
]

const TIMEZONE_OPTIONS = [
  { value: "America/Santiago",    label: "Santiago (CLT/CLST)" },
  { value: "America/Lima",        label: "Lima (PET)" },
  { value: "America/Bogota",      label: "Bogotá (COT)" },
  { value: "America/Mexico_City", label: "Ciudad de México (CST/CDT)" },
  { value: "America/New_York",    label: "Nueva York (EST/EDT)" },
  { value: "America/Sao_Paulo",   label: "São Paulo (BRT)" },
  { value: "Europe/Madrid",       label: "Madrid (CET/CEST)" },
  { value: "UTC",                 label: "UTC" },
]

const LANGUAGE_OPTIONS = [
  { value: "es", label: "Español" },
  { value: "en", label: "English" },
]

// ─── Component ────────────────────────────────────────────────────────────────

interface ConfigScreenProps {
  onLogout: () => void
}

export function ClientProfileScreen({ onLogout }: ConfigScreenProps) {
  const [config, setConfig] = useState<AgentConfig | null>(null)
  const [draft, setDraft] = useState<AgentConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(false)

  async function fetchConfig() {
    setLoading(true)
    setError(false)
    try {
      const res = await getAgentConfig()
      setConfig(res.config)
      setDraft(res.config)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchConfig() }, [])

  function updateDraft<K extends keyof AgentConfig>(key: K, value: AgentConfig[K]) {
    setDraft((prev) => prev ? { ...prev, [key]: value } : prev)
    setSaved(false)
  }

  async function handleSave() {
    if (!draft || !config) return
    setSaving(true)
    try {
      const res = await updateAgentConfig({
        briefingTime: draft.briefingTime,
        timezone:     draft.timezone,
        language:     draft.language,
        agentName:    draft.agentName,
        tone:         draft.tone,
      })
      setConfig(res.config)
      setDraft(res.config)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      // Keep draft so the user can retry
    } finally {
      setSaving(false)
    }
  }

  async function handleLogout() {
    await logout()
    onLogout()
  }

  const isDirty = draft && config && JSON.stringify(draft) !== JSON.stringify(config)

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="p-5 space-y-5 animate-pulse">
          <div className="h-7 w-40 bg-muted rounded pt-2" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-muted rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  // ── Error state ─────────────────────────────────────────────────────────────
  if (error || !draft) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 p-5">
        <AlertCircle className="h-10 w-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground text-center">
          No se pudo cargar la configuración.
        </p>
        <Button variant="outline" size="sm" onClick={fetchConfig} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Reintentar
        </Button>
      </div>
    )
  }

  // ── Main render ─────────────────────────────────────────────────────────────
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-5 space-y-5">

        {/* Header */}
        <div className="pt-2 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">Configuración</h1>
          {saved && (
            <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
              <Check className="h-3.5 w-3.5" />
              Guardado
            </div>
          )}
        </div>

        {/* ── Identidad del agente ─────────────────────────────────────────── */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">
            Identidad
          </p>
          <Card className="bg-card border-border">
            <CardContent className="p-4 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="agentName" className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Nombre del agente
                </Label>
                <Input
                  id="agentName"
                  value={draft.agentName}
                  onChange={(e) => updateDraft("agentName", e.target.value)}
                  className="h-10 rounded-xl"
                  placeholder="Ej: Mi Asistente"
                />
                <p className="text-[11px] text-muted-foreground px-1">
                  Actualiza IDENTITY.md del agente
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Tono ─────────────────────────────────────────────────────────── */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">
            Tono
          </p>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <p className="text-[11px] text-muted-foreground mb-3">
                Define cómo responde tu agente. Actualiza SOUL.md.
              </p>
              <div className="grid grid-cols-3 gap-2">
                {TONE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateDraft("tone", opt.value)}
                    className={cn(
                      "flex flex-col items-center gap-1 p-3 rounded-xl border text-center transition-all text-xs",
                      draft.tone === opt.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    )}
                  >
                    <span className="font-medium">{opt.label}</span>
                    <span className="text-[10px] opacity-70 leading-tight hidden sm:block">
                      {opt.description}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Briefing ─────────────────────────────────────────────────────── */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">
            Briefing diario
          </p>
          <Card className="bg-card border-border">
            <CardContent className="p-4 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="briefingTime" className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  Hora del briefing
                </Label>
                <Input
                  id="briefingTime"
                  type="time"
                  value={draft.briefingTime}
                  onChange={(e) => updateDraft("briefingTime", e.target.value)}
                  className="h-10 rounded-xl w-36"
                />
                <p className="text-[11px] text-muted-foreground px-1">
                  Actualiza el cron del agente
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="timezone" className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  Zona horaria
                </Label>
                <select
                  id="timezone"
                  value={draft.timezone}
                  onChange={(e) => updateDraft("timezone", e.target.value)}
                  className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {TIMEZONE_OPTIONS.map((tz) => (
                    <option key={tz.value} value={tz.value}>{tz.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="language" className="flex items-center gap-2 text-sm">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  Idioma
                </Label>
                <select
                  id="language"
                  value={draft.language}
                  onChange={(e) => updateDraft("language", e.target.value as "es" | "en")}
                  className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {LANGUAGE_OPTIONS.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Canales (read-only MVP) ───────────────────────────────────────── */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">
            Canales conectados
            <span className="ml-2 normal-case font-normal text-muted-foreground/70">(solo lectura — MVP)</span>
          </p>
          <Card className="bg-card border-border">
            <CardContent className="p-0 divide-y divide-border">
              {/* WhatsApp */}
              <div className="flex items-center gap-3 p-4">
                <div className="h-9 w-9 rounded-xl bg-green-500 flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">WA</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">WhatsApp</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {draft.channels.whatsapp.phone ?? "Sin número"}
                  </p>
                </div>
                {draft.channels.whatsapp.connected
                  ? <Check className="h-4 w-4 text-green-500 shrink-0" />
                  : <X className="h-4 w-4 text-muted-foreground shrink-0" />
                }
              </div>

              {/* Telegram */}
              <div className="flex items-center gap-3 p-4 opacity-50">
                <div className="h-9 w-9 rounded-xl bg-blue-500 flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">TG</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Telegram</p>
                  <p className="text-xs text-muted-foreground">No conectado</p>
                </div>
                <X className="h-4 w-4 text-muted-foreground shrink-0" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Save button ───────────────────────────────────────────────────── */}
        <Button
          onClick={handleSave}
          disabled={!isDirty || saving}
          className={cn(
            "w-full h-11 rounded-xl gap-2 transition-all",
            saved && "bg-green-600 hover:bg-green-700"
          )}
        >
          {saving
            ? <><RefreshCw className="h-4 w-4 animate-spin" /> Guardando...</>
            : saved
            ? <><Check className="h-4 w-4" /> Guardado</>
            : <><Save className="h-4 w-4" /> Guardar cambios</>
          }
        </Button>

        {/* ── Logout ───────────────────────────────────────────────────────── */}
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </Button>

        <p className="text-center text-[10px] text-muted-foreground pb-2">
          Portal de Usuarios · v1.0.0
        </p>
      </div>
    </div>
  )
}
