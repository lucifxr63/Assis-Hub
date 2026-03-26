"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreHorizontal, Check, X, Calendar, Mail, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface Client {
  id: string
  name: string
  email: string
  status: "active" | "suspended" | "pending"
  googleConnected: boolean
  lastActive: string
  queries: number
}

const clients: Client[] = [
  { id: "1", name: "Carlos Méndez", email: "carlos@empresa.com", status: "active", googleConnected: true, lastActive: "hace 5 min", queries: 145 },
  { id: "2", name: "Ana Rodríguez", email: "ana@startup.io", status: "active", googleConnected: true, lastActive: "hace 1 hora", queries: 89 },
  { id: "3", name: "Pedro López", email: "pedro@corp.mx", status: "active", googleConnected: false, lastActive: "hace 2 horas", queries: 67 },
  { id: "4", name: "María García", email: "maria@negocio.com", status: "suspended", googleConnected: true, lastActive: "hace 3 días", queries: 234 },
  { id: "5", name: "Juan Hernández", email: "juan@empresa.com", status: "pending", googleConnected: false, lastActive: "nunca", queries: 0 },
  { id: "6", name: "Laura Sánchez", email: "laura@tech.io", status: "active", googleConnected: true, lastActive: "hace 30 min", queries: 178 },
]

export function ClientsScreen() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const statusConfig = {
    active: { label: "Activo", className: "bg-accent/10 text-accent border-accent/20" },
    suspended: { label: "Suspendido", className: "bg-destructive/10 text-destructive border-destructive/20" },
    pending: { label: "Pendiente", className: "bg-chart-3/10 text-chart-3 border-chart-3/20" },
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Gestión de Clientes</h1>
          <p className="text-muted-foreground">Administra los usuarios del sistema</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Agregar Cliente
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Check className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">4</p>
                <p className="text-sm text-muted-foreground">Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <X className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">1</p>
                <p className="text-sm text-muted-foreground">Suspendidos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-chart-3" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">1</p>
                <p className="text-sm text-muted-foreground">Pendientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar cliente..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>Cliente</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="hidden md:table-cell">Google</TableHead>
                  <TableHead className="hidden lg:table-cell">Última actividad</TableHead>
                  <TableHead className="hidden lg:table-cell text-right">Consultas</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id} className="border-border">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
                          <span className="text-sm font-medium text-secondary-foreground">
                            {client.name.split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{client.name}</p>
                          <p className="text-sm text-muted-foreground">{client.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusConfig[client.status].className}>
                        {statusConfig[client.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className={cn(
                        "inline-flex items-center gap-1.5 text-sm",
                        client.googleConnected ? "text-accent" : "text-muted-foreground"
                      )}>
                        {client.googleConnected ? (
                          <>
                            <Check className="h-4 w-4" />
                            <span>Conectado</span>
                          </>
                        ) : (
                          <>
                            <X className="h-4 w-4" />
                            <span>Sin conectar</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">
                      {client.lastActive}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-right font-medium">
                      {client.queries}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                          <DropdownMenuItem>Historial de uso</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            {client.status === "suspended" ? "Reactivar" : "Suspender"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
