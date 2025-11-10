// Test JARVIS Natural Conversation
const axios = require('axios');

async function testConversation(message, description) {
  try {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`📝 Test: ${description}`);
    console.log(`💬 Usuario: "${message}"`);
    console.log('⏳ Esperando respuesta...\n');

    const startTime = Date.now();
    const response = await axios.post(
      'http://localhost:3001/api/command',
      { command: message },
      { timeout: 60000 }
    );
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log(`🤖 JARVIS (${elapsed}s):`);
    console.log(response.data.response);
    console.log('─'.repeat(80));

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function runTests() {
  console.log('\n🚀 PROBANDO JARVIS - CONVERSACIÓN NATURAL\n');

  // Test 1: Saludo simple
  await testConversation(
    'hola jarvis',
    'Saludo simple (NO debe generar código)'
  );

  // Test 2: Pregunta de estado
  await testConversation(
    'como estas?',
    'Pregunta casual (NO debe generar código)'
  );

  // Test 3: Pregunta conceptual
  await testConversation(
    'que es docker?',
    'Pregunta conceptual (explicación SIN código innecesario)'
  );

  // Test 4: Solicitud explícita de código
  await testConversation(
    'crea una función de suma en JavaScript',
    'Solicitud de código (SÍ debe generar código)'
  );

  console.log('\n✅ TESTS COMPLETADOS\n');
}

runTests();
