"use client"

/**
 * ClientApp — Shell principal de la aplicación
 *
 * RESPONSABILIDADES
 * ─────────────────
 * 1. Verificar sesión al montar (GET /auth/me)
 * 2. Mostrar loading → login → app según el estado de auth
 * 3. Proveer el estado del usuario a las pantallas hijas
 * 4. Manejar logout globalmente
 * 5. Renderizar la navegación (bottom tabs en mobile, sidebar en desktop)
 *
 * ESTADOS DE AUTH
 * ───────────────
 * "loading"      → verificando sesión con el backend
 * null           → sin sesión → muestra LoginScreen
 * User object    → autenticado → muestra la app
 *
 * MOCK MODE
 * ─────────
 * getMe() retorna null (simula sesión cerrada), mostrando la pantalla de login.
 * Al hacer clic en "Continuar con Google", mockLogin() retorna el usuario mock
 * y la app pasa al estado autenticado sin ningún redirect.
 * Cambia NEXT_PUBLIC_USE_MOCK=false para usar el backend real.
 */

import { useState, useEffect } from "react"
import { ClientChatScreen } from "./client/screens/chat-screen"
import { ClientSummaryScreen } from "./client/screens/summary-screen"
import { ClientProfileScreen } from "./client/screens/profile-screen"
import { LoginScreen } from "./client/screens/login-screen"
import { Home, MessageSquare, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { getMe, mockLogin, loginWithGoogle, logout, USE_MOCK } from "@/lib/api"
import type { User } from "@/lib/types"

// Exported so screens can reference it in their props
export type ClientScreen = "dashboard" | "chat" | "config"

const TABS = [
  { id: "dashboard" as const, label: "Inicio",  icon: Home },
  { id: "chat"      as const, label: "Chat",    icon: MessageSquare },
  { id: "config"    as const, label: "Config",  icon: Settings },
]

// ─── Loading screen ───────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-3 bg-background">
      <div className="h-10 w-10 rounded-2xl bg-primary animate-pulse" />
      <p className="text-sm text-muted-foreground">Verificando sesión...</p>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ClientApp() {
  const [user, setUser] = useState<User | null | "loading">("loading")
  const [loginError, setLoginError] = useState<string | null>(null)
  const [currentScreen, setCurrentScreen] = useState<ClientScreen>("dashboard")

  useEffect(() => {
    // Detect OAuth error callback from backend (e.g. /?error=USER_NOT_FOUND)
    const params = new URLSearchParams(window.location.search)
    const error = params.get("error")
    if (error) {
      setLoginError(error)
      // Clean the URL so the error doesn't persist on refresh
      window.history.replaceState({}, "", window.location.pathname)
    }

    // Validate existing session
    getMe().then((res) => {
      setUser(res?.ok ? res.user : null)
    })
  }, [])

  // ── Auth handlers ───────────────────────────────────────────────────────────

  async function handleLogin() {
    if (USE_MOCK) {
      // Mock: simulate OAuth by loading the mock user directly
      setUser("loading")
      const mockUser = await mockLogin()
      setUser(mockUser)
    } else {
      // Real: redirect to backend OAuth — browser never comes back here
      loginWithGoogle()
    }
  }

  async function handleLogout() {
    await logout()
    setUser(null)
    setCurrentScreen("dashboard")
  }

  // ── Render states ────────────────────────────────────────────────────────────

  if (user === "loading") {
    return <LoadingScreen />
  }

  if (user === null) {
    return (
      <div className="h-screen bg-background overflow-hidden">
        <LoginScreen onLogin={handleLogin} error={loginError} />
      </div>
    )
  }

  // ── Authenticated app ────────────────────────────────────────────────────────

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-background overflow-hidden">

      {/* ── Desktop sidebar ─────────────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card shrink-0">
        <div className="p-6 border-b border-border">
          <h1 className="text-lg font-semibold">Customware</h1>
          <p className="text-xs text-muted-foreground">{user.name} · {user.email}</p>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = currentScreen === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentScreen(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left w-full",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {tab.label}
                {tab.id === "chat" && (
                  <span className="ml-auto text-[10px] bg-muted text-muted-foreground rounded-full px-1.5 py-0.5">
                    Fase 2
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-0">

        {/* Screen */}
        <div className="flex-1 overflow-hidden">
          {currentScreen === "dashboard" && (
            <ClientSummaryScreen
              userName={user.name}
              onNavigate={setCurrentScreen}
            />
          )}
          {currentScreen === "chat" && <ClientChatScreen />}
          {currentScreen === "config" && (
            <ClientProfileScreen onLogout={handleLogout} />
          )}
        </div>

        {/* ── Mobile bottom tab bar ──────────────────────────────────────────── */}
        <nav className="lg:hidden h-16 bg-card border-t border-border px-2 shrink-0">
          <div className="flex justify-around items-center h-full">
            {TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = currentScreen === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentScreen(tab.id)}
                  className={cn(
                    "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors relative",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <Icon className={cn("h-5 w-5", isActive && "stroke-[2.5]")} />
                  <span className="text-[10px] font-medium">{tab.label}</span>
                  {tab.id === "chat" && (
                    <span className="absolute -top-0.5 right-2 h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
                  )}
                </button>
              )
            })}
          </div>
        </nav>
      </div>
    </div>
  )
}
