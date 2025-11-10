// Test Ollama Project Generation
const axios = require('axios');

async function testOllamaProject() {
  try {
    console.log('\n🚀 PROBANDO GENERACIÓN DE PROYECTO COMPLETO CON OLLAMA\n');

    const request = {
      command: 'crea un proyecto completo de To-Do List con React y Node.js. Debe incluir: frontend React con componentes para listar, agregar y eliminar tareas, backend Express con API REST para CRUD, y archivo README con instrucciones de instalación'
    };

    console.log('📝 Solicitud:', request.command);
    console.log('\n⏳ Esperando respuesta de Ollama (puede tomar 30-60 segundos)...\n');

    const response = await axios.post(
      'http://localhost:3001/api/command',
      request,
      { timeout: 180000 } // 3 minutos timeout
    );

    console.log('✅ RESPUESTA DE OLLAMA:\n');
    console.log('─'.repeat(80));
    console.log(response.data.response);
    console.log('─'.repeat(80));

    console.log('\n✅ TEST COMPLETADO\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Detalles:', error.response.data);
    }
  }
}

testOllamaProject();
