"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClientView } from "@/components/client-view"
import { AdminView } from "@/components/admin-view"
import { MessageSquare, Settings } from "lucide-react"

export default function Home() {
  const [activeView, setActiveView] = useState<"client" | "admin">("client")

  return (
    <main className="min-h-screen bg-background">
      <Tabs value={activeView} onValueChange={(v) => setActiveView(v as "client" | "admin")} className="w-full">
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <TabsList className="bg-card shadow-lg border border-border">
            <TabsTrigger value="client" className="gap-2 px-6">
              <MessageSquare className="h-4 w-4" />
              Cliente
            </TabsTrigger>
            <TabsTrigger value="admin" className="gap-2 px-6">
              <Settings className="h-4 w-4" />
              Administrador
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="client" className="mt-0 focus-visible:outline-none">
          <ClientView />
        </TabsContent>
        
        <TabsContent value="admin" className="mt-0 focus-visible:outline-none">
          <AdminView />
        </TabsContent>
      </Tabs>
    </main>
  )
}
