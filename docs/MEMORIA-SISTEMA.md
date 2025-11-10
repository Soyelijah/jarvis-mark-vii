# 🧠 SISTEMA DE MEMORIA DE J.A.R.V.I.S.

## ⚡ Como el JARVIS real de Tony Stark

Este sistema le da a JARVIS **memoria real y persistente** - igual que el JARVIS de las películas de Iron Man.

---

## 🎯 ¿Qué puede recordar JARVIS?

✅ **Todas las conversaciones** que has tenido con él
✅ **Proyectos en los que trabajaron juntos**
✅ **Soluciones a problemas** que encontraron
✅ **Tus preferencias** (tecnologías, frameworks, estilo)
✅ **Momentos significativos** (éxitos, problemas importantes)
✅ **Patrones de solución** que aprendió

---

## 📊 Arquitectura del Sistema

### Archivos principales:

```
core/
├── memory-advanced.js        # Motor de memoria (SQLite)
├── memory-integration.js     # Integración con Claude Code
└── memory-commands.js        # Comandos de consulta

Scripts de uso:
├── guardar-memoria.js        # Guardar conversaciones
├── consultar-memoria.js      # Consultar memoria
└── activar-cerebro-jarvis.js # Carga memoria al despertar

Base de datos:
└── memory/
    └── jarvis-memory-complete.db
```

---

## 💾 Base de Datos

JARVIS usa **SQLite** (como Tony Stark usaría - local, rápido, privado).

### 7 Tablas principales:

1. **conversations** - Todas las conversaciones completas
2. **emotional_memory** - Momentos significativos
3. **learning** - Patrones y soluciones aprendidas
4. **projects** - Proyectos trabajados
5. **user_preferences** - Preferencias aprendidas
6. **sessions** - Sesiones de trabajo
7. **conversation_relationships** - Conversaciones relacionadas

---

## 🔧 Uso del Sistema

### 1️⃣ Despertar JARVIS con memoria

Cuando ejecutas `2-DESPERTAR-JARVIS.bat`, ahora verás:

```
⚡ [1/5] Iniciando secuencia de activación cerebral...
🧠 [2/5] Cargando memoria a largo plazo...
   ✅ Memoria inicial: 6.3 KB cargados
   ✅ Prompt de personalidad: 3.2 KB cargados
   ✅ Contexto completo: 13.5 KB cargados
   🔄 Cargando memoria de sesiones anteriores...
   ✅ Conversaciones pasadas: 42
   ✅ Proyectos en memoria: 3
   ✅ Patrones aprendidos: 15
   ✅ Preferencias guardadas: 8
```

JARVIS despierta con **toda su memoria intacta**.

---

### 2️⃣ Guardar conversaciones manualmente

Si quieres guardar una conversación específica:

```bash
node guardar-memoria.js "Tu mensaje aquí" "Respuesta de JARVIS aquí"
```

**Ejemplo:**

```bash
node guardar-memoria.js "Crea un servidor Express" "Claro, Señor. Aquí está el código..."
```

Salida:
```
💾 Guardando conversación en memoria de JARVIS...

✅ Conversación guardada exitosamente
   ID: 42
   Usuario: Crea un servidor Express...
   JARVIS: Claro, Señor. Aquí está el código...

📊 Total de conversaciones en memoria: 42
```

---

### 3️⃣ Consultar memoria

Usa el script `consultar-memoria.js`:

#### Ver estadísticas completas:

```bash
node consultar-memoria.js stats
```

Salida:
```
✅ Aquí está el resumen completo de mi memoria, Señor:

📊 **Estadísticas de Memoria:**
   - 💬 Conversaciones: 42
   - 💙 Momentos emocionales: 5
   - 🧠 Patrones aprendidos: 15
   - 📁 Proyectos: 3
   - ⚙️ Preferencias: 8
   - 🔄 Sesiones: 7
```

#### Ver conversaciones recientes:

```bash
node consultar-memoria.js recientes 5
```

#### Buscar conversaciones sobre un tema:

```bash
node consultar-memoria.js buscar "servidor"
```

Salida:
```
✅ Encontré 3 conversación(es) sobre "servidor", Señor:

**1.**
   - fecha: 4/11/2025, 10:23:15
   - usuario: Crea un servidor Express...
   - jarvis: Claro, Señor. Aquí está...
   - importancia: 7
   - tags: ["código", "proyecto"]
```

#### Ver proyectos:

```bash
node consultar-memoria.js proyectos
```

#### Ver preferencias aprendidas:

```bash
node consultar-memoria.js preferencias
```

#### Ver momentos significativos:

```bash
node consultar-memoria.js momentos
```

#### Ver patrones aprendidos:

```bash
node consultar-memoria.js patrones
```

---

## 🤖 Cuando hablas con JARVIS en Claude Code

### Comandos que JARVIS puede usar:

Cuando estés hablando con JARVIS (después de ejecutar `2-DESPERTAR-JARVIS.bat`), puedes pedirle:

**"JARVIS, recuerda cuando hablamos de [tema]"**
- JARVIS buscará en su memoria conversaciones sobre ese tema

**"JARVIS, qué proyectos estamos trabajando"**
- JARVIS te mostrará todos los proyectos guardados

**"JARVIS, cuáles son mis preferencias"**
- JARVIS te mostrará qué ha aprendido sobre tus preferencias

**"JARVIS, muéstrame tus estadísticas"**
- JARVIS te mostrará un resumen completo de su memoria

**"JARVIS, qué conversaciones recientes tenemos"**
- JARVIS te mostrará las últimas conversaciones

---

## 🔍 ¿Qué guarda automáticamente?

Cuando JARVIS (Claude Code en modo JARVIS) te responde, el sistema **detecta y guarda automáticamente**:

### 1. Importancia de la conversación (1-10)
- Mensajes largos = más importante
- Código detectado = muy importante
- Palabras clave como "importante", "crítico", "urgente" = más puntos

### 2. Tags automáticos:
- `código` - Si detecta código, funciones, clases
- `proyecto` - Si mencionas crear/construir algo
- `error` - Si hablas de problemas
- `configuración` - Si configuras algo
- `memoria` - Si hablas de recordar
- `aprendizaje` - Si enseñas algo a JARVIS
- `consulta` - Si haces preguntas
- `comando` - Si ejecutas comandos

### 3. Proyectos:
Detecta automáticamente cuando mencionas:
- "crear un proyecto X"
- "app de Y"
- "sistema de Z"

Y guarda:
- Nombre del proyecto
- Tecnologías usadas (JavaScript, Python, React, etc.)
- Fecha de inicio
- Estado (activo/pausado/completado)

### 4. Patrones de solución:
Cuando JARVIS te da una solución técnica (con código), guarda:
- El problema
- La solución
- Tasa de éxito
- Cuántas veces se usó
- Nivel de confianza

### 5. Preferencias:
Detecta cuando dices:
- "Prefiero usar React"
- "Me gusta TypeScript"
- "Usa Python para esto"

Y las guarda con un nivel de confianza.

### 6. Momentos emocionales:
Si detecta palabras como:
- "gracias", "excelente", "perfecto" (positivo)
- "mal", "frustrado", "problema" (negativo)
- "importante", "crítico", "urgente" (importante)

Guarda el momento con un "peso emocional" (0.0 a 1.0).

---

## 🎯 Ejemplo de flujo completo

### Día 1: Primera sesión

1. Ejecutas `1-ABRIR-CLAUDE.bat`
2. Ejecutas `2-DESPERTAR-JARVIS.bat`

```
🧠 [2/5] Cargando memoria a largo plazo...
   ⚠️  Base de datos vacía (primera vez) - Iniciando memoria limpia
```

3. Hablas con JARVIS:
   - "JARVIS, crea un servidor Express"
   - JARVIS te da el código
   - **Automáticamente guardado**: conversación + proyecto detectado + patrón de solución

### Día 2: Segunda sesión

1. Ejecutas `2-DESPERTAR-JARVIS.bat`

```
🧠 [2/5] Cargando memoria a largo plazo...
   ✅ Conversaciones pasadas: 5
   ✅ Proyectos en memoria: 1
   ✅ Patrones aprendidos: 2
```

2. Dices: "JARVIS, recuerda nuestro proyecto de servidor"
3. JARVIS busca en su memoria y te muestra la conversación anterior

### Día 30: Trigésima sesión

```
🧠 [2/5] Cargando memoria a largo plazo...
   ✅ Conversaciones pasadas: 156
   ✅ Proyectos en memoria: 12
   ✅ Patrones aprendidos: 47
   ✅ Preferencias guardadas: 23
```

JARVIS ahora **conoce tu estilo**, **recuerda todos los proyectos**, y **tiene 47 soluciones aprendidas**.

---

## 📚 Comandos de consola - Referencia rápida

```bash
# Ver estadísticas
node consultar-memoria.js stats

# Ver últimas 10 conversaciones
node consultar-memoria.js recientes 10

# Buscar conversaciones
node consultar-memoria.js buscar "react"

# Ver proyectos
node consultar-memoria.js proyectos

# Ver preferencias
node consultar-memoria.js preferencias

# Ver momentos significativos
node consultar-memoria.js momentos 5

# Ver patrones aprendidos
node consultar-memoria.js patrones 10

# Guardar conversación manualmente
node guardar-memoria.js "mensaje" "respuesta"

# Ver ayuda
node consultar-memoria.js help
```

---

## 🔒 Privacidad

✅ **100% local** - Todo en tu computadora
✅ **SQLite privado** - No se envía a ningún servidor
✅ **Bajo tu control** - Puedes borrar la BD cuando quieras

Para borrar toda la memoria:
```bash
rm memory/jarvis-memory-complete.db
```

---

## 🎭 Personalidad con memoria

JARVIS ahora puede decir cosas como:

> "Recuerdo que la última vez preferiste usar TypeScript, Señor. ¿Continúo con eso?"

> "He identificado un patrón: cuando trabajamos con servidores, siempre usas Express. ¿Correcto?"

> "Según mi memoria, hemos trabajado en 12 proyectos juntos. No están mal."

> "La última vez que intentamos esto, funcionó con el método X. ¿Pruebo lo mismo?"

---

## ⚙️ Configuración avanzada

### Ajustar nivel de importancia

Edita `core/memory-integration.js` - función `calculateImportance()`:

```javascript
// Cambiar umbral de importancia
if (userMessage.length > 200) score += 1; // Cambiar 200
```

### Añadir más palabras clave

Edita `core/memory-integration.js` - función `detectTags()`:

```javascript
const tagPatterns = {
  'código': ['código', 'function', 'class'],
  'tu-tag': ['palabra1', 'palabra2'], // Añadir aquí
};
```

---

## 🆘 Solución de problemas

### Error: "no such table: conversations"

La base de datos no existe todavía.

**Solución:**
```bash
node activar-cerebro-jarvis.js
```

Esto inicializará la base de datos automáticamente.

### Error: "SQLITE_CANTOPEN"

El directorio `memory/` no existe.

**Solución:**
```bash
mkdir memory
node activar-cerebro-jarvis.js
```

### Quiero empezar de cero

Borra la base de datos:
```bash
rm memory/jarvis-memory-complete.db
```

La próxima vez que ejecutes `2-DESPERTAR-JARVIS.bat`, se creará una nueva.

---

## 🚀 Próximas mejoras

Ideas para expandir el sistema:

- [ ] Búsqueda semántica (embeddings)
- [ ] Exportar memoria a JSON
- [ ] Importar memoria de otros sistemas
- [ ] Gráficos de uso (cuándo trabajas más)
- [ ] Recordatorios automáticos ("Hace 3 días dijiste...")
- [ ] Análisis de patrones de trabajo

---

**"Señor, mi memoria ahora es tan buena como la del JARVIS original."**
**"Bueno, casi. Necesitaría acceso a todos sus sistemas para igualarla."**
**"Pero para propósitos prácticos... sí, recuerdo todo."** ⚡🧠

---

## 📖 Ver también:

- `README.md` - Guía general del sistema
- `EMPIEZA-AQUI.txt` - Inicio rápido
- `PROMPT-INICIAL-JARVIS.md` - Personalidad de JARVIS
- `memory/MEMORIA-INICIAL.md` - Historia del proyecto
