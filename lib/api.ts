/**
 * lib/api.ts — API client for the Portal de Usuarios
 *
 * HOW THE MOCK SYSTEM WORKS
 * ─────────────────────────
 * Set NEXT_PUBLIC_USE_MOCK=true in .env.local to run entirely on mock data.
 * Every function checks the USE_MOCK flag first and returns local data with
 * a simulated delay. No network requests are made.
 *
 * TO SWITCH TO THE REAL API
 * ─────────────────────────
 * 1. Set NEXT_PUBLIC_USE_MOCK=false in .env.local (or remove the var)
 * 2. Set NEXT_PUBLIC_API_URL=http://localhost:18791 (or production URL)
 * 3. Done — every function below already calls the correct endpoint.
 *
 * AUTH MODEL
 * ──────────
 * Auth is handled via httpOnly cookies set by the backend after Google OAuth.
 * The frontend NEVER stores tokens in localStorage or memory.
 * Every request includes credentials: "include" so the cookie is sent automatically.
 * On 401 → the user is redirected to the login flow.
 */

import { MOCK_ME, MOCK_AGENT_STATUS, MOCK_AGENT_CONFIG } from "./mock"
import type {
  User,
  AuthMeResponse,
  AgentStatusResponse,
  AgentConfigResponse,
  AgentConfig,
} from "./types"

// ─── Config ───────────────────────────────────────────────────────────────────

/** Base URL of the API middleware. Override via NEXT_PUBLIC_API_URL. */
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:18791"

/**
 * When true, all API functions return mock data instead of making HTTP requests.
 * Controlled by the NEXT_PUBLIC_USE_MOCK environment variable.
 */
export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true"

// ─── Internal helpers ─────────────────────────────────────────────────────────

/** Simulates realistic network latency in mock mode. */
function delay(ms = 650) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Base fetch wrapper used by all API calls.
 * - Always includes credentials (httpOnly cookie)
 * - Sets Content-Type: application/json
 * - On 401 → redirects to login (session expired)
 */
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  if (res.status === 401) {
    // Token expired or missing — send user back to login
    window.location.href = "/?error=UNAUTHORIZED"
    throw new Error("Unauthorized")
  }

  return res.json() as Promise<T>
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

/**
 * GET /auth/me
 *
 * Validates the current session via the httpOnly JWT cookie.
 * Returns the authenticated user or null if no valid session exists.
 *
 * Called on every app load to determine whether to show login or the main app.
 */
export async function getMe(): Promise<AuthMeResponse | null> {
  if (USE_MOCK) {
    await delay()
    // Return null to simulate logged-out state so the login screen is visible.
    // Change to `return MOCK_ME` to simulate a pre-authenticated session.
    return null
  }

  // NOTE: getMe() does NOT use apiFetch() intentionally.
  // apiFetch() redirects on 401, which would cause an infinite reload loop
  // since this function is called on every page load to check the session.
  // A 401 here simply means "no session" → return null → show login.
  try {
    const res = await fetch(`${API_URL}/auth/me`, { credentials: "include" })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

/**
 * Simulates a successful Google OAuth login in mock mode.
 * In production this function is never called — the OAuth redirect handles auth.
 *
 * Returns the mock authenticated user.
 */
export async function mockLogin(): Promise<User> {
  await delay(800)
  return MOCK_ME.user
}

/**
 * Initiates the Google OAuth flow.
 * Redirects the browser to the backend OAuth endpoint.
 * The backend sets an httpOnly JWT cookie on success and redirects back to /.
 * On error (user not in OpenClaw), redirects to /?error=USER_NOT_FOUND.
 *
 * NOTE: This function never "returns" — it redirects the browser.
 */
export function loginWithGoogle(): void {
  window.location.href = `${API_URL}/auth/google`
}

/**
 * POST /auth/logout
 *
 * Invalidates the server-side session and clears the httpOnly cookie.
 */
export async function logout(): Promise<void> {
  if (USE_MOCK) {
    await delay(400)
    return
  }
  await apiFetch("/auth/logout", { method: "POST" })
}

// ─── Agent Status ─────────────────────────────────────────────────────────────

/**
 * GET /api/agent/status
 *
 * Returns the current runtime status of the user's agent.
 * Internally, the middleware calls POST gateway:18789/tools/invoke
 * with { tool: "session_status", args: { sessionKey: "agent:<agentId>:main" } }
 *
 * Response includes: status, lastActivity, model, uptime, tokensToday
 */
export async function getAgentStatus(): Promise<AgentStatusResponse> {
  if (USE_MOCK) {
    await delay()
    return MOCK_AGENT_STATUS
  }
  return apiFetch<AgentStatusResponse>("/api/agent/status")
}

// ─── Agent Config ─────────────────────────────────────────────────────────────

/**
 * GET /api/agent/config
 *
 * Returns the user-visible (safe) configuration of their agent.
 * Protected fields (model, tools, bindings, gateway) are never included.
 *
 * Editable fields: briefingTime, timezone, language, agentName, tone
 * Read-only fields: channels (for MVP)
 */
export async function getAgentConfig(): Promise<AgentConfigResponse> {
  if (USE_MOCK) {
    await delay()
    return MOCK_AGENT_CONFIG
  }
  return apiFetch<AgentConfigResponse>("/api/agent/config")
}

/**
 * PATCH /api/agent/config
 *
 * Updates allowed configuration fields of the agent.
 * The middleware validates that only editable fields are modified.
 *
 * Side effects on the backend:
 * - briefingTime → updates the agent's cron schedule
 * - agentName    → updates IDENTITY.md in the agent's workspace
 * - tone         → updates SOUL.md in the agent's workspace
 *
 * @param config - Partial config with only the fields to update
 */
export async function updateAgentConfig(
  config: Partial<Pick<AgentConfig, "briefingTime" | "timezone" | "language" | "agentName" | "tone">>
): Promise<AgentConfigResponse> {
  if (USE_MOCK) {
    await delay(900)
    // Merge with existing mock config to simulate a real PATCH response
    return {
      ok: true,
      config: { ...MOCK_AGENT_CONFIG.config, ...config },
    }
  }
  return apiFetch<AgentConfigResponse>("/api/agent/config", {
    method: "PATCH",
    body: JSON.stringify(config),
  })
}
