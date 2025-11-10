// Test Ollama Conversation
const axios = require('axios');

async function testOllama() {
  try {
    console.log('\n🚀 TEST CONVERSACIÓN CON OLLAMA\n');

    const request = {
      command: 'explícame en 3 líneas qué es React hooks'
    };

    console.log('📝 Pregunta:', request.command);
    console.log('\n⏳ Esperando...\n');

    const startTime = Date.now();
    const response = await axios.post(
      'http://localhost:3001/api/command',
      request,
      { timeout: 60000 }
    );
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log(`✅ RESPUESTA (${elapsed}s):\n`);
    console.log('─'.repeat(80));
    console.log(response.data.response);
    console.log('─'.repeat(80));

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testOllama();
