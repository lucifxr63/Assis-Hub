# Portal de Usuarios — Plan de Implementación

**Fecha:** 2026-03-26 **Objetivo:** Frontend mobile-first para que usuarios externos (Erick, Rodrigo, José, Luciano, futuros) puedan ver configuración, estado y gestionar su agente sin depender de Felipe. **Equipo:** Luciano (frontend) \+ Bolt (dev backend vía Mac) **Stack:** Next.js (React) \+ API middleware (Node/Express) \+ OpenClaw Gateway

---

## 1\. Arquitectura

┌──────────────────────────────────────────────────────┐

│                  Usuario (móvil/desktop)               │

│                    Next.js App (SSR)                    │

│              Mobile-first, PWA-capable                  │

└──────────────────┬───────────────────────────────────┘

                   │ HTTPS

┌──────────────────▼───────────────────────────────────┐

│              API Middleware (Node/Express)              │

│                                                        │

│  \- Auth: Google OAuth 2.0 \+ JWT sessions               │

│  \- Mapeo usuario → agentId                             │

│  \- Rate limiting \+ CORS                                │

│  \- Proxy seguro al Gateway (solo ops permitidas)       │

│  \- Puerto: 18791                                       │

└──────────────────┬───────────────────────────────────┘

                   │ localhost (WS \+ HTTP)

┌──────────────────▼───────────────────────────────────┐

│              OpenClaw Gateway (:18789)                  │

│                                                        │

│  Endpoints disponibles:                                │

│  \- POST /v1/chat/completions (chat con agente)         │

│  \- POST /v1/responses (OpenResponses API)              │

│  \- POST /tools/invoke (invocar tools directamente)     │

│  \- WebSocket (sesiones en tiempo real)                 │

└──────────────────────────────────────────────────────┘

**Clave:** El frontend NUNCA habla directo al Gateway. Todo pasa por el middleware que:

1. Autentica al usuario (JWT)  
2. Resuelve `userId → agentId`  
3. Inyecta headers de Gateway (`Authorization`, `x-openclaw-agent-id`)  
4. Filtra qué operaciones puede hacer cada usuario

---

## 2\. Modelo de datos

### Tabla `users` (SQLite o JSON file para MVP)

{

  "users": \[

    {

      "id": "usr\_001",

      "email": "erick@example.com",

      "name": "Erick",

      "agentId": "erick",

      "phone": "+56986199797",

      "channel": "whatsapp",

      "role": "user",

      "createdAt": "2026-03-26T00:00:00Z",

      "settings": {

        "briefingTime": "08:00",

        "timezone": "America/Santiago",

        "language": "es"

      }

    }

  \]

}

### Roles

| Rol | Permisos |
| :---- | :---- |
| `admin` | Todo (Felipe) |
| `user` | Ver/editar config de SU agente, ver estado, chat |

---

## 3\. API Middleware — Endpoints

### 3.1 Auth

| Método | Ruta | Descripción |
| :---- | :---- | :---- |
| `GET` | `/auth/google` | Redirect a Google OAuth |
| `GET` | `/auth/google/callback` | Callback OAuth → genera JWT |
| `GET` | `/auth/me` | Valida sesión, retorna usuario |
| `POST` | `/auth/refresh` | Refresh token |
| `POST` | `/auth/logout` | Invalida token |

**Flujo OAuth:**

1. Frontend redirige a `/auth/google`  
2. Usuario aprueba con su Gmail  
3. Callback recibe el email  
4. Middleware busca email en tabla `users`  
   - Si existe → genera JWT con `{ userId, agentId, role }`  
   - Si no existe → 403 "No tienes un agente asignado. Contacta a Customware."  
5. JWT se guarda en cookie httpOnly \+ secure

**Response `/auth/me`:**

{

  "ok": true,

  "user": {

    "id": "usr\_001",

    "name": "Erick",

    "email": "erick@example.com",

    "agentId": "erick",

    "role": "user"

  }

}

**Error (no registrado):**

{

  "ok": false,

  "error": {

    "code": "USER\_NOT\_FOUND",

    "message": "No tienes un agente asignado. Contacta a Customware."

  }

}

### 3.2 Estado del agente

| Método | Ruta | Descripción |
| :---- | :---- | :---- |
| `GET` | `/api/agent/status` | Estado del agente del usuario |
| `GET` | `/api/agent/sessions` | Sesiones activas |
| `GET` | `/api/agent/history` | Historial reciente de mensajes |

Internamente el middleware hace:

GET /api/agent/status

  → POST gateway:18789/tools/invoke

    { tool: "session\_status", args: { sessionKey: "agent:\<agentId\>:main" } }

**Response `/api/agent/status`:**

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

### 3.3 Configuración del agente

| Método | Ruta | Descripción |
| :---- | :---- | :---- |
| `GET` | `/api/agent/config` | Config visible del agente |
| `PATCH` | `/api/agent/config` | Actualizar config permitida |

**Config expuesta (safe):**

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

**Config editable (PATCH):**

- `briefingTime` → actualiza cron del agente  
- `timezone`  
- `language`  
- `agentName` → actualiza IDENTITY.md del agente  
- `tone` → actualiza SOUL.md del agente

**Config NO editable (protegida):**

- model, tools, bindings, auth, gateway — solo admin

### 3.4 Chat con el agente (opcional, fase 2\)

| Método | Ruta | Descripción |
| :---- | :---- | :---- |
| `POST` | `/api/agent/chat` | Enviar mensaje al agente |
| `GET` | `/api/agent/chat/stream` | SSE stream de respuesta |

Internamente usa `/v1/chat/completions` con `x-openclaw-agent-id: <agentId>`.

### 3.5 Admin (solo Felipe)

| Método | Ruta | Descripción |
| :---- | :---- | :---- |
| `GET` | `/api/admin/users` | Lista todos los usuarios |
| `POST` | `/api/admin/users` | Crear nuevo usuario |
| `DELETE` | `/api/admin/users/:id` | Eliminar usuario |
| `GET` | `/api/admin/agents` | Estado de todos los agentes |
| `POST` | `/api/admin/provision` | Provisionar agente completo |

---

## 4\. Frontend — Pantallas

### 4.1 Login

- Botón "Continuar con Google"  
- Si no tiene agente → mensaje claro de contacto  
- Mobile-first, centrado, logo Customware

### 4.2 Dashboard (home)

- Estado del agente (activo/inactivo, última actividad)  
- Tokens usados hoy  
- Próximo briefing programado  
- Accesos rápidos: Config, Chat, Historial

### 4.3 Configuración

- Hora del briefing (time picker)  
- Zona horaria (selector)  
- Idioma  
- Nombre del agente  
- Tono (formal/casual/directo)  
- Canales conectados (read-only para MVP)

### 4.4 Historial (fase 2\)

- Últimos N mensajes con el agente  
- Filtros por fecha

### 4.5 Chat web (fase 2\)

- Interfaz tipo chat para hablar con el agente  
- Streaming de respuestas via SSE  
- Complementa WhatsApp, no lo reemplaza

### 4.6 Admin Panel (solo Felipe, fase 2\)

- Ver todos los usuarios y agentes  
- Provisionar nuevos usuarios  
- Ver métricas de uso

---

## 5\. Seguridad

### Principios

1. **Zero trust al frontend:** Todo se valida en el middleware  
2. **Scope por usuario:** Cada request solo puede operar sobre SU agente  
3. **Gateway token interno:** El token del gateway (`730ef...`) NUNCA se expone al frontend  
4. **JWT httpOnly:** No accesible desde JavaScript del cliente  
5. **CORS estricto:** Solo el dominio del frontend  
6. **Rate limiting:** Por usuario, por endpoint

### Headers que inyecta el middleware

Authorization: Bearer \<GATEWAY\_TOKEN\>        // token interno

x-openclaw-agent-id: \<agentId\>               // del JWT del usuario

x-openclaw-session-key: agent:\<agentId\>:main  // sesión del agente

### Lo que el usuario NO puede hacer

- ❌ Ver/modificar config de otros agentes  
- ❌ Acceder al gateway directamente  
- ❌ Ejecutar tools arbitrarios  
- ❌ Cambiar modelo o tools del agente  
- ❌ Ver MEMORY.md, SOUL.md, o archivos internos

---

## 6\. Prerequisitos en OpenClaw

Antes de que el front funcione, hay que habilitar en `openclaw.json`:

{

  gateway: {

    http: {

      endpoints: {

        chatCompletions: { enabled: true },  // para chat web

        responses: { enabled: true },         // alternativa OpenResponses

      }

    }

  }

}

El endpoint `/tools/invoke` ya está siempre habilitado.

---

## 7\. Fases de Implementación

### Fase 1 — MVP (2-3 semanas)

**Backend:**

- [ ] Scaffold proyecto Node/Express  
- [ ] Google OAuth 2.0 (con consent screen en modo test)  
- [ ] Tabla de usuarios (JSON → SQLite)  
- [ ] JWT auth middleware  
- [ ] Proxy `/api/agent/status` → gateway tools/invoke  
- [ ] Proxy `/api/agent/config` GET/PATCH  
- [ ] Habilitar endpoints HTTP en gateway config

**Frontend:**

- [ ] Next.js \+ Tailwind, mobile-first  
- [ ] Pantalla login con Google  
- [ ] Dashboard con estado del agente  
- [ ] Pantalla de configuración básica  
- [ ] PWA manifest (installable)

### Fase 2 — Chat \+ Historial (2 semanas)

- [ ] Chat web con streaming SSE  
- [ ] Historial de mensajes  
- [ ] Notificaciones push (si PWA)

### Fase 3 — Admin \+ Provisión (2 semanas)

- [ ] Panel admin para Felipe  
- [ ] Provisión automática de nuevos usuarios  
- [ ] Métricas de uso por agente  
- [ ] Onboarding web (complementa WhatsApp)

### Fase 4 — Producción (1 semana)

- [ ] HTTPS vía Cloudflare Tunnel o Tailscale Funnel  
- [ ] Dominio propio (ej: app.customware.cl)  
- [ ] Google OAuth consent screen verificado  
- [ ] Monitoring \+ alertas

---

## 8\. Stack Técnico Detallado

| Componente | Tecnología |
| :---- | :---- |
| Frontend | Next.js 15 \+ React 19 \+ Tailwind CSS |
| Auth | Google OAuth 2.0 \+ JWT (jose) |
| Backend API | Node.js \+ Express |
| Base de datos | SQLite (better-sqlite3) para MVP |
| Gateway comm | HTTP fetch → localhost:18789 |
| Deployment | Mismo Raspberry Pi (puerto 18791\) |
| HTTPS | Cloudflare Tunnel (gratis) |
| CI/CD | Git push → script de deploy |

---

## 9\. Estructura del Proyecto

portal-usuario/

├── frontend/           \# Next.js app

│   ├── app/

│   │   ├── layout.tsx

│   │   ├── page.tsx          \# → redirect a /dashboard o /login

│   │   ├── login/

│   │   │   └── page.tsx      \# Google OAuth button

│   │   ├── dashboard/

│   │   │   └── page.tsx      \# Agent status \+ quick actions

│   │   ├── config/

│   │   │   └── page.tsx      \# Agent settings

│   │   ├── chat/

│   │   │   └── page.tsx      \# Web chat (fase 2\)

│   │   └── admin/

│   │       └── page.tsx      \# Admin panel (fase 3\)

│   ├── components/

│   │   ├── AgentStatus.tsx

│   │   ├── ConfigForm.tsx

│   │   ├── ChatWindow.tsx

│   │   └── Layout/

│   ├── lib/

│   │   ├── api.ts            \# Fetch wrapper con auth

│   │   └── auth.ts           \# JWT helpers

│   └── public/

│       └── manifest.json     \# PWA

│

├── backend/            \# Express API

│   ├── server.ts

│   ├── routes/

│   │   ├── auth.ts           \# Google OAuth \+ JWT

│   │   ├── agent.ts          \# /api/agent/\*

│   │   └── admin.ts          \# /api/admin/\*

│   ├── middleware/

│   │   ├── auth.ts           \# JWT validation

│   │   └── rateLimit.ts

│   ├── services/

│   │   ├── gateway.ts        \# OpenClaw Gateway client

│   │   └── users.ts          \# User CRUD

│   └── data/

│       └── users.json        \# MVP user store

│

├── package.json

└── README.md

---

## 10\. Variables de Entorno

\# Backend

GATEWAY\_URL=http://localhost:18789

GATEWAY\_TOKEN=730ef3b0fb11aab542d1a5d8d2fa7f320c8c3ff9d29db084

GOOGLE\_CLIENT\_ID=\<from-google-console\>

GOOGLE\_CLIENT\_SECRET=\<from-google-console\>

GOOGLE\_CALLBACK\_URL=https://app.customware.cl/auth/google/callback

JWT\_SECRET=\<random-32-bytes\>

PORT=18791

\# Frontend

NEXT\_PUBLIC\_API\_URL=https://app.customware.cl

---

## 11\. Para Luciano — Resumen Frontend

**Lo que necesitas saber:**

1. **Auth:** Solo Google OAuth. El backend te da un JWT en cookie httpOnly. Tu frontend solo necesita:  
     
   - Redirigir a `GET /auth/google` para login  
   - Llamar `GET /auth/me` para verificar sesión  
   - Si 401 → mostrar login

   

2. **API calls:** Todas a `/api/*` con credentials incluidas (cookie). El backend maneja todo lo demás.  
     
3. **Diseño:** Mobile-first, tema oscuro preferido (consistente con Launch Control), Tailwind CSS.  
     
4. **Sin estado en frontend:** No guardes tokens en localStorage. La cookie httpOnly se maneja sola.  
     
5. **Streaming (fase 2):** Para el chat, usa `EventSource` o `fetch` con `ReadableStream` a `/api/agent/chat/stream`.

---

*Este documento se construirá con Bolt vía Mac. El frontend lo desarrolla Luciano en paralelo.*  
