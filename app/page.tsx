"use client"

import { useState } from "react"
import { MobileFrame } from "@/components/mobile-frame"
import { ClientApp } from "@/components/client-app"
import { AdminApp } from "@/components/admin-app"
import { Button } from "@/components/ui/button"
import { Smartphone, Monitor } from "lucide-react"

export default function Home() {
  const [activeApp, setActiveApp] = useState<"client" | "admin">("client")

  return (
    <main className="min-h-screen bg-muted/50 flex flex-col items-center justify-center p-4 gap-6">
      {/* App Selector */}
      <div className="flex items-center gap-4">
        <Button
          variant={activeApp === "client" ? "default" : "outline"}
          className="gap-2"
          onClick={() => setActiveApp("client")}
        >
          <Smartphone className="h-4 w-4" />
          App Cliente
        </Button>
        <Button
          variant={activeApp === "admin" ? "default" : "outline"}
          className="gap-2"
          onClick={() => setActiveApp("admin")}
        >
          <Monitor className="h-4 w-4" />
          App Admin
        </Button>
      </div>

      {/* Mobile Frame */}
      <MobileFrame>
        {activeApp === "client" ? <ClientApp /> : <AdminApp />}
      </MobileFrame>

      {/* Navigation Tree */}
      <div className="max-w-md text-center">
        <h3 className="text-sm font-medium text-foreground mb-2">
          {activeApp === "client" ? "Navegacion Cliente" : "Navegacion Administrador"}
        </h3>
        <p className="text-xs text-muted-foreground">
          {activeApp === "client" 
            ? "Inicio > Chat | Resumen | Conexiones | Perfil"
            : "Dashboard | Clientes > Detalle | Auditoria | Configuracion"
          }
        </p>
      </div>
    </main>
  )
}
