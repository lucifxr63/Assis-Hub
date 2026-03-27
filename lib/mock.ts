/**
 * Mock data for all API responses.
 *
 * Shapes match exactly the real API contracts defined in the middleware.
 * When switching to real API, only lib/api.ts changes — this file can be
 * kept for testing or removed entirely.
 */

import type { AuthMeResponse, AgentStatusResponse, AgentConfigResponse } from "./types"

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const MOCK_ME: AuthMeResponse = {
  ok: true,
  user: {
    id: "usr_004",
    name: "Luciano",
    email: "luciano@customware.cl",
    agentId: "luciano",
    role: "user",
  },
}

// ─── Agent Status ─────────────────────────────────────────────────────────────

export const MOCK_AGENT_STATUS: AgentStatusResponse = {
  ok: true,
  agent: {
    id: "luciano",
    name: "Asistente de Luciano",
    status: "active",
    // Dynamic: 23 minutes ago from now
    lastActivity: new Date(Date.now() - 23 * 60 * 1000).toISOString(),
    model: "anthropic/claude-sonnet-4-6",
    uptime: "3d 14h",
    tokensToday: 12450,
  },
}

// ─── Agent Config ─────────────────────────────────────────────────────────────

export const MOCK_AGENT_CONFIG: AgentConfigResponse = {
  ok: true,
  config: {
    briefingTime: "08:00",
    timezone: "America/Santiago",
    language: "es",
    agentName: "Asistente de Luciano",
    tone: "casual",
    channels: {
      whatsapp: { connected: true, phone: "+56999253551" },
      telegram: { connected: false },
    },
  },
}
