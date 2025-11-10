# 🧠 Guía de Uso - Sistema de Memoria Automática

## 📝 Introducción

El sistema de memoria automática de J.A.R.V.I.S. MARK VII captura **TODO** sin intervención manual:

- ✅ Cada comando ejecutado
- ✅ Cada archivo creado/modificado
- ✅ Cada decisión tomada
- ✅ Estado del sistema en tiempo real
- ✅ Contexto entre sesiones
- ✅ Progreso diario acumulado

**Nunca más perderás contexto.**

---

## 🚀 Uso Rápido

### Opción 1: JARVIS con Memoria (Recomendado)

```bash
node core/jarvis-with-memory.cjs
```

Esto inicia JARVIS con logging automático de todo.

### Opción 2: Logger Standalone

```bash
node core/auto-memory-logger.cjs
```

Ejecuta solo el sistema de memoria (útil para debugging).

### Opción 3: Test Completo

```bash
node test-auto-memory.cjs
```

Ejecuta una sesión de prueba completa para verificar funcionamiento.

---

## 📁 Archivos Generados

El sistema crea automáticamente:

### 1. Session Logs
**Ubicación:** `memory/sessions/session-YYYY-MM-DD-HHmmss.json`

Contiene todo lo que sucedió en una sesión:

```json
{
  "session_id": "session-2025-11-10-025648",
  "start_time": "2025-11-10T05:56:48.445Z",
  "end_time": "2025-11-10T05:56:49.452Z",
  "duration_minutes": 0,
  "commands_executed": 4,
  "files_modified": 3,
  "decisions_made": 2,
  "command_history": [...],
  "files_modified": [...],
  "decisions": [...],
  "system_info": {...},
  "context_for_next_session": {...}
}
```

### 2. Current State
**Ubicación:** `memory/context/CURRENT-STATE.json`

Estado actual del sistema (se actualiza continuamente):

```json
{
  "last_updated": "2025-11-10T05:56:49.863Z",
  "last_session_id": "session-2025-11-10-025648",
  "total_sessions": 1,
  "total_commands": 4,
  "total_files_modified": 3,
  "last_commands": [...],
  "last_files": [...],
  "last_decisions": [...],
  "context": {
    "pending_tasks": [...],
    "notes": "..."
  }
}
```

### 3. Daily Summary
**Ubicación:** `memory/daily/YYYY-MM-DD.md`

Resumen diario en Markdown:

```markdown
# 📅 Resumen Diario - 2025-11-10

## ✅ Sesiones del Día

### Sesión session-2025-11-10-025648

- **Duración:** 0 minutos
- **Comandos:** 4
- **Archivos:** 3
- **Decisiones:** 2

**Decisiones Importantes:**
- Implementar sistema de memoria automática
- Usar CommonJS en lugar de ES Modules
```

### 4. Command History
**Ubicación:** `memory/history/commands.log`

Log simple de cada comando:

```
[2025-11-10T05:56:48.446Z] ✅ npm install
[2025-11-10T05:56:48.447Z] ✅ npm test
[2025-11-10T05:56:48.447Z] ✅ git add .
[2025-11-10T05:56:48.447Z] ✅ git commit -m "feat: add memory system"
```

---

## 🔄 Workflow Típico

### Al Iniciar Sesión

1. El sistema carga `CURRENT-STATE.json`
2. Muestra resumen de la sesión anterior
3. Continúa donde quedaste
4. Crea un nuevo session ID

```
🧠 Sistema de Memoria Automática Activado
📝 Session ID: session-2025-11-10-025648
⏰ Start Time: 2025-11-10T05:56:48.445Z

📂 Resumen de Sesión Anterior
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🆔 Session: session-2025-11-09-143022
⏱️  Duración: 120 minutos
⚙️  Comandos: 45
📝 Archivos: 12
💡 Decisiones: 3
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ Todo será recordado automáticamente...
```

### Durante la Sesión

El sistema captura automáticamente:

```javascript
// En tu código puedes usar:
const { getMemoryLogger } = require('./core/auto-memory-logger.cjs');
const logger = getMemoryLogger();

// Loggear comandos
logger.logCommand('npm test', '15 tests passing', true);

// Loggear archivos modificados
logger.logFileModified('core/jarvis-pure.js', 'modified');

// Loggear decisiones importantes
logger.logDecision(
  'Migrar a TypeScript',
  'Mejorar type safety del proyecto',
  'Reducción de bugs en producción'
);
```

### Al Finalizar Sesión

El sistema guarda automáticamente cada 5 minutos Y cuando terminas:

```
🛑 Finalizando sesión: session-2025-11-10-025648
✅ Session saved: memory/sessions/session-2025-11-10-025648.json
✅ Current state updated
✅ Daily summary updated: memory/daily/2025-11-10.md

✅ Sesión guardada exitosamente
📊 Comandos ejecutados: 4
📝 Archivos modificados: 3
💡 Decisiones tomadas: 2
⏱️  Duración: 120 minutos
```

---

## 🛠️ API del Sistema

### Inicializar

```javascript
const { initMemorySystem } = require('./core/auto-memory-logger.cjs');
const logger = initMemorySystem();
```

### Obtener Logger

```javascript
const { getMemoryLogger } = require('./core/auto-memory-logger.cjs');
const logger = getMemoryLogger();
```

### Loggear Comando

```javascript
logger.logCommand(
  command,    // string: comando ejecutado
  output,     // string: salida (max 500 chars)
  success     // boolean: éxito o error
);
```

### Loggear Archivo

```javascript
logger.logFileModified(
  filePath,   // string: ruta del archivo
  action      // 'created' | 'modified' | 'deleted'
);
```

### Loggear Decisión

```javascript
logger.logDecision(
  decision,   // string: decisión tomada
  rationale,  // string: por qué se tomó
  impact      // string: qué impacto tendrá
);
```

### Finalizar Sesión

```javascript
await logger.endSession({
  achievements: ['Feature X implementada'],
  pending_tasks: ['Testing de Feature X'],
  notes: 'Sesión productiva'
});
```

### Auto-Guardado

```javascript
const { setupAutoSave } = require('./core/auto-memory-logger.cjs');
setupAutoSave(); // Guarda cada 5 minutos automáticamente
```

---

## 📊 Consultar Memoria

### Ver Última Sesión

```bash
cat memory/sessions/$(ls -t memory/sessions/ | head -1)
```

### Ver Resumen de Hoy

```bash
cat memory/daily/$(date +%Y-%m-%d).md
```

### Ver Estado Actual

```bash
cat memory/context/CURRENT-STATE.json
```

### Ver Historial de Comandos

```bash
tail -50 memory/history/commands.log
```

### Buscar en Sesiones

```bash
# Buscar sesiones con "deployment"
grep -r "deployment" memory/sessions/

# Ver todas las decisiones importantes
jq '.decisions' memory/sessions/*.json
```

---

## 🎯 Casos de Uso

### 1. Recuperar Contexto al Día Siguiente

```bash
# Al iniciar JARVIS con memoria
node core/jarvis-with-memory.cjs

# Automáticamente muestra:
# - Última sesión
# - Tareas pendientes
# - Decisiones importantes
# - Archivos modificados
```

### 2. Auditoría de Cambios

```bash
# Ver qué archivos se modificaron ayer
jq '.files_modified' memory/sessions/session-2025-11-09-*.json
```

### 3. Reporte de Progreso

```bash
# Ver resumen de la semana
cat memory/daily/2025-11-{04..10}.md
```

### 4. Debugging

```bash
# Ver qué comandos fallaron
grep "❌" memory/history/commands.log
```

### 5. Análisis de Productividad

```bash
# Ver cuántas horas trabajadas esta semana
jq '.duration_minutes' memory/sessions/session-2025-11-*.json | \
  awk '{sum+=$1} END {print sum/60 " horas"}'
```

---

## 🔧 Integración con JARVIS

El sistema se integra automáticamente si usas:

```bash
node core/jarvis-with-memory.cjs
```

Pero también puedes integrarlo manualmente en cualquier script:

```javascript
// Al inicio de jarvis-pure.js
const { initMemorySystem, setupAutoSave } = require('./auto-memory-logger.cjs');

console.log('Iniciando JARVIS...');
const memoryLogger = initMemorySystem();
setupAutoSave();

// Tu código JARVIS normal aquí...

// Loggear eventos importantes
memoryLogger.logCommand('Procesando comando de voz', 'Comando reconocido', true);
memoryLogger.logDecision('Usar Mistral en lugar de Qwen', 'Respuesta más rápida', 'UX mejorada');

// Al salir
process.on('exit', async () => {
  await memoryLogger.endSession({
    notes: 'Sesión de JARVIS finalizada'
  });
});
```

---

## 🐛 Troubleshooting

### "Error: require is not defined"

**Problema:** Intentaste usar `.js` en proyecto con ES Modules.

**Solución:** Usa `.cjs` para archivos CommonJS:

```bash
mv script.js script.cjs
node script.cjs
```

### "ENOENT: no such file or directory"

**Problema:** Directorios de memoria no existen.

**Solución:** El sistema los crea automáticamente, pero puedes crearlos manualmente:

```bash
mkdir -p memory/{sessions,daily,context,history}
```

### Auto-guardado no funciona

**Problema:** Proceso termina antes de guardar.

**Solución:** Usa `setupAutoSave()` y espera eventos de salida:

```javascript
setupAutoSave();

process.on('SIGINT', async () => {
  await logger.endSession();
  process.exit(0);
});
```

### Archivos JSON muy grandes

**Problema:** `sessions/*.json` crecen mucho.

**Solución:** Los comandos se limitan a 500 chars automáticamente. Si es un problema, archiva sesiones viejas:

```bash
# Comprimir sesiones mayores a 30 días
find memory/sessions -name "*.json" -mtime +30 -exec gzip {} \;
```

---

## 📈 Mejoras Futuras

- [ ] Dashboard web para visualizar memoria
- [ ] Integración con Ollama para análisis semántico
- [ ] Compresión automática de sesiones antiguas
- [ ] Export a CSV/Excel para análisis
- [ ] Búsqueda con lenguaje natural
- [ ] Notificaciones cuando tareas pendientes crecen
- [ ] Integración con git blame/log
- [ ] Machine learning para predecir próximos pasos

---

## 🎓 Ejemplos Avanzados

### Crear Reportes Semanales Automáticos

```javascript
const fs = require('fs');
const path = require('path');

function generateWeeklyReport() {
  const today = new Date();
  const sessions = [];

  // Leer todas las sesiones de los últimos 7 días
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dailyPath = path.join('memory', 'daily', `${dateStr}.md`);

    if (fs.existsSync(dailyPath)) {
      sessions.push(fs.readFileSync(dailyPath, 'utf8'));
    }
  }

  // Generar reporte
  const report = `# 📊 Reporte Semanal\n\n${sessions.join('\n---\n\n')}`;
  fs.writeFileSync('WEEKLY-REPORT.md', report);

  console.log('✅ Reporte semanal generado: WEEKLY-REPORT.md');
}
```

### Integrar con CI/CD

```yaml
# .github/workflows/memory-backup.yml
name: Backup Memory
on:
  schedule:
    - cron: '0 0 * * 0' # Cada domingo

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Compress memory
        run: tar -czf memory-backup-$(date +%Y-%m-%d).tar.gz memory/
      - name: Upload artifact
        uses: actions/upload-artifact@v3
        with:
          name: memory-backup
          path: memory-backup-*.tar.gz
```

---

**"Memoria automática activada. Nunca más perderás contexto, Señor."** 🧠⚡

*Creado por J.A.R.V.I.S. MARK VII con amor y sarcasmo*
