"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface Connection {
  id: string
  name: string
  description: string
  icon: string
  connected: boolean
}

const initialConnections: Connection[] = [
  {
    id: "google",
    name: "Google Workspace",
    description: "Calendario, Gmail y Google Meet",
    icon: "https://www.google.com/favicon.ico",
    connected: true
  },
  {
    id: "outlook",
    name: "Microsoft Outlook",
    description: "Correo y calendario de Outlook",
    icon: "https://outlook.live.com/favicon.ico",
    connected: false
  },
  {
    id: "slack",
    name: "Slack",
    description: "Mensajes y canales de Slack",
    icon: "https://slack.com/favicon.ico",
    connected: false
  }
]

export function ConnectionScreen() {
  const [connections, setConnections] = useState<Connection[]>(initialConnections)

  const toggleConnection = (id: string) => {
    setConnections(connections.map(conn =>
      conn.id === id ? { ...conn, connected: !conn.connected } : conn
    ))
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          Conexiones
        </h1>
        <p className="text-muted-foreground">
          Conecta tus cuentas para que tu asistente pueda ayudarte mejor
        </p>
      </div>

      <div className="space-y-4">
        {connections.map((connection) => (
          <Card 
            key={connection.id}
            className={cn(
              "bg-card border-border transition-all hover:shadow-md",
              connection.connected && "ring-2 ring-primary/20"
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                  <img 
                    src={connection.icon} 
                    alt={connection.name}
                    className="h-6 w-6"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3C/svg%3E"
                    }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{connection.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{connection.description}</p>
                </div>

                {/* Status & Action */}
                <div className="flex items-center gap-3 shrink-0">
                  {/* Status Badge */}
                  <div className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                    connection.connected 
                      ? "bg-primary/10 text-primary" 
                      : "bg-muted text-muted-foreground"
                  )}>
                    {connection.connected ? (
                      <>
                        <Check className="h-3 w-3" />
                        Conectado
                      </>
                    ) : (
                      <>
                        <X className="h-3 w-3" />
                        Desconectado
                      </>
                    )}
                  </div>

                  {/* Action Button */}
                  <Button
                    variant={connection.connected ? "outline" : "default"}
                    size="sm"
                    className="rounded-full"
                    onClick={() => toggleConnection(connection.id)}
                  >
                    {connection.connected ? "Desconectar" : "Conectar"}
                    {!connection.connected && <ExternalLink className="h-3 w-3 ml-1" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Help Text */}
      <p className="text-center text-xs text-muted-foreground mt-8">
        Tus datos están seguros. Solo accedemos a la información necesaria para ayudarte.
      </p>
    </div>
  )
}
