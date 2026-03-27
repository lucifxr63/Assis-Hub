"use client"

/**
 * LoginScreen — Pantalla de inicio de sesión
 *
 * AUTH FLOW (producción)
 * ─────────────────────
 * 1. Usuario hace clic en "Continuar con Google"
 * 2. onLogin() redirige a GET /auth/google en el middleware
 * 3. El middleware completa OAuth con Google y setea un JWT en cookie httpOnly
 * 4. El backend redirige de vuelta a la app (/)
 * 5. ClientApp llama GET /auth/me → obtiene el usuario → muestra el dashboard
 *
 * ERROR FLOW
 * ──────────
 * Si el email del usuario no está registrado en OpenClaw, el backend
 * redirige a /?error=USER_NOT_FOUND. ClientApp detecta el query param
 * y lo pasa como prop `error` a este componente.
 *
 * MOCK MODE
 * ─────────
 * onLogin() viene de ClientApp. En mock mode, en vez de redirigir al
 * backend, establece el usuario mock directamente en el estado de la app.
 */

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import type { ApiErrorCode } from "@/lib/types"

// Error messages mapped to backend error codes
const ERROR_MESSAGES: Partial<Record<ApiErrorCode, string>> = {
  USER_NOT_FOUND:
    "Tu cuenta no tiene un agente asignado. Contacta a Customware para obtener acceso.",
  UNAUTHORIZED:
    "Tu sesión expiró. Inicia sesión nuevamente.",
}

interface LoginScreenProps {
  /** Called when the user clicks "Continuar con Google".
   *  In mock mode: sets the mock user directly.
   *  In production: redirects to /auth/google (never returns). */
  onLogin: () => void
  /** OAuth error code passed from the backend via query param (?error=CODE). */
  error?: string | null
}

export function LoginScreen({ onLogin, error }: LoginScreenProps) {
  const errorMessage = error
    ? (ERROR_MESSAGES[error as ApiErrorCode] ?? "Ocurrió un error inesperado. Intenta de nuevo.")
    : null

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-background">

      {/* Brand */}
      <div className="flex flex-col items-center gap-3 mb-8">
        <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
          {/* Customware logo placeholder — replace src when available */}
          <span className="text-2xl font-bold text-primary-foreground">CW</span>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Customware</h1>
          <p className="text-sm text-muted-foreground mt-1">Portal de agentes IA</p>
        </div>
      </div>

      {/* Card */}
      <Card className="w-full max-w-sm border-border bg-card">
        <CardContent className="p-6 space-y-4">

          {/* Error banner */}
          {errorMessage && (
            <div className="flex gap-3 p-3 rounded-xl bg-destructive/10 border border-destructive/20">
              <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <p className="text-xs text-destructive leading-relaxed">{errorMessage}</p>
            </div>
          )}

          {/* Description */}
          <p className="text-sm text-muted-foreground text-center">
            Accede con tu cuenta de Google para gestionar tu agente.
          </p>

          {/* Google OAuth button */}
          <Button
            onClick={onLogin}
            className="w-full h-11 rounded-xl gap-3 text-sm font-medium"
          >
            {/* Google "G" icon */}
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden>
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continuar con Google
          </Button>
        </CardContent>
      </Card>

      {/* Footer */}
      <p className="mt-8 text-xs text-muted-foreground text-center max-w-xs">
        Solo usuarios con un agente asignado pueden acceder.
        <br />
        ¿No tienes acceso?{" "}
        <a
          href="mailto:contacto@customware.cl"
          className="text-primary hover:underline"
        >
          Contacta a Customware
        </a>
      </p>
    </div>
  )
}
