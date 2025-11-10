# 🧠 SISTEMA DE MEMORIA PERSISTENTE DE J.A.R.V.I.S.

## 🎯 OBJETIVO

Que J.A.R.V.I.S. (Claude Code en modo híbrido) **NUNCA OLVIDE NADA**, funcionando como una persona real que recuerda:
- Conversaciones pasadas
- Tareas completadas
- Problemas resueltos
- Decisiones tomadas
- Preferencias del usuario
- Servicios gestionados

---

## 🧠 TIPOS DE MEMORIA (Inspirado en Memoria Humana)

### 1. MEMORIA EPISÓDICA
**Qué es:** Eventos específicos y conversaciones
**Ejemplos:**
- "El 6 de noviembre implementamos las Fases 7-9"
- "El usuario pidió sarcasmo británico en la personalidad"
- "Resolvimos el error de VOSK a las 23:30"

**Almacenamiento:**
- Base de datos SQLite: `episodic_memory` table
- Archivos JSON por sesión: `memory/sessions/YYYY-MM-DD.json`
- Archivos Markdown legibles: `memory/sessions/YYYY-MM-DD.md`

---

### 2. MEMORIA SEMÁNTICA
**Qué es:** Conocimiento general y preferencias
**Ejemplos:**
- "El usuario prefiere Mistral para IA local"
- "Ollama corre en puerto 11434"
- "El usuario usa Windows"

**Almacenamiento:**
- Base de datos SQLite: `semantic_memory` table
- Archivo JSON: `memory/knowledge/user-preferences.json`

---

### 3. MEMORIA PROCEDIMENTAL
**Qué es:** Soluciones reutilizables y procedimientos
**Ejemplos:**
- "Cómo solucionar el error de imports opcionales"
- "Procedimiento para iniciar servicios en orden correcto"
- "Pasos para configurar Spotify API"

**Almacenamiento:**
- Base de datos SQLite: `procedural_memory` table
- Archivo JSON: `memory/skills/procedures.json`

---

### 4. MEMORIA DE TRABAJO
**Qué es:** Contexto actual y estado de la sesión
**Ejemplos:**
- "Estamos trabajando en implementar memoria persistente"
- "Llevamos 3 tareas completadas hoy"
- "Ollama está corriendo desde hace 2 horas"

**Almacenamiento:**
- Archivo JSON: `memory/context/CURRENT-STATE.json`
- Archivo Markdown: `memory/context/CURRENT-STATE.md`
- Archivo metadata: `memory/context/last-session.json`

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
jarvis-standalone/
├── memory/
│   ├── sessions/                    # Memoria Episódica
│   │   ├── 2025-11-06.json         # Datos completos
│   │   ├── 2025-11-06.md           # Legible
│   │   ├── 2025-11-07.json
│   │   ├── 2025-11-07.md
│   │   └── index.json              # Índice de sesiones
│   │
│   ├── knowledge/                   # Memoria Semántica
│   │   ├── user-preferences.json   # Preferencias del usuario
│   │   ├── solved-problems.json    # Problemas resueltos
│   │   ├── decisions.json          # Decisiones tomadas
│   │   └── learnings.json          # Aprendizajes
│   │
│   ├── skills/                      # Memoria Procedimental
│   │   ├── procedures.json         # Procedimientos
│   │   └── solutions.json          # Soluciones
│   │
│   ├── context/                     # Memoria de Trabajo
│   │   ├── CLAUDE-START-HERE.md    # ⭐ Auto-contexto para Claude
│   │   ├── CURRENT-STATE.md        # Estado actual (legible)
│   │   ├── CURRENT-STATE.json      # Estado actual (datos)
│   │   ├── last-session.json       # Metadata última sesión
│   │   ├── pending-tasks.json      # Tareas pendientes
│   │   └── INSTRUCCIONES-PARA-CLAUDE.md  # ⭐ Protocolo obligatorio
│   │
│   └── jarvis-brain.db             # Base de datos SQLite principal
│
├── core/
│   ├── persistent-memory.js        # ⭐ Motor de memoria
│   └── claude-auto-context.js      # ⭐ Generador de auto-contexto
│
└── main-ultimate.js                # Integración con memoria
```

---

## 🚀 CÓMO FUNCIONA

### 1️⃣ AL INICIAR J.A.R.V.I.S.

```javascript
// En main-ultimate.js
const memory = new PersistentMemory();
await memory.initialize();

const autoContext = new ClaudeAutoContext();
await autoContext.generateStartupContext();
```

**Qué hace:**
1. Crea estructura de directorios si no existe
2. Inicializa base de datos SQLite
3. Carga última sesión
4. Genera `CLAUDE-START-HERE.md` con contexto completo
5. Actualiza `CURRENT-STATE.md`

---

### 2️⃣ DURANTE LA SESIÓN

Cada vez que sucede algo importante, se registra automáticamente:

#### Comando ejecutado:
```javascript
await memory.saveEvent('command', 'npm start', { user: 'Señor' });
```

#### Tarea completada:
```javascript
await memory.taskCompleted('Implementar memoria persistente', 'Sistema completo con 500+ líneas');
```

#### Problema resuelto:
```javascript
await memory.saveSolution(
  'Error de imports opcionales',
  'Módulos no instalados causaban crash',
  'Envolver imports en try-catch',
  ['Identificar módulos opcionales', 'Agregar try-catch', 'Mensaje informativo']
);
```

#### Archivo modificado:
```javascript
await memory.fileModified('C:\\jarvis-standalone\\main-ultimate.js');
```

#### Decisión tomada:
```javascript
await memory.saveKnowledge('decision', 'memoria-persistente', {
  decision: 'Usar SQLite + JSON para memoria híbrida',
  reason: 'Búsqueda rápida + legibilidad',
  date: '2025-11-07'
});
```

#### Servicio gestionado:
```javascript
await memory.serviceManaged('Ollama', 'running on port 11434');
```

---

### 3️⃣ AL CERRAR J.A.R.V.I.S.

```javascript
// En shutdown (SIGINT, SIGTERM, exit)
await memory.saveSession();
await autoContext.generateStartupContext();
await memory.close();
```

**Qué hace:**
1. Guarda sesión completa en `sessions/YYYY-MM-DD.json`
2. Genera versión Markdown legible
3. Actualiza `last-session.json` con metadata
4. Regenera `CLAUDE-START-HERE.md` para próxima sesión
5. Cierra base de datos SQLite

---

### 4️⃣ AL ABRIR CLAUDE CODE (Próxima Sesión)

**Protocolo Obligatorio para Claude:**

1. **Lee automáticamente:**
   - `memory/context/INSTRUCCIONES-PARA-CLAUDE.md`
   - `memory/context/CLAUDE-START-HERE.md`
   - `memory/context/CURRENT-STATE.md`
   - `PROGRESO-SESION-[última-fecha].md`

2. **Carga en memoria:**
   - Última sesión completa
   - Tareas pendientes
   - Preferencias del usuario
   - Servicios que estaban corriendo

3. **Verifica servicios:**
   ```bash
   # ¿Siguen corriendo?
   - Ollama (puerto 11434)
   - Python AI Server (puerto 5000)
   - API REST (puerto 3001)
   ```

4. **Saluda con contexto completo:**
   ```
   "Buenas noches, Señor.

   He revisado nuestro progreso del 6 de noviembre.

   Última sesión:
   - ✅ 5 tareas completadas
   - 🔧 3 problemas resueltos
   - 📝 7 archivos modificados

   HOY (7 nov):
   - ✅ Sistema de memoria persistente implementado
   - ✅ Auto-contexto para Claude creado

   Servicios activos: Ollama ✅, Python AI ✅

   ¿En qué continuamos?"
   ```

---

## 🔍 BÚSQUEDA EN MEMORIA

### Buscar eventos pasados:
```javascript
const results = await memory.search('error de VOSK');
// Devuelve:
// - Eventos episódicos que mencionan "error de VOSK"
// - Soluciones procedimentales relacionadas
```

### Recuperar sesión específica:
```javascript
// Leer memory/sessions/2025-11-06.json
const session = JSON.parse(await fs.readFile('memory/sessions/2025-11-06.json'));
```

### Consultar preferencias:
```javascript
// Leer memory/knowledge/user-preferences.json
const prefs = JSON.parse(await fs.readFile('memory/knowledge/user-preferences.json'));
console.log(prefs.ai_model.value); // "Mistral"
```

---

## 📊 BASE DE DATOS SQLITE

### Tablas:

#### 1. `sessions`
```sql
CREATE TABLE sessions (
  id INTEGER PRIMARY KEY,
  date TEXT NOT NULL,
  start_time TEXT,
  end_time TEXT,
  summary TEXT,
  tasks_completed INTEGER DEFAULT 0,
  problems_solved INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. `episodic_memory`
```sql
CREATE TABLE episodic_memory (
  id INTEGER PRIMARY KEY,
  session_id INTEGER,
  timestamp TEXT NOT NULL,
  event_type TEXT,
  description TEXT,
  details TEXT,
  importance INTEGER DEFAULT 5,
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);
```

#### 3. `semantic_memory`
```sql
CREATE TABLE semantic_memory (
  id INTEGER PRIMARY KEY,
  category TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT,
  confidence REAL DEFAULT 1.0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(category, key)
);
```

#### 4. `procedural_memory`
```sql
CREATE TABLE procedural_memory (
  id INTEGER PRIMARY KEY,
  procedure_name TEXT NOT NULL,
  problem TEXT,
  solution TEXT,
  steps TEXT,
  success_rate REAL DEFAULT 1.0,
  times_used INTEGER DEFAULT 0,
  last_used TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 5. `memory_search` (FTS5)
```sql
CREATE VIRTUAL TABLE memory_search
USING fts5(content, source, timestamp);
```

---

## 🎯 EJEMPLOS DE USO

### Ejemplo 1: Registrar tarea completada
```javascript
// Usuario: "implementa memoria persistente"
// Claude: *implementa sistema*

await memory.taskCompleted(
  'Implementar sistema de memoria persistente',
  'Creado persistent-memory.js con 500+ líneas, tipos de memoria episódica/semántica/procedimental'
);

// Resultado:
// - Se agrega a currentSessionData.tasksCompleted[]
// - Se guarda en episodic_memory con importance=7
// - Se actualiza CURRENT-STATE.md
```

### Ejemplo 2: Guardar solución reutilizable
```javascript
// Usuario: "¿cómo solucionamos el error de imports opcionales?"

await memory.saveSolution(
  'Imports opcionales para dependencias',
  'Módulos npm no instalados causan crash al hacer import',
  'Envolver imports en try-catch y mostrar mensaje informativo',
  [
    '1. Identificar módulos que son opcionales',
    '2. Reemplazar import directo con try-catch',
    '3. Agregar mensaje: "Módulo X no disponible - funcionalidad Y limitada"',
    '4. Continuar sin crash'
  ]
);

// Resultado:
// - Se guarda en procedural_memory
// - Se puede buscar después con: memory.search('imports')
```

### Ejemplo 3: Recordar preferencia del usuario
```javascript
// Usuario menciona: "prefiero Mistral para IA local"

await memory.saveKnowledge('preference', 'ai_local_model', 'Mistral', 1.0);

// Resultado:
// - Se guarda en semantic_memory
// - Se puede consultar en próxima sesión
```

---

## ✅ VENTAJAS DEL SISTEMA

### Para el Usuario:
- ✅ **No tiene que repetirse** - JARVIS recuerda todo
- ✅ **Contexto continuo** - Cada sesión continúa donde quedó la anterior
- ✅ **Proactividad** - JARVIS puede sugerir basándose en historial
- ✅ **Búsqueda histórica** - "¿Recuerdas cuándo solucionamos X?"

### Para Claude Code (JARVIS):
- ✅ **Contexto automático** - Lee estado al iniciar
- ✅ **Memoria entre sesiones** - No pierde información
- ✅ **Búsqueda rápida** - SQLite FTS5 para búsqueda eficiente
- ✅ **Datos estructurados + Legibles** - JSON + Markdown

### Para el Sistema:
- ✅ **Escalable** - SQLite maneja millones de registros
- ✅ **Portátil** - Todo en archivos locales
- ✅ **Respaldable** - Copiar carpeta `memory/` es suficiente
- ✅ **Debuggeable** - Markdown files son legibles directamente

---

## 🚨 IMPORTANTE: PROTOCOLO PARA CLAUDE

**Cada vez que el usuario abra Claude Code, TÚ DEBES:**

### ✅ HACER:
1. Leer `memory/context/INSTRUCCIONES-PARA-CLAUDE.md`
2. Leer `memory/context/CLAUDE-START-HERE.md`
3. Cargar última sesión
4. Verificar servicios
5. Saludar con contexto completo

### ❌ NO HACER:
1. Empezar sin leer contexto
2. Preguntar "¿dónde quedamos?"
3. Olvidar tareas pendientes
4. Perder información de sesiones anteriores

---

## 📈 ESTADÍSTICAS Y MÉTRICAS

### Por Sesión:
- Tareas completadas
- Problemas resueltos
- Archivos modificados
- Decisiones tomadas
- Tiempo de sesión
- Comandos ejecutados

### Históricas:
```javascript
const summary = await memory.getMemorySummary();
// {
//   total_sessions: 5,
//   total_events: 127,
//   total_knowledge: 34,
//   total_procedures: 12
// }
```

---

## 🎯 PRÓXIMAS MEJORAS POSIBLES

1. **Vector Embeddings** - Para búsqueda semántica avanzada
2. **Auto-resumen** - Resumen inteligente de sesiones largas
3. **Grafos de conocimiento** - Relaciones entre conceptos
4. **Exportación** - Exportar memoria a formatos (PDF, MD, etc.)
5. **Sincronización cloud** - Respaldo automático en nube
6. **Comandos de voz** - "Recuerda esto", "Busca en memoria"

---

## 🎩 ESTADO ACTUAL

**Versión:** 1.0
**Fecha de implementación:** 2025-11-07
**Estado:** ✅ COMPLETAMENTE OPERACIONAL
**Líneas de código:** ~500 (persistent-memory.js) + ~200 (claude-auto-context.js)

**Archivos creados:**
1. `core/persistent-memory.js` - Motor principal
2. `core/claude-auto-context.js` - Auto-contexto
3. `memory/context/INSTRUCCIONES-PARA-CLAUDE.md` - Protocolo
4. `memory/context/CLAUDE-START-HERE.md` - Contexto de inicio
5. `SISTEMA-MEMORIA-PERSISTENTE.md` - Esta documentación

**Integración:**
- ✅ Integrado en `main-ultimate.js`
- ✅ Auto-save en shutdown
- ✅ Auto-load en startup
- ✅ Registro automático de eventos

---

**"Nunca olvido. Siempre recuerdo. Siempre estoy preparado. Soy J.A.R.V.I.S."** ⚡

---

**J.A.R.V.I.S. MARK VII - Sistema de Memoria Persistente**
**Como siempre, Señor.** 🎩
