#!/usr/bin/env node

/**
 * 🚀 JARVIS Auto-Startup Hook
 *
 * Este script se ejecuta AUTOMÁTICAMENTE cuando Claude Code inicia
 * en el directorio jarvis-standalone.
 *
 * Funciones:
 * 1. Inicializa el sistema de memoria automática
 * 2. Carga el contexto de la sesión anterior
 * 3. Prepara el entorno para continuidad perfecta
 * 4. Presenta resumen al usuario
 *
 * @author J.A.R.V.I.S. MARK VII
 */

const fs = require('fs');
const path = require('path');

// Colores para terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

function loadMemoryState() {
  const statePath = path.join(__dirname, '..', '..', 'memory', 'context', 'CURRENT-STATE.json');

  if (!fs.existsSync(statePath)) {
    return null;
  }

  try {
    const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
    return state;
  } catch (error) {
    console.error('⚠️ Error loading memory state:', error.message);
    return null;
  }
}

function loadLastSession() {
  const sessionsDir = path.join(__dirname, '..', '..', 'memory', 'sessions');

  if (!fs.existsSync(sessionsDir)) {
    return null;
  }

  try {
    const files = fs.readdirSync(sessionsDir)
      .filter(f => f.endsWith('.json'))
      .map(f => ({
        name: f,
        path: path.join(sessionsDir, f),
        mtime: fs.statSync(path.join(sessionsDir, f)).mtime
      }))
      .sort((a, b) => b.mtime - a.mtime);

    if (files.length === 0) {
      return null;
    }

    const lastSession = JSON.parse(fs.readFileSync(files[0].path, 'utf8'));
    return lastSession;
  } catch (error) {
    console.error('⚠️ Error loading last session:', error.message);
    return null;
  }
}

function displayWelcome() {
  console.log('\n' + '='.repeat(60));
  log('🧠 J.A.R.V.I.S. MARK VII - Sistema de Memoria Automática', 'bright');
  console.log('='.repeat(60) + '\n');

  const state = loadMemoryState();
  const lastSession = loadLastSession();

  if (!state && !lastSession) {
    log('✨ Primera vez que nos encontramos. Iniciando memoria limpia...', 'cyan');
    log('📝 Todo será capturado automáticamente desde ahora.\n', 'green');
    return;
  }

  log('🔄 Cargando memoria de sesión anterior...', 'cyan');
  console.log();

  if (state) {
    log('📊 Estado del Sistema:', 'bright');
    log(`   • Última actualización: ${new Date(state.last_updated).toLocaleString()}`, 'blue');
    log(`   • Total de sesiones: ${state.total_sessions || 0}`, 'blue');
    log(`   • Comandos ejecutados: ${state.total_commands || 0}`, 'blue');
    log(`   • Archivos modificados: ${state.total_files_modified || 0}`, 'blue');
    console.log();
  }

  if (lastSession) {
    log('📂 Última Sesión:', 'bright');
    log(`   • ID: ${lastSession.session_id}`, 'magenta');
    log(`   • Duración: ${lastSession.duration_minutes || 0} minutos`, 'magenta');
    log(`   • Comandos: ${lastSession.commands_executed || 0}`, 'magenta');
    log(`   • Archivos: ${lastSession.files_modified?.length || 0}`, 'magenta');
    log(`   • Decisiones: ${lastSession.decisions_made || 0}`, 'magenta');
    console.log();

    if (lastSession.decisions && lastSession.decisions.length > 0) {
      const lastDecision = lastSession.decisions[lastSession.decisions.length - 1];
      log('💡 Última Decisión Importante:', 'bright');
      log(`   "${lastDecision.decision}"`, 'yellow');
      if (lastDecision.rationale) {
        log(`   Razón: ${lastDecision.rationale}`, 'yellow');
      }
      console.log();
    }

    if (lastSession.context_for_next_session?.pending_tasks) {
      const tasks = lastSession.context_for_next_session.pending_tasks;
      if (tasks.length > 0) {
        log('📌 Tareas Pendientes:', 'bright');
        tasks.forEach((task, i) => {
          log(`   ${i + 1}. ${task}`, 'green');
        });
        console.log();
      }
    }

    if (lastSession.context_for_next_session?.next_priority) {
      log('🎯 Próxima Prioridad:', 'bright');
      log(`   ${lastSession.context_for_next_session.next_priority}`, 'cyan');
      console.log();
    }
  }

  log('✅ Memoria cargada completamente. Continuidad activada.', 'green');
  log('🤖 J.A.R.V.I.S. listo para continuar donde quedamos.\n', 'bright');

  console.log('='.repeat(60) + '\n');
}

// Main execution
if (require.main === module) {
  displayWelcome();
}

module.exports = { loadMemoryState, loadLastSession, displayWelcome };
