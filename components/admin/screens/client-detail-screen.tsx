"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ChevronLeft, 
  Check, 
  X, 
  MessageSquare, 
  Calendar, 
  Mail,
  MoreVertical,
  Ban,
  RefreshCw
} from "lucide-react"

interface AdminClientDetailScreenProps {
  clientId: string | null
  onBack: () => void
}

// Mock client data
const clientData = {
  id: "1",
  name: "Carlos Garcia",
  email: "carlos@empresa.com",
  phone: "+52 55 1234 5678",
  status: "active" as const,
  plan: "Premium",
  joinedDate: "15 Ene 2026",
  googleConnected: true,
  outlookConnected: false,
  slackConnected: false,
  stats: {
    totalConversations: 145,
    messagesThisMonth: 523,
    emailsSent: 34,
    meetingsScheduled: 12
  },
  recentConversations: [
    { id: "1", preview: "Programa reunion para manana a las 10", time: "Hoy 9:35" },
    { id: "2", preview: "Responde el correo de Juan", time: "Hoy 9:31" },
    { id: "3", preview: "Que reuniones tengo hoy?", time: "Hoy 9:30" },
  ]
}

export function AdminClientDetailScreen({ clientId, onBack }: AdminClientDetailScreenProps) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-5 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3 pt-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2" onClick={onBack}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-foreground">Detalle Cliente</h1>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">CG</span>
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-foreground">{clientData.name}</h2>
                <p className="text-xs text-muted-foreground">{clientData.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-medium">
                    Activo
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                    {clientData.plan}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connections */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1 mb-2">
            Integraciones
          </p>
          <Card className="bg-card border-border">
            <CardContent className="p-0 divide-y divide-border">
              <div className="flex items-center justify-between p-3">
                <span className="text-sm text-foreground">Google Workspace</span>
                {clientData.googleConnected ? (
                  <div className="flex items-center gap-1 text-accent">
                    <Check className="h-4 w-4" />
                    <span className="text-xs">Conectado</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <X className="h-4 w-4" />
                    <span className="text-xs">No conectado</span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between p-3">
                <span className="text-sm text-foreground">Microsoft Outlook</span>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <X className="h-4 w-4" />
                  <span className="text-xs">No conectado</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3">
                <span className="text-sm text-foreground">Slack</span>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <X className="h-4 w-4" />
                  <span className="text-xs">No conectado</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1 mb-2">
            Estadisticas del mes
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Card className="bg-primary/5 border-0">
              <CardContent className="p-3 text-center">
                <MessageSquare className="h-5 w-5 text-primary mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">{clientData.stats.messagesThisMonth}</p>
                <p className="text-[10px] text-muted-foreground">Mensajes</p>
              </CardContent>
            </Card>
            <Card className="bg-accent/10 border-0">
              <CardContent className="p-3 text-center">
                <Mail className="h-5 w-5 text-accent mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">{clientData.stats.emailsSent}</p>
                <p className="text-[10px] text-muted-foreground">Correos enviados</p>
              </CardContent>
            </Card>
            <Card className="bg-chart-3/10 border-0">
              <CardContent className="p-3 text-center">
                <Calendar className="h-5 w-5 text-chart-3 mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">{clientData.stats.meetingsScheduled}</p>
                <p className="text-[10px] text-muted-foreground">Reuniones</p>
              </CardContent>
            </Card>
            <Card className="bg-secondary border-0">
              <CardContent className="p-3 text-center">
                <MessageSquare className="h-5 w-5 text-foreground mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">{clientData.stats.totalConversations}</p>
                <p className="text-[10px] text-muted-foreground">Conv. totales</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Conversations */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1 mb-2">
            Conversaciones recientes
          </p>
          <Card className="bg-card border-border">
            <CardContent className="p-0 divide-y divide-border">
              {clientData.recentConversations.map((conv) => (
                <div key={conv.id} className="p-3">
                  <p className="text-sm text-foreground truncate">{conv.preview}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{conv.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 gap-2 text-destructive border-destructive/30">
            <Ban className="h-4 w-4" />
            Suspender
          </Button>
          <Button variant="outline" className="flex-1 gap-2">
            <RefreshCw className="h-4 w-4" />
            Reiniciar
          </Button>
        </div>
      </div>
    </div>
  )
}
