// test-scheduler.cjs
// Tests para Task Scheduler y Workflow Manager

const TaskScheduler = require('./core/scheduler/task-scheduler.cjs');
const WorkflowManager = require('./core/scheduler/workflow-manager.cjs');
const path = require('path');

async function testTaskScheduler() {
  console.log('='.repeat(60));
  console.log('🧪 TEST: Task Scheduler');
  console.log('='.repeat(60));

  // Scheduler sin persistencia para tests simples
  const scheduler = new TaskScheduler({
    projectRoot: process.cwd()
  });

  try {
    // Test 1: Inicialización
    console.log('\n📝 Test 1: Inicialización del scheduler...');
    await scheduler.initialize();
    console.log('✅ Scheduler inicializado correctamente');

    // Test 2: Crear tarea con intervalo
    console.log('\n📝 Test 2: Crear tarea con intervalo...');
    const intervalTask = await scheduler.scheduleTask({
      name: 'Test Interval Task',
      description: 'Tarea de prueba con intervalo',
      type: 'interval',
      schedule: '5000', // 5 segundos
      action: 'command',
      parameters: { command: 'echo', args: ['Test'] }
    });
    console.log(`✅ Tarea creada: ${intervalTask.name} (ID: ${intervalTask.id})`);

    // Test 3: Crear tarea con cron
    console.log('\n📝 Test 3: Crear tarea con cron expression...');
    const cronTask = await scheduler.scheduleTask({
      name: 'Daily Task',
      description: 'Tarea diaria',
      type: 'cron',
      schedule: '0 9 * * *', // Todos los días a las 9 AM
      action: 'command',
      parameters: { command: 'backup' }
    });
    console.log(`✅ Tarea cron creada: ${cronTask.name} (ID: ${cronTask.id})`);

    // Test 4: Obtener todas las tareas
    console.log('\n📝 Test 4: Obtener todas las tareas...');
    const allTasks = scheduler.getAllTasks();
    console.log(`✅ Total de tareas: ${allTasks.length}`);
    allTasks.forEach(task => {
      console.log(`   - ${task.name} (${task.type})`);
    });

    // Test 5: Deshabilitar tarea
    console.log('\n📝 Test 5: Deshabilitar tarea...');
    await scheduler.disableTask(intervalTask.id);
    const disabledTask = scheduler.getTask(intervalTask.id);
    console.log(`✅ Tarea deshabilitada: ${disabledTask.name} (enabled: ${disabledTask.enabled})`);

    // Test 6: Habilitar tarea
    console.log('\n📝 Test 6: Habilitar tarea...');
    await scheduler.enableTask(intervalTask.id);
    const enabledTask = scheduler.getTask(intervalTask.id);
    console.log(`✅ Tarea habilitada: ${enabledTask.name} (enabled: ${enabledTask.enabled})`);

    // Test 7: Obtener estadísticas
    console.log('\n📝 Test 7: Obtener estadísticas...');
    const stats = scheduler.getStats();
    console.log('✅ Estadísticas obtenidas:');
    console.log(`   - Total de tareas: ${stats.totalTasks}`);
    console.log(`   - Tareas activas: ${stats.enabledTasks}`);
    console.log(`   - Tareas pausadas: ${stats.disabledTasks}`);
    console.log(`   - Por tipo:`, stats.byType);

    // Test 8: Eliminar tarea
    console.log('\n📝 Test 8: Eliminar tarea...');
    await scheduler.deleteTask(intervalTask.id);
    const remainingTasks = scheduler.getAllTasks();
    console.log(`✅ Tarea eliminada. Tareas restantes: ${remainingTasks.length}`);

    // Cleanup
    await scheduler.shutdown();

    console.log('\n✅ Todos los tests de Task Scheduler pasaron exitosamente!\n');
    return true;

  } catch (error) {
    console.error('\n❌ Error en tests de Task Scheduler:', error);
    return false;
  }
}

async function testWorkflowManager() {
  console.log('='.repeat(60));
  console.log('🧪 TEST: Workflow Manager');
  console.log('='.repeat(60));

  const workflowManager = new WorkflowManager({
    projectRoot: process.cwd()
  });

  try {
    // Test 1: Inicialización
    console.log('\n📝 Test 1: Inicialización del workflow manager...');
    await workflowManager.initialize();
    console.log('✅ Workflow manager inicializado correctamente');

    // Test 2: Obtener templates
    console.log('\n📝 Test 2: Obtener templates predefinidos...');
    const templates = workflowManager.getTemplates();
    const templateNames = Object.keys(templates);
    console.log(`✅ Templates disponibles: ${templateNames.length}`);
    templateNames.forEach(name => {
      console.log(`   - ${name}: ${templates[name].description}`);
    });

    // Test 3: Crear workflow personalizado
    console.log('\n📝 Test 3: Crear workflow personalizado...');
    const customWorkflow = await workflowManager.createWorkflow({
      name: 'Test Workflow',
      description: 'Workflow de prueba',
      steps: [
        {
          name: 'Paso 1: Preparación',
          action: 'reindex-code',
          parameters: {}
        },
        {
          name: 'Paso 2: Limpieza',
          action: 'cleanup-notifications',
          parameters: { olderThan: 7 * 24 * 60 * 60 * 1000 }
        }
      ]
    });
    console.log(`✅ Workflow creado: ${customWorkflow.name} (ID: ${customWorkflow.id})`);
    console.log(`   - ${customWorkflow.steps.length} pasos`);

    // Test 4: Obtener todos los workflows
    console.log('\n📝 Test 4: Obtener todos los workflows...');
    const allWorkflows = workflowManager.getAllWorkflows();
    console.log(`✅ Total de workflows: ${allWorkflows.length}`);
    allWorkflows.forEach(wf => {
      console.log(`   - ${wf.name} (${wf.steps.length} pasos)`);
    });

    // Test 5: Obtener estadísticas
    console.log('\n📝 Test 5: Obtener estadísticas...');
    const stats = workflowManager.getStats();
    console.log('✅ Estadísticas obtenidas:');
    console.log(`   - Total de workflows: ${stats.totalWorkflows}`);
    console.log(`   - Workflows activos: ${stats.enabledWorkflows}`);

    // Test 6: Eliminar workflow
    console.log('\n📝 Test 6: Eliminar workflow...');
    await workflowManager.deleteWorkflow(customWorkflow.id);
    const remainingWorkflows = workflowManager.getAllWorkflows();
    console.log(`✅ Workflow eliminado. Workflows restantes: ${remainingWorkflows.length}`);

    console.log('\n✅ Todos los tests de Workflow Manager pasaron exitosamente!\n');
    return true;

  } catch (error) {
    console.error('\n❌ Error en tests de Workflow Manager:', error);
    return false;
  }
}

async function runAllTests() {
  console.log('\n🚀 Iniciando tests del sistema de Task Scheduler & Workflows...\n');

  const results = {
    taskScheduler: false,
    workflowManager: false
  };

  // Ejecutar tests
  results.taskScheduler = await testTaskScheduler();
  results.workflowManager = await testWorkflowManager();

  // Resumen
  console.log('='.repeat(60));
  console.log('📊 RESUMEN DE TESTS');
  console.log('='.repeat(60));
  console.log(`Task Scheduler: ${results.taskScheduler ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Workflow Manager: ${results.workflowManager ? '✅ PASS' : '❌ FAIL'}`);
  console.log('='.repeat(60));

  const allPassed = Object.values(results).every(r => r);

  if (allPassed) {
    console.log('\n🎉 ¡Todos los tests pasaron exitosamente!\n');
    process.exit(0);
  } else {
    console.log('\n❌ Algunos tests fallaron\n');
    process.exit(1);
  }
}

// Ejecutar tests
runAllTests().catch(error => {
  console.error('❌ Error fatal en tests:', error);
  process.exit(1);
});
