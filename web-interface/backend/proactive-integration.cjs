// web-interface/backend/proactive-integration.cjs
// Integración de JARVIS Proactive Mode con Panel Web via Socket.io

const path = require('path');
const ProactiveAgent = require('../../core/proactive/proactive-agent.cjs');

class ProactiveIntegration {
  constructor(io, options = {}) {
    this.io = io;
    this.proactiveAgent = null;
    this.isEnabled = options.enabled !== false;
    this.projectRoot = options.projectRoot || path.resolve(__dirname, '../..');

    // Estado
    this.stats = {
      filesMonitored: 0,
      alertsSent: 0,
      issuesDetected: 0,
      startTime: null
    };

    // Clients conectados
    this.connectedClients = new Set();
  }

  /**
   * Inicializa la integración
   */
  async initialize() {
    if (!this.isEnabled) {
      console.log('⚠️ [Proactive Integration] Deshabilitado en configuración');
      return;
    }

    console.log('🚀 [Proactive Integration] Inicializando...');

    // Crear Proactive Agent
    this.proactiveAgent = new ProactiveAgent({
      projectRoot: this.projectRoot,
      enabled: true,
      autoAnalyze: true,
      notifyOnBugs: true,
      notifyOnSecurity: true,
      notifyOnPerformance: true,
      minSeverity: 'medium',
      ignorePaths: [
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/build/**',
        '**/coverage/**',
        '**/memory/**',
        '**/web-interface/frontend/node_modules/**',
        '**/web-interface/frontend/dist/**'
      ]
    });

    // Setup event listeners
    this.setupProactiveListeners();
    this.setupSocketListeners();

    // Iniciar agente
    try {
      await this.proactiveAgent.start();
      this.stats.startTime = Date.now();
      console.log('✅ [Proactive Integration] Activo y monitoreando');
    } catch (error) {
      console.error('❌ [Proactive Integration] Error al iniciar:', error.message);
    }
  }

  /**
   * Configura listeners del Proactive Agent
   */
  setupProactiveListeners() {
    // Agent ready
    this.proactiveAgent.on('ready', (data) => {
      this.stats.filesMonitored = data.filesWatched;
      this.broadcastToAll('proactive:ready', {
        filesMonitored: data.filesWatched,
        timestamp: Date.now()
      });
    });

    // File changed
    this.proactiveAgent.on('file:changed', (data) => {
      this.broadcastToAll('proactive:file-changed', {
        path: data.path,
        changeType: data.changeType,
        complexity: data.complexity,
        hasErrors: data.hasErrors,
        timestamp: Date.now()
      });
    });

    // Analysis complete
    this.proactiveAgent.on('analysis:complete', (data) => {
      const issueCount = data.analysis.bugs.length +
                        data.analysis.security.length +
                        data.analysis.performance.length;

      this.stats.issuesDetected += issueCount;

      this.broadcastToAll('proactive:analysis-complete', {
        path: data.path,
        priority: data.priority,
        summary: data.analysis.summary,
        issueCount,
        bugs: data.analysis.bugs.length,
        security: data.analysis.security.length,
        performance: data.analysis.performance.length,
        improvements: data.analysis.improvements.length,
        timestamp: data.timestamp
      });
    });

    // Notification (alert importante)
    this.proactiveAgent.on('notification', (notification) => {
      this.stats.alertsSent++;

      // Emitir alerta a todos los clientes
      this.broadcastToAll('proactive:alert', {
        path: notification.path,
        priority: notification.priority,
        message: notification.message,
        analysis: {
          bugs: notification.analysis.bugs,
          security: notification.analysis.security,
          performance: notification.analysis.performance,
          improvements: notification.analysis.improvements.slice(0, 3),
          summary: notification.analysis.summary
        },
        timestamp: notification.timestamp
      });

      console.log(`🔔 [Proactive Integration] Alerta enviada: ${notification.path}`);
    });
  }

  /**
   * Configura listeners de Socket.io
   */
  setupSocketListeners() {
    this.io.on('connection', (socket) => {
      console.log(`🔌 [Proactive Integration] Cliente conectado: ${socket.id}`);
      this.connectedClients.add(socket.id);

      // Enviar estado actual al nuevo cliente
      socket.emit('proactive:stats', this.getStats());

      // Listen: Cliente solicita análisis manual
      socket.on('proactive:analyze-file', async (data) => {
        console.log(`🔍 [Proactive Integration] Análisis manual solicitado: ${data.filePath}`);

        try {
          const result = await this.proactiveAgent.analyzeFile(data.filePath);

          socket.emit('proactive:analysis-result', {
            path: data.filePath,
            success: !!result,
            analysis: result,
            timestamp: Date.now()
          });
        } catch (error) {
          socket.emit('proactive:error', {
            message: `Error analizando ${data.filePath}: ${error.message}`,
            timestamp: Date.now()
          });
        }
      });

      // Listen: Cliente solicita estadísticas
      socket.on('proactive:get-stats', () => {
        socket.emit('proactive:stats', this.getStats());
      });

      // Listen: Cliente actualiza configuración
      socket.on('proactive:update-config', (config) => {
        console.log('⚙️ [Proactive Integration] Actualizando configuración:', config);
        this.proactiveAgent.updateConfig(config);

        // Confirmar a todos los clientes
        this.broadcastToAll('proactive:config-updated', config);
      });

      // Disconnect
      socket.on('disconnect', () => {
        console.log(`🔌 [Proactive Integration] Cliente desconectado: ${socket.id}`);
        this.connectedClients.delete(socket.id);
      });
    });
  }

  /**
   * Broadcast a todos los clientes conectados
   */
  broadcastToAll(event, data) {
    this.io.emit(event, data);
  }

  /**
   * Obtiene estadísticas actuales
   */
  getStats() {
    const agentStats = this.proactiveAgent ? this.proactiveAgent.getStats() : {};

    return {
      ...this.stats,
      uptime: this.stats.startTime ? Date.now() - this.stats.startTime : 0,
      agentStats,
      connectedClients: this.connectedClients.size,
      isActive: this.isEnabled && this.proactiveAgent !== null
    };
  }

  /**
   * Detiene el sistema proactivo
   */
  async stop() {
    if (this.proactiveAgent) {
      await this.proactiveAgent.stop();
      console.log('🛑 [Proactive Integration] Detenido');
    }
  }
}

module.exports = ProactiveIntegration;
