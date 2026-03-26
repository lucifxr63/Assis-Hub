"use client"

import { useState } from "react"
import { AdminSidebar } from "./admin/admin-sidebar"
import { DashboardScreen } from "./admin/dashboard-screen"
import { ClientsScreen } from "./admin/clients-screen"
import { AuditScreen } from "./admin/audit-screen"
import { SettingsScreen } from "./admin/settings-screen"

export type AdminScreen = "dashboard" | "clients" | "audit" | "settings"

export function AdminView() {
  const [currentScreen, setCurrentScreen] = useState<AdminScreen>("dashboard")

  return (
    <div className="min-h-screen flex bg-sidebar text-sidebar-foreground">
      {/* Sidebar */}
      <AdminSidebar currentScreen={currentScreen} onScreenChange={setCurrentScreen} />

      {/* Main Content */}
      <main className="flex-1 bg-background rounded-tl-2xl overflow-auto pt-16 lg:pt-0">
        {currentScreen === "dashboard" && <DashboardScreen />}
        {currentScreen === "clients" && <ClientsScreen />}
        {currentScreen === "audit" && <AuditScreen />}
        {currentScreen === "settings" && <SettingsScreen />}
      </main>
    </div>
  )
}
