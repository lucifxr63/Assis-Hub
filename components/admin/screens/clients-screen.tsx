"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, ChevronRight, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface Client {
  id: string
  name: string
  email: string
  status: "active" | "inactive" | "suspended"
  googleConnected: boolean
  lastActive: string
  conversations: number
}

const clients: Client[] = [
  {
    id: "1",
    name: "Carlos Garcia",
    email: "carlos@empresa.com",
    status: "active",
    googleConnected: true,
    lastActive: "Hace 5 min",
    conversations: 145
  },
  {
    id: "2",
    name: "Maria Lopez",
    email: "maria@empresa.com",
    status: "active",
    googleConnected: true,
    lastActive: "Hace 1 hora",
    conversations: 89
  },
  {
    id: "3",
    name: "Juan Perez",
    email: "juan@empresa.com",
    status: "inactive",
    googleConnected: false,
    lastActive: "Hace 3 dias",
    conversations: 23
  },
  {
    id: "4",
    name: "Ana Martinez",
    email: "ana@empresa.com",
    status: "suspended",
    googleConnected: true,
    lastActive: "Hace 1 semana",
    conversations: 67
  },
  {
    id: "5",
    name: "Roberto Sanchez",
    email: "roberto@empresa.com",
    status: "active",
    googleConnected: true,
    lastActive: "Hace 30 min",
    conversations: 112
  }
]

interface AdminClientsScreenProps {
  onClientSelect: (clientId: string) => void
}

export function AdminClientsScreen({ onClientSelect }: AdminClientsScreenProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: Client["status"]) => {
    switch (status) {
      case "active": return "bg-accent text-accent-foreground"
      case "inactive": return "bg-muted text-muted-foreground"
      case "suspended": return "bg-destructive text-destructive-foreground"
    }
  }

  const getStatusLabel = (status: Client["status"]) => {
    switch (status) {
      case "active": return "Activo"
      case "inactive": return "Inactivo"
      case "suspended": return "Suspendido"
    }
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="pt-2">
          <h1 className="text-xl font-semibold text-foreground">Clientes</h1>
          <p className="text-sm text-muted-foreground">{clients.length} usuarios registrados</p>
        </div>

        {/* Search */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar cliente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 text-sm"
            />
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Clients List */}
        <div className="space-y-2">
          {filteredClients.map((client) => (
            <Card 
              key={client.id}
              className="bg-card border-border cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onClientSelect(client.id)}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <span className="text-sm font-medium text-secondary-foreground">
                      {client.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground truncate">{client.name}</p>
                      <span className={cn(
                        "text-[9px] px-1.5 py-0.5 rounded-full font-medium",
                        getStatusColor(client.status)
                      )}>
                        {getStatusLabel(client.status)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{client.email}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1">
                        {client.googleConnected ? (
                          <Check className="h-3 w-3 text-accent" />
                        ) : (
                          <X className="h-3 w-3 text-muted-foreground" />
                        )}
                        <span className="text-[10px] text-muted-foreground">Google</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{client.conversations} conv.</span>
                      <span className="text-[10px] text-muted-foreground">{client.lastActive}</span>
                    </div>
                  </div>

                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
