# Backend Context — Portal de Usuarios OpenClaw

**Para:** Backend developer (Bolt)
**Fecha:** 2026-03-26
**Proyecto:** Portal web para que usuarios de OpenClaw gestionen su agente IA sin depender de Felipe
**Frontend:** Luciano (Next.js, mobile-first)
**Backend:** Este documento — Node.js/Express, puerto 18791

---

## 1. Contexto del sistema

OpenClaw es un gateway de agentes IA que corre en un Raspberry Pi. Cada usuario tiene un agente personalizado con su propia configuración, workspace y credenciales. Actualmente los usuarios solo interactúan vía WhatsApp. Este portal expone una API segura para que puedan:

- Ver el estado de su agente
- Editar configuración básica (hora de briefing, zona horaria, nombre del agente, tono)
- (Fase 2) Chatear con su agente desde la web
- (Fase 3) Admin panel para Felipe

**Nada del frontend toca el Gateway directamente.** Todo pasa por este middleware.

---

## 2. Arquitectura

```
Usuario (móvil/desktop)
        │ HTTPS
        ▼
API Middleware — Node/Express (:18791)   ← TÚ builds esto
   - Google OAuth 2.0 + JWT
   - userId → agentId mapping
   - Rate limiting + CORS
   - Proxy seguro al Gateway
        │ localhost HTTP/WS
        ▼
OpenClaw Gateway (:18789)               ← ya existe, no tocar
   POST /v1/chat/completions
   POST /v1/responses
   POST /tools/invoke
   WebSocket
```

---

## 3. Stack técnico

| Componente | Tecnología |
|---|---|
| Runtime | Node.js + TypeScript |
| Framework | Express |
| Auth | Google OAuth 2.0 + JWT (`jose`) |
| Base de datos | SQLite (`better-sqlite3`) — para MVP, users.json también válido |
| Gateway client | HTTP fetch → `http://localhost:18789` |
| Puerto | 18791 |
| Deployment | Mismo Raspberry Pi que el Gateway |
| HTTPS | Cloudflare Tunnel (para exponer al exterior) |

---

## 4. Variables de entorno (`.env`)

```env
# Gateway — NUNCA exponer al frontend
GATEWAY_URL=http://localhost:18789
GATEWAY_TOKEN=730ef3b0fb11aab542d1a5d8d2fa7f320c8c3ff9d29db084

# Google OAuth — crear en Google Cloud Console
GOOGLE_CLIENT_ID=<from-google-console>
GOOGLE_CLIENT_SECRET=<from-google-console>
GOOGLE_CALLBACK_URL=https://app.customware.cl/auth/google/callback

# JWT
JWT_SECRET=<random-32-bytes>
JWT_EXPIRES_IN=7d

# Server
PORT=18791
FRONTEND_URL=https://app.customware.cl
NODE_ENV=production
```

> ⚠️ El `GATEWAY_TOKEN` es el master token interno. Jamás retornarlo en ningún response.

---

## 5. Modelo de datos

### Tabla `users`

```typescript
interface User {
  id: string;              // "usr_001"
  email: string;           // email de Google OAuth
  name: string;            // nombre display
  agentId: string;         // id del agente en OpenClaw (ej: "erick")
  phone: string;           // número WhatsApp con código país
  channel: "whatsapp";     // canal principal
  role: "admin" | "user";
  createdAt: string;       // ISO 8601
  settings: {
    briefingTime: string;  // "HH:MM" en timezone del usuario
    timezone: string;      // IANA tz (ej: "America/Santiago")
    language: string;      // "es" | "en"
  };
}
```

### Usuarios actuales (seed data)

```json
[
  {
    "id": "usr_001",
    "email": "erick@[su-gmail].com",
    "name": "Erick",
    "agentId": "erick",
    "phone": "+56986199797",
    "channel": "whatsapp",
    "role": "user",
    "createdAt": "2026-03-26T00:00:00Z",
    "settings": { "briefingTime": "08:00", "timezone": "America/Santiago", "language": "es" }
  },
  {
    "id": "usr_002",
    "email": "rodrigo@[su-gmail].com",
    "name": "Rodrigo",
    "agentId": "rodrigo",
    "phone": "+56995374930",
    "channel": "whatsapp",
    "role": "user",
    "createdAt": "2026-03-26T00:00:00Z",
    "settings": { "briefingTime": "08:00", "timezone": "America/Santiago", "language": "es" }
  },
  {
    "id": "usr_003",
    "email": "jose@[su-gmail].com",
    "name": "José",
    "agentId": "jose",
    "phone": "+56959189812",
    "channel": "whatsapp",
    "role": "user",
    "createdAt": "2026-03-26T00:00:00Z",
    "settings": { "briefingTime": "08:00", "timezone": "America/Santiago", "language": "es" }
  },
  {
    "id": "usr_004",
    "email": "luciano@[su-gmail].com",
    "name": "Luciano",
    "agentId": "luciano",
    "phone": "+56999253551",
    "channel": "whatsapp",
    "role": "user",
    "createdAt": "2026-03-26T00:00:00Z",
    "settings": { "briefingTime": "08:00", "timezone": "America/Santiago", "language": "es" }
  },
  {
    "id": "usr_005",
    "email": "cesar@[su-gmail].com",
    "name": "César",
    "agentId": "cesar",
    "phone": "+56985020674",
    "channel": "whatsapp",
    "role": "user",
    "createdAt": "2026-03-26T00:00:00Z",
    "settings": { "briefingTime": "08:00", "timezone": "America/Santiago", "language": "es" }
  },
  {
    "id": "usr_admin",
    "email": "felipe@[su-gmail].com",
    "name": "Felipe",
    "agentId": "felipe",
    "phone": "",
    "channel": "whatsapp",
    "role": "admin",
    "createdAt": "2026-03-26T00:00:00Z",
    "settings": { "briefingTime": "08:00", "timezone": "America/Santiago", "language": "es" }
  }
]
```

> Los emails reales de cada usuario se deben completar antes del despliegue. El acceso está restringido a emails en esta tabla.

---

## 6. API Endpoints — Especificación completa

### 6.1 Auth

#### `GET /auth/google`
Redirige al flujo OAuth de Google. No requiere auth.

#### `GET /auth/google/callback`
Callback OAuth. Recibe `code` de Google, valida email contra tabla `users`.
- Si existe → firma JWT `{ userId, agentId, role }`, setea cookie httpOnly
- Si no existe → redirect a `/login?error=USER_NOT_FOUND`

**Cookie:**
```
Set-Cookie: session=<jwt>; HttpOnly; Secure; SameSite=Lax; Max-Age=604800
```

#### `GET /auth/me`
Requiere: cookie de sesión válida.

**Response 200:**
```json
{
  "ok": true,
  "user": {
    "id": "usr_001",
    "name": "Erick",
    "email": "erick@gmail.com",
    "agentId": "erick",
    "role": "user"
  }
}
```

**Response 401:**
```json
{ "ok": false, "error": { "code": "UNAUTHORIZED", "message": "Sesión inválida o expirada." } }
```

#### `POST /auth/refresh`
Renueva el JWT. Requiere cookie válida.

#### `POST /auth/logout`
Invalida la cookie (Max-Age=0).

---

### 6.2 Estado del agente

#### `GET /api/agent/status`
Requiere: auth user.
Internamente: `POST gateway:18789/tools/invoke` con `{ tool: "session_status", args: { sessionKey: "agent:<agentId>:main" } }`

**Response 200:**
```json
{
  "ok": true,
  "agent": {
    "id": "erick",
    "name": "Erick's Agent",
    "status": "active",
    "lastActivity": "2026-03-26T20:15:00Z",
    "model": "anthropic/claude-sonnet-4-6",
    "uptime": "3d 14h",
    "tokensToday": 12450
  }
}
```

#### `GET /api/agent/sessions`
Requiere: auth user.
Retorna sesiones activas del agente del usuario. Solo las del propio `agentId`.

#### `GET /api/agent/history`
Requiere: auth user.
Query params: `?limit=20&before=<ISO-date>`
Retorna historial reciente de mensajes del agente.

---

### 6.3 Configuración del agente

#### `GET /api/agent/config`
Requiere: auth user.

**Response 200:**
```json
{
  "ok": true,
  "config": {
    "briefingTime": "08:00",
    "timezone": "America/Santiago",
    "language": "es",
    "agentName": "Mi Asistente",
    "tone": "casual",
    "channels": {
      "whatsapp": { "connected": true, "phone": "+56986199797" },
      "telegram": { "connected": false }
    }
  }
}
```

#### `PATCH /api/agent/config`
Requiere: auth user.
Body (todos opcionales):

```json
{
  "briefingTime": "09:00",
  "timezone": "America/Santiago",
  "language": "es",
  "agentName": "Asistente Pro",
  "tone": "formal"
}
```

**Campos permitidos para editar:**
- `briefingTime` → actualiza settings del user en DB + cron del agente (tool invoke al gateway)
- `timezone` → actualiza settings del user en DB
- `language` → actualiza settings del user en DB
- `agentName` → modifica `IDENTITY.md` del agente (`~/.openclaw/agents/<agentId>/workspace/IDENTITY.md`)
- `tone` → modifica `SOUL.md` del agente (`~/.openclaw/agents/<agentId>/workspace/SOUL.md`)

**Campos BLOQUEADOS (devuelve 403 si se intentan editar):**
- `model`, `tools`, `bindings`, `auth`, `gateway`, cualquier campo no listado arriba

**Response 200:**
```json
{ "ok": true, "updated": ["briefingTime", "agentName"] }
```

---

### 6.4 Chat con el agente — Fase 2

#### `POST /api/agent/chat`
Requiere: auth user.

**Body:**
```json
{ "message": "Hola, necesito un resumen de mi semana" }
```

Internamente: `POST gateway:18789/v1/chat/completions` con header `x-openclaw-agent-id: <agentId>`.

#### `GET /api/agent/chat/stream`
SSE stream. Usa `ReadableStream` del fetch al gateway. El frontend escucha con `EventSource`.

---

### 6.5 Admin — Solo Felipe (role: admin)

Todos requieren: auth + `role === "admin"`. Cualquier otro role → 403.

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/admin/users` | Lista todos los usuarios |
| `POST` | `/api/admin/users` | Crear nuevo usuario |
| `DELETE` | `/api/admin/users/:id` | Eliminar usuario |
| `GET` | `/api/admin/agents` | Estado de todos los agentes |
| `POST` | `/api/admin/provision` | Provisionar agente completo en el sistema |

#### `POST /api/admin/provision`
Ejecuta la secuencia de provisión de un nuevo usuario:

1. Crear directorios `~/.openclaw/agents/<userId>/workspace/memory` y `agent/`
2. Generar archivos workspace: `AGENTS.md`, `SOUL.md`, `USER.md`, `IDENTITY.md`, `MEMORY.md`, `TOOLS.md`, `HEARTBEAT.md`
3. Copiar/generar `auth-profiles.json` y `models.json` en `agent/`
4. Agregar entry a `openclaw.json`: `agents.list[]`, `bindings[]`, `channels.whatsapp.allowFrom[]`
5. Aplicar `tools.deny` para usuarios externos (ver sección 8)
6. Restart del gateway

---

## 7. Headers que el middleware inyecta al Gateway

```
Authorization: Bearer <GATEWAY_TOKEN>          // del .env, nunca del cliente
x-openclaw-agent-id: <agentId>                 // del JWT del usuario
x-openclaw-session-key: agent:<agentId>:main   // sesión del agente
```

---

## 8. Seguridad

### Principios
1. El frontend nunca habla directo al Gateway
2. Cada request solo puede operar sobre el agente del usuario autenticado (`agentId` viene del JWT, no del request body)
3. `GATEWAY_TOKEN` nunca se expone en ningún response
4. JWT en cookie `httpOnly` — no accesible desde JS del cliente
5. CORS: solo el dominio del frontend (`FRONTEND_URL` del `.env`)
6. Rate limiting por usuario: sugerido 60 req/min en endpoints normales, 10 req/min en chat

### Tools deny para usuarios externos
Al provisionar usuarios no-admin, aplicar en `openclaw.json`:

```json
"tools": {
  "deny": [
    "exec", "process", "gateway", "nodes",
    "sessions_spawn", "subagents",
    "sessions_list", "sessions_history",
    "sessions_send", "session_status"
  ],
  "elevated": { "enabled": false }
}
```

> ⚠️ **Estado actual:** José, Luciano y César aún no tienen `tools.deny` aplicado. Esto es un riesgo de seguridad activo — pueden ejecutar `exec`, `gateway`, etc.

### Lo que un usuario NO puede hacer vía la API
- Ver o modificar config de otros agentes
- Acceder a `MEMORY.md`, `SOUL.md`, o archivos internos del workspace
- Cambiar modelo o tools del agente
- Ejecutar tools arbitrarios vía `/tools/invoke`
- Acceder a endpoints `/api/admin/*`

---

## 9. Estructura del proyecto

```
portal-usuario/
├── backend/
│   ├── server.ts
│   ├── routes/
│   │   ├── auth.ts          # GET /auth/google, callback, /auth/me, logout
│   │   ├── agent.ts         # /api/agent/*
│   │   └── admin.ts         # /api/admin/*
│   ├── middleware/
│   │   ├── auth.ts          # JWT validation, extrae userId/agentId/role del JWT
│   │   └── rateLimit.ts
│   ├── services/
│   │   ├── gateway.ts       # Cliente HTTP hacia localhost:18789
│   │   └── users.ts         # CRUD sobre SQLite/JSON
│   └── data/
│       └── users.json       # Seed data (ver sección 5)
├── frontend/                # Luciano lo maneja — Next.js
│   └── ...
└── package.json
```

---

## 10. Prerequisitos en OpenClaw (confirmar con Felipe antes de testear)

Habilitar en `openclaw.json` del gateway:

```json
{
  "gateway": {
    "http": {
      "endpoints": {
        "chatCompletions": { "enabled": true },
        "responses": { "enabled": true }
      }
    }
  }
}
```

El endpoint `/tools/invoke` ya está habilitado por defecto.

---

## 11. Fases de implementación — Scope del backend

### Fase 1 — MVP (prioridad ahora)
- [ ] Scaffold Node/Express + TypeScript
- [ ] Google OAuth 2.0 con Passport.js o `openid-client`
- [ ] Tabla de usuarios (SQLite con better-sqlite3 o JSON file)
- [ ] JWT middleware (generación + validación con `jose`)
- [ ] `GET /api/agent/status` → proxy a gateway `tools/invoke`
- [ ] `GET /api/agent/config` → leer settings del usuario
- [ ] `PATCH /api/agent/config` → editar campos permitidos + modificar archivos workspace
- [ ] Habilitar endpoints HTTP en gateway config
- [ ] CORS + rate limiting

### Fase 2
- [ ] `POST /api/agent/chat` + SSE stream
- [ ] `GET /api/agent/history`
- [ ] `GET /api/agent/sessions`

### Fase 3
- [ ] Endpoints `/api/admin/*`
- [ ] `POST /api/admin/provision` (automatiza checklist de provisión)
- [ ] Métricas de uso por agente

### Fase 4
- [ ] HTTPS via Cloudflare Tunnel
- [ ] Google OAuth consent screen verificado (salir de modo test)
- [ ] Monitoring + alertas

---

## 12. Errores estándar

Todos los errores siguen este formato:

```json
{
  "ok": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Mensaje legible para el usuario"
  }
}
```

| Código | HTTP | Cuándo |
|---|---|---|
| `UNAUTHORIZED` | 401 | Cookie ausente o JWT inválido/expirado |
| `FORBIDDEN` | 403 | Usuario autenticado pero sin permisos (ej: acceso admin) |
| `USER_NOT_FOUND` | 403 | Email de Google no registrado en la tabla de usuarios |
| `AGENT_UNAVAILABLE` | 503 | Gateway no responde o agente offline |
| `FIELD_NOT_EDITABLE` | 400 | Intento de editar campo protegido en PATCH config |
| `VALIDATION_ERROR` | 400 | Body malformado |
| `RATE_LIMITED` | 429 | Demasiadas requests |

---

## 13. Notas de integración con el Gateway

El Gateway en `:18789` expone:
- `POST /v1/chat/completions` — chat en formato OpenAI
- `POST /v1/responses` — OpenResponses API (alternativa)
- `POST /tools/invoke` — invocar tools directamente
- WebSocket — sesiones en tiempo real

Para obtener el estado del agente, el middleware usa `tools/invoke`:

```http
POST http://localhost:18789/tools/invoke
Authorization: Bearer <GATEWAY_TOKEN>
x-openclaw-agent-id: <agentId>
Content-Type: application/json

{
  "tool": "session_status",
  "args": { "sessionKey": "agent:<agentId>:main" }
}
```

---

*Documento generado para el backend developer. Cualquier duda coordinar con Luciano (frontend) o Felipe (sistema OpenClaw).*
