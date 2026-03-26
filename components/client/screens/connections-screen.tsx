"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X, ChevronRight, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

interface Connection {
  id: string
  name: string
  description: string
  iconColor: string
  iconLetter: string
  connected: boolean
}

const initialConnections: Connection[] = [
  {
    id: "google",
    name: "Google Workspace",
    description: "Calendario, Gmail y Meet",
    iconColor: "bg-red-500",
    iconLetter: "G",
    connected: true
  },
  {
    id: "outlook",
    name: "Microsoft Outlook",
    description: "Correo y calendario",
    iconColor: "bg-blue-500",
    iconLetter: "M",
    connected: false
  },
  {
    id: "slack",
    name: "Slack",
    description: "Mensajes y canales",
    iconColor: "bg-purple-500",
    iconLetter: "S",
    connected: false
  },
  {
    id: "notion",
    name: "Notion",
    description: "Documentos y bases de datos",
    iconColor: "bg-foreground",
    iconLetter: "N",
    connected: false
  }
]

export function ClientConnectionsScreen() {
  const [connections, setConnections] = useState<Connection[]>(initialConnections)

  const toggleConnection = (id: string) => {
    setConnections(connections.map(conn =>
      conn.id === id ? { ...conn, connected: !conn.connected } : conn
    ))
  }

  const connectedCount = connections.filter(c => c.connected).length

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-5 space-y-5">
        {/* Header */}
        <div className="pt-2">
          <h1 className="text-xl font-semibold text-foreground">Conexiones</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {connectedCount} de {connections.length} servicios conectados
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(connectedCount / connections.length) * 100}%` }}
          />
        </div>

        {/* Connections List */}
        <div className="space-y-3">
          {connections.map((connection) => (
            <Card 
              key={connection.id}
              className={cn(
                "bg-card border-border transition-all",
                connection.connected && "ring-1 ring-primary/30"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  {/* Icon */}
                  <div className={cn(
                    "h-11 w-11 rounded-xl flex items-center justify-center shrink-0",
                    connection.iconColor
                  )}>
                    <span className="text-white font-bold text-lg">{connection.iconLetter}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground text-sm">{connection.name}</p>
                      {connection.connected && (
                        <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-2.5 w-2.5 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{connection.description}</p>
                  </div>

                  {/* Action */}
                  <Button
                    variant={connection.connected ? "outline" : "default"}
                    size="sm"
                    className="rounded-full text-xs h-8"
                    onClick={() => toggleConnection(connection.id)}
                  >
                    {connection.connected ? "Gestionar" : "Conectar"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Security Note */}
        <Card className="bg-secondary/50 border-0">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Shield className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-xs font-medium text-foreground">Tus datos estan seguros</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Solo accedemos a la informacion necesaria. Puedes desconectar en cualquier momento.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
