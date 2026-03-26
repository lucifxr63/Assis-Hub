"use client"

import { useState } from "react"
import { ClientChatScreen } from "./client/screens/chat-screen"
import { ClientSummaryScreen } from "./client/screens/summary-screen"
import { ClientConnectionsScreen } from "./client/screens/connections-screen"
import { ClientProfileScreen } from "./client/screens/profile-screen"
import { Home, MessageSquare, Link2, User } from "lucide-react"
import { cn } from "@/lib/utils"

type ClientScreen = "summary" | "chat" | "connections" | "profile"

const tabs = [
  { id: "summary" as const, label: "Inicio", icon: Home },
  { id: "chat" as const, label: "Chat", icon: MessageSquare },
  { id: "connections" as const, label: "Conectar", icon: Link2 },
  { id: "profile" as const, label: "Perfil", icon: User },
]

export function ClientApp() {
  const [currentScreen, setCurrentScreen] = useState<ClientScreen>("summary")

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Screen Content */}
      <div className="flex-1 overflow-hidden">
        {currentScreen === "summary" && <ClientSummaryScreen onNavigate={setCurrentScreen} />}
        {currentScreen === "chat" && <ClientChatScreen />}
        {currentScreen === "connections" && <ClientConnectionsScreen />}
        {currentScreen === "profile" && <ClientProfileScreen />}
      </div>

      {/* Bottom Tab Bar */}
      <nav className="h-20 bg-card border-t border-border px-2 pb-6">
        <div className="flex justify-around items-center h-full">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = currentScreen === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentScreen(tab.id)}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
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
