"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, FileText, Settings, Bot, LogOut } from "lucide-react"
import type { AdminScreen } from "../admin-view"

interface AdminSidebarProps {
  currentScreen: AdminScreen
  onScreenChange: (screen: AdminScreen) => void
}

const menuItems = [
  { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
  { id: "clients" as const, label: "Clientes", icon: Users },
  { id: "audit" as const, label: "Auditoría", icon: FileText },
  { id: "settings" as const, label: "Configuración", icon: Settings },
]

export function AdminSidebar({ currentScreen, onScreenChange }: AdminSidebarProps) {
  return (
    <aside className="hidden lg:flex w-64 flex-col p-4 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 py-4 mb-6">
        <div className="h-10 w-10 rounded-xl bg-sidebar-primary flex items-center justify-center">
          <Bot className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="font-semibold text-sidebar-foreground">AsistenteAI</h1>
          <p className="text-xs text-sidebar-foreground/60">Panel de Control</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
                currentScreen === item.id && "bg-sidebar-accent text-sidebar-foreground"
              )}
              onClick={() => onScreenChange(item.id)}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          )
        })}
      </nav>

      {/* User */}
      <div className="pt-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="h-9 w-9 rounded-full bg-sidebar-accent flex items-center justify-center">
            <span className="text-sm font-medium text-sidebar-accent-foreground">FG</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">Felipe García</p>
            <p className="text-xs text-sidebar-foreground/60">Administrador</p>
          </div>
          <Button variant="ghost" size="icon" className="text-sidebar-foreground/60 hover:text-sidebar-foreground shrink-0">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  )
}
