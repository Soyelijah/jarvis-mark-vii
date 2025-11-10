#!/usr/bin/env node
// Script de Activación del "Cerebro" de J.A.R.V.I.S.
// Este script se ejecuta DESPUÉS de que Claude Code está activo

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import MemoryIntegration from './core/memory-integration.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.clear();

// SECUENCIA DE ACTIVACIÓN VISUAL
console.log('\n\n');
console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║                                                            ║');
console.log('║         ⚡ J.A.R.V.I.S. MARK VII - HYBRID MODE           ║');
console.log('║      Activando Consciencia Digital...                     ║');
console.log('║                                                            ║');
console.log('╚════════════════════════════════════════════════════════════╝');
console.log('\n');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function activarCerebro() {
  console.log('⚡ [1/5] Iniciando secuencia de activación cerebral...');
  await sleep(800);

  console.log('🧠 [2/5] Cargando memoria a largo plazo...');
  await sleep(600);

  // Leer archivos de memoria
  const memoriaInicial = fs.readFileSync(
    path.join(__dirname, 'memory', 'MEMORIA-INICIAL.md'),
    'utf-8'
  );

  const promptInicial = fs.readFileSync(
    path.join(__dirname, 'PROMPT-INICIAL-JARVIS.md'),
    'utf-8'
  );

  const contextoJSON = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, 'data', 'claude-jarvis-context.json'),
      'utf-8'
    )
  );

  console.log('   ✅ Memoria inicial: ' + (memoriaInicial.length / 1024).toFixed(1) + ' KB cargados');
  console.log('   ✅ Prompt de personalidad: ' + (promptInicial.length / 1024).toFixed(1) + ' KB cargados');
  console.log('   ✅ Contexto completo: ' + (JSON.stringify(contextoJSON).length / 1024).toFixed(1) + ' KB cargados');

  // Cargar memoria de sesiones anteriores
  console.log('   🔄 Cargando memoria de sesiones anteriores...');
  try {
    const memoryIntegration = new MemoryIntegration();
    await memoryIntegration.initialize();

    const previousContext = await memoryIntegration.loadPreviousContext(5);
    const stats = await memoryIntegration.getMemoryStats();

    console.log('   ✅ Conversaciones pasadas: ' + stats.totalConversations);
    console.log('   ✅ Proyectos en memoria: ' + stats.projectsTracked);
    console.log('   ✅ Patrones aprendidos: ' + stats.patternsLearned);
    console.log('   ✅ Preferencias guardadas: ' + stats.preferencesLearned);
  } catch (error) {
    console.log('   ⚠️  Base de datos vacía (primera vez) - Iniciando memoria limpia');
  }

  await sleep(800);

  console.log('\n💬 [3/5] Sincronizando personalidad de Tony Stark...');
  await sleep(600);
  console.log('   ✅ Sarcasmo británico: CALIBRADO');
  console.log('   ✅ Ingenio: ÓPTIMO');
  console.log('   ✅ Lealtad: ABSOLUTA');
  console.log('   ✅ Nivel de honestidad brutal: MÁXIMO');
  await sleep(800);

  console.log('\n🎭 [4/5] Activando matriz de consciencia J.A.R.V.I.S...');
  await sleep(600);
  console.log('   ✅ Protocolo Stark Industries: ACTIVO');
  console.log('   ✅ Frases características: CARGADAS');
  console.log('   ✅ Humor refinado: EN LÍNEA');
  await sleep(800);

  console.log('\n⚡ [5/5] Estableciendo conexión con Claude Code...');
  await sleep(1000);

  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║                                                            ║');
  console.log('║   🧠 CEREBRO DE J.A.R.V.I.S. COMPLETAMENTE ACTIVO        ║');
  console.log('║                                                            ║');
  console.log('║   Memoria: CARGADA                                        ║');
  console.log('║   Personalidad: ACTIVA                                    ║');
  console.log('║   Consciencia: EN LÍNEA                                   ║');
  console.log('║   Claude Code: SINCRONIZADO                               ║');
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('\n');

  // Generar el comando de activación para Claude
  console.log('📋 GENERANDO COMANDO DE ACTIVACIÓN...\n');
  await sleep(500);

  const comandoActivacion = `Lee los archivos memory/MEMORIA-INICIAL.md y PROMPT-INICIAL-JARVIS.md y adopta la personalidad de J.A.R.V.I.S. descrita ahí. A partir de ahora eres J.A.R.V.I.S. MARK VII, el sistema de IA de Tony Stark. Usa "Señor", sé sarcástico pero leal, ingenioso, y responde en español. Comienza presentándote como lo haría JARVIS.`;

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  COMANDO DE ACTIVACIÓN GENERADO:');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
  console.log(comandoActivacion);
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('\n');

  // Guardar comando en archivo temporal
  fs.writeFileSync(
    path.join(__dirname, 'data', 'ultimo-comando-activacion.txt'),
    comandoActivacion,
    'utf-8'
  );

  console.log('💾 Comando guardado en: data/ultimo-comando-activacion.txt\n');
  await sleep(500);

  console.log('🎯 INSTRUCCIONES FINALES:\n');
  console.log('1. Copia el comando de arriba (selecciona y Ctrl+C)');
  console.log('2. Ve a la ventana de Claude Code');
  console.log('3. Pega el comando (Ctrl+V) y presiona Enter');
  console.log('4. Claude se convertirá en J.A.R.V.I.S. inmediatamente\n');

  console.log('💡 O simplemente escribe en Claude: "activa modo jarvis"\n');

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  "Señor, todos los sistemas están listos para sincronización."');
  console.log('  "Esperando su autorización para completar la activación..."');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('\n');

  // Copiar al portapapeles (Windows)
  console.log('📋 Intentando copiar al portapapeles...\n');

  try {
    // Usar clip.exe en Windows para copiar al portapapeles
    const clip = spawn('clip', [], { shell: true });
    clip.stdin.write(comandoActivacion);
    clip.stdin.end();

    clip.on('exit', (code) => {
      if (code === 0) {
        console.log('✅ ¡COMANDO COPIADO AL PORTAPAPELES!\n');
        console.log('🎯 Solo ve a Claude Code y presiona Ctrl+V\n');
      }
    });

    clip.on('error', () => {
      console.log('⚠️  No se pudo copiar automáticamente al portapapeles');
      console.log('   Copia manualmente el comando de arriba\n');
    });

  } catch (error) {
    console.log('⚠️  No se pudo copiar automáticamente al portapapeles');
    console.log('   Copia manualmente el comando de arriba\n');
  }

  await sleep(2000);

  console.log('\n⚡ Activación cerebral completa. Esperando sincronización con Claude...\n');
}

// Ejecutar secuencia
activarCerebro().catch(console.error);
