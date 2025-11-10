# 🤖 JARVIS Proactive Mode

## ¿Qué es?

**JARVIS Proactive Mode** es un sistema que convierte a JARVIS de un asistente reactivo a un **compañero proactivo** que monitorea tu código en tiempo real y te alerta sobre problemas antes de que los notes.

## 🌟 Características

### Monitoreo Inteligente
- **File Watcher** - Detecta cambios en tiempo real
- **Análisis automático** - Examina cada cambio con IA
- **Clasificación inteligente** - Determina prioridad y severidad

### Detección Proactiva
- 🐛 **Bugs** - Errores de lógica, typos, problemas de sintaxis
- 🔒 **Security** - Injection, XSS, secrets expuestos
- ⚡ **Performance** - Loops ineficientes, memory leaks
- 💡 **Mejoras** - Refactoring, best practices
- ✅ **Tests** - Funciones sin cobertura de tests

### Notificaciones Inteligentes
- **Severidad** - Critical, High, Medium, Low
- **Contexto** - Línea exacta y sugerencia de fix
- **No intrusivo** - Solo notifica issues significativos

## 🚀 Uso

### Inicio Rápido

```bash
# Asegúrate de que Ollama esté corriendo
ollama serve

# Inicia JARVIS Proactive Mode
npm run proactive
```

El sistema comenzará a monitorear tu proyecto automáticamente.

### Con Modelo Específico

```bash
# Usar modelo ligero (más rápido)
OLLAMA_MODEL=mistral:latest npm run proactive

# Usar modelo de código (más preciso)
OLLAMA_MODEL=qwen2.5-coder:32b npm run proactive
```

## 📊 Ejemplo de Salida

```
🤖  J.A.R.V.I.S. PROACTIVE MODE  ⚡

✅ Modo proactivo activo
   Monitoreando 1,234 archivos

📝 src/utils/payment.js [major]
   🔍 Análisis: 3 issues encontrados

============================================================
🔔 JARVIS PROACTIVE ALERT
============================================================
📄 Archivo: src/utils/payment.js
⚠️ Prioridad: HIGH

🔒 **Security Issues (1)**
   [HIGH] Línea 45: Uso de eval() con input de usuario
   ➜ Fix: Usa JSON.parse() en su lugar

🐛 **Bugs Detectados (1)**
   [MEDIUM] Línea 67: Posible null reference
   ➜ Agregar validación antes de acceder a property

⚡ **Performance Issues (1)**
   [MEDIUM] Línea 89: Loop O(n²) innecesario
   ➜ Usar Map para búsqueda O(1)

📝 Se detectaron issues de seguridad y performance que requieren atención
============================================================
```

## ⚙️ Configuración

El sistema se puede configurar editando `jarvis-proactive.cjs`:

```javascript
const config = {
  // Auto-análisis con IA
  autoAnalyze: true,

  // Notificaciones
  notifyOnBugs: true,
  notifyOnSecurity: true,
  notifyOnPerformance: true,

  // Severidad mínima para notificar
  minSeverity: 'medium', // low, medium, high, critical

  // Modelo de IA
  model: 'qwen2.5-coder:32b',

  // Directorios ignorados
  ignorePaths: [
    '**/node_modules/**',
    '**/.git/**',
    '**/dist/**',
    // ... más
  ]
};
```

## 🎯 Casos de Uso

### Durante Desarrollo
- Detecta bugs mientras escribes código
- Alerta sobre problemas de seguridad inmediatamente
- Sugiere mejoras de performance

### Code Review Automático
- Analiza cada cambio antes de commit
- Identifica issues que pasarían desapercibidos
- Propone refactorings

### Mantenimiento
- Monitorea proyectos legacy
- Detecta regresiones automáticamente
- Alerta sobre deuda técnica

## 🧠 Arquitectura

```
jarvis-proactive/
├── core/
│   ├── file-watcher.cjs       # Monitoreo de archivos
│   ├── ai-analyzer.cjs        # Análisis con Ollama
│   └── proactive-agent.cjs    # Orquestador principal
└── jarvis-proactive.cjs       # Punto de entrada
```

### Flujo de Trabajo

1. **File Watcher** detecta cambio
2. **Analizador** extrae metadata (complejidad, tipo, etc.)
3. **Clasificador** determina si requiere análisis de IA
4. **IA** examina el código y detecta issues
5. **Notificador** alerta si hay problemas significativos

## 📈 Métricas

El sistema tracking métricas en tiempo real:

- Archivos monitoreados
- Cambios detectados
- Análisis realizados
- Issues encontrados
- Notificaciones enviadas

Ver estadísticas con `Ctrl+C` al salir.

## 🔧 Troubleshooting

### Ollama no responde
```bash
# Verificar que Ollama esté corriendo
ollama list

# Reiniciar Ollama
ollama serve
```

### Demasiadas notificaciones
```javascript
// Aumentar severidad mínima
minSeverity: 'high'

// Desactivar categorías específicas
notifyOnPerformance: false
```

### Análisis muy lento
```javascript
// Usar modelo más liviano
model: 'mistral:latest'
```

## 🚀 Próximas Mejoras

- [ ] Integración con panel web
- [ ] Auto-fix sugerido (aplicar fixes automáticamente)
- [ ] Machine learning para aprender tu estilo
- [ ] Integración con Git (alertar antes de commit)
- [ ] Dashboard de métricas históricas

## 💡 Tips

**Para desarrollo activo:**
```bash
# En una terminal aparte
npm run proactive
```

**Para proyectos grandes:**
- Configura `ignorePaths` para excluir directorios innecesarios
- Usa `minSeverity: 'high'` para reducir ruido

**Para máxima precisión:**
- Usa `qwen2.5-coder:32b` (requiere ~20GB RAM)
- Asegúrate de tener Ollama corriendo localmente

---

**"Always watching, Señor. Never sleeping."** 🤖⚡
