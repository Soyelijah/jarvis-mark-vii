// core/proactive/proactive-agent.cjs
// Agente proactivo principal que orquesta file watching, análisis y notificaciones

const FileWatcher = require('./file-watcher.cjs');
const AIAnalyzer = require('./ai-analyzer.cjs');
const { EventEmitter } = require('events');

class ProactiveAgent extends EventEmitter {
  constructor(options = {}) {
    super();

    this.projectRoot = options.projectRoot || process.cwd();
    this.enabled = options.enabled !== false;

    // Componentes
    this.fileWatcher = new FileWatcher({
      rootPath: this.projectRoot,
      ignorePaths: options.ignorePaths,
      debounceTime: options.debounceTime || 1000
    });

    this.aiAnalyzer = new AIAnalyzer({
      ollamaUrl: options.ollamaUrl,
      model: options.model
    });

    // Estado
    this.isRunning = false;
    this.startTime = null;

    // Configuración
    this.config = {
      autoAnalyze: options.autoAnalyze !== false,
      notifyOnBugs: options.notifyOnBugs !== false,
      notifyOnSecurity: options.notifyOnSecurity !== false,
      notifyOnPerformance: options.notifyOnPerformance !== false,
      minSeverity: options.minSeverity || 'medium' // low, medium, high, critical
    };

    // Estadísticas globales
    this.stats = {
      filesMonitored: 0,
      changesDetected: 0,
      analysisPerformed: 0,
      issuesFound: 0,
      notificationsSent: 0
    };

    this.setupEventListeners();
  }

  /**
   * Configura listeners entre componentes
   */
  setupEventListeners() {
    // File Watcher Events
    this.fileWatcher.on('ready', (data) => {
      this.stats.filesMonitored = data.filesWatched;
      console.log(`✅ [Proactive Agent] Monitoreo activo en ${data.filesWatched} archivos`);
      this.emit('ready', data);
    });

    this.fileWatcher.on('file:changed', (data) => {
      this.stats.changesDetected++;
      this.handleFileChange(data);
    });

    this.fileWatcher.on('analysis:required', (data) => {
      if (this.config.autoAnalyze) {
        this.aiAnalyzer.queueAnalysis(data);
      }
    });

    // AI Analyzer Events
    this.aiAnalyzer.on('analysis:complete', (data) => {
      this.stats.analysisPerformed++;
      this.handleAnalysisComplete(data);
    });

    this.aiAnalyzer.on('analysis:error', (data) => {
      console.error(`❌ [Proactive Agent] Error en análisis: ${data.path}`);
    });
  }

  /**
   * Inicia el agente proactivo
   */
  async start() {
    if (this.isRunning) {
      console.log('⚠️ [Proactive Agent] Ya está ejecutándose');
      return;
    }

    console.log('🚀 [Proactive Agent] Iniciando modo proactivo...');
    console.log(`📁 [Proactive Agent] Proyecto: ${this.projectRoot}`);
    console.log(`🤖 [Proactive Agent] Auto-análisis: ${this.config.autoAnalyze ? 'Activado' : 'Desactivado'}`);

    this.isRunning = true;
    this.startTime = Date.now();

    // Iniciar file watcher
    this.fileWatcher.start();

    // Limpiar cache periódicamente
    setInterval(() => {
      this.aiAnalyzer.cleanCache();
    }, 10 * 60 * 1000); // Cada 10 minutos

    this.emit('started');
  }

  /**
   * Detiene el agente proactivo
   */
  async stop() {
    if (!this.isRunning) {
      console.log('⚠️ [Proactive Agent] No está ejecutándose');
      return;
    }

    console.log('🛑 [Proactive Agent] Deteniendo modo proactivo...');

    this.isRunning = false;

    await this.fileWatcher.stop();

    this.emit('stopped');

    console.log('✅ [Proactive Agent] Modo proactivo detenido');
  }

  /**
   * Maneja cambio de archivo
   */
  handleFileChange(data) {
    const { path, changeType, info } = data;

    console.log(`📝 [Proactive Agent] Cambio detectado: ${path} (${changeType})`);

    // Emitir para UI
    this.emit('file:changed', {
      path,
      changeType,
      complexity: info.complexity,
      hasErrors: info.hasErrors
    });
  }

  /**
   * Maneja resultado de análisis
   */
  handleAnalysisComplete(data) {
    const { path, analysis, priority } = data;

    console.log(`✨ [Proactive Agent] Análisis completado: ${path}`);
    console.log(`   📊 Bugs: ${analysis.bugs.length}`);
    console.log(`   🔒 Security: ${analysis.security.length}`);
    console.log(`   ⚡ Performance: ${analysis.performance.length}`);
    console.log(`   💡 Improvements: ${analysis.improvements.length}`);

    // Contar issues
    const totalIssues = analysis.bugs.length + analysis.security.length + analysis.performance.length;
    this.stats.issuesFound += totalIssues;

    // Determinar si notificar
    const shouldNotify = this.shouldNotify(analysis, priority);

    if (shouldNotify) {
      this.sendNotification(path, analysis, priority);
    }

    // Emitir para UI/logging
    this.emit('analysis:complete', {
      path,
      analysis,
      priority,
      timestamp: Date.now()
    });
  }

  /**
   * Determina si debe enviar notificación
   */
  shouldNotify(analysis, priority) {
    // Siempre notificar issues críticos de seguridad
    if (analysis.security.some(issue => issue.severity === 'critical')) {
      return true;
    }

    // Notificar bugs de alta severidad
    if (this.config.notifyOnBugs && analysis.bugs.some(bug => bug.severity === 'high')) {
      return true;
    }

    // Notificar problemas de seguridad (según config)
    if (this.config.notifyOnSecurity && analysis.security.length > 0) {
      return true;
    }

    // Notificar problemas de performance (según config)
    if (this.config.notifyOnPerformance && analysis.performance.length > 0) {
      return true;
    }

    // No notificar si no hay issues significativos
    return false;
  }

  /**
   * Envía notificación
   */
  sendNotification(path, analysis, priority) {
    const notification = this.buildNotification(path, analysis, priority);

    console.log(`\n${'='.repeat(60)}`);
    console.log(`🔔 JARVIS PROACTIVE ALERT`);
    console.log(`${'='.repeat(60)}`);
    console.log(`📄 Archivo: ${path}`);
    console.log(`⚠️ Prioridad: ${priority.toUpperCase()}`);
    console.log(`\n${notification.message}`);
    console.log(`${'='.repeat(60)}\n`);

    this.stats.notificationsSent++;

    // Emitir para UI
    this.emit('notification', notification);
  }

  /**
   * Construye notificación formateada
   */
  buildNotification(path, analysis, priority) {
    let message = '';

    // Security issues
    if (analysis.security.length > 0) {
      message += `🔒 **Security Issues (${analysis.security.length})**\n`;
      analysis.security.slice(0, 3).forEach(issue => {
        message += `   [${issue.severity.toUpperCase()}] Línea ${issue.line}: ${issue.issue}\n`;
        message += `   ➜ Fix: ${issue.fix}\n`;
      });
      message += '\n';
    }

    // Bugs
    if (analysis.bugs.length > 0) {
      message += `🐛 **Bugs Detectados (${analysis.bugs.length})**\n`;
      analysis.bugs.slice(0, 3).forEach(bug => {
        message += `   [${bug.severity.toUpperCase()}] Línea ${bug.line}: ${bug.description}\n`;
        message += `   ➜ ${bug.suggestion}\n`;
      });
      message += '\n';
    }

    // Performance
    if (analysis.performance.length > 0) {
      message += `⚡ **Performance Issues (${analysis.performance.length})**\n`;
      analysis.performance.slice(0, 2).forEach(perf => {
        message += `   [${perf.impact.toUpperCase()}] Línea ${perf.line}: ${perf.problem}\n`;
        message += `   ➜ ${perf.solution}\n`;
      });
      message += '\n';
    }

    // Summary
    message += `📝 ${analysis.summary}`;

    return {
      path,
      priority,
      message,
      analysis,
      timestamp: Date.now()
    };
  }

  /**
   * Obtiene estadísticas globales
   */
  getStats() {
    return {
      ...this.stats,
      uptime: this.isRunning ? Date.now() - this.startTime : 0,
      fileWatcher: this.fileWatcher.getStats(),
      aiAnalyzer: this.aiAnalyzer.getStats()
    };
  }

  /**
   * Actualiza configuración
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    console.log('⚙️ [Proactive Agent] Configuración actualizada:', this.config);
  }

  /**
   * Fuerza análisis de un archivo específico
   */
  async analyzeFile(filePath) {
    console.log(`🔍 [Proactive Agent] Análisis manual solicitado: ${filePath}`);

    const fileData = {
      path: filePath,
      fullPath: require('path').join(this.projectRoot, filePath),
      info: { type: 'manual', extension: require('path').extname(filePath) },
      changeType: 'manual',
      priority: 'high'
    };

    return await this.aiAnalyzer.analyzeFile(fileData);
  }
}

module.exports = ProactiveAgent;
