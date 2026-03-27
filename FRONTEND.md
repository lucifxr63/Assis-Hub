# Frontend — Portal de Usuarios Customware

> Next.js · Tailwind CSS · Mobile-first · Mock system

---

## Arquitectura general

```
Usuario (móvil / desktop)
        │ HTTPS
        ▼
  Next.js App (este repo)          ← tú estás aquí
        │ fetch + credentials: "include"
        ▼
  API Middleware (Node/Express :18791)
        │ JWT auth  ·  userId → agentId
        ▼
  OpenClaw Gateway (:18789)
        │
        ▼
  Agente IA del usuario
```

**Regla crítica:** el frontend **nunca** habla directo al Gateway.
Todo va al middleware (`/api/*`) con la cookie JWT adjunta automáticamente.

---

## Sistema de mocks

El frontend puede correr completamente sin backend gracias a la flag de entorno:

```bash
# .env.local
NEXT_PUBLIC_USE_MOCK=true   # sin backend
NEXT_PUBLIC_USE_MOCK=false  # backend real
```

### Cómo funciona

Cada función en `lib/api.ts` revisa `USE_MOCK` antes de hacer cualquier request:

```ts
export async function getAgentStatus() {
  if (USE_MOCK) {
    await delay(650)          // simula latencia de red
    return MOCK_AGENT_STATUS  // dato local de lib/mock.ts
  }
  return apiFetch("/api/agent/status")  // request real
}
```

Los datos mock están en `lib/mock.ts` con las mismas formas exactas que la API real.

### Flujo de login en mock mode

1. App carga → `getMe()` retorna `null` (sesión cerrada simulada)
2. Se muestra `LoginScreen`
3. Usuario hace clic en "Continuar con Google"
4. `mockLogin()` retorna el usuario mock con 800ms de delay
5. App entra al dashboard como si OAuth hubiera completado

### Para simular sesión ya iniciada

En `lib/api.ts`, cambia `getMe()` para retornar el mock directamente:

```ts
// Antes (sesión cerrada):
return null

// Después (sesión activa):
return MOCK_ME
```

---

## Cómo enchufar la API real

1. Asegúrate que el middleware esté levantado en el puerto 18791
2. Edita `.env.local`:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:18791
   NEXT_PUBLIC_USE_MOCK=false
   ```
3. Reinicia el servidor de Next.js: `pnpm dev`
4. Listo. Ningún archivo de componente cambia.

Para producción:
```bash
NEXT_PUBLIC_API_URL=https://app.customware.cl
NEXT_PUBLIC_USE_MOCK=false
```

---

## Estructura de archivos

```
Assis-Hub/
├── app/
│   ├── layout.tsx          # Root layout (lang="es", h-full)
│   └── page.tsx            # Entry point → renderiza <ClientApp />
│
├── components/
│   ├── client-app.tsx      # Shell principal: auth state + navegación
│   └── client/
│       └── screens/
│           ├── login-screen.tsx    # Pantalla de login (Google OAuth)
│           ├── summary-screen.tsx  # Dashboard del agente (Fase 1)
│           ├── profile-screen.tsx  # Configuración del agente (Fase 1)
│           └── chat-screen.tsx     # Placeholder chat (Fase 2)
│
├── lib/
│   ├── types.ts    # Interfaces TypeScript (User, AgentStatus, AgentConfig…)
│   ├── mock.ts     # Datos mock con shapes exactas de la API real
│   ├── api.ts      # Funciones API con modo mock integrado
│   └── utils.ts    # cn() y helpers
│
├── .env.local          # Variables locales (no commitear)
├── .env.local.example  # Plantilla para nuevos devs
└── FRONTEND.md         # Este archivo
```

---

## Auth flow completo

### Producción (Google OAuth)

```
1. Usuario → clic "Continuar con Google"
2. Frontend → window.location.href = API_URL + "/auth/google"
3. Backend → redirect a Google OAuth
4. Usuario → aprueba con su Gmail
5. Backend → recibe callback con email
6. Backend → busca email en tabla users
   ├── Existe   → genera JWT { userId, agentId, role }
   │             → setea cookie httpOnly + secure
   │             → redirect a / (frontend)
   └── No existe → redirect a /?error=USER_NOT_FOUND
7. Frontend carga → ClientApp llama getMe()
   ├── Cookie válida → retorna User → muestra dashboard
   └── Sin cookie   → retorna null → muestra login
```

### Mock mode

```
1. getMe() → null → muestra login
2. Clic "Continuar con Google" → mockLogin() → User mock
3. setUser(mockUser) → muestra dashboard
```

---

## Pantallas

### Login (`login-screen.tsx`)

- Botón "Continuar con Google" → llama `onLogin()` (prop)
- Banner de error para `USER_NOT_FOUND` y `UNAUTHORIZED`
- Link de contacto para usuarios sin acceso
- **Props:** `onLogin: () => void`, `error?: string | null`

### Dashboard (`summary-screen.tsx`)

- Datos de `GET /api/agent/status`: status badge, última actividad, uptime
- Tokens usados hoy con número formateado
- Próximo briefing calculado desde `config.briefingTime`
- Botón "Actualizar" que re-fetcha ambos endpoints
- Accesos rápidos: Config (funcional) · Chat (disabled, Fase 2)
- **Props:** `userName: string`, `onNavigate: (screen) => void`

### Config (`profile-screen.tsx`)

- Carga config con `GET /api/agent/config`
- Formulario con draft local (no guarda hasta hacer clic en "Guardar")
- Campos editables: `agentName`, `tone`, `briefingTime`, `timezone`, `language`
- Canales (`whatsapp`, `telegram`): solo lectura en MVP
- Botón "Guardar" activo solo si hay cambios pendientes (`isDirty`)
- Feedback visual: spinner durante PATCH, check verde 3s tras éxito
- Botón "Cerrar sesión" → llama `onLogout()` (prop) → vuelve al login
- **Props:** `onLogout: () => void`

### Chat (`chat-screen.tsx`)

- Placeholder informativo con lista de features de Fase 2
- Sin props ni llamadas a API

---

## Navegación

| Tab | Ícono | Mobile | Desktop |
|-----|-------|--------|---------|
| Inicio | `Home` | bottom bar | sidebar |
| Chat | `MessageSquare` | bottom bar (badge "Fase 2") | sidebar (badge) |
| Config | `Settings` | bottom bar | sidebar |

- **Mobile** (`< lg`): bottom tab bar fija de 64px
- **Desktop** (`lg+`): sidebar izquierdo de 256px con nombre/email del usuario

---

## Variables de entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | URL base del middleware | `http://localhost:18791` |
| `NEXT_PUBLIC_USE_MOCK` | Modo mock sin backend | `true` |

---

## Fases de implementación

| Fase | Contenido | Estado |
|------|-----------|--------|
| **Fase 1 — MVP** | Login Google OAuth, Dashboard, Config | ✅ Frontend listo |
| **Fase 2** | Chat web SSE, historial | ⏳ Pendiente backend |
| **Fase 3** | Admin panel (solo Felipe) | ⏳ Pendiente |
| **Fase 4** | Producción: HTTPS, dominio, monitoring | ⏳ Pendiente |

---

## Endpoints del middleware (referencia)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/auth/google` | Inicia OAuth → redirect a Google |
| `GET` | `/auth/google/callback` | Callback OAuth → genera JWT cookie |
| `GET` | `/auth/me` | Valida sesión → retorna User |
| `POST` | `/auth/logout` | Invalida JWT |
| `GET` | `/api/agent/status` | Estado del agente |
| `GET` | `/api/agent/config` | Config visible del agente |
| `PATCH` | `/api/agent/config` | Actualiza config permitida |
| `POST` | `/api/agent/chat` | *(Fase 2)* Enviar mensaje |
| `GET` | `/api/agent/chat/stream` | *(Fase 2)* SSE streaming |

Todos los requests incluyen `credentials: "include"` (cookie JWT automática).
El middleware inyecta los headers internos al gateway — el frontend no los ve.

---

## Seguridad — qué NO hacer

- ❌ No guardes tokens en `localStorage` o `sessionStorage`
- ❌ No hagas requests directos al gateway (`:18789`)
- ❌ No expongas `GATEWAY_TOKEN` en variables `NEXT_PUBLIC_*`
- ✅ La cookie httpOnly se maneja sola — el browser la envía automáticamente
