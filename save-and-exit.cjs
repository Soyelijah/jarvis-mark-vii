#!/usr/bin/env node

/**
 * 💾 Save and Exit - J.A.R.V.I.S. MARK VII
 *
 * Script para guardar sesión con resumen personalizado antes de cerrar.
 * Uso: node save-and-exit.cjs
 *
 * @author J.A.R.V.I.S. MARK VII
 */

const { getMemoryLogger } = require('./core/auto-memory-logger.cjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function saveAndExit() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('💾 J.A.R.V.I.S. - Guardando sesión antes de cerrar');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const logger = getMemoryLogger();

  console.log('📝 Por favor proporciona un breve resumen de tu sesión:\n');

  // Preguntas opcionales
  const achievements = await question('✅ ¿Qué lograste hoy? (Enter para omitir): ');
  const pending = await question('📌 ¿Qué queda pendiente? (Enter para omitir): ');
  const notes = await question('💭 Notas adicionales (Enter para omitir): ');
  const nextPriority = await question('🎯 Próxima prioridad para mañana (Enter para omitir): ');

  console.log('\n💾 Guardando sesión...\n');

  const sessionData = {
    achievements: achievements ? achievements.split(',').map(s => s.trim()).filter(Boolean) : ['Sesión de trabajo completada'],
    pending_tasks: pending ? pending.split(',').map(s => s.trim()).filter(Boolean) : [],
    notes: notes || 'Sesión cerrada manualmente por usuario',
    user_mood: 'satisfied',
    next_priority: nextPriority || 'Continuar con tareas pendientes',
    manual_exit: true
  };

  await logger.endSession(sessionData);

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Sesión guardada exitosamente');
  console.log('🌙 Buenas noches, Señor. Descanse bien.');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  rl.close();
  process.exit(0);
}

// Ejecutar
saveAndExit().catch(error => {
  console.error('❌ Error al guardar:', error.message);
  process.exit(1);
});
