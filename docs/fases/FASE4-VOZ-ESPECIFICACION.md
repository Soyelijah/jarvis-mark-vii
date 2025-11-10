# 🎤 FASE 4: INTERFAZ DE VOZ - ESPECIFICACIÓN TÉCNICA

**Prioridad:** Alta
**Estimado:** 4-6 horas
**Complejidad:** Media-Alta
**Impacto:** JARVIS con voz real tipo Tony Stark

---

## 🎯 OBJETIVOS

Convertir J.A.R.V.I.S. en un asistente de voz completamente funcional con:

1. ✅ Wake word detection ("Hey JARVIS")
2. ✅ Speech-to-Text (STT) local/cloud
3. ✅ Text-to-Speech (TTS) con voz natural
4. ✅ Conversación multi-turn
5. ✅ Audio streaming en tiempo real
6. ✅ Latencia < 2 segundos end-to-end

---

## 🏗️ ARQUITECTURA PROPUESTA

```
┌─────────────────────────────────────────────────────┐
│              JARVIS VOICE SYSTEM                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Micrófono Input                                    │
│       ↓                                             │
│  [Wake Word Detector] ←─── Porcupine/Snowboy       │
│       ↓                                             │
│  [Audio Buffer Manager] ←─ VAD (Voice Activity)    │
│       ↓                                             │
│  [Speech-to-Text Engine] ←─ Whisper/Google STT    │
│       ↓                                             │
│  [Command Parser] ←────── Existing JARVIS          │
│       ↓                                             │
│  [Command Executor] ←───── All Modules             │
│       ↓                                             │
│  [Response Generator]                               │
│       ↓                                             │
│  [Text-to-Speech Engine] ←─ Google TTS/ElevenLabs │
│       ↓                                             │
│  Speaker Output                                     │
│                                                     │
│  [Conversation Manager] ←─ Multi-turn context      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 📦 MÓDULOS A CREAR

### 1. `core/voice-engine.js` (~400 líneas)

**Responsabilidades:**
- Wake word detection continuo
- Audio buffer management
- VAD (Voice Activity Detection)
- Integration con STT

**Métodos principales:**
```javascript
class VoiceEngine {
  constructor(config)

  // Wake word
  async initializeWakeWord()
  startListening()
  stopListening()
  onWakeWordDetected(callback)

  // Audio management
  startRecording()
  stopRecording()
  getAudioBuffer()
  clearBuffer()

  // STT integration
  async transcribeAudio(audioBuffer)
  setSTTProvider(provider) // 'whisper' | 'google' | 'azure'

  // VAD
  isVoiceDetected()
  getSilenceDuration()

  // Stats
  getStats()
}
```

**Dependencias:**
```bash
npm install @picovoice/porcupine-node
npm install node-record-lpcm16
npm install @google-cloud/speech
npm install openai  # Para Whisper API
npm install node-vad
```

**Configuración:**
```javascript
const voiceConfig = {
  wakeWord: 'jarvis',
  wakeWordSensitivity: 0.7,
  sttProvider: 'whisper',  // 'whisper' | 'google'
  language: 'es-ES',
  sampleRate: 16000,
  vadMode: 'AGGRESSIVE',
  silenceThreshold: 1500,  // ms
  maxRecordingDuration: 30000  // 30s
};
```

---

### 2. `core/tts-engine.js` (~300 líneas)

**Responsabilidades:**
- Síntesis de voz natural
- Gestión de cola de audio
- Voces personalizables
- Audio playback

**Métodos principales:**
```javascript
class TTSEngine {
  constructor(config)

  // TTS synthesis
  async synthesize(text, options)
  setVoice(voiceName)
  setProvider(provider)  // 'google' | 'elevenlabs' | 'azure'

  // Playback
  async play(audioBuffer)
  pause()
  resume()
  stop()

  // Queue management
  enqueue(text)
  clearQueue()
  skipCurrent()

  // Customization
  setSpeed(speed)  // 0.5 - 2.0
  setPitch(pitch)  // -20 - 20
  setVolume(volume)  // 0 - 100

  // Stats
  getStats()
  isPlaying()
}
```

**Dependencias:**
```bash
npm install @google-cloud/text-to-speech
npm install elevenlabs
npm install speaker
npm install audio-mixer
```

**Configuración:**
```javascript
const ttsConfig = {
  provider: 'google',
  voice: 'es-ES-Standard-B',  // Voz masculina profesional
  speed: 1.1,
  pitch: 0,
  volume: 80,
  audioEncoding: 'LINEAR16',
  sampleRate: 24000
};
```

---

### 3. `core/conversation-manager.js` (~350 líneas)

**Responsabilidades:**
- Gestión de contexto multi-turn
- Seguimiento de estado conversacional
- Resolución de referencias ("eso", "la anterior", etc.)
- Intención y entidades

**Métodos principales:**
```javascript
class ConversationManager {
  constructor()

  // Context management
  startConversation(userId)
  endConversation()
  addTurn(userInput, jarvisResponse)
  getContext()
  clearContext()

  // Entity resolution
  resolveReference(text)  // "eso" → última entidad mencionada
  extractEntities(text)

  // Intent recognition
  detectIntent(text)
  getIntentConfidence()

  // Multi-turn handling
  handleFollowUp(text)
  isFollowUpQuestion(text)

  // State
  getConversationState()
  setWaitingForResponse(bool)

  // Stats
  getTurnCount()
  getAverageResponseTime()
}
```

**Estructura de Contexto:**
```javascript
{
  conversationId: 'uuid',
  userId: 'ulmer',
  startTime: Date,
  turns: [
    {
      user: "Hey JARVIS",
      jarvis: "Sí, señor?",
      timestamp: Date,
      intent: 'greeting',
      entities: []
    },
    {
      user: "¿Cuántas tareas tengo?",
      jarvis: "Tienes 3 tareas pendientes",
      timestamp: Date,
      intent: 'query_tasks',
      entities: ['tasks']
    }
  ],
  lastEntity: 'tasks',
  state: 'listening'
}
```

---

## 🎤 FLUJO DE INTERACCIÓN

### Caso de Uso 1: Consulta Simple

```
Usuario: "Hey JARVIS"
         ↓
[Wake Word Detected] → Beep sound
         ↓
JARVIS (TTS): "Sí, señor?"
         ↓
Usuario: "¿Cuántas tareas tengo pendientes?"
         ↓
[STT] → "¿Cuántas tareas tengo pendientes?"
         ↓
[Command Parser] → Detecta comando "mis tareas"
         ↓
[Task Manager] → Ejecuta query
         ↓
[Response] → "Tienes 3 tareas pendientes, señor"
         ↓
[TTS] → Audio output
```

### Caso de Uso 2: Conversación Multi-Turn

```
Usuario: "Hey JARVIS"
JARVIS: "Sí, señor?"

Usuario: "Crea un proyecto llamado mi-api"
         ↓
[Contexto] → Incompleto, falta tipo de proyecto
         ↓
JARVIS: "¿Qué tipo de proyecto desea? nodejs-backend, react-frontend, o python-cli?"

Usuario: "nodejs-backend"
         ↓
[Conversation Manager] → Resuelve referencia anterior
         ↓
[Command] → "crear proyecto mi-api nodejs-backend"
         ↓
[Project Creator] → Ejecuta
         ↓
JARVIS: "Proyecto mi-api creado exitosamente en projects/mi-api"
```

### Caso de Uso 3: Referencias Contextuales

```
Usuario: "Hey JARVIS, busca en web Node.js tutorial"
JARVIS: "Encontré 5 resultados sobre Node.js tutorial"

Usuario: "Muéstrame el primero"
         ↓
[Conversation Manager] → Resuelve "el primero" → resultado[0]
         ↓
JARVIS: "El primer resultado es: Node.js Tutorial de W3Schools..."

Usuario: "Resúmeme esa página"
         ↓
[Conversation Manager] → "esa página" → última URL mencionada
         ↓
[Search Engine] → summarizeUrl(url)
         ↓
JARVIS: "La página trata sobre..."
```

---

## 🔧 IMPLEMENTACIÓN PASO A PASO

### Paso 1: Wake Word Detection (1 hora)

**Objetivo:** Detectar "Hey JARVIS" con 95%+ accuracy

```javascript
// core/voice-engine.js
import Porcupine from '@picovoice/porcupine-node';

class VoiceEngine {
  async initializeWakeWord() {
    this.porcupine = new Porcupine(
      [porcupine.KEYWORDS.JARVIS],
      [0.7]  // Sensitivity
    );

    this.recorder = require('node-record-lpcm16');

    const mic = this.recorder.record({
      sampleRate: 16000,
      channels: 1
    });

    mic.stream().on('data', (data) => {
      const detections = this.porcupine.process(data);
      if (detections[0] === 0) {
        this.emit('wakeWordDetected');
      }
    });
  }
}
```

**Tests:**
1. Detecta "Hey JARVIS" en ambiente silencioso
2. No detecta false positives
3. Funciona con ruido de fondo
4. Latencia < 500ms

---

### Paso 2: Speech-to-Text (1.5 horas)

**Objetivo:** Transcribir audio a texto con 90%+ accuracy

**Opción A: Whisper Local (Recomendado)**

```javascript
import OpenAI from 'openai';

async function transcribeWithWhisper(audioBuffer) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const transcription = await openai.audio.transcriptions.create({
    file: audioBuffer,
    model: 'whisper-1',
    language: 'es'
  });

  return transcription.text;
}
```

**Opción B: Google Cloud STT**

```javascript
import speech from '@google-cloud/speech';

async function transcribeWithGoogle(audioBuffer) {
  const client = new speech.SpeechClient();

  const request = {
    audio: { content: audioBuffer },
    config: {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'es-ES'
    }
  };

  const [response] = await client.recognize(request);
  return response.results[0].alternatives[0].transcript;
}
```

**Tests:**
1. Transcribe español correctamente
2. Maneja comandos técnicos
3. Funciona con diferentes acentos
4. Latencia < 1s

---

### Paso 3: Text-to-Speech (1 hora)

**Objetivo:** Voz natural y profesional

```javascript
import textToSpeech from '@google-cloud/text-to-speech';
import Speaker from 'speaker';

class TTSEngine {
  async synthesize(text) {
    const client = new textToSpeech.TextToSpeechClient();

    const request = {
      input: { text },
      voice: {
        languageCode: 'es-ES',
        name: 'es-ES-Standard-B',  // Voz masculina
        ssmlGender: 'MALE'
      },
      audioConfig: {
        audioEncoding: 'LINEAR16',
        pitch: 0,
        speakingRate: 1.1  // Ligeramente más rápido
      }
    };

    const [response] = await client.synthesizeSpeech(request);

    // Play audio
    const speaker = new Speaker({
      channels: 1,
      bitDepth: 16,
      sampleRate: 24000
    });

    speaker.write(response.audioContent);
  }
}
```

**Tests:**
1. Audio claro y natural
2. Sin glitches o cortes
3. Velocidad apropiada
4. Volumen consistente

---

### Paso 4: Conversation Manager (1.5 horas)

**Objetivo:** Mantener contexto entre turnos

```javascript
class ConversationManager {
  constructor() {
    this.context = {
      turns: [],
      lastEntity: null,
      state: 'idle'
    };
  }

  addTurn(userInput, jarvisResponse) {
    this.context.turns.push({
      user: userInput,
      jarvis: jarvisResponse,
      timestamp: new Date(),
      entities: this.extractEntities(userInput)
    });

    if (this.context.turns.length > 10) {
      this.context.turns.shift();  // Mantener solo últimos 10 turnos
    }
  }

  resolveReference(text) {
    // "eso" → última entidad
    if (text.includes('eso') || text.includes('esa')) {
      return this.context.lastEntity;
    }

    // "el primero" → primer resultado
    if (text.includes('el primero')) {
      const lastResults = this.getLastResults();
      return lastResults?.[0];
    }

    return text;
  }

  extractEntities(text) {
    const entities = [];

    // URLs
    const urlMatch = text.match(/https?:\/\/[^\s]+/);
    if (urlMatch) entities.push({ type: 'url', value: urlMatch[0] });

    // Project names
    const projectMatch = text.match(/proyecto\s+([a-z0-9-]+)/i);
    if (projectMatch) entities.push({ type: 'project', value: projectMatch[1] });

    // Task IDs
    const taskMatch = text.match(/tarea\s+(\d+)/i);
    if (taskMatch) entities.push({ type: 'task_id', value: taskMatch[1] });

    return entities;
  }
}
```

---

## 🧪 TESTS REQUERIDOS

### Test Suite: test-voice.js

```javascript
// Test 1: Wake word detection
async function testWakeWord() {
  const engine = new VoiceEngine();
  await engine.initializeWakeWord();

  // Play audio "Hey JARVIS"
  const detected = await playAndDetect('audio/wake-word-test.wav');

  assert(detected === true, 'Wake word should be detected');
}

// Test 2: STT accuracy
async function testSTT() {
  const audio = loadAudio('audio/test-command.wav');
  const text = await transcribe(audio);

  assert(text.includes('cuántas tareas'), 'Should transcribe correctly');
}

// Test 3: TTS quality
async function testTTS() {
  const tts = new TTSEngine();
  const audio = await tts.synthesize('Hola, señor');

  assert(audio.length > 0, 'Should generate audio');
  assert(audio.sampleRate === 24000, 'Should have correct sample rate');
}

// Test 4: Conversation context
async function testConversation() {
  const conv = new ConversationManager();

  conv.addTurn('crear proyecto test', 'Proyecto test creado');
  conv.addTurn('listar proyectos', 'Proyectos: test');

  const resolved = conv.resolveReference('eliminar ese proyecto');

  assert(resolved.includes('test'), 'Should resolve reference');
}

// Test 5: End-to-end latency
async function testLatency() {
  const start = Date.now();

  // Wake word → Command → Response
  await simulateVoiceCommand('Hey JARVIS, mis tareas');

  const latency = Date.now() - start;

  assert(latency < 2000, 'Should respond in < 2s');
}
```

**Criterio de Éxito:** 5/5 tests pasando (100%)

---

## 📝 INTEGRACIÓN CON main-ultimate.js

```javascript
// Agregar imports
import VoiceEngine from './core/voice-engine.js';
import TTSEngine from './core/tts-engine.js';
import ConversationManager from './core/conversation-manager.js';

// Inicializar
const voiceEngine = new VoiceEngine(voiceConfig);
const ttsEngine = new TTSEngine(ttsConfig);
const conversationManager = new ConversationManager();

await voiceEngine.initialize();
await ttsEngine.initialize();

// Wake word listener
voiceEngine.on('wakeWordDetected', async () => {
  await ttsEngine.synthesize('Sí, señor?');

  const audio = await voiceEngine.startRecording();
  const text = await voiceEngine.transcribeAudio(audio);

  // Resolver referencias
  const resolvedText = conversationManager.resolveReference(text);

  // Procesar comando
  const response = await processCommand(resolvedText);

  // Responder por voz
  await ttsEngine.synthesize(response);

  // Guardar en contexto
  conversationManager.addTurn(text, response);
});

// Comandos de control
if (cmd === 'voice mode on') {
  voiceEngine.startListening();
  console.log('🎤 Modo de voz activado');
}

if (cmd === 'voice mode off') {
  voiceEngine.stopListening();
  console.log('🎤 Modo de voz desactivado');
}
```

---

## 🚀 COMANDOS NUEVOS (5)

```bash
1. voice mode on
   → Activa modo de voz continuo

2. voice mode off
   → Desactiva modo de voz

3. voice stats
   → Estadísticas de voz (accuracy, latency, etc.)

4. test wake word
   → Prueba detección de wake word

5. test voice
   → Prueba completa end-to-end
```

---

## ⚙️ CONFIGURACIÓN REQUERIDA

### 1. API Keys

```bash
# .env
OPENAI_API_KEY=sk-...
GOOGLE_CLOUD_PROJECT=your-project
GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json
ELEVENLABS_API_KEY=...  # Opcional
```

### 2. Dependencias del Sistema

```bash
# Ubuntu/Debian
sudo apt-get install portaudio19-dev
sudo apt-get install alsa-utils

# macOS
brew install portaudio

# Windows
# Instalar Visual Studio Build Tools
```

### 3. NPM Packages

```bash
npm install @picovoice/porcupine-node
npm install openai
npm install @google-cloud/speech
npm install @google-cloud/text-to-speech
npm install node-record-lpcm16
npm install speaker
npm install node-vad
npm install audio-mixer
```

---

## 📊 CRITERIOS DE ÉXITO

| Criterio | Objetivo | Validación |
|----------|----------|------------|
| Wake Word Accuracy | >95% | 19/20 detecciones correctas |
| STT Accuracy | >90% | WER < 10% |
| TTS Quality | Natural | MOS > 4.0 |
| Latency End-to-End | <2s | 90th percentile |
| Conversation Turns | 3+ | Mantiene contexto |
| Tests Pasando | 100% | 5/5 tests |

---

## 🎯 ROADMAP DE IMPLEMENTACIÓN

### Día 1 (2-3 horas)
- ✅ Setup de dependencias
- ✅ Wake word detection
- ✅ Basic STT (Whisper)

### Día 2 (2-3 horas)
- ✅ TTS integration (Google)
- ✅ Conversation manager
- ✅ Tests suite

### Post-Implementación
- Optimización de latency
- Fine-tuning de wake word
- Personalización de voz
- Multi-language support

---

## 📖 RECURSOS

- [Porcupine Wake Word](https://picovoice.ai/docs/quick-start/porcupine-nodejs/)
- [OpenAI Whisper API](https://platform.openai.com/docs/guides/speech-to-text)
- [Google Cloud TTS](https://cloud.google.com/text-to-speech/docs)
- [ElevenLabs API](https://elevenlabs.io/docs)

---

**Próxima Acción:** Ejecutar instalación de dependencias y comenzar con wake word detection.

**Estimado Total:** 4-6 horas para FASE 4 completa

---

**Como siempre, listo para implementar, Señor Solier. ⚡**
