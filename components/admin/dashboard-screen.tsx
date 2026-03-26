"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, CheckCircle, AlertTriangle, TrendingUp, Activity } from "lucide-react"

const alerts = [
  { id: 1, message: "Las credenciales de Google están fallando para 3 usuarios", severity: "warning" },
  { id: 2, message: "Usuario juan@empresa.com ha excedido el límite de consultas", severity: "info" },
  { id: 3, message: "API de OpenAI respondiendo con latencia alta", severity: "warning" },
]

const recentActivity = [
  { id: 1, user: "Carlos M.", action: "Consultó su agenda del día", time: "hace 2 min" },
  { id: 2, user: "Ana R.", action: "Envió respuesta de correo", time: "hace 5 min" },
  { id: 3, user: "Pedro L.", action: "Reprogramó reunión", time: "hace 12 min" },
  { id: 4, user: "María G.", action: "Solicitó resumen de correos", time: "hace 15 min" },
]

export function DashboardScreen() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Salud del sistema y métricas generales</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Usuarios activos hoy</p>
                <p className="text-3xl font-bold text-foreground mt-1">127</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-sm">
              <TrendingUp className="h-4 w-4 text-accent" />
              <span className="text-accent font-medium">+12%</span>
              <span className="text-muted-foreground">vs ayer</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tasa de éxito</p>
                <p className="text-3xl font-bold text-foreground mt-1">94.2%</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-accent" />
              </div>
            </div>
            <div className="mt-3">
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-accent rounded-full" style={{ width: "94.2%" }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Consultas hoy</p>
                <p className="text-3xl font-bold text-foreground mt-1">2,847</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-chart-3/10 flex items-center justify-center">
                <Activity className="h-6 w-6 text-chart-3" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-sm">
              <TrendingUp className="h-4 w-4 text-accent" />
              <span className="text-accent font-medium">+8%</span>
              <span className="text-muted-foreground">vs promedio</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alertas activas</p>
                <p className="text-3xl font-bold text-foreground mt-1">3</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              2 advertencias, 1 info
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts & Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Alerts */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Alertas del Sistema
            </CardTitle>
            <CardDescription>Problemas que requieren atención</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert) => (
              <div 
                key={alert.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
              >
                <AlertTriangle className={`h-4 w-4 mt-0.5 shrink-0 ${
                  alert.severity === "warning" ? "text-chart-3" : "text-primary"
                }`} />
                <p className="text-sm text-foreground">{alert.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Actividad Reciente
            </CardTitle>
            <CardDescription>Últimas acciones de los usuarios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <span className="text-xs font-medium text-secondary-foreground">
                      {activity.user.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
