"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Volume2, Cloud, Calendar, Mail, ChevronRight, Sparkles } from "lucide-react"

interface ClientSummaryScreenProps {
  onNavigate: (screen: "chat") => void
}

export function ClientSummaryScreen({ onNavigate }: ClientSummaryScreenProps) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-5 space-y-5">
        {/* Header */}
        <div className="pt-2">
          <p className="text-sm text-muted-foreground">Buenos dias</p>
          <h1 className="text-2xl font-semibold text-foreground">Carlos</h1>
        </div>

        {/* Quick Action - Voice Summary */}
        <Button 
          className="w-full h-14 rounded-2xl gap-3 text-base bg-primary hover:bg-primary/90"
          onClick={() => onNavigate("chat")}
        >
          <Volume2 className="h-5 w-5" />
          Escuchar resumen del dia
        </Button>

        {/* Quick Widgets */}
        <div className="grid grid-cols-2 gap-3">
          {/* Weather */}
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <Cloud className="h-6 w-6 text-primary" />
                <span className="text-xs text-muted-foreground">CDMX</span>
              </div>
              <p className="text-2xl font-bold text-foreground mt-2">22°C</p>
              <p className="text-xs text-muted-foreground">Parcialmente nublado</p>
            </CardContent>
          </Card>

          {/* Next Meeting */}
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <Calendar className="h-6 w-6 text-accent" />
                <span className="text-xs text-muted-foreground">10:00</span>
              </div>
              <p className="text-sm font-semibold text-foreground mt-2 line-clamp-1">Standup diario</p>
              <p className="text-xs text-muted-foreground">En 45 minutos</p>
            </CardContent>
          </Card>
        </div>

        {/* Email Summary Card */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="font-medium text-foreground">12 correos nuevos</p>
                  <p className="text-xs text-muted-foreground">3 marcados como importantes</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        {/* Today Stats */}
        <div>
          <h2 className="text-sm font-medium text-foreground mb-3">Tu dia de hoy</h2>
          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-primary/5 border-0">
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-bold text-primary">3</p>
                <p className="text-[10px] text-muted-foreground">Reuniones</p>
              </CardContent>
            </Card>
            <Card className="bg-accent/10 border-0">
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-bold text-accent">5</p>
                <p className="text-[10px] text-muted-foreground">Tareas</p>
              </CardContent>
            </Card>
            <Card className="bg-secondary border-0">
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-bold text-foreground">2</p>
                <p className="text-[10px] text-muted-foreground">Recordatorios</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Suggestion */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Sugerencia del asistente</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Tienes tiempo libre entre 11:30 y 14:00. Podria ser buen momento para revisar los correos pendientes.
                </p>
                <Button 
                  variant="link" 
                  className="h-auto p-0 text-xs text-primary mt-2"
                  onClick={() => onNavigate("chat")}
                >
                  Preguntame como
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
