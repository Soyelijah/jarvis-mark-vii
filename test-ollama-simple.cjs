// Test Ollama Simple Code Generation
const axios = require('axios');

async function testOllama() {
  try {
    console.log('\n🚀 PROBANDO OLLAMA CON SOLICITUD SIMPLE\n');

    const request = {
      command: 'crea un componente React llamado TodoItem que muestre una tarea con un botón para eliminarla'
    };

    console.log('📝 Solicitud:', request.command);
    console.log('\n⏳ Esperando respuesta...\n');

    const response = await axios.post(
      'http://localhost:3001/api/command',
      request,
      { timeout: 120000 }
    );

    console.log('✅ RESPUESTA:\n');
    console.log('─'.repeat(80));
    console.log(response.data.response);
    console.log('─'.repeat(80));

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testOllama();
