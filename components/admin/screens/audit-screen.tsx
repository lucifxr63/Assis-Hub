"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, FileText, Save, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const auditLogs = [
  {
    id: "1",
    user: "Carlos Garcia",
    action: "Envio correo via asistente",
    details: "Destinatario: juan@empresa.com",
    time: "Hoy 9:35",
    type: "email"
  },
  {
    id: "2",
    user: "Maria Lopez",
    action: "Reprogramo reunion",
    details: "Standup diario movido a 11:00",
    time: "Hoy 9:20",
    type: "calendar"
  },
  {
    id: "3",
    user: "Juan Perez",
    action: "Consulta informacion",
    details: "Solicito resumen del dia",
    time: "Hoy 9:15",
    type: "query"
  },
  {
    id: "4",
    user: "Ana Martinez",
    action: "Conecto integracion",
    details: "Google Workspace conectado",
    time: "Hoy 8:45",
    type: "integration"
  },
  {
    id: "5",
    user: "Roberto Sanchez",
    action: "Envio correo via asistente",
    details: "Destinatario: cliente@abc.com",
    time: "Hoy 8:30",
    type: "email"
  }
]

const businessRules = `1. Siempre confirmar antes de enviar correos
2. No reprogramar reuniones sin autorizacion explicita
3. Responder correos en tono formal y profesional
4. No acceder a informacion financiera sensible
5. Notificar al usuario sobre cambios en calendario`

export function AdminAuditScreen() {
  const [activeTab, setActiveTab] = useState<"logs" | "rules">("logs")
  const [rules, setRules] = useState(businessRules)

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="pt-2">
          <h1 className="text-xl font-semibold text-foreground">Auditoria</h1>
          <p className="text-sm text-muted-foreground">Registros y reglas de negocio</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2">
          <Button
            variant={activeTab === "logs" ? "default" : "outline"}
            size="sm"
            className="flex-1 gap-2"
            onClick={() => setActiveTab("logs")}
          >
            <MessageSquare className="h-4 w-4" />
            Registros
          </Button>
          <Button
            variant={activeTab === "rules" ? "default" : "outline"}
            size="sm"
            className="flex-1 gap-2"
            onClick={() => setActiveTab("rules")}
          >
            <FileText className="h-4 w-4" />
            Reglas
          </Button>
        </div>

        {activeTab === "logs" ? (
          <>
            {/* Filter */}
            <Button variant="outline" className="w-full justify-between text-sm h-10">
              Todos los tipos
              <ChevronDown className="h-4 w-4" />
            </Button>

            {/* Audit Logs */}
            <div className="space-y-2">
              {auditLogs.map((log) => (
                <Card key={log.id} className="bg-card border-border">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] font-medium text-secondary-foreground">
                          {log.user.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-medium text-foreground truncate">{log.user}</p>
                          <span className="text-[10px] text-muted-foreground shrink-0">{log.time}</span>
                        </div>
                        <p className="text-sm text-foreground mt-0.5">{log.action}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{log.details}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Rules Editor */}
            <Card className="bg-card border-border">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">Reglas de Negocio</p>
                  <span className="text-[10px] text-muted-foreground">Lenguaje natural</span>
                </div>
                <Textarea
                  value={rules}
                  onChange={(e) => setRules(e.target.value)}
                  className="min-h-[200px] text-sm resize-none"
                  placeholder="Escribe las reglas que debe seguir el asistente..."
                />
                <Button className="w-full gap-2">
                  <Save className="h-4 w-4" />
                  Guardar cambios
                </Button>
              </CardContent>
            </Card>

            {/* Info */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-3">
                <p className="text-xs text-foreground font-medium">Como funcionan las reglas</p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Escribe instrucciones en lenguaje natural. El asistente las seguira automaticamente en todas las interacciones.
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
