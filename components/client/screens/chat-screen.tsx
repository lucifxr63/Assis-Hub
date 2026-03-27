"use client"

/**
 * ChatScreen — Placeholder Fase 2
 *
 * Esta pantalla será el chat web con el agente en Fase 2.
 *
 * IMPLEMENTACIÓN FUTURA (Fase 2)
 * ──────────────────────────────
 * POST /api/agent/chat              → enviar mensaje al agente
 * GET  /api/agent/chat/stream (SSE) → respuesta en streaming
 * GET  /api/agent/history           → historial de conversaciones
 *
 * El backend usa POST /v1/chat/completions con x-openclaw-agent-id: <agentId>
 * Para streaming: EventSource o fetch con ReadableStream
 */

import { MessageSquare, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function ClientChatScreen() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 gap-5">

      {/* Icon */}
      <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
        <MessageSquare className="h-8 w-8 text-muted-foreground" />
      </div>

      {/* Text */}
      <div className="text-center space-y-2">
        <h2 className="text-lg font-semibold text-foreground">Chat web</h2>
        <p className="text-sm text-muted-foreground max-w-xs">
          Pronto podrás hablar directamente con tu agente desde aquí,
          con respuestas en tiempo real.
        </p>
      </div>

      {/* Phase 2 card */}
      <Card className="w-full max-w-xs bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Clock className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-xs font-medium text-foreground">Llegará en Fase 2</p>
              <ul className="text-[11px] text-muted-foreground space-y-1">
                <li>· Chat con streaming en tiempo real</li>
                <li>· Historial de conversaciones</li>
                <li>· Complementa WhatsApp</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-[11px] text-muted-foreground text-center">
        Por ahora usa WhatsApp para hablar con tu agente.
      </p>
    </div>
  )
}
