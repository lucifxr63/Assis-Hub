"use client"

import { useState } from "react"
import { ChatInterface } from "./client/chat-interface"
import { DailySummary } from "./client/daily-summary"
import { ConnectionScreen } from "./client/connection-screen"
import { Button } from "@/components/ui/button"
import { MessageSquare, Sun, Link2 } from "lucide-react"

type ClientScreen = "chat" | "summary" | "connection"

export function ClientView() {
  const [currentScreen, setCurrentScreen] = useState<ClientScreen>("chat")

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <div className="flex gap-2 bg-card/95 backdrop-blur-sm shadow-xl border border-border rounded-full p-2">
          <Button
            variant={currentScreen === "chat" ? "default" : "ghost"}
            size="sm"
            className="rounded-full gap-2"
            onClick={() => setCurrentScreen("chat")}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Chat</span>
          </Button>
          <Button
            variant={currentScreen === "summary" ? "default" : "ghost"}
            size="sm"
            className="rounded-full gap-2"
            onClick={() => setCurrentScreen("summary")}
          >
            <Sun className="h-4 w-4" />
            <span className="hidden sm:inline">Resumen</span>
          </Button>
          <Button
            variant={currentScreen === "connection" ? "default" : "ghost"}
            size="sm"
            className="rounded-full gap-2"
            onClick={() => setCurrentScreen("connection")}
          >
            <Link2 className="h-4 w-4" />
            <span className="hidden sm:inline">Conexiones</span>
          </Button>
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 pt-20 pb-24">
        {currentScreen === "chat" && <ChatInterface />}
        {currentScreen === "summary" && <DailySummary />}
        {currentScreen === "connection" && <ConnectionScreen />}
      </div>
    </div>
  )
}
