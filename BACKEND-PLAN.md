# Backend — Plan de Implementación por Bloques

**Para:** Backend developer (Bolt)
**Stack:** Node.js + TypeScript + Express — Puerto 18791
**Referencia completa:** [BACKEND-CONTEXT.md](./BACKEND-CONTEXT.md)

---

## BLOQUE 1 — Scaffold + /auth/me 🔴

> Objetivo: que el frontend pase de "loading" a mostrar la pantalla de login real.
> El primer endpoint que llama el frontend al montar es `GET /auth/me`.

### 1.1 Scaffold del proyecto

```
backend/
├── server.ts
├── routes/
│   ├── auth.ts
│   ├── agent.ts
│   └── admin.ts
├── middleware/
│   ├── auth.ts         # JWT validation
│   └── rateLimit.ts
├── services/
│   ├── gateway.ts      # HTTP client → localhost:18789
│   └── users.ts        # CRUD sobre users.json
└── data/
    └── users.json      # Seed data (ver sección Users más abajo)
```

**Dependencies mínimas:**
```bash
npm install express cors cookie-parser dotenv jose
npm install -D typescript @types/express @types/node ts-node-dev
```

### 1.2 `GET /auth/me`

**Sin cookie válida → 401:**
```json
{ "ok": false, "error": { "code": "UNAUTHORIZED", "message": "Sesión inválida o expirada." } }
```

**Con cookie válida → 200:**
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

Lógica:
1. Leer cookie `session` del request
2. Si no existe → 401
3. Verificar JWT con `JWT_SECRET` (usar `jose`: `jwtVerify`)
4. Extraer `{ userId, agentId, role }` del payload
5. Buscar el user en `users.json` por `id`
6. Si no existe → 401 (el user fue eliminado después de emitir el token)
7. Retornar los campos públicos del user

### 1.3 CORS

```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL,   // dominio Netlify o localhost:3000
  credentials: true,                  // CRÍTICO: para que las cookies pasen
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));
```

### 1.4 `.env`

```env
GATEWAY_URL=http://localhost:18789
GATEWAY_TOKEN=730ef3b0fb11aab542d1a5d8d2fa7f320c8c3ff9d29db084
GOOGLE_CLIENT_ID=<from-google-console>
GOOGLE_CLIENT_SECRET=<from-google-console>
GOOGLE_CALLBACK_URL=https://app.customware.cl/auth/google/callback
JWT_SECRET=<random-32-bytes-hex>
JWT_EXPIRES_IN=7d
PORT=18791
FRONTEND_URL=https://<tu-subdominio>.netlify.app
NODE_ENV=production
```

> Para generar `JWT_SECRET`: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### ✅ Done cuando

Cambiar `NEXT_PUBLIC_USE_MOCK=false` en el frontend y que la pantalla de login aparezca sin errores de consola (no 404, no CORS error, no 500).

---

## BLOQUE 2 — Auth completo 🔴

> Objetivo: flujo completo login → dashboard → logout funciona en el browser.

### 2.1 `GET /auth/google`

Redirige al consent screen de Google.

```typescript
// Usar google-auth-library o construir la URL manualmente:
const url = `https://accounts.google.com/o/oauth2/v2/auth?` +
  `client_id=${GOOGLE_CLIENT_ID}` +
  `&redirect_uri=${GOOGLE_CALLBACK_URL}` +
  `&response_type=code` +
  `&scope=openid%20email%20profile` +
  `&access_type=offline`;
res.redirect(url);
```

**Dependencia recomendada:** `google-auth-library`
```bash
npm install google-auth-library
```

### 2.2 `GET /auth/google/callback`

Recibe `?code=...` de Google.

Flujo:
1. Intercambiar `code` por `id_token` + `access_token` usando Google Token endpoint
2. Verificar `id_token` y extraer `email`, `name`
3. Buscar email en `data/users.json`
4. Si no existe → `redirect(FRONTEND_URL + '/?error=USER_NOT_FOUND')`
5. Si existe → generar JWT:
   ```typescript
   // Payload del JWT
   { userId: user.id, agentId: user.agentId, role: user.role }
   ```
6. Setear cookie:
   ```typescript
   res.cookie('session', jwt, {
     httpOnly: true,
     secure: process.env.NODE_ENV === 'production',
     sameSite: 'lax',
     maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 días en ms
   });
   ```
7. Redirect a `FRONTEND_URL + '/dashboard'`

### 2.3 `POST /auth/logout`

```typescript
res.clearCookie('session');
res.json({ ok: true });
```

### ✅ Done cuando

El flujo completo login → dashboard → logout funciona en el browser sin recargas manuales ni errores.

---

## BLOQUE 3 — Dashboard operativo 🟡

> Objetivo: la pantalla de inicio muestra datos reales del agente (no mock).

### 3.1 JWT Middleware

Crear `middleware/auth.ts` que todos los endpoints `/api/*` usen:

```typescript
async function requireAuth(req, res, next) {
  const token = req.cookies?.session;
  if (!token) return res.status(401).json({ ok: false, error: { code: 'UNAUTHORIZED' } });

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET_KEY);
    req.user = payload;  // { userId, agentId, role }
    next();
  } catch {
    return res.status(401).json({ ok: false, error: { code: 'UNAUTHORIZED' } });
  }
}
```

### 3.2 `GET /api/agent/status`

Internamente llama al Gateway:

```http
POST http://localhost:18789/tools/invoke
Authorization: Bearer <GATEWAY_TOKEN>
x-openclaw-agent-id: <agentId del JWT>
Content-Type: application/json

{
  "tool": "session_status",
  "args": { "sessionKey": "agent:<agentId>:main" }
}
```

**Response esperado:**
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

Si el Gateway no responde → `503 { ok: false, error: { code: "AGENT_UNAVAILABLE" } }`

### 3.3 `GET /api/agent/config`

Lee desde `data/users.json` el user del JWT y retorna solo los campos seguros:

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

> `agentName` y `tone` se leen del workspace del agente (`IDENTITY.md` / `SOUL.md`) o se cachean en users.json. Para MVP se puede hardcodear en users.json.

### ✅ Done cuando

La pantalla `summary-screen` muestra datos reales del agente (status, tokens, próximo briefing).

---

## BLOQUE 4 — Config editable 🟡

> Objetivo: `profile-screen` guarda cambios y aparecen reflejados al recargar.

### 4.1 `PATCH /api/agent/config`

**Campos permitidos:**

| Campo | Acción |
|---|---|
| `briefingTime` | Actualizar `users.json` + tool invoke al gateway para actualizar cron |
| `timezone` | Actualizar `users.json` |
| `language` | Actualizar `users.json` |
| `agentName` | Actualizar `users.json` + sobreescribir línea en `IDENTITY.md` del workspace |
| `tone` | Actualizar `users.json` + sobreescribir línea en `SOUL.md` del workspace |

**Validación:**
```typescript
const ALLOWED_FIELDS = ['briefingTime', 'timezone', 'language', 'agentName', 'tone'];
const BLOCKED_FIELDS = ['model', 'tools', 'bindings', 'auth', 'gateway'];

for (const key of Object.keys(body)) {
  if (BLOCKED_FIELDS.includes(key)) {
    return res.status(403).json({ ok: false, error: { code: 'FIELD_NOT_EDITABLE', message: `El campo '${key}' no puede modificarse.` } });
  }
  if (!ALLOWED_FIELDS.includes(key)) {
    return res.status(400).json({ ok: false, error: { code: 'VALIDATION_ERROR', message: `Campo desconocido: '${key}'` } });
  }
}
```

**Paths de workspace:**
```typescript
const WORKSPACE_BASE = `~/.openclaw/agents/${agentId}/workspace`;
// agentName → IDENTITY.md
// tone      → SOUL.md
```

> Para `agentName` y `tone`, el approach más simple para MVP es reemplazar líneas específicas en los `.md`. Coordinar con Felipe el formato exacto de esos archivos para saber qué línea tocar.

**Response 200:**
```json
{ "ok": true, "updated": ["briefingTime", "agentName"] }
```

### ✅ Done cuando

`profile-screen` guarda cambios con feedback visual y al recargar los datos persisten.

---

## Resumen de errores estándar

Todos los errores usan este formato:
```json
{ "ok": false, "error": { "code": "ERROR_CODE", "message": "Mensaje legible" } }
```

| Código | HTTP | Cuándo usarlo |
|---|---|---|
| `UNAUTHORIZED` | 401 | Cookie ausente, JWT inválido o expirado |
| `FORBIDDEN` | 403 | Autenticado pero sin permisos (ej: acceso admin) |
| `USER_NOT_FOUND` | 403 | Email de Google no está en users.json |
| `FIELD_NOT_EDITABLE` | 403 | PATCH intenta editar campo protegido |
| `AGENT_UNAVAILABLE` | 503 | Gateway no responde o timeout |
| `VALIDATION_ERROR` | 400 | Body malformado o campo desconocido |
| `RATE_LIMITED` | 429 | Demasiadas requests del mismo user |

---

## Orden de entrega

```
BLOQUE 1 → BLOQUE 2 → BLOQUE 3 → BLOQUE 4
```

Cada bloque tiene criterio de done independiente.
El frontend puede ir testeando contra el backend a partir del BLOQUE 1 completado.
