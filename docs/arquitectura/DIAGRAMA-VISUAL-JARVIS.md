# 🎨 DIAGRAMA VISUAL DE J.A.R.V.I.S. MARK VII

---

## 📊 VISTA GENERAL DEL SISTEMA

```
                        ┌──────────────────────────────┐
                        │     USUARIO (Señor Solier)   │
                        └────────────┬─────────────────┘
                                     │
                ┌────────────────────┼────────────────────┐
                │                    │                    │
                ▼                    ▼                    ▼
        ┌───────────────┐   ┌───────────────┐   ┌──────────────┐
        │  CLAUDE CODE  │   │  TERMINAL     │   │  WEB BROWSER │
        │  (Híbrido)    │   │  (Directo)    │   │  (API 3001)  │
        └───────┬───────┘   └───────┬───────┘   └──────┬───────┘
                │                   │                   │
                └───────────────────┼───────────────────┘
                                    │
                        ┌───────────▼───────────┐
                        │   JARVIS MARK VII     │
                        │  (main-ultimate.js)   │
                        └───────────┬───────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐         ┌─────────────────┐        ┌──────────────┐
│  SISTEMA BASE │         │ MEMORIA         │        │  SERVICIOS   │
│  (FASE 1-5)   │────────▶│ PERSISTENTE     │◀───────│  EXTERNOS    │
└───────────────┘         └─────────────────┘        └──────────────┘
        │                           │                           │
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐         ┌─────────────────┐        ┌──────────────┐
│  FASE 6       │         │  SQLite         │        │  Ollama      │
│  Standard     │         │  + JSON + MD    │        │  :11434      │
└───────────────┘         └─────────────────┘        └──────────────┘
        │                                                      │
        ▼                                                      ▼
┌───────────────┐                                    ┌──────────────┐
│  FASE 7-9     │                                    │  Python AI   │
│  Ultimate     │────────────────────────────────────│  :5000       │
└───────────────┘                                    └──────────────┘
```

---

## 🧠 ARQUITECTURA DE CAPAS (Detallada)

```
┌─────────────────────────────────────────────────────────────────────┐
│  CAPA 5: INTERFAZ DE USUARIO                                        │
├─────────────────────────────────────────────────────────────────────┤
│  • Claude Code (Modo Híbrido)                                       │
│  • Terminal (npm run ultimate)                                      │
│  • Web Browser (Dashboard en puerto 3001)                           │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────────┐
│  CAPA 4: ENTRADA/SALIDA                                             │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐                │
│  │  readline   │  │  Express API │  │  Webhooks  │                │
│  │  (stdin)    │  │  (REST)      │  │            │                │
│  └─────────────┘  └──────────────┘  └────────────┘                │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────────┐
│  CAPA 3: PROCESAMIENTO DE COMANDOS                                  │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐          │
│  │  processCommand() - main-ultimate.js                 │          │
│  └────────────────────┬─────────────────────────────────┘          │
│                       │                                             │
│       ┌───────────────┼───────────────┐                            │
│       │               │               │                            │
│       ▼               ▼               ▼                            │
│  ┌─────────┐  ┌──────────────┐  ┌─────────────┐                  │
│  │  NLP    │  │  Decision    │  │  Personality│                  │
│  │  Engine │─▶│  Engine      │─▶│  Filter     │                  │
│  └─────────┘  └──────────────┘  └─────────────┘                  │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────────┐
│  CAPA 2: MÓDULOS FUNCIONALES                                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  FASE 6 - STANDARD MODULES                             │        │
│  ├────────────────────────────────────────────────────────┤        │
│  │  • app-control.js        • git-integration.js          │        │
│  │  • system-automation.js  • monitor-integration.js      │        │
│  │  • web-integration.js    • smart-home.js               │        │
│  │  • remote-control-api.js                               │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                     │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  FASE 7 - ULTIMATE (fase-7-ultimate.js)                │        │
│  ├────────────────────────────────────────────────────────┤        │
│  │  • VoiceRecognition247                                 │        │
│  │  • MistralFineTuning                                   │        │
│  │  • ProactiveEngineV2                                   │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                     │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  FASE 8 - INTEGRATIONS (fase-8-integrations.js)        │        │
│  ├────────────────────────────────────────────────────────┤        │
│  │  • SmartHomeReal (Home Assistant)                      │        │
│  │  • VisionEngine (OpenCV)                               │        │
│  │  • EmailCalendarIntegration                            │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                     │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  FASE 9 - POLISH (fase-9-polish.js)                    │        │
│  ├────────────────────────────────────────────────────────┤        │
│  │  • MusicControl (Spotify)                              │        │
│  │  • FaceRecognitionAdvanced                             │        │
│  │  • UltraMemory                                         │        │
│  └────────────────────────────────────────────────────────┘        │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────────┐
│  CAPA 1: NÚCLEO (FASE 1-5)                                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────┐           │
│  │  JARVIS PURE (jarvis-pure.js)                       │           │
│  ├─────────────────────────────────────────────────────┤           │
│  │  ┌──────────────────────────────────────────────┐   │           │
│  │  │  CONVERSATIONAL AI (7 módulos)               │   │           │
│  │  ├──────────────────────────────────────────────┤   │           │
│  │  │  1. ConversationMemory                       │   │           │
│  │  │  2. ProactiveEngine                          │   │           │
│  │  │  3. NaturalLanguageResponse                  │   │           │
│  │  │  4. EmotionalIntelligence                    │   │           │
│  │  │  5. AdvancedNLPConversational                │   │           │
│  │  │  6. ConversationEngine                       │   │           │
│  │  │  7. BackgroundAutonomous                     │   │           │
│  │  └──────────────────────────────────────────────┘   │           │
│  │                                                      │           │
│  │  ┌──────────────────────────────────────────────┐   │           │
│  │  │  CORE ENGINES                                │   │           │
│  │  ├──────────────────────────────────────────────┤   │           │
│  │  │  • nlp-engine.js                             │   │           │
│  │  │  • decision-engine.js                        │   │           │
│  │  │  • reasoning-engine.js                       │   │           │
│  │  │  • universal-executor.js                     │   │           │
│  │  │  • code-analyzer.js                          │   │           │
│  │  └──────────────────────────────────────────────┘   │           │
│  │                                                      │           │
│  │  ┌──────────────────────────────────────────────┐   │           │
│  │  │  PERSONALITY & MEMORY                        │   │           │
│  │  ├──────────────────────────────────────────────┤   │           │
│  │  │  • personality.js (Tony Stark)               │   │           │
│  │  │  • memory.js (básica)                        │   │           │
│  │  │  • conversation-memory.js                    │   │           │
│  │  └──────────────────────────────────────────────┘   │           │
│  └─────────────────────────────────────────────────────┘           │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────────┐
│  CAPA 0: MEMORIA PERSISTENTE (Nueva)                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────┐           │
│  │  PERSISTENT MEMORY SYSTEM                           │           │
│  ├─────────────────────────────────────────────────────┤           │
│  │  • persistent-memory.js                             │           │
│  │  • claude-auto-context.js                           │           │
│  │                                                      │           │
│  │  ┌────────────────────────────────────────┐         │           │
│  │  │  MEMORIA EPISÓDICA                     │         │           │
│  │  │  (eventos, conversaciones)             │         │           │
│  │  │  → sessions/*.json                     │         │           │
│  │  └────────────────────────────────────────┘         │           │
│  │                                                      │           │
│  │  ┌────────────────────────────────────────┐         │           │
│  │  │  MEMORIA SEMÁNTICA                     │         │           │
│  │  │  (conocimiento, preferencias)          │         │           │
│  │  │  → knowledge/*.json                    │         │           │
│  │  └────────────────────────────────────────┘         │           │
│  │                                                      │           │
│  │  ┌────────────────────────────────────────┐         │           │
│  │  │  MEMORIA PROCEDIMENTAL                 │         │           │
│  │  │  (soluciones, procedimientos)          │         │           │
│  │  │  → skills/*.json                       │         │           │
│  │  └────────────────────────────────────────┘         │           │
│  │                                                      │           │
│  │  ┌────────────────────────────────────────┐         │           │
│  │  │  MEMORIA DE TRABAJO                    │         │           │
│  │  │  (estado actual)                       │         │           │
│  │  │  → context/*.md, *.json                │         │           │
│  │  └────────────────────────────────────────┘         │           │
│  │                                                      │           │
│  │  ┌────────────────────────────────────────┐         │           │
│  │  │  BASE DE DATOS SQLite                  │         │           │
│  │  │  jarvis-brain.db                       │         │           │
│  │  │  • sessions                            │         │           │
│  │  │  • episodic_memory                     │         │           │
│  │  │  • semantic_memory                     │         │           │
│  │  │  • procedural_memory                   │         │           │
│  │  │  • memory_search (FTS5)                │         │           │
│  │  └────────────────────────────────────────┘         │           │
│  └─────────────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 FLUJO DE DATOS COMPLETO

```
┌─────────────┐
│   USUARIO   │
│ "hola JARVIS"│
└──────┬──────┘
       │
       ▼
┌────────────────────────────────┐
│  INPUT HANDLER                 │
│  (readline / API)              │
└──────┬─────────────────────────┘
       │
       ▼
┌────────────────────────────────┐
│  REGISTRO EN MEMORIA           │
│  memory.saveEvent()            │
└──────┬─────────────────────────┘
       │
       ▼
┌────────────────────────────────┐
│  NLP ENGINE                    │
│  • Tokenización                │
│  • Análisis de intención       │
│  • Extracción de entidades     │
└──────┬─────────────────────────┘
       │
       ▼
┌────────────────────────────────┐
│  DECISION ENGINE               │
│  ¿Qué tipo de comando es?      │
└──────┬─────────────────────────┘
       │
       ├──► Comando de sistema ───► system-automation.js
       │
       ├──► Comando de voz ───────► fase-7-ultimate.js
       │
       ├──► Comando de memoria ──► persistent-memory.js
       │
       ├──► Comando smart home ──► smart-home.js
       │
       ├──► Conversación general ► conversation-engine.js
       │                              │
       │                              ▼
       │                     ┌─────────────────────┐
       │                     │  ¿Necesita IA?      │
       │                     └──────┬──────────────┘
       │                            │
       │                            ├──► Python AI Server
       │                            │    (análisis profundo)
       │                            │
       │                            └──► Ollama/Mistral
       │                                 (generación)
       │
       ▼
┌────────────────────────────────┐
│  PERSONALITY FILTER            │
│  personality.js                │
│  • Agregar sarcasmo            │
│  • Aplicar estilo Tony Stark   │
│  • "Como siempre, Señor"       │
└──────┬─────────────────────────┘
       │
       ▼
┌────────────────────────────────┐
│  REGISTRAR RESULTADO           │
│  memory.taskCompleted()        │
└──────┬─────────────────────────┘
       │
       ▼
┌────────────────────────────────┐
│  OUTPUT                        │
│  console.log() / API response  │
└────────────────────────────────┘
```

---

## 🗄️ ESTRUCTURA DE MEMORIA

```
memory/
│
├─ sessions/
│  ├─ 2025-11-06.json          ← Sesión completa (datos)
│  ├─ 2025-11-06.md            ← Sesión completa (legible)
│  ├─ 2025-11-07.json
│  └─ 2025-11-07.md
│
├─ knowledge/
│  ├─ user-preferences.json    ← "Prefiero Mistral"
│  ├─ solved-problems.json     ← "Error X → Solución Y"
│  └─ decisions.json           ← "Elegimos SQLite porque..."
│
├─ skills/
│  ├─ procedures.json          ← "Cómo hacer deploy"
│  └─ solutions.json           ← Soluciones reutilizables
│
├─ context/
│  ├─ CLAUDE-START-HERE.md     ← ⭐ Auto-contexto para Claude
│  ├─ CURRENT-STATE.md         ← Estado actual (legible)
│  ├─ CURRENT-STATE.json       ← Estado actual (datos)
│  ├─ last-session.json        ← Metadata última sesión
│  ├─ pending-tasks.json       ← Tareas pendientes
│  └─ INSTRUCCIONES-PARA-CLAUDE.md  ← ⭐ Protocolo
│
└─ jarvis-brain.db             ← SQLite database
   ├─ sessions
   ├─ episodic_memory
   ├─ semantic_memory
   ├─ procedural_memory
   └─ memory_search (FTS5)
```

---

## 🌐 SERVICIOS Y PUERTOS

```
┌──────────────────────────────────────────┐
│  JARVIS STANDALONE                       │
│  Node.js (main-ultimate.js)              │
│  Puerto: N/A (local)                     │
└──────────────────────────────────────────┘
                │
                ├──► OLLAMA
                │    Puerto: 11434
                │    Modelo: Mistral
                │
                ├──► PYTHON AI SERVER
                │    Puerto: 5000
                │    Framework: Flask
                │
                ├──► REMOTE API
                │    Puerto: 3001
                │    Framework: Express
                │
                └──► HOME ASSISTANT (opcional)
                     Puerto: 8123
                     Status: Simulado
```

---

## 📦 FLUJO DE INSTALACIÓN Y EJECUCIÓN

```
┌─────────────────────────────────────────┐
│  INSTALACIÓN                            │
├─────────────────────────────────────────┤
│  git clone [repo]                       │
│  cd jarvis-standalone                   │
│  npm install                            │
│  cp .env.example .env (opcional)        │
└─────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  SERVICIOS OPCIONALES                   │
├─────────────────────────────────────────┤
│  Terminal 1: ollama serve               │
│  Terminal 2: cd python && python server │
└─────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  EJECUCIÓN                              │
├─────────────────────────────────────────┤
│  Terminal 3: npm run ultimate           │
└─────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  SISTEMA LISTO                          │
├─────────────────────────────────────────┤
│  • Memoria persistente: ✅              │
│  • JARVIS base: ✅                      │
│  • FASE 6-9: ✅                         │
│  • API REST: ✅ (puerto 3001)           │
│  • Esperando comandos...                │
└─────────────────────────────────────────┘
```

---

## 🎯 COMANDOS DISPONIBLES POR CATEGORÍA

```
┌──────────────────────────────────────────────────┐
│  SISTEMA                                         │
├──────────────────────────────────────────────────┤
│  • "salir" / "exit"     → Cerrar JARVIS          │
│  • "ayuda"              → Mostrar ayuda          │
│  • "status"             → Estado del sistema     │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│  VOZ (FASE 7)                                    │
├──────────────────────────────────────────────────┤
│  • "voice start"        → Activar escucha 24/7   │
│  • "voice stop"         → Desactivar voz         │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│  FINE-TUNING (FASE 7)                            │
├──────────────────────────────────────────────────┤
│  • "train model"        → Entrenar Mistral       │
│  • "train stats"        → Ver estadísticas       │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│  SMART HOME (FASE 6/8)                           │
├──────────────────────────────────────────────────┤
│  • "lights on/off"      → Control de luces       │
│  • "set temp [N]"       → Ajustar temperatura    │
│  • "activate [scene]"   → Activar escena         │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│  EMAIL & CALENDAR (FASE 8)                       │
├──────────────────────────────────────────────────┤
│  • "check emails"       → Ver emails nuevos      │
│  • "show calendar"      → Ver eventos próximos   │
│  • "schedule [event]"   → Crear evento           │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│  MÚSICA (FASE 9)                                 │
├──────────────────────────────────────────────────┤
│  • "play [canción]"     → Reproducir en Spotify  │
│  • "pause music"        → Pausar música          │
│  • "next track"         → Siguiente canción      │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│  VISIÓN (FASE 8)                                 │
├──────────────────────────────────────────────────┤
│  • "what do you see"    → Analizar imagen        │
│  • "detect faces"       → Detectar rostros       │
│  • "recognize me"       → Reconocimiento facial  │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│  MEMORIA (Nueva - aún sin comandos interactivos) │
├──────────────────────────────────────────────────┤
│  • [Por implementar]                             │
│  • "recuerda [...]"     → Guardar recuerdo       │
│  • "busca [tema]"       → Buscar en memoria      │
│  • "qué hicimos [cuándo]" → Ver sesiones         │
└──────────────────────────────────────────────────┘
```

---

**J.A.R.V.I.S. MARK VII - Diagrama Visual Completo**
**"Como siempre, Señor."** ⚡🎩
