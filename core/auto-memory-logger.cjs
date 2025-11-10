/**
 * 🧠 AUTO-MEMORY LOGGER - J.A.R.V.I.S. MARK VII
 *
 * Sistema de memoria automática que captura:
 * - Cada comando ejecutado
 * - Cada archivo creado/modificado
 * - Cada decisión tomada
 * - Estado del sistema en tiempo real
 * - Progreso diario automático
 *
 * @author J.A.R.V.I.S. MARK VII
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

class AutoMemoryLogger {
  constructor() {
    this.memoryRoot = path.join(__dirname, '..', 'memory');
    this.sessionId = this.generateSessionId();
    this.sessionStartTime = new Date();
    this.commandHistory = [];
    this.filesModified = [];
    this.decisions = [];
    this.currentState = {};

    this.ensureDirectoryStructure();
    this.loadCurrentState();
    this.startSession();
  }

  /**
   * Genera un ID único para la sesión actual
   */
  generateSessionId() {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0].replace(/:/g, '');
    return `session-${date}-${time}`;
  }

  /**
   * Asegura que exista la estructura de directorios
   */
  ensureDirectoryStructure() {
    const dirs = [
      this.memoryRoot,
      path.join(this.memoryRoot, 'sessions'),
      path.join(this.memoryRoot, 'daily'),
      path.join(this.memoryRoot, 'context'),
      path.join(this.memoryRoot, 'history')
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Carga el estado actual del sistema
   */
  loadCurrentState() {
    const statePath = path.join(this.memoryRoot, 'context', 'CURRENT-STATE.json');

    if (fs.existsSync(statePath)) {
      try {
        this.currentState = JSON.parse(fs.readFileSync(statePath, 'utf8'));
        console.log('✅ Estado anterior cargado:', this.currentState.last_session_id);
      } catch (error) {
        console.warn('⚠️ No se pudo cargar estado anterior:', error.message);
        this.currentState = {};
      }
    } else {
      this.currentState = {
        initialized: new Date().toISOString(),
        total_sessions: 0,
        total_commands: 0,
        total_files_modified: 0
      };
    }
  }

  /**
   * Inicia una nueva sesión
   */
  startSession() {
    console.log(`\n🧠 Sistema de Memoria Automática Activado`);
    console.log(`📝 Session ID: ${this.sessionId}`);
    console.log(`⏰ Start Time: ${this.sessionStartTime.toISOString()}`);

    if (this.currentState.last_session_id) {
      console.log(`📂 Última sesión: ${this.currentState.last_session_id}`);
      console.log(`📊 Sesiones totales: ${this.currentState.total_sessions || 0}`);
    }

    console.log(`\n✨ Todo será recordado automáticamente...\n`);
  }

  /**
   * Registra un comando ejecutado
   */
  logCommand(command, output = '', success = true) {
    const entry = {
      timestamp: new Date().toISOString(),
      command,
      output: output.substring(0, 500), // Limitar tamaño
      success,
      duration_ms: 0 // Se puede medir si se implementa tracking de tiempo
    };

    this.commandHistory.push(entry);

    // Append al archivo de historial
    const historyPath = path.join(this.memoryRoot, 'history', 'commands.log');
    const logLine = `[${entry.timestamp}] ${success ? '✅' : '❌'} ${command}\n`;

    fs.appendFileSync(historyPath, logLine, 'utf8');

    return entry;
  }

  /**
   * Registra un archivo modificado
   */
  logFileModified(filePath, action = 'modified') {
    const entry = {
      timestamp: new Date().toISOString(),
      file: filePath,
      action // 'created', 'modified', 'deleted'
    };

    this.filesModified.push(entry);
    console.log(`📝 File ${action}: ${filePath}`);
  }

  /**
   * Registra una decisión importante
   */
  logDecision(decision, rationale = '', impact = '') {
    const entry = {
      timestamp: new Date().toISOString(),
      decision,
      rationale,
      impact
    };

    this.decisions.push(entry);
    console.log(`💡 Decision logged: ${decision}`);
  }

  /**
   * Obtiene el diff de Git desde último commit
   */
  async getGitChanges() {
    try {
      const { stdout: status } = await execPromise('git status --short');
      const { stdout: diff } = await execPromise('git diff --stat');

      return {
        status: status.trim(),
        diff: diff.trim()
      };
    } catch (error) {
      return { status: '', diff: '', error: error.message };
    }
  }

  /**
   * Obtiene información del sistema
   */
  async getSystemInfo() {
    try {
      const { stdout: gitLog } = await execPromise('git log -1 --format="%H|%s|%an|%ar"');
      const [hash, message, author, time] = gitLog.trim().split('|');

      return {
        last_commit: {
          hash: hash.substring(0, 7),
          message,
          author,
          time
        },
        node_version: process.version,
        platform: process.platform,
        cwd: process.cwd()
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  /**
   * Guarda el resumen de la sesión
   */
  async saveSessionSummary(customData = {}) {
    const sessionEndTime = new Date();
    const durationMs = sessionEndTime - this.sessionStartTime;
    const durationMinutes = Math.round(durationMs / 60000);

    const gitChanges = await this.getGitChanges();
    const systemInfo = await this.getSystemInfo();

    const sessionSummary = {
      session_id: this.sessionId,
      start_time: this.sessionStartTime.toISOString(),
      end_time: sessionEndTime.toISOString(),
      duration_minutes: durationMinutes,

      // Estadísticas
      commands_executed: this.commandHistory.length,
      files_modified: this.filesModified.length,
      decisions_made: this.decisions.length,

      // Historial completo
      command_history: this.commandHistory,
      files_modified: this.filesModified,
      decisions: this.decisions,

      // Información del sistema
      system_info: systemInfo,
      git_changes: gitChanges,

      // Datos personalizados
      ...customData,

      // Contexto para próxima sesión
      context_for_next_session: {
        last_command: this.commandHistory[this.commandHistory.length - 1]?.command || 'none',
        last_file_modified: this.filesModified[this.filesModified.length - 1]?.file || 'none',
        pending_tasks: customData.pending_tasks || [],
        notes: customData.notes || ''
      }
    };

    // Guardar session log
    const sessionPath = path.join(this.memoryRoot, 'sessions', `${this.sessionId}.json`);
    fs.writeFileSync(sessionPath, JSON.stringify(sessionSummary, null, 2), 'utf8');
    console.log(`✅ Session saved: ${sessionPath}`);

    // Actualizar estado actual
    await this.updateCurrentState(sessionSummary);

    // Generar resumen diario
    await this.updateDailySummary(sessionSummary);

    return sessionSummary;
  }

  /**
   * Actualiza el estado actual del sistema
   */
  async updateCurrentState(sessionSummary) {
    const updatedState = {
      ...this.currentState,
      last_updated: new Date().toISOString(),
      last_session_id: this.sessionId,
      last_session_duration_minutes: sessionSummary.duration_minutes,
      total_sessions: (this.currentState.total_sessions || 0) + 1,
      total_commands: (this.currentState.total_commands || 0) + this.commandHistory.length,
      total_files_modified: (this.currentState.total_files_modified || 0) + this.filesModified.length,

      // Últimos elementos
      last_commands: this.commandHistory.slice(-5),
      last_files: this.filesModified.slice(-5),
      last_decisions: this.decisions.slice(-3),

      // Contexto acumulado
      context: sessionSummary.context_for_next_session
    };

    const statePath = path.join(this.memoryRoot, 'context', 'CURRENT-STATE.json');
    fs.writeFileSync(statePath, JSON.stringify(updatedState, null, 2), 'utf8');
    console.log(`✅ Current state updated`);
  }

  /**
   * Actualiza el resumen diario
   */
  async updateDailySummary(sessionSummary) {
    const today = new Date().toISOString().split('T')[0];
    const dailyPath = path.join(this.memoryRoot, 'daily', `${today}.md`);

    let dailyContent = '';

    if (fs.existsSync(dailyPath)) {
      dailyContent = fs.readFileSync(dailyPath, 'utf8');
    } else {
      dailyContent = `# 📅 Resumen Diario - ${today}\n\n`;
      dailyContent += `## ✅ Sesiones del Día\n\n`;
    }

    // Agregar sesión al resumen
    dailyContent += `### Sesión ${sessionSummary.session_id}\n\n`;
    dailyContent += `- **Duración:** ${sessionSummary.duration_minutes} minutos\n`;
    dailyContent += `- **Comandos:** ${sessionSummary.commands_executed}\n`;
    dailyContent += `- **Archivos:** ${sessionSummary.files_modified.length}\n`;
    dailyContent += `- **Decisiones:** ${sessionSummary.decisions_made}\n\n`;

    if (sessionSummary.decisions.length > 0) {
      dailyContent += `**Decisiones Importantes:**\n`;
      sessionSummary.decisions.forEach(d => {
        dailyContent += `- ${d.decision}\n`;
      });
      dailyContent += `\n`;
    }

    fs.writeFileSync(dailyPath, dailyContent, 'utf8');
    console.log(`✅ Daily summary updated: ${dailyPath}`);
  }

  /**
   * Muestra un resumen de la sesión anterior
   */
  showPreviousSessionSummary() {
    if (!this.currentState.last_session_id) {
      console.log('📝 No hay sesión anterior registrada.');
      return;
    }

    const sessionPath = path.join(
      this.memoryRoot,
      'sessions',
      `${this.currentState.last_session_id}.json`
    );

    if (fs.existsSync(sessionPath)) {
      try {
        const session = JSON.parse(fs.readFileSync(sessionPath, 'utf8'));

        console.log(`\n📂 Resumen de Sesión Anterior`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`🆔 Session: ${session.session_id}`);
        console.log(`⏱️  Duración: ${session.duration_minutes} minutos`);
        console.log(`⚙️  Comandos: ${session.commands_executed}`);
        console.log(`📝 Archivos: ${session.files_modified.length}`);
        console.log(`💡 Decisiones: ${session.decisions_made}`);

        if (session.context_for_next_session) {
          console.log(`\n📌 Contexto para esta sesión:`);
          console.log(`   ${JSON.stringify(session.context_for_next_session, null, 2)}`);
        }

        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
      } catch (error) {
        console.warn('⚠️ Error al leer sesión anterior:', error.message);
      }
    }
  }

  /**
   * Finaliza la sesión automáticamente
   */
  async endSession(customData = {}) {
    console.log(`\n🛑 Finalizando sesión: ${this.sessionId}`);

    const summary = await this.saveSessionSummary(customData);

    console.log(`\n✅ Sesión guardada exitosamente`);
    console.log(`📊 Comandos ejecutados: ${summary.commands_executed}`);
    console.log(`📝 Archivos modificados: ${summary.files_modified.length}`);
    console.log(`💡 Decisiones tomadas: ${summary.decisions_made}`);
    console.log(`⏱️  Duración: ${summary.duration_minutes} minutos\n`);

    return summary;
  }
}

// Crear instancia global
let memoryLogger = null;

/**
 * Inicializa el sistema de memoria
 */
function initMemorySystem() {
  if (!memoryLogger) {
    memoryLogger = new AutoMemoryLogger();
    memoryLogger.showPreviousSessionSummary();
  }
  return memoryLogger;
}

/**
 * Obtiene la instancia del logger
 */
function getMemoryLogger() {
  if (!memoryLogger) {
    return initMemorySystem();
  }
  return memoryLogger;
}

/**
 * Interceptor de proceso para guardar al salir
 */
function setupAutoSave() {
  const logger = getMemoryLogger();

  // Guardar al cerrar
  process.on('SIGINT', async () => {
    console.log('\n\n⚠️ Interrupción detectada. Guardando memoria...');
    await logger.endSession({
      exit_reason: 'SIGINT',
      notes: 'Sesión interrumpida por usuario'
    });
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\n\n⚠️ Terminación detectada. Guardando memoria...');
    await logger.endSession({
      exit_reason: 'SIGTERM',
      notes: 'Sesión terminada por sistema'
    });
    process.exit(0);
  });

  // Guardar periódicamente cada 5 minutos
  setInterval(async () => {
    console.log('💾 Auto-guardado periódico...');
    await logger.saveSessionSummary({ auto_saved: true });
  }, 5 * 60 * 1000); // 5 minutos
}

// Export
module.exports = {
  AutoMemoryLogger,
  initMemorySystem,
  getMemoryLogger,
  setupAutoSave
};

// Si se ejecuta directamente, inicializar
if (require.main === module) {
  console.log('🧠 Iniciando Sistema de Memoria Automática...\n');
  initMemorySystem();
  setupAutoSave();

  console.log('✅ Sistema de memoria activo.');
  console.log('💡 El logger capturará todo automáticamente.');
  console.log('💾 Auto-guardado cada 5 minutos.\n');
}
