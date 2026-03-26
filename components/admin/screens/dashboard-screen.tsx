"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, CheckCircle, MessageSquare, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"

const stats = [
  {
    label: "Usuarios activos",
    value: "1,284",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "text-primary bg-primary/10"
  },
  {
    label: "Tasa de exito",
    value: "94.2%",
    change: "+2.1%",
    trend: "up",
    icon: CheckCircle,
    color: "text-accent bg-accent/10"
  },
  {
    label: "Consultas hoy",
    value: "3,847",
    change: "+18%",
    trend: "up",
    icon: MessageSquare,
    color: "text-chart-3 bg-chart-3/10"
  },
  {
    label: "Alertas activas",
    value: "3",
    change: "-2",
    trend: "down",
    icon: AlertTriangle,
    color: "text-destructive bg-destructive/10"
  }
]

const recentActivity = [
  { user: "Maria Lopez", action: "Conecto Google Workspace", time: "Hace 5 min" },
  { user: "Juan Perez", action: "Envio 3 correos via asistente", time: "Hace 12 min" },
  { user: "Ana Garcia", action: "Reprogramo 2 reuniones", time: "Hace 25 min" },
  { user: "Carlos Ruiz", action: "Nuevo usuario registrado", time: "Hace 1 hora" },
]

export function AdminDashboardScreen() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-5 space-y-5">
        {/* Header */}
        <div className="pt-2">
          <p className="text-sm text-muted-foreground">Panel de Control</p>
          <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="bg-card border-border">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${stat.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className={`flex items-center gap-0.5 text-[10px] font-medium ${
                      stat.trend === "up" ? "text-accent" : "text-destructive"
                    }`}>
                      {stat.trend === "up" ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {stat.change}
                    </div>
                  </div>
                  <p className="text-lg font-bold text-foreground">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Activity Chart Placeholder */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-foreground mb-3">Consultas por hora</p>
            <div className="flex items-end justify-around h-24 gap-1">
              {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((height, i) => (
                <div 
                  key={i}
                  className="flex-1 bg-primary/20 rounded-t-sm relative group"
                  style={{ height: `${height}%` }}
                >
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-sm transition-all"
                    style={{ height: `${height * 0.7}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[9px] text-muted-foreground">
              <span>8AM</span>
              <span>12PM</span>
              <span>4PM</span>
              <span>8PM</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div>
          <p className="text-sm font-medium text-foreground mb-3">Actividad reciente</p>
          <Card className="bg-card border-border">
            <CardContent className="p-0 divide-y divide-border">
              {recentActivity.map((activity, i) => (
                <div key={i} className="p-3 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <span className="text-xs font-medium text-secondary-foreground">
                      {activity.user.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{activity.user}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{activity.action}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">{activity.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
