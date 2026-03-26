"use client"

import { useState } from "react"
import { AdminDashboardScreen } from "./admin/screens/dashboard-screen"
import { AdminClientsScreen } from "./admin/screens/clients-screen"
import { AdminClientDetailScreen } from "./admin/screens/client-detail-screen"
import { AdminAuditScreen } from "./admin/screens/audit-screen"
import { AdminSettingsScreen } from "./admin/screens/settings-screen"
import { LayoutDashboard, Users, FileText, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

type AdminScreen = "dashboard" | "clients" | "client-detail" | "audit" | "settings"

const tabs = [
  { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
  { id: "clients" as const, label: "Clientes", icon: Users },
  { id: "audit" as const, label: "Auditoria", icon: FileText },
  { id: "settings" as const, label: "Config", icon: Settings },
]

export function AdminApp() {
  const [currentScreen, setCurrentScreen] = useState<AdminScreen>("dashboard")
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)

  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId)
    setCurrentScreen("client-detail")
  }

  const handleBack = () => {
    setCurrentScreen("clients")
    setSelectedClientId(null)
  }

  return (
    <div className="h-full flex flex-col bg-sidebar">
      {/* Screen Content */}
      <div className="flex-1 overflow-hidden bg-background rounded-t-3xl">
        {currentScreen === "dashboard" && <AdminDashboardScreen />}
        {currentScreen === "clients" && <AdminClientsScreen onClientSelect={handleClientSelect} />}
        {currentScreen === "client-detail" && <AdminClientDetailScreen clientId={selectedClientId} onBack={handleBack} />}
        {currentScreen === "audit" && <AdminAuditScreen />}
        {currentScreen === "settings" && <AdminSettingsScreen />}
      </div>

      {/* Bottom Tab Bar */}
      <nav className="h-20 bg-sidebar px-2 pb-6">
        <div className="flex justify-around items-center h-full">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = currentScreen === tab.id || 
              (tab.id === "clients" && currentScreen === "client-detail")
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentScreen(tab.id)}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors",
                  isActive ? "text-sidebar-primary" : "text-sidebar-foreground/60"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive && "stroke-[2.5]")} />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
