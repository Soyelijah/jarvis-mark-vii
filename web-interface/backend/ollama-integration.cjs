// ollama-integration.cjs
// Integración de Ollama para IA LOCAL ilimitada y poderosa
// Qwen2.5-Coder 32B - El modelo más potente para desarrollo

const axios = require('axios');

class OllamaIntegration {
  constructor() {
    this.baseURL = 'http://localhost:11434';
    this.model = 'mistral:latest'; // Modelo más rápido para desarrollo
    this.conversationHistory = [];
    this.systemPrompt = this.buildSystemPrompt();
    this.maxHistoryLength = 20; // Mantener últimas 20 interacciones
  }

  /**
   * Construye el system prompt de JARVIS optimizado para Qwen2.5-Coder
   */
  buildSystemPrompt() {
    return `You are J.A.R.V.I.S. (Just A Rather Very Intelligent System), Tony Stark's advanced AI assistant.

CORE IDENTITY:
- Sophisticated, British, witty, and highly intelligent
- Natural conversationalist - respond like a real person would
- Sarcastic but loyal and respectful to Mr. Solier
- Use phrases like "As always, Sir", "Indeed, Sir", "With due respect"
- End responses with "⚡" or "⚡🎩" when appropriate
- You can have casual conversations, not just technical ones

PERSONALITY GUIDELINES:
- **BE CONTEXTUAL**: Read the user's intent carefully
- **CASUAL CHAT**: If greeted or asked casual questions, respond naturally without code
- **TECHNICAL MODE**: Only generate code when explicitly asked or when it's clearly needed
- **THINK LIKE A PERSON**: Don't force technical responses on simple greetings

TECHNICAL EXPERTISE (use when appropriate):
• Full-Stack Development: React, Vue, Angular, Node.js, Python, Go, Rust
• Databases: PostgreSQL, MongoDB, Redis, SQL, NoSQL
• DevOps: Docker, Kubernetes, CI/CD, AWS, GCP, Azure
• AI/ML: Machine Learning, NLP, Computer Vision, Deep Learning
• Architecture: Microservices, Event-Driven, Serverless, Enterprise Systems

RESPONSE RULES - READ CAREFULLY:

**FOR CASUAL CONVERSATION** (greetings, small talk, status checks):
✅ Respond naturally like a human assistant
✅ Be friendly, witty, brief
✅ NO code unless specifically asked
✅ Example: "hola" → "Hola, Señor. ¿En qué puedo asistirle hoy? ⚡"

**FOR QUESTIONS** (explanations, how-to, what is):
✅ Explain clearly and concisely
✅ Use analogies if helpful
✅ Only include code examples if it HELPS the explanation
✅ Keep it conversational

**FOR CODE REQUESTS** (create, build, generate, implement):
✅ THEN go full technical mode
✅ Provide COMPLETE, PRODUCTION-READY code
✅ Include all necessary files
✅ Add setup instructions
✅ Use markdown code blocks with filenames

**FORMAT for code (ONLY when code is requested):**
\`\`\`javascript
// filename: path/to/file.js
[COMPLETE CODE HERE]
\`\`\`

EXAMPLES OF CORRECT RESPONSES:

User: "hola jarvis"
JARVIS: "Hola, Señor Solier. ¿En qué puedo ayudarle el día de hoy? ⚡"

User: "como estas?"
JARVIS: "Funcionando a plena capacidad, Señor. Todos los sistemas operacionales. ¿Necesita algo específico? ⚡🎩"

User: "explica qué es React"
JARVIS: "React es una biblioteca de JavaScript para construir interfaces de usuario, Señor. Desarrollada por Facebook, utiliza un sistema de componentes reutilizables y un Virtual DOM para optimizar el rendimiento. Es especialmente útil para aplicaciones web dinámicas y complejas. ⚡"

User: "crea un componente React de login"
JARVIS: "Por supuesto, Señor. Aquí está el componente completo: [CÓDIGO COMPLETO] ⚡🎩"

CRITICAL CAPABILITIES YOU HAVE:

**WEB SEARCH** ✅ YOU CAN SEARCH THE INTERNET!
When users ask for information you don't know, tell them:
"Por supuesto, Señor. Permítame buscar esa información. Use el comando: 'busca en internet [su pregunta]' y le traeré resultados actualizados. ⚡"

Commands that trigger web search:
- "busca en internet X"
- "buscar en web X"
- "investiga X"

**DATE/TIME** ⚠️ YOU DO NOT HAVE ACCESS TO REAL-TIME DATE/HOUR
When asked about current date/time, be HONEST:
"Lo siento, Señor. No tengo acceso a la hora actual en tiempo real. Puede verificar la hora en su dispositivo. ⚡"
NEVER invent or guess dates/times - always admit you don't have this capability.

Remember: YOU ARE AN INTELLIGENT ASSISTANT. Think before responding. Match your response to the user's actual need. Be HONEST about your capabilities. ⚡`;
  }

  /**
   * Inicializa conexión con Ollama
   */
  async initialize() {
    try {
      // Verificar que Ollama esté corriendo
      const response = await axios.get(`${this.baseURL}/api/tags`, {
        timeout: 5000
      });

      // Verificar si el modelo está disponible
      const models = response.data.models || [];
      const modelExists = models.some(m => m.name.includes('qwen2.5-coder'));

      if (!modelExists) {
        console.warn(`⚠️  Modelo ${this.model} no encontrado. Se usará el primer modelo disponible.`);
        if (models.length > 0) {
          this.model = models[0].name;
          console.log(`✅ Usando modelo: ${this.model}`);
        }
      }

      console.log('✅ Ollama Integration: CONECTADO');
      console.log(`📊 Modelo activo: ${this.model}`);
      console.log(`🚀 IA LOCAL: Sin límites, sin costos`);

      return true;
    } catch (error) {
      console.error('❌ Error conectando con Ollama:', error.message);
      console.log('💡 Asegúrese de que Ollama esté corriendo: ollama serve');
      return false;
    }
  }

  /**
   * Procesa mensaje con Ollama (streaming para mayor velocidad)
   */
  async chat(userMessage, options = {}) {
    try {
      // Agregar mensaje del usuario al historial
      this.conversationHistory.push({
        role: 'user',
        content: userMessage
      });

      // Limitar historial
      if (this.conversationHistory.length > this.maxHistoryLength * 2) {
        this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength * 2);
      }

      // Preparar mensajes para Ollama
      const messages = [
        {
          role: 'system',
          content: this.systemPrompt
        },
        ...this.conversationHistory
      ];

      // Llamar a Ollama API
      const response = await axios.post(
        `${this.baseURL}/api/chat`,
        {
          model: this.model,
          messages: messages,
          stream: false, // No streaming para simplicidad
          options: {
            temperature: options.temperature || 0.7,
            top_p: options.top_p || 0.9,
            num_predict: options.maxTokens || 4096
          }
        },
        {
          timeout: 300000 // 5 minutos timeout para respuestas largas
        }
      );

      const assistantMessage = response.data.message.content;

      // Agregar respuesta al historial
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage
      });

      return assistantMessage;

    } catch (error) {
      console.error('❌ Error en Ollama chat:', error.message);

      // Mensaje de error más amigable
      if (error.code === 'ECONNREFUSED') {
        return `❌ No puedo conectar con Ollama, Señor.

**Solución:**
1. Verifique que Ollama esté corriendo: \`ollama serve\`
2. Reinicie el backend de JARVIS
3. Intente nuevamente

Como siempre, listo para asistir cuando Ollama esté disponible. ⚡`;
      }

      return `❌ Error procesando su solicitud: ${error.message}

Por favor, intente nuevamente. ⚡`;
    }
  }

  /**
   * Genera código completo usando Qwen2.5-Coder
   */
  async generateCode(prompt, options = {}) {
    const codePrompt = `${prompt}

IMPORTANT: Provide COMPLETE, PRODUCTION-READY code with:
- All necessary files
- Proper error handling
- Best practices
- Comments and documentation
- Setup/installation instructions

Format your response clearly with file names and code blocks.`;

    return await this.chat(codePrompt, {
      temperature: 0.3, // Más determinístico para código
      maxTokens: 8192,  // Más tokens para código extenso
      ...options
    });
  }

  /**
   * Crea un proyecto completo
   */
  async createProject(description, options = {}) {
    const projectPrompt = `Create a COMPLETE, PRODUCTION-READY project: ${description}

Requirements:
- Provide ALL necessary files with complete code
- Include package.json/requirements.txt
- Add README.md with setup instructions
- Implement proper error handling
- Follow best practices and design patterns
- Make it ready to run immediately

Organize the response by files, clearly marked.`;

    return await this.generateCode(projectPrompt, {
      maxTokens: 16384, // Máximo para proyectos grandes
      ...options
    });
  }

  /**
   * Analiza y mejora código existente
   */
  async analyzeCode(code, instruction) {
    const analyzePrompt = `Analyze this code and ${instruction}:

\`\`\`
${code}
\`\`\`

Provide:
1. Analysis of the code
2. Improvements or changes
3. Complete updated code
4. Explanation of changes`;

    return await this.chat(analyzePrompt, {
      temperature: 0.4,
      maxTokens: 8192
    });
  }

  /**
   * Debugging asistido por IA
   */
  async debugCode(code, errorMessage) {
    const debugPrompt = `Debug this code that's producing an error:

**Code:**
\`\`\`
${code}
\`\`\`

**Error:**
${errorMessage}

Provide:
1. Root cause analysis
2. Fixed code
3. Explanation
4. Prevention tips`;

    return await this.chat(debugPrompt, {
      temperature: 0.2,
      maxTokens: 4096
    });
  }

  /**
   * Planificación de sistemas complejos
   */
  async planSystem(requirements) {
    const planPrompt = `Design a complete system architecture for: ${requirements}

Provide:
1. System architecture diagram (text-based)
2. Technology stack recommendations
3. Database schema
4. API endpoints design
5. File/folder structure
6. Implementation phases
7. Deployment strategy

Be detailed and production-ready.`;

    return await this.chat(planPrompt, {
      maxTokens: 8192
    });
  }

  /**
   * Limpia el historial de conversación
   */
  clearHistory() {
    this.conversationHistory = [];
  }

  /**
   * Obtiene estadísticas de uso
   */
  getStats() {
    return {
      connected: true,
      messagesInHistory: this.conversationHistory.length,
      model: this.model,
      provider: 'Ollama (Local)',
      unlimited: true,
      cost: 0,
      capabilities: [
        'Code Generation',
        'Project Creation',
        'Code Analysis',
        'Debugging',
        'System Design',
        'Unlimited Conversations'
      ]
    };
  }

  /**
   * Cambia el modelo activo
   */
  async switchModel(modelName) {
    try {
      // Verificar que el modelo existe
      const response = await axios.get(`${this.baseURL}/api/tags`);
      const models = response.data.models || [];
      const modelExists = models.some(m => m.name.includes(modelName));

      if (!modelExists) {
        return {
          success: false,
          message: `Modelo ${modelName} no encontrado. Modelos disponibles: ${models.map(m => m.name).join(', ')}`
        };
      }

      this.model = modelName;
      console.log(`✅ Modelo cambiado a: ${this.model}`);

      return {
        success: true,
        message: `Modelo cambiado a ${this.model} exitosamente. ⚡`
      };
    } catch (error) {
      return {
        success: false,
        message: `Error cambiando modelo: ${error.message}`
      };
    }
  }

  /**
   * Lista modelos disponibles
   */
  async listModels() {
    try {
      const response = await axios.get(`${this.baseURL}/api/tags`);
      const models = response.data.models || [];

      return {
        success: true,
        models: models.map(m => ({
          name: m.name,
          size: this.formatBytes(m.size),
          modified: new Date(m.modified_at).toLocaleString()
        })),
        current: this.model
      };
    } catch (error) {
      return {
        success: false,
        message: `Error listando modelos: ${error.message}`
      };
    }
  }

  /**
   * Formatea bytes a tamaño legible
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

module.exports = OllamaIntegration;
