"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Cloud, Calendar, Mail, Volume2, Clock, ArrowRight } from "lucide-react"

export function DailySummary() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Greeting */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-foreground mb-2 text-balance">
          Buenos días, Carlos
        </h1>
        <p className="text-muted-foreground">
          Martes, 25 de marzo de 2026
        </p>
      </div>

      {/* Read Summary Button */}
      <Button 
        size="lg" 
        className="w-full mb-8 rounded-xl h-14 text-base gap-3"
      >
        <Volume2 className="h-5 w-5" />
        Léeme el resumen
      </Button>

      {/* Widgets Grid */}
      <div className="grid gap-4">
        {/* Weather Widget */}
        <Card className="bg-card border-border hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Cloud className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Clima actual</p>
                  <p className="text-2xl font-semibold text-foreground">22°C</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Ciudad de México</p>
                <p className="text-sm text-foreground">Parcialmente nublado</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Meeting Widget */}
        <Card className="bg-card border-border hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Próxima reunión
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-foreground">Standup diario</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">10:00 AM - 10:15 AM</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="rounded-full gap-1">
                Ver <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Emails Widget */}
        <Card className="bg-card border-border hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Mail className="h-7 w-7 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Correos sin leer</p>
                  <p className="text-2xl font-semibold text-foreground">12</p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
                  3 importantes
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Summary */}
        <Card className="bg-card border-border hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-primary">3</p>
                <p className="text-xs text-muted-foreground mt-1">Reuniones hoy</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-accent">5</p>
                <p className="text-xs text-muted-foreground mt-1">Tareas pendientes</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">2</p>
                <p className="text-xs text-muted-foreground mt-1">Recordatorios</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
