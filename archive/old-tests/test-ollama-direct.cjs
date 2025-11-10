// Test Ollama Direct (sin interceptores)
const axios = require('axios');

async function testOllama() {
  try {
    console.log('\n🚀 PROBANDO OLLAMA DIRECTO (SIN INTERCEPTORES)\n');

    const request = {
      command: 'construye un sistema completo de autenticación con JWT, incluye backend Express, middleware de auth, rutas de login/register, y frontend React con formularios'
    };

    console.log('📝 Solicitud:', request.command);
    console.log('\n⏳ Esperando respuesta de Qwen2.5-Coder (30-60 seg)...\n');

    const startTime = Date.now();
    const response = await axios.post(
      'http://localhost:3001/api/command',
      request,
      { timeout: 180000 }
    );
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log(`✅ RESPUESTA (${elapsed}s):\n`);
    console.log('─'.repeat(80));
    console.log(response.data.response);
    console.log('─'.repeat(80));

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Detalles:', error.response.data);
    }
  }
}

testOllama();
