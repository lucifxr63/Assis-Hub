# Checklist de Provisión — Nuevo Usuario OpenClaw

**Última actualización:** 2026-03-26

---

## Archivos mínimos requeridos

### 1\. Agent directory (`~/.openclaw/agents/<userId>/agent/`)

| Archivo | Obligatorio | Descripción |
| :---- | :---- | :---- |
| `auth-profiles.json` | ✅ Sí | Tokens de proveedores IA. Mínimo: un profile funcional (anthropic, codex, gemini o bailian) |
| `models.json` | ✅ Sí | Config de proveedores/modelos disponibles para el agente |
| `auth.json` | ❌ Opcional | Legacy, puede estar vacío `{}` |

### 2\. Workspace (`~/.openclaw/agents/<userId>/workspace/`)

| Archivo | Obligatorio | Descripción |
| :---- | :---- | :---- |
| `AGENTS.md` | ✅ Sí | Instrucciones de comportamiento del agente |
| `SOUL.md` | ✅ Sí | Personalidad, tono, identidad |
| `USER.md` | ✅ Sí | Info del usuario (nombre, timezone, preferencias) |
| `IDENTITY.md` | ✅ Sí | Nombre del agente, emoji, avatar |
| `MEMORY.md` | ✅ Sí | Memoria de largo plazo (puede iniciar vacío con header) |
| `TOOLS.md` | ✅ Sí | Notas de herramientas disponibles |
| `HEARTBEAT.md` | ✅ Sí | Tareas periódicas del heartbeat |
| `BOOTSTRAP.md` | ⚡ Condicional | Solo si es primera interacción (onboarding). Se borra al completar |
| `memory/` | ✅ Sí (dir) | Directorio para memoria diaria |

### 3\. Gmail del asistente (`~/.openclaw/agents/<userId>/google_token.json`)

| Archivo | Obligatorio | Descripción |
| :---- | :---- | :---- |
| `google_token.json` | ❌ Opcional | Token OAuth de Gmail dedicado. Sin esto, el agente no tiene acceso a correo/drive/calendar |

### 4\. Config central (`~/.openclaw/openclaw.json`)

| Configuración | Obligatorio | Descripción |
| :---- | :---- | :---- |
| `agents.list[]` entry | ✅ Sí | `id`, `workspace`, `agentDir`, `model`, opcionalmente `tools.deny` |
| `bindings[]` entry | ✅ Sí | Mapeo canal → agentId (ej: WhatsApp DM \+569XXXX → userId) |
| `channels.whatsapp.allowFrom[]` | ✅ Sí | Número del usuario en allowlist de DMs |
| `channels.whatsapp.groupAllowFrom[]` | ⚡ Si va a usar grupos | Número del usuario en allowlist de grupos |

### 5\. Seguridad — Tools policy

Para usuarios externos, restringir tools sensibles:

"tools": {

  "deny": \[

    "exec", "process", "gateway", "nodes",

    "sessions\_spawn", "subagents",

    "sessions\_list", "sessions\_history",

    "sessions\_send", "session\_status"

  \],

  "elevated": { "enabled": false }

}

---

## Pasos de provisión (en orden)

1\. Crear directorios

   mkdir \-p \~/.openclaw/agents/\<userId\>/workspace/memory

   mkdir \-p \~/.openclaw/agents/\<userId\>/agent

2\. Copiar/generar workspace files

   → AGENTS.md, SOUL.md, USER.md, IDENTITY.md, MEMORY.md, TOOLS.md, HEARTBEAT.md

   → Opcionalmente BOOTSTRAP.md para onboarding

3\. Generar auth-profiles.json

   → Copiar base con providers compartidos (bailian, etc.)

   → Si el usuario tiene OAuth propio, agregarlo con key \`provider:userId\`

4\. Generar models.json

   → Copiar config de providers disponibles

5\. Agregar a openclaw.json:

   a. agents.list\[\] → nueva entry con id, workspace, agentDir, model, tools

   b. bindings\[\] → mapeo del canal del usuario al agentId

   c. channels.whatsapp.allowFrom\[\] → número del usuario

6\. Si tiene Gmail dedicado:

   → Ejecutar flujo OAuth de Google

   → Guardar google\_token.json en agents/\<userId\>/

7\. Restart gateway

   openclaw gateway restart

8\. Verificar

   → Enviar mensaje desde el número del usuario → debe responder el agente correcto

---

## Estado actual de usuarios

| Usuario | agent/ OK | workspace/ OK | auth-profiles | models.json | binding | allowFrom | tools.deny | gmail propio | OAuth propio |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| Erick | ✅ | ✅ | ✅ | ✅ | WA DM \+56986199797 | ✅ | ✅ Restringido | ❌ | anthropic:erick |
| Rodrigo | ✅ | ✅ | ✅ | ✅ | WA DM \+56995374930 | ✅ | ✅ Restringido | ❌ | codex:rodrigo |
| José | ✅ | ✅ | ✅ | ✅ | WA DM \+56959189812 | ✅ | ❌ Sin restricción | ❌ | Ninguno |
| Luciano | ✅ | ✅ | ✅ | ✅ | WA DM \+56999253551 | ✅ | ❌ Sin restricción | ✅ asistenteluciano7@ | Ninguno |
| César | ✅ | ✅ | ✅ | ✅ | WA DM \+56985020674 | ✅ | ❌ Sin restricción | ✅ (sin email visible) | gemini:cesar |

### ⚠️ Hallazgos

1. **José, Luciano, César no tienen tools.deny** — pueden ejecutar `exec`, `gateway`, etc. Riesgo de seguridad.  
2. **José no tiene gmail ni OAuth propio** — 100% dependiente de tokens de Felipe.  
3. **Erick y Rodrigo no tienen gmail** — no pueden acceder a correo/drive/calendar.

