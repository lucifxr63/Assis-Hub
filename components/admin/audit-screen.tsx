"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, AlertCircle, Check, Plus, X, Edit2, Save } from "lucide-react"
import { cn } from "@/lib/utils"

interface ConversationLog {
  id: string
  user: string
  userMessage: string
  assistantResponse: string
  success: boolean
  timestamp: string
}

const logs: ConversationLog[] = [
  {
    id: "1",
    user: "Carlos M.",
    userMessage: "Programa una reunión con Juan para mañana",
    assistantResponse: "He programado la reunión con Juan para mañana a las 10:00 AM. Te envié una invitación de calendario.",
    success: true,
    timestamp: "14:32"
  },
  {
    id: "2",
    user: "Ana R.",
    userMessage: "Muéstrame las ventas del último mes",
    assistantResponse: "Lo siento, no tengo acceso a información de ventas. Solo puedo ayudarte con tu calendario y correos.",
    success: false,
    timestamp: "14:28"
  },
  {
    id: "3",
    user: "Pedro L.",
    userMessage: "Cancela todas mis reuniones de hoy",
    assistantResponse: "He cancelado las 4 reuniones programadas para hoy y notifiqué a los participantes.",
    success: true,
    timestamp: "14:15"
  },
  {
    id: "4",
    user: "María G.",
    userMessage: "¿Qué tiempo hace hoy?",
    assistantResponse: "Actualmente en tu ubicación hay 22°C con cielos parcialmente nublados. Se espera lluvia ligera por la tarde.",
    success: true,
    timestamp: "13:55"
  },
]

interface BusinessRule {
  id: string
  rule: string
  active: boolean
}

const initialRules: BusinessRule[] = [
  { id: "1", rule: "Nunca enviar correos después de las 10 PM a menos que sea urgente", active: true },
  { id: "2", rule: "Siempre confirmar antes de cancelar reuniones con más de 3 participantes", active: true },
  { id: "3", rule: "Responder en español a menos que el usuario escriba en inglés", active: true },
]

export function AuditScreen() {
  const [rules, setRules] = useState<BusinessRule[]>(initialRules)
  const [newRule, setNewRule] = useState("")
  const [isAddingRule, setIsAddingRule] = useState(false)

  const addRule = () => {
    if (!newRule.trim()) return
    setRules([...rules, { id: Date.now().toString(), rule: newRule, active: true }])
    setNewRule("")
    setIsAddingRule(false)
  }

  const toggleRule = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, active: !r.active } : r))
  }

  const deleteRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id))
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Auditoría e Intervención</h1>
        <p className="text-muted-foreground">Revisa conversaciones y ajusta reglas de negocio</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Conversation Logs */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Registros de Conversación
            </CardTitle>
            <CardDescription>Últimas interacciones del asistente</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              <div className="p-4 space-y-4">
                {logs.map((log) => (
                  <div 
                    key={log.id}
                    className={cn(
                      "p-4 rounded-lg border",
                      log.success ? "border-border bg-muted/30" : "border-destructive/30 bg-destructive/5"
                    )}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center">
                          <span className="text-xs font-medium text-secondary-foreground">
                            {log.user.split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>
                        <span className="font-medium text-sm text-foreground">{log.user}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={cn(
                          "text-xs",
                          log.success 
                            ? "bg-accent/10 text-accent border-accent/20"
                            : "bg-destructive/10 text-destructive border-destructive/20"
                        )}>
                          {log.success ? (
                            <><Check className="h-3 w-3 mr-1" /> Éxito</>
                          ) : (
                            <><AlertCircle className="h-3 w-3 mr-1" /> Fallo</>
                          )}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="text-muted-foreground">Usuario:</span>{" "}
                        <span className="text-foreground">{log.userMessage}</span>
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Asistente:</span>{" "}
                        <span className="text-foreground">{log.assistantResponse}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Business Rules */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Edit2 className="h-5 w-5 text-primary" />
                  Reglas de Negocio
                </CardTitle>
                <CardDescription>Instrucciones globales para el asistente</CardDescription>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                className="gap-1"
                onClick={() => setIsAddingRule(true)}
              >
                <Plus className="h-4 w-4" />
                Agregar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Rule Form */}
            {isAddingRule && (
              <div className="p-4 rounded-lg border border-primary/30 bg-primary/5 space-y-3">
                <Textarea
                  placeholder="Escribe una nueva regla en lenguaje natural..."
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
                <div className="flex gap-2 justify-end">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => { setIsAddingRule(false); setNewRule("") }}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    size="sm" 
                    className="gap-1"
                    onClick={addRule}
                    disabled={!newRule.trim()}
                  >
                    <Save className="h-4 w-4" />
                    Guardar
                  </Button>
                </div>
              </div>
            )}

            {/* Rules List */}
            <div className="space-y-3">
              {rules.map((rule) => (
                <div 
                  key={rule.id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg border transition-colors",
                    rule.active 
                      ? "border-border bg-muted/30" 
                      : "border-border/50 bg-transparent opacity-60"
                  )}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-6 w-6 shrink-0 mt-0.5",
                      rule.active && "text-accent"
                    )}
                    onClick={() => toggleRule(rule.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <p className="flex-1 text-sm text-foreground">{rule.rule}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteRule(rule.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground pt-2">
              Las reglas se aplican a todas las conversaciones del asistente de forma global.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
