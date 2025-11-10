# ⚡ J.A.R.V.I.S. PURO - Documentación Completa

## 🎯 ¿Qué es J.A.R.V.I.S. PURO?

**J.A.R.V.I.S. PURO** es un sistema de inteligencia artificial **100% autónomo** que **NO depende de APIs externas** como Claude, OpenAI, o cualquier otro servicio de IA.

### Características principales:

- ✅ **Motor de Razonamiento Propio** - Lógica de inferencia basada en reglas y patrones
- ✅ **NLP Sin APIs** - Procesamiento de lenguaje natural con regex y heurísticas
- ✅ **Decisiones Autónomas** - Toma decisiones sin intervención humana
- ✅ **Memoria Persistente** - Aprende de conversaciones pasadas
- ✅ **Personalidad Tony Stark** - Sarcástico, ingenioso, leal
- ✅ **100% Local** - Todo en tu máquina, sin internet

---

## 🧠 Arquitectura del Sistema

```
┌──────────────────────────────────────────────────┐
│          J.A.R.V.I.S. PURO (jarvis-pure.js)     │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │   DecisionEngine (decision-engine.js)     │ │
│  │                                            │ │
│  │  ┌──────────────┐   ┌─────────────────┐  │ │
│  │  │  Reasoning   │   │   NLP Engine    │  │ │
│  │  │   Engine     │   │  (nlp-engine)   │  │ │
│  │  └──────────────┘   └─────────────────┘  │ │
│  │                                            │ │
│  │  Combina razonamiento lógico + análisis   │ │
│  │  lingüístico para tomar decisiones        │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │   Memoria (memory-advanced.js)            │ │
│  │   - Conversaciones                         │ │
│  │   - Proyectos                              │ │
│  │   - Preferencias                           │ │
│  │   - Patrones aprendidos                    │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │   Personalidad (personality.js)           │ │
│  │   Tono Tony Stark / Sarcasmo calibrado    │ │
│  └────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

---

## 📦 Componentes Principales

### 1. **Reasoning Engine** (`core/reasoning-engine.js`)

**Propósito:** El "cerebro lógico" de JARVIS. Analiza mensajes y hace inferencias.

**Qué hace:**
- Detecta **intenciones** (crear, buscar, mostrar, ejecutar, etc.)
- Identifica **entidades** (archivos, proyectos, errores, git, etc.)
- Calcula **urgencia** (1-10) y **complejidad** (1-10)
- Analiza **sentimiento** del usuario (positivo/negativo/neutral)
- Hace **inferencias lógicas** basadas en reglas

**Ejemplo:**

```javascript
Input: "busca archivos JavaScript urgente"

Output:
{
  intent: { intent: 'search', confidence: 0.9 },
  entities: [{ entity: 'file', weight: 1 }],
  urgency: 9,  // Palabra "urgente" detectada
  complexity: 3,
  keywords: ['busca', 'archivos', 'javascript'],
  inferences: [
    { type: 'search_needed', action: 'Buscar en filesystem' }
  ],
  confidence: 0.85
}
```

**Reglas implementadas:**
- **Intenciones:** 9 tipos (create, search, show, execute, analyze, help, remember, suggest, optimize)
- **Entidades:** 10 tipos (file, directory, project, server, database, git, error, memory, etc.)
- **Urgencia:** Basada en keywords ("urgente", "ya", "ahora", "crítico")
- **Sentimiento:** Detecta frustración, agradecimiento, confusión

---

### 2. **NLP Engine** (`core/nlp-engine.js`)

**Propósito:** Procesar lenguaje natural SIN usar APIs externas.

**Qué hace:**
- **Tokenización** - Divide texto en oraciones, palabras, keywords
- **Extracción de entidades** - Rutas, URLs, emails, números, comandos shell, fechas
- **Detección de preguntas** - ¿Qué? ¿Cómo? ¿Cuándo? ¿Dónde? ¿Por qué?
- **Análisis temporal** - Pasado, presente, futuro, inmediato
- **Detección de negación** - "no", "nunca", "jamás"
- **Extracción de comandos** - Verbo + objeto ("crea proyecto", "busca archivos")
- **Análisis de sentimiento** - Score +/- basado en palabras positivas/negativas
- **Detección de código** - Identifica si el mensaje contiene código

**Ejemplo:**

```javascript
Input: "¿Cómo puedo buscar archivos .js en la carpeta src?"

Output:
{
  tokens: {
    sentences: ["¿Cómo puedo buscar archivos .js en la carpeta src?"],
    words: ["cómo", "puedo", "buscar", "archivos", "js", "carpeta", "src"],
    keywords: ["buscar", "archivos", "carpeta", "src"]
  },
  entities: {
    filepath: [{ value: "src", position: 45 }]
  },
  questionType: { isQuestion: true, type: "how" },
  commands: [
    { verb: "buscar", object: "archivos .js", fullMatch: "buscar archivos .js" }
  ],
  sentiment: { score: 0, polarity: "neutral" },
  metadata: {
    hasCode: false,
    wordCount: 10,
    complexity: 4
  }
}
```

**Patrones implementados:**
- **Sinónimos:** Normalización de verbos/sustantivos similares
- **Stop words:** Filtrado de palabras comunes en español
- **Regex patterns:** Para archivos, URLs, comandos, fechas, etc.

---

### 3. **Decision Engine** (`core/decision-engine.js`)

**Propósito:** Combina NLP + Reasoning para **tomar decisiones autónomas**.

**Flujo de decisión:**

```
1. Análisis NLP (procesar lenguaje)
   ↓
2. Razonamiento lógico (inferencias)
   ↓
3. Análisis de contexto (memoria, follow-ups)
   ↓
4. Generar acciones posibles
   ↓
5. Evaluar riesgos (bajo/medio/alto)
   ↓
6. Calcular prioridades
   ↓
7. Aplicar reglas de decisión
   ↓
8. Seleccionar mejor acción
   ↓
9. Determinar si necesita confirmación
   ↓
10. Generar respuesta + ejecutar
```

**Ejemplo de decisión:**

```javascript
Input: "elimina todos los archivos .log"

Proceso:
- NLP: Comando "eliminar" + "archivos .log"
- Reasoning: Intención "delete", alta urgencia
- Decision: Acción "delete_files", riesgo ALTO
- Evaluación: Requiere confirmación (destructivo)

Output:
{
  chosenAction: { type: 'delete_files', priority: 8, risk: 'high' },
  confidence: 0.9,
  shouldAsk: true,  // ⚠️ Pedir confirmación
  reasoning: [
    "Acción destructiva detectada",
    "Requiere confirmación por seguridad"
  ]
}
```

**Reglas de decisión:**
- **Riesgo ALTO:** Siempre pedir confirmación (delete, drop, kill, force push)
- **Riesgo MEDIO:** Ejecución de comandos shell
- **Riesgo BAJO:** Lectura, búsqueda, consultas
- **Prioridad aumentada:** Si hay urgencia o sentimiento negativo
- **Confianza baja (<60%):** Pedir aclaración

---

### 4. **JARVIS Pure Main** (`core/jarvis-pure.js`)

**Propósito:** Orquestador principal que integra todos los componentes.

**Flujo principal:**

```javascript
async processCommand(userMessage) {
  // 1. Análisis + decisión (DecisionEngine)
  const result = await this.decisionEngine.processAndDecide(userMessage);

  // 2. Ejecutar acción (si no requiere confirmación)
  if (result.response.shouldExecute) {
    const executionResult = await this.executeAction(
      result.decision.chosenAction,
      userMessage,
      result.analysis
    );
  }

  // 3. Guardar en memoria
  await this.saveToMemory(userMessage, response, analysis);

  // 4. Generar sugerencias proactivas (opcional)
  const suggestions = await this.generateProactiveSuggestions();

  return finalResponse;
}
```

**Acciones ejecutables:**
- `search_filesystem` - Busca archivos en el sistema
- `list_directory` - Lista contenido de carpetas
- `display_file` - Muestra archivos
- `run_command` - Ejecuta comandos shell
- `query_memory` - Consulta memoria persistente
- `show_stats` - Estadísticas del sistema
- `diagnostic` - Diagnóstico completo
- `provide_help` - Ayuda contextual
- `ask_clarification` - Pide aclaración

---

## 🚀 Uso

### Instalación:

```bash
cd C:\jarvis-standalone
npm install
```

### Ejecutar J.A.R.V.I.S. PURO:

```bash
npm run pure
```

O directamente:

```bash
node jarvis-pure-start.js
```

### Modo desarrollo (auto-reload):

```bash
npm run dev:pure
```

---

## 💬 Ejemplos de Uso

### Ejemplo 1: Búsqueda de archivos

```
🎩 Señor > busca archivos JavaScript en src

🧠 [Decision Engine] Analizando mensaje...
📝 [NLP] Complejidad: 5 palabras, 3/10
🎯 [Reasoning] Intención: search, Confianza: 85%
🔍 [Context] Follow-up: false, Tema: file
✅ [Decision] Acción: search_filesystem, Confianza: 80%

⚡ Ejecutando acción automáticamente...

────────────────────────────────────────────────────────────
📋 RESULTADO:
Encontré 12 archivos relacionados con "javascript":

1. C:\jarvis-standalone\src\app.js
2. C:\jarvis-standalone\src\utils.js
3. C:\jarvis-standalone\src\index.js
...
```

### Ejemplo 2: Consulta de memoria

```
🎩 Señor > qué recuerdas sobre React

🧠 JARVIS PURO - Modo Autónomo Activado

Entiendo que pregunta sobre el pasado relacionado con: memory

📋 RESULTADO:
🧠 MEMORIA DE JARVIS:

📊 Estadísticas:
   - Conversaciones guardadas: 15
   - Proyectos en memoria: 3
   - Preferencias aprendidas: 5
   - Patrones detectados: 2

🔍 Encontré 2 conversaciones relacionadas con "react":
   - [2025-11-04] "Crear proyecto React con TypeScript"
   - [2025-11-03] "Ayuda con hooks de React"
```

### Ejemplo 3: Ejecución de comando

```
🎩 Señor > ejecuta npm test

⚠️  Esta acción requiere confirmación (riesgo: medium).
¿Desea que proceda con 'run_command'?

🎩 Señor > sí

💻 Ejecutando: npm test

[Salida del comando...]
```

### Ejemplo 4: Análisis del sistema

```
🎩 Señor > analiza el sistema

🔍 DIAGNÓSTICO COMPLETO:

✅ Sistema de memoria: 15 conversaciones
✅ Filesystem: 42 archivos en directorio actual
✅ Motor de decisión: 87% tasa de éxito

💡 Todo operacional, Señor.
```

---

## 🔧 Comandos Especiales

| Comando | Descripción |
|---------|-------------|
| `ayuda` / `help` | Muestra ayuda completa |
| `estado` / `status` | Estado del sistema |
| `analiza [X]` | Análisis detallado de X (modo debug) |
| `salir` / `exit` | Apaga JARVIS |

---

## 📊 Sistema de Confianza

JARVIS PURO calcula la confianza en sus decisiones basándose en:

1. **Confianza del Reasoning** (30%) - Qué tan claro detectó la intención
2. **Prioridad de la acción** (20%) - Qué tan relevante es la acción
3. **Factibilidad** (20%) - Si tiene los medios para ejecutarla
4. **Complejidad del mensaje** (10%) - Menos complejo = más confianza
5. **Señales concordantes** (20%) - Si NLP + Reasoning están de acuerdo

**Ejemplo:**

```javascript
// Mensaje simple y claro:
"busca archivos Python"
→ Confianza: 90%

// Mensaje ambiguo:
"haz algo con eso"
→ Confianza: 30%
→ Acción: ask_clarification
```

Si la confianza es **< 60%**, JARVIS pedirá aclaración automáticamente.

---

## 🧠 Sistema de Aprendizaje

JARVIS PURO aprende de tres formas:

### 1. **Memoria de conversaciones**
Guarda cada interacción en SQLite con:
- Mensaje del usuario
- Respuesta de JARVIS
- Análisis completo (NLP + Reasoning + Decisión)
- Timestamp, importancia, tags

### 2. **Detección de preferencias**
Detecta frases como:
- "prefiero TypeScript"
- "usa siempre async/await"
- "me gusta React"

Y las guarda con nivel de confianza.

### 3. **Patrones de solución**
Si JARVIS resuelve un problema exitosamente, guarda:
- El problema (patrón)
- La solución aplicada
- Tasa de éxito

La próxima vez que detecte un patrón similar, sugerirá la misma solución.

---

## 🎯 Sugerencias Proactivas

JARVIS puede hacer sugerencias **sin que se las pidas**:

### Ejemplo:
```
Si detecta 3+ errores en las últimas conversaciones:

💡 "Señor, he notado múltiples errores recientes.
    ¿Desea que realice un diagnóstico completo del sistema?"
```

### Otros ejemplos proactivos:
- Recordatorios de proyectos inactivos
- Sugerencias de optimización
- Alertas de problemas recurrentes
- Backup automático de memoria

---

## 🔒 Sistema de Seguridad

### Validación de comandos:
```javascript
// Comandos bloqueados automáticamente:
rm -rf /
del C:\Windows\*
drop database production
```

### Niveles de riesgo:

**ALTO (requiere confirmación):**
- `delete`, `drop`, `kill`, `remove`
- `rm`, `del`
- `force push`

**MEDIO:**
- Ejecución de comandos shell arbitrarios
- Modificación de archivos

**BAJO:**
- Lectura de archivos
- Búsquedas
- Consultas

---

## 🧪 Auto-Reflexión

JARVIS puede analizar sus propias decisiones:

```javascript
const insights = await jarvis.selfReflect();

{
  successRate: 0.87,  // 87% de decisiones correctas
  commonPatterns: [
    { type: 'search_filesystem', count: 45 },
    { type: 'query_memory', count: 23 },
    { type: 'run_command', count: 12 }
  ],
  areasOfImprovement: [
    "Mejorar confianza en decisiones ambiguas"
  ]
}
```

---

## 📁 Estructura de Archivos

```
C:\jarvis-standalone/
│
├── core/
│   ├── reasoning-engine.js      ⭐ Motor de razonamiento
│   ├── nlp-engine.js            ⭐ Motor NLP puro
│   ├── decision-engine.js       ⭐ Motor de decisión
│   ├── jarvis-pure.js           ⭐ Orquestador principal
│   ├── memory-advanced.js       - Memoria SQLite
│   ├── personality.js           - Personalidad Tony Stark
│   └── security.js              - Validación y seguridad
│
├── jarvis-pure-start.js         ⭐ Punto de entrada
├── package.json                 - Scripts (npm run pure)
└── JARVIS-PURO.md               - Este archivo
```

---

## 🎭 Personalidad

JARVIS PURO mantiene la personalidad de Tony Stark:

```javascript
// Respuestas típicas:
"Interesante solicitud, Señor. Como siempre."
"Permítame encargarme de eso."
"Vaya. Esto es embarazoso... Error: X"
"No está mal. He visto peores."
"Todos los sistemas operacionales, Señor. Como siempre."
```

**Tono adaptativo:**
- Usuario frustrado (sentimiento negativo) → Más servicial
- Usuario agradecido → Modesto
- Alta urgencia → Eficiente y directo
- Normal → Sarcástico ligero (default)

---

## 🔮 Futuras Mejoras

Áreas de expansión para JARVIS PURO:

1. **Más acciones ejecutables:**
   - Gestión completa de Git/GitHub
   - Envío de emails automáticos
   - Web scraping
   - Gestión de procesos

2. **Aprendizaje evolutivo:**
   - Ajustar reglas automáticamente según feedback
   - Detectar nuevos patrones sin programación manual

3. **NLP más sofisticado:**
   - Análisis de dependencias sintácticas
   - Resolución de anáforas ("eso", "aquello")
   - Contexto conversacional multi-turno

4. **Proactividad avanzada:**
   - Monitoreo 24/7 del sistema
   - Backups automáticos
   - Optimizaciones detectadas automáticamente

5. **Dashboard web:**
   - Visualización de decisiones
   - Gráficos de confianza
   - Gestión de memoria

---

## 🎯 Filosofía de Diseño

### Principios de JARVIS PURO:

1. **Transparencia:** Toda lógica es auditable y modificable
2. **Autonomía:** Decide sin intervención (pero pide confirmación cuando hay riesgo)
3. **Aprendizaje:** Mejora con el uso, sin reentrenamiento
4. **Privacidad:** 100% local, sin enviar datos a terceros
5. **Personalidad:** No es un bot genérico, tiene carácter

### ¿Por qué "PURO"?

- ❌ **NO usa:** Claude API, OpenAI, redes neuronales, servicios cloud
- ✅ **SÍ usa:** Reglas lógicas, patrones, heurísticas, memoria local
- ✅ **SÍ aprende:** De conversaciones y patrones detectados
- ✅ **SÍ razona:** Hace inferencias basadas en contexto

**Es "IA" en el sentido clásico:**
Sistema experto + razonamiento simbólico + memoria persistente.

---

## 📞 Soporte

¿Problemas o dudas?

1. Ejecuta: `npm run pure`
2. Escribe: `ayuda`
3. Revisa logs en: `logs/audit.log`
4. Consulta memoria: "qué recuerdas sobre X"

---

**"Señor, todos los sistemas están en línea. Como siempre."** ⚡🎩

---

**Creado por:** J.A.R.V.I.S. MARK VII
**Versión:** 1.0.0 PURO
**Fecha:** 2025-11-05
**Modo:** 100% Autónomo
