// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string
  name: string
  email: string
  agentId: string
  role: "user" | "admin"
}

export interface AuthMeResponse {
  ok: true
  user: User
}

// ─── Agent ────────────────────────────────────────────────────────────────────

export type AgentStatusValue = "active" | "inactive" | "error"

export interface AgentStatus {
  id: string
  name: string
  status: AgentStatusValue
  lastActivity: string   // ISO 8601
  model: string
  uptime: string
  tokensToday: number
}

export interface AgentStatusResponse {
  ok: true
  agent: AgentStatus
}

export type Tone = "formal" | "casual" | "directo"

export interface AgentConfig {
  briefingTime: string   // "HH:MM"
  timezone: string       // IANA tz, e.g. "America/Santiago"
  language: "es" | "en"
  agentName: string
  tone: Tone
  channels: {
    whatsapp: { connected: boolean; phone?: string }
    telegram: { connected: boolean }
  }
}

export interface AgentConfigResponse {
  ok: true
  config: AgentConfig
}

// ─── Errors ───────────────────────────────────────────────────────────────────

export type ApiErrorCode =
  | "USER_NOT_FOUND"      // 403 — email no registrado en OpenClaw
  | "UNAUTHORIZED"        // 401 — sin sesión o token expirado
  | "AGENT_UNAVAILABLE"   // agente offline
  | "RATE_LIMITED"
  | "UNKNOWN"

export interface ApiError {
  ok: false
  error: {
    code: ApiErrorCode
    message: string
  }
}
