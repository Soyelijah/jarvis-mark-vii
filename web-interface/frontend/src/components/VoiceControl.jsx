// web-interface/frontend/src/components/VoiceControl.jsx
// Control por Voz y Chat Conversacional

import React, { useState, useEffect, useRef } from 'react';

const VoiceControl = ({ socket, onAction }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    // Escuchar respuestas de comandos
    socket.on('voice:response', (data) => {
      addMessage('assistant', data.response, data);

      // Hablar la respuesta si está habilitado
      if (voiceEnabled && data.response) {
        speak(data.response);
      }

      // Ejecutar acción si la hay
      if (data.action && onAction) {
        onAction(data.action, data.parameters);
      }
    });

    // Escuchar historial
    socket.on('voice:history', (history) => {
      setMessages(history.map(h => ({
        role: h.type,
        content: h.text,
        timestamp: h.timestamp,
        data: h.data
      })));
    });

    // Solicitar historial inicial
    socket.emit('voice:get-history');

    return () => {
      socket.off('voice:response');
      socket.off('voice:history');
    };
  }, [socket, voiceEnabled, onAction]);

  useEffect(() => {
    // Scroll automático
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Inicializar Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'es-ES';

      recognitionRef.current.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        handleVoiceCommand(text);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Error de reconocimiento:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleVoiceCommand = (text) => {
    if (!socket || !text.trim()) return;

    addMessage('user', text);
    socket.emit('voice:command', { text });
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    handleVoiceCommand(inputText);
    setInputText('');
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      // Cancelar si ya está hablando
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const addMessage = (role, content, data = null) => {
    setMessages(prev => [...prev, {
      role,
      content,
      timestamp: Date.now(),
      data
    }]);
  };

  const clearHistory = () => {
    if (socket) {
      socket.emit('voice:clear-history');
    }
    setMessages([]);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const hasVoiceSupport = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🎤</span>
            <div>
              <h3 className="text-lg font-bold text-white">Control por Voz</h3>
              <p className="text-xs text-gray-400">
                {hasVoiceSupport ? 'Presiona el micrófono o escribe' : 'Solo modo texto'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Toggle de voz */}
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`p-2 rounded-lg transition-all ${
                voiceEnabled
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-400'
              }`}
              title={voiceEnabled ? 'Voz habilitada' : 'Voz deshabilitada'}
            >
              🔊
            </button>

            {/* Limpiar historial */}
            <button
              onClick={clearHistory}
              className="p-2 bg-gray-700 text-gray-400 rounded-lg hover:bg-gray-600 transition-all"
              title="Limpiar historial"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-6xl mb-4">🎤</p>
            <p className="text-xl text-white mb-2">Di "Hola JARVIS"</p>
            <p className="text-sm text-gray-400 mb-4">
              O escribe cualquier comando
            </p>
            <div className="space-y-1 text-xs text-gray-500 max-w-md mx-auto text-left">
              <p>💡 Ejemplos de comandos:</p>
              <p className="ml-4">• "Ejecuta crear un README"</p>
              <p className="ml-4">• "Busca notification-system"</p>
              <p className="ml-4">• "Documenta el proyecto"</p>
              <p className="ml-4">• "Muestra las notificaciones"</p>
              <p className="ml-4">• "Abre búsqueda"</p>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-700 text-gray-100'
              }`}
            >
              <div className="flex items-start space-x-2">
                <span className="text-lg flex-shrink-0">
                  {message.role === 'user' ? '👤' : '🤖'}
                </span>
                <div className="flex-1">
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.data?.suggestions && (
                    <div className="mt-2 space-y-1">
                      {message.data.suggestions.map((suggestion, i) => (
                        <p key={i} className="text-xs text-gray-300 italic">
                          {suggestion}
                        </p>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="bg-gray-800 p-4 border-t border-gray-700">
        {isListening && (
          <div className="mb-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-3 flex items-center space-x-3">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-100"></div>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-200"></div>
            </div>
            <span className="text-red-400 text-sm font-medium">Escuchando...</span>
          </div>
        )}

        {transcript && (
          <div className="mb-3 bg-cyan-500 bg-opacity-20 border border-cyan-500 rounded-lg p-2">
            <p className="text-cyan-400 text-sm">Reconocido: "{transcript}"</p>
          </div>
        )}

        <form onSubmit={handleTextSubmit} className="flex space-x-2">
          {hasVoiceSupport && (
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              disabled={isSpeaking}
              className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                isListening
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : isSpeaking
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
              }`}
            >
              {isListening ? '🎙️ Escuchando' : isSpeaking ? '🔊 Hablando' : '🎤 Hablar'}
            </button>
          )}

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Escribe un comando o pregunta..."
            className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            disabled={isListening}
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isListening}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              !inputText.trim() || isListening
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700'
            }`}
          >
            Enviar
          </button>
        </form>

        {isSpeaking && (
          <button
            onClick={stopSpeaking}
            className="mt-2 w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm"
          >
            ⏹️ Detener Voz
          </button>
        )}
      </div>
    </div>
  );
};

export default VoiceControl;
