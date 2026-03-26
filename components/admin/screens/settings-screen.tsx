"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { 
  Key, 
  Check, 
  X, 
  Bot,
  Eye,
  EyeOff,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"

const apiConnections = [
  { id: "openai", name: "OpenAI API", connected: true, key: "sk-...abc123" },
  { id: "google", name: "Google Cloud", connected: true, key: "AIza...xyz" },
  { id: "sendgrid", name: "SendGrid", connected: false, key: "" },
]

export function AdminSettingsScreen() {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [toneValue, setToneValue] = useState([50])

  const toggleKeyVisibility = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const getToneLabel = (value: number) => {
    if (value < 33) return "Formal"
    if (value < 66) return "Neutro"
    return "Casual"
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-5 space-y-5">
        {/* Header */}
        <div className="pt-2">
          <h1 className="text-xl font-semibold text-foreground">Configuracion</h1>
          <p className="text-sm text-muted-foreground">APIs y preferencias</p>
        </div>

        {/* API Connections */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1 mb-2">
            Conexiones API
          </p>
          <Card className="bg-card border-border">
            <CardContent className="p-0 divide-y divide-border">
              {apiConnections.map((api) => (
                <div key={api.id} className="p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{api.name}</span>
                    </div>
                    {api.connected ? (
                      <div className="flex items-center gap-1 text-accent">
                        <Check className="h-3.5 w-3.5" />
                        <span className="text-[10px]">Activo</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <X className="h-3.5 w-3.5" />
                        <span className="text-[10px]">Sin configurar</span>
                      </div>
                    )}
                  </div>
                  {api.connected && (
                    <div className="flex items-center gap-2">
                      <Input
                        type={showKeys[api.id] ? "text" : "password"}
                        value={api.key}
                        readOnly
                        className="h-8 text-xs font-mono bg-secondary"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => toggleKeyVisibility(api.id)}
                      >
                        {showKeys[api.id] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  )}
                  {!api.connected && (
                    <Button variant="outline" size="sm" className="w-full text-xs h-8">
                      Configurar
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Assistant Settings */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1 mb-2">
            Comportamiento del Asistente
          </p>
          <Card className="bg-card border-border">
            <CardContent className="p-4 space-y-4">
              {/* Tone Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">Tono de respuesta</span>
                  </div>
                  <span className="text-xs font-medium text-primary">{getToneLabel(toneValue[0])}</span>
                </div>
                <Slider
                  value={toneValue}
                  onValueChange={setToneValue}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Formal</span>
                  <span>Neutro</span>
                  <span>Casual</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Toggles */}
        <Card className="bg-card border-border">
          <CardContent className="p-0 divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-foreground">Confirmacion de acciones</p>
                <p className="text-[11px] text-muted-foreground">Pedir confirmacion antes de enviar</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-foreground">Modo de prueba</p>
                <p className="text-[11px] text-muted-foreground">Simular acciones sin ejecutar</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-foreground">Notificaciones admin</p>
                <p className="text-[11px] text-muted-foreground">Alertas de errores criticos</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Advanced */}
        <Button variant="outline" className="w-full justify-between">
          Configuracion avanzada
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
