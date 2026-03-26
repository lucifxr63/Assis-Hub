"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { 
  User, 
  Bell, 
  Moon, 
  Globe, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Sparkles
} from "lucide-react"

export function ClientProfileScreen() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-5 space-y-5">
        {/* Header */}
        <div className="pt-2 text-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl font-bold text-primary">CG</span>
          </div>
          <h1 className="text-lg font-semibold text-foreground">Carlos Garcia</h1>
          <p className="text-sm text-muted-foreground">carlos@empresa.com</p>
        </div>

        {/* Plan Card */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Plan Premium</p>
                  <p className="text-xs text-muted-foreground">Acceso ilimitado</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="rounded-full text-xs">
                Gestionar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Settings Groups */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">
            Preferencias
          </p>
          
          <Card className="bg-card border-border">
            <CardContent className="p-0 divide-y divide-border">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-foreground">Notificaciones</span>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Moon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-foreground">Modo oscuro</span>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-foreground">Idioma</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span className="text-sm">Espanol</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">
            Soporte
          </p>
          
          <Card className="bg-card border-border">
            <CardContent className="p-0 divide-y divide-border">
              <button className="flex items-center justify-between p-4 w-full text-left hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-foreground">Centro de ayuda</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
              <button className="flex items-center justify-between p-4 w-full text-left hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-foreground">Cuenta y seguridad</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Logout */}
        <Button variant="outline" className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/10">
          <LogOut className="h-4 w-4" />
          Cerrar sesion
        </Button>

        <p className="text-center text-[10px] text-muted-foreground">
          Version 1.0.0
        </p>
      </div>
    </div>
  )
}
