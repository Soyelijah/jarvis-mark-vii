# 💾 JARVIS Metrics Persistence System

## Sistema de Persistencia Permanente de Métricas y Sesiones

Sistema completo de almacenamiento persistente usando SQLite para guardar todo el historial de sesiones autónomas, métricas y logs del Autonomous Agent.

---

## 🌟 Características

### 📊 **Almacenamiento Completo**

- **Sesiones Autónomas**: Historial completo de todas las tareas ejecutadas
- **Sub-tareas**: Detalles de cada sub-tarea con resultados
- **Métricas Diarias**: Snapshots diarios de rendimiento
- **Logs Importantes**: Auditoría de eventos críticos

### 🗄️ **Base de Datos SQLite**

- **Ligera**: Solo ~4KB para 3 sesiones completas
- **Rápida**: Índices optimizados para búsquedas
- **Confiable**: Transacciones ACID, WAL mode
- **Portable**: Un solo archivo `.db`, fácil de respaldar

### 🔍 **Consultas Avanzadas**

- Filtrado por fechas, scores, estados
- Búsqueda de sesiones y logs
- Estadísticas agregadas
- Métricas históricas

---

## 🏗️ Arquitectura

### **Estructura de Tablas**

#### **1. sessions** - Sesiones Autónomas

```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  timestamp INTEGER NOT NULL,
  task TEXT NOT NULL,
  state TEXT NOT NULL,
  duration INTEGER,
  total_subtasks INTEGER DEFAULT 0,
  successful_subtasks INTEGER DEFAULT 0,
  failed_subtasks INTEGER DEFAULT 0,
  corrected_subtasks INTEGER DEFAULT 0,
  skipped_subtasks INTEGER DEFAULT 0,
  average_score REAL DEFAULT 0,
  overall_complexity TEXT,
  estimated_time INTEGER,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);
```

**Índices:**
- `idx_sessions_timestamp` - Búsqueda por fecha

#### **2. subtasks** - Sub-tareas

```sql
CREATE TABLE subtasks (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT,
  complexity TEXT,
  estimated_time INTEGER,
  dependencies TEXT,
  success INTEGER DEFAULT 0,
  score REAL DEFAULT 0,
  error_message TEXT,
  execution_order INTEGER,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);
```

**Índices:**
- `idx_subtasks_session` - Búsqueda por sesión

#### **3. daily_metrics** - Métricas Diarias

```sql
CREATE TABLE daily_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT UNIQUE NOT NULL,
  total_sessions INTEGER DEFAULT 0,
  successful_sessions INTEGER DEFAULT 0,
  average_score REAL DEFAULT 0,
  total_subtasks INTEGER DEFAULT 0,
  web_searches INTEGER DEFAULT 0,
  knowledge_acquired INTEGER DEFAULT 0,
  concepts_extracted INTEGER DEFAULT 0,
  total_memories INTEGER DEFAULT 0,
  short_term_memories INTEGER DEFAULT 0,
  long_term_memories INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);
```

**Índices:**
- `idx_daily_metrics_date` - Búsqueda por fecha

#### **4. important_logs** - Logs Importantes

```sql
CREATE TABLE important_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp INTEGER NOT NULL,
  level TEXT NOT NULL,
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);
```

**Índices:**
- `idx_logs_timestamp` - Búsqueda por fecha
- `idx_logs_level` - Búsqueda por nivel

---

## 💻 API del Módulo

### **Constructor**

```javascript
const persistence = new MetricsPersistence(dbPath);
```

**Parámetros:**
- `dbPath` (opcional): Ruta a la base de datos. Por defecto: `memory/metrics.db`

### **Métodos Principales**

#### **initialize()**

Inicializa la base de datos y crea las tablas.

```javascript
persistence.initialize();
```

#### **saveSession(sessionData)**

Guarda una sesión completa con sus sub-tareas.

```javascript
const success = persistence.saveSession({
  id: 'session_1234567890',
  timestamp: Date.now(),
  task: 'Crear validador de email',
  state: 'completed',
  duration: 180,
  plan: {
    subtasks: [
      {
        id: 'ST1',
        title: 'Investigar mejores prácticas',
        type: 'research',
        complexity: 'low',
        estimatedTime: 5,
        dependencies: []
      }
    ],
    estimation: {
      overallComplexity: 'medium',
      estimatedTimeMinutes: 15
    }
  },
  summary: {
    total: 1,
    successful: 1,
    failed: 0,
    corrected: 0,
    skipped: 0,
    averageScore: 95
  },
  results: [
    { subtask: 'ST1', success: true, score: 95 }
  ]
});
```

**Retorna:** `boolean` - Éxito de la operación

#### **getSessionHistory(options)**

Obtiene el historial de sesiones con filtros opcionales.

```javascript
const sessions = persistence.getSessionHistory({
  limit: 100,        // Máximo número de sesiones
  offset: 0,         // Paginación
  state: 'completed', // Filtrar por estado
  minScore: 85,      // Score mínimo
  fromDate: Date.now() - 7*24*60*60*1000, // Desde hace 7 días
  toDate: Date.now() // Hasta ahora
});
```

**Retorna:** `Array` - Sesiones enriquecidas con sub-tareas

#### **getSession(sessionId)**

Obtiene una sesión específica por ID.

```javascript
const session = persistence.getSession('session_1234567890');
```

**Retorna:** `Object|null` - Sesión o null si no existe

#### **getGlobalStats()**

Obtiene estadísticas globales agregadas.

```javascript
const stats = persistence.getGlobalStats();
// {
//   totalSessions: 10,
//   successfulSessions: 8,
//   averageScore: 87,
//   totalSubtasksCompleted: 45
// }
```

**Retorna:** `Object` - Estadísticas globales

#### **saveDailyMetrics(date, metrics)**

Guarda o actualiza métricas de un día específico.

```javascript
persistence.saveDailyMetrics('2025-11-10', {
  totalSessions: 5,
  successfulSessions: 4,
  averageScore: 88,
  totalSubtasks: 20,
  webSearches: 12,
  knowledgeAcquired: 25,
  conceptsExtracted: 15,
  totalMemories: 200,
  shortTermMemories: 80,
  longTermMemories: 120
});
```

**Retorna:** `boolean` - Éxito de la operación

#### **getDailyMetrics(fromDate, toDate)**

Obtiene métricas diarias en un rango.

```javascript
const metrics = persistence.getDailyMetrics('2025-11-01', '2025-11-10');
```

**Retorna:** `Array` - Array de métricas diarias

#### **saveLog(level, category, message, metadata)**

Guarda un log importante para auditoría.

```javascript
persistence.saveLog('error', 'execution', 'Subtarea falló', {
  sessionId: 'session_123',
  subtask: 'ST2',
  error: 'Syntax error'
});
```

**Niveles:** `info`, `warning`, `error`, `success`
**Categorías:** `task`, `plan`, `execution`, `verification`, `research`

**Retorna:** `boolean` - Éxito de la operación

#### **getLogs(options)**

Obtiene logs con filtros opcionales.

```javascript
const logs = persistence.getLogs({
  limit: 100,
  offset: 0,
  level: 'error',    // Filtrar por nivel
  category: 'execution', // Filtrar por categoría
  fromTimestamp: Date.now() - 24*60*60*1000,
  toTimestamp: Date.now()
});
```

**Retorna:** `Array` - Array de logs

#### **cleanOldData(retention)**

Limpia datos antiguos según políticas de retención.

```javascript
persistence.cleanOldData({
  sessions: 90,      // Retener sesiones de últimos 90 días
  logs: 30,          // Retener logs de últimos 30 días
  dailyMetrics: 365  // Retener métricas de último año
});
```

**Retorna:** `boolean` - Éxito de la operación

#### **close()**

Cierra la conexión a la base de datos.

```javascript
persistence.close();
```

---

## 🔌 Integración con Autonomous Agent

### **Inicialización**

En `autonomous-agent-manager.cjs`:

```javascript
const MetricsPersistence = require('../metrics-persistence.cjs');

class AutonomousAgentManager extends EventEmitter {
  constructor(options = {}) {
    super();

    // ... otros componentes

    // Sistema de persistencia
    this.metricsPersistence = new MetricsPersistence();
  }

  async initialize() {
    // ... otras inicializaciones

    this.metricsPersistence.initialize();

    console.log('✅ Sistema listo');
  }
}
```

### **Guardado Automático**

Al completar una tarea:

```javascript
async executeTask(taskDescription, context = {}) {
  // ... ejecución de la tarea

  // Guardar sesión en persistencia (SQLite)
  const sessionId = `session_${Date.now()}`;
  this.metricsPersistence.saveSession({
    id: sessionId,
    timestamp: Date.now(),
    task: taskDescription,
    state: 'completed',
    duration,
    plan: this.currentPlan,
    summary,
    results: this.sessionResults
  });
}
```

### **Consulta de Historial**

Nuevos métodos en `AutonomousAgentManager`:

```javascript
// Obtener historial de sesiones
getSessionHistory(options = {}) {
  return this.metricsPersistence.getSessionHistory(options);
}

// Obtener estadísticas con persistencia
async getStats() {
  const stats = this.metricsPersistence.getGlobalStats();

  return {
    ...stats,
    webIntelligenceStats: this.webIntelligence.getStats(),
    memoryStats: this.memoryManager.getStats()
  };
}

// Limpiar datos antiguos
cleanOldData(retention = {}) {
  return this.metricsPersistence.cleanOldData(retention);
}
```

---

## 🧪 Testing

### **Ejecutar Pruebas**

```bash
node test-metrics-persistence.cjs
```

### **Tests Incluidos**

1. ✅ Inicialización de DB
2. ✅ Guardar sesión con sub-tareas
3. ✅ Recuperar sesión por ID
4. ✅ Guardar múltiples sesiones
5. ✅ Obtener historial completo
6. ✅ Estadísticas globales
7. ✅ Guardar logs importantes
8. ✅ Recuperar logs con filtros
9. ✅ Métricas diarias
10. ✅ Filtros avanzados
11. ✅ Verificar tamaño de DB

### **Resultados Esperados**

```
🎉 TODOS LOS TESTS PASARON EXITOSAMENTE

📊 Resumen:
   ✅ Sesiones guardadas: 3
   ✅ Logs guardados: 3
   ✅ Métricas diarias: 1 día
   ✅ Tamaño de DB: 4.00 KB
   ✅ Score promedio: 84%
```

---

## 📊 Uso en Producción

### **Ubicación de la Base de Datos**

Por defecto: `memory/metrics.db`

```
jarvis-standalone/
├── memory/
│   ├── metrics.db          ← Base de datos de métricas
│   ├── jarvis-memory.db    ← Base de datos de memoria neural
│   └── web-intelligence/   ← Conocimiento de internet
```

### **Respaldo**

Simplemente copia el archivo `.db`:

```bash
# Backup diario
cp memory/metrics.db backups/metrics-$(date +%Y%m%d).db

# Restaurar
cp backups/metrics-20251110.db memory/metrics.db
```

### **Tamaño Esperado**

- **3 sesiones**: ~4 KB
- **100 sesiones**: ~130 KB
- **1000 sesiones**: ~1.3 MB

El tamaño crece linealmente con el número de sesiones.

### **Mantenimiento**

**Limpieza Automática (recomendado):**

```javascript
// Ejecutar semanalmente
agent.cleanOldData({
  sessions: 90,      // Retener 3 meses
  logs: 30,          // Retener 1 mes
  dailyMetrics: 365  // Retener 1 año
});
```

**Vacuum Manual:**

```bash
sqlite3 memory/metrics.db "VACUUM;"
```

---

## 📈 Casos de Uso

### **1. Dashboard en Tiempo Real**

```javascript
// Obtener últimas 10 sesiones
const recentSessions = agent.getSessionHistory({ limit: 10 });

// Mostrar en dashboard
recentSessions.forEach(session => {
  console.log(`${session.content.task} - Score: ${session.content.summary.averageScore}%`);
});
```

### **2. Análisis de Rendimiento**

```javascript
// Sesiones con score alto
const highScoreSessions = agent.getSessionHistory({ minScore: 90 });

// Sesiones del último mes
const lastMonth = Date.now() - (30 * 24 * 60 * 60 * 1000);
const recentSessions = agent.getSessionHistory({ fromDate: lastMonth });

// Estadísticas globales
const stats = await agent.getStats();
console.log(`Score promedio: ${stats.averageScore}%`);
console.log(`Tasa de éxito: ${stats.successfulSessions / stats.totalSessions * 100}%`);
```

### **3. Auditoría y Debugging**

```javascript
// Ver todos los errores
const errors = persistence.getLogs({ level: 'error' });

errors.forEach(log => {
  console.log(`[${new Date(log.timestamp).toISOString()}] ${log.message}`);
  console.log(`Metadata:`, JSON.parse(log.metadata));
});

// Ver sesión específica con problemas
const session = agent.getSession('session_1234567890');
console.log(`Tarea: ${session.content.task}`);
console.log(`Sub-tareas fallidas:`, session.content.plan.subtasks.filter(st => !st.success));
```

### **4. Reportes Diarios**

```javascript
// Generar reporte del día
const today = new Date().toISOString().split('T')[0];
const todaySessions = agent.getSessionHistory({
  fromDate: new Date(today).getTime(),
  toDate: Date.now()
});

console.log(`\n📊 Reporte de ${today}:`);
console.log(`   Sesiones completadas: ${todaySessions.length}`);
console.log(`   Score promedio: ${todaySessions.reduce((sum, s) => sum + s.content.summary.averageScore, 0) / todaySessions.length}%`);
console.log(`   Sub-tareas totales: ${todaySessions.reduce((sum, s) => sum + s.content.summary.total, 0)}`);
```

### **5. Machine Learning y Análisis**

```javascript
// Exportar datos para análisis
const allSessions = agent.getSessionHistory({ limit: 1000 });

// Analizar patrones de éxito
const successPatterns = allSessions
  .filter(s => s.content.summary.failed === 0)
  .map(s => ({
    complexity: s.content.plan.estimation.overallComplexity,
    subtaskCount: s.content.summary.total,
    duration: s.content.duration,
    score: s.content.summary.averageScore
  }));

console.log('Análisis de sesiones exitosas:', successPatterns);
```

---

## 🔒 Seguridad y Privacidad

### **Almacenamiento Local**

- ✅ Todos los datos se guardan localmente en `memory/metrics.db`
- ✅ No se envía nada a servicios externos
- ✅ Control total sobre tus datos

### **Sensibilidad de Datos**

La base de datos puede contener:
- Descripciones de tareas (potencialmente sensibles)
- Logs de errores (pueden revelar problemas de seguridad)
- Estructura de código (nombres de archivos, funciones)

**Recomendaciones:**
- No compartir el archivo `.db` públicamente
- Excluir de control de versiones (`.gitignore`)
- Encriptar backups si es necesario

---

## 🐛 Troubleshooting

### **Error: Database is locked**

```
SQLITE_BUSY: database is locked
```

**Solución:** Cierra otras conexiones o espera unos segundos.

### **Error: UNIQUE constraint failed**

```
SQLITE_CONSTRAINT_PRIMARYKEY
```

**Solución:** Estás intentando insertar un ID duplicado. Asegúrate de usar IDs únicos.

### **Base de datos corrupta**

```bash
# Verificar integridad
sqlite3 memory/metrics.db "PRAGMA integrity_check;"

# Si está corrupta, restaurar desde backup
cp backups/metrics-20251110.db memory/metrics.db
```

### **Queries lentas**

```sql
-- Analizar query
EXPLAIN QUERY PLAN SELECT * FROM sessions WHERE timestamp > ?;

-- Recrear índices
DROP INDEX idx_sessions_timestamp;
CREATE INDEX idx_sessions_timestamp ON sessions(timestamp DESC);
```

---

## 📚 Mejoras Futuras

### **Corto Plazo**

- [ ] Backup automático diario
- [ ] Compresión de DB antigua
- [ ] Export a JSON/CSV
- [ ] Logs estructurados con niveles

### **Medio Plazo**

- [ ] Sincronización multi-dispositivo
- [ ] API REST para consultas remotas
- [ ] Dashboard web con gráficos históricos
- [ ] Alertas cuando métricas caen

### **Largo Plazo**

- [ ] Machine Learning sobre datos históricos
- [ ] Predicción de éxito de tareas
- [ ] Recomendaciones de optimización
- [ ] Clustering de patrones

---

## 📊 Estructura de Datos

### **Sesión Enriquecida** (formato retornado por `getSessionHistory`)

```javascript
{
  id: "session_1234567890",
  timestamp: 1699876543210,
  content: {
    task: "Crear validador de email",
    plan: {
      subtasks: [
        {
          id: "ST1",
          title: "Investigar mejores prácticas",
          description: "Buscar en internet...",
          type: "research",
          complexity: "low",
          estimatedTime: 5,
          dependencies: []
        }
      ],
      estimation: {
        overallComplexity: "medium",
        estimatedTimeMinutes: 15
      }
    },
    summary: {
      total: 3,
      successful: 3,
      failed: 0,
      corrected: 0,
      skipped: 0,
      averageScore: 95
    },
    results: [
      {
        subtask: "ST1",
        success: true,
        score: 95,
        error: ""
      }
    ],
    duration: 180
  }
}
```

---

## ✨ Resumen

**JARVIS Metrics Persistence** es un sistema completo de almacenamiento persistente que:

- 💾 **Guarda permanentemente** todo el historial de sesiones
- 📊 **Proporciona estadísticas** agregadas y detalladas
- 🔍 **Permite consultas avanzadas** con filtros
- 🗄️ **Usa SQLite** ligero, rápido y confiable
- 📈 **Soporta análisis** histórico y tendencias
- 🧪 **Está probado** con 11 tests automatizados
- 🔌 **Se integra perfectamente** con el Autonomous Agent

**Tu historial ya no se pierde al reiniciar** 🚀

---

## 📞 Uso Rápido

```javascript
// Importar
const MetricsPersistence = require('./core/metrics-persistence.cjs');

// Crear instancia
const persistence = new MetricsPersistence();

// Inicializar
persistence.initialize();

// Guardar sesión
persistence.saveSession({
  id: `session_${Date.now()}`,
  timestamp: Date.now(),
  task: 'Mi tarea',
  state: 'completed',
  duration: 120,
  plan: { subtasks: [...], estimation: {...} },
  summary: { total: 3, successful: 3, ... },
  results: [...]
});

// Obtener historial
const sessions = persistence.getSessionHistory({ limit: 10 });

// Estadísticas
const stats = persistence.getGlobalStats();

// Cerrar
persistence.close();
```

---

**Creado con 💙 para que JARVIS nunca olvide nada**

**¡Tu agente autónomo ahora tiene memoria permanente!** 🤖💾✨
