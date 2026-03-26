"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Key, Link2, MessageCircle, Save, Check, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface ApiConnection {
  id: string
  name: string
  description: string
  connected: boolean
  lastChecked: string
}

const apiConnections: ApiConnection[] = [
  { id: "openai", name: "OpenAI", description: "GPT-4 para procesamiento de lenguaje", connected: true, lastChecked: "hace 5 min" },
  { id: "google", name: "Google Workspace Admin", description: "Gestión de cuentas de Google", connected: true, lastChecked: "hace 10 min" },
  { id: "sendgrid", name: "SendGrid", description: "Envío de notificaciones por email", connected: false, lastChecked: "nunca" },
]

export function SettingsScreen() {
  const [tone, setTone] = useState("professional")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => setIsSaving(false), 1500)
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Configuración General</h1>
        <p className="text-muted-foreground">Ajusta las conexiones y comportamiento del sistema</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* API Connections */}
        <Card className="bg-card border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              Conexiones API
            </CardTitle>
            <CardDescription>APIs maestras del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {apiConnections.map((api) => (
                <div 
                  key={api.id}
                  className={cn(
                    "p-4 rounded-lg border transition-all",
                    api.connected 
                      ? "border-accent/30 bg-accent/5" 
                      : "border-border bg-muted/30"
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                      <Link2 className="h-5 w-5 text-secondary-foreground" />
                    </div>
                    <Badge variant="outline" className={cn(
                      "text-xs",
                      api.connected 
                        ? "bg-accent/10 text-accent border-accent/20"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {api.connected ? (
                        <><Check className="h-3 w-3 mr-1" /> Conectado</>
                      ) : (
                        "Sin conectar"
                      )}
                    </Badge>
                  </div>
                  <h3 className="font-medium text-foreground">{api.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{api.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {api.connected && `Verificado ${api.lastChecked}`}
                    </span>
                    <Button 
                      variant={api.connected ? "ghost" : "default"} 
                      size="sm"
                      className="gap-1"
                    >
                      {api.connected ? "Configurar" : "Conectar"}
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tone Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Tono del Asistente
            </CardTitle>
            <CardDescription>Personalidad global para todas las conversaciones</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={tone} onValueChange={setTone} className="space-y-3">
              <div className={cn(
                "flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors",
                tone === "formal" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
              )}>
                <RadioGroupItem value="formal" id="formal" />
                <div className="flex-1">
                  <Label htmlFor="formal" className="font-medium cursor-pointer">Formal</Label>
                  <p className="text-sm text-muted-foreground">Comunicación seria y respetuosa</p>
                </div>
              </div>
              <div className={cn(
                "flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors",
                tone === "professional" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
              )}>
                <RadioGroupItem value="professional" id="professional" />
                <div className="flex-1">
                  <Label htmlFor="professional" className="font-medium cursor-pointer">Profesional</Label>
                  <p className="text-sm text-muted-foreground">Equilibrio entre cordial y eficiente</p>
                </div>
              </div>
              <div className={cn(
                "flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors",
                tone === "casual" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
              )}>
                <RadioGroupItem value="casual" id="casual" />
                <div className="flex-1">
                  <Label htmlFor="casual" className="font-medium cursor-pointer">Casual</Label>
                  <p className="text-sm text-muted-foreground">Amigable y relajado</p>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* API Keys */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Claves de API</CardTitle>
            <CardDescription>Configura las credenciales del sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="openai-key">OpenAI API Key</Label>
              <Input 
                id="openai-key"
                type="password"
                value="sk-••••••••••••••••••••••••••••••"
                readOnly
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="google-key">Google Service Account</Label>
              <Input 
                id="google-key"
                type="password"
                value="service-account@project.iam.gserviceaccount.com"
                readOnly
                className="font-mono text-sm"
              />
            </div>
            <Button 
              className="w-full gap-2" 
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Check className="h-4 w-4" />
                  Guardado
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
