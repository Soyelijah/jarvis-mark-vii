# 🚀 JARVIS - Guía de Inicio Rápido

## ✅ Estado Actual: OPERACIONAL

```
🟢 Backend API    → http://localhost:7777
🟢 Frontend React → http://localhost:5173
🟢 WebSocket      → ws://localhost:7777
🟢 Todos los módulos → ACTIVOS
```

---

## 📱 Acceso al Dashboard

### **PASO 1: Abre tu navegador**
```
http://localhost:5173
```

### **PASO 2: Explora las secciones**

El dashboard tiene las siguientes áreas:

#### 🏠 **Dashboard Principal**
- Vista general del sistema
- Métricas en tiempo real
- Estado de todos los módulos
- Notificaciones recientes

#### 💬 **Chat Inteligente**
Ubicación: Panel izquierdo o sección "Chat"

**Ejemplos de comandos:**
```
"¿Cuál es el estado del sistema?"
"Busca funciones de autenticación"
"Crea un backup del proyecto"
"Analiza el código en busca de errores"
"Muéstrame las tareas pendientes"
```

#### 🧠 **Neural Memory**
- Ver memorias almacenadas
- Historial de interacciones
- Contextos guardados

#### 📝 **Gestión de Tareas**
- 11 tareas en el sistema
- 6 pendientes, 5 completadas
- Crear, editar, eliminar tareas
- Prioridades y etiquetas

#### 🔍 **Búsqueda de Código**
- Búsqueda semántica
- 35 archivos indexados
- 7,684 líneas de código
- 19 funciones y 19 clases

#### 📊 **Métricas y Monitoreo**
- Performance en tiempo real
- Uso de memoria
- Operaciones del sistema
- Cache hits/misses

#### ⚙️ **Configuración**
- Ajustes del sistema
- Preferencias de usuario
- Configuración de módulos

#### 🔔 **Notificaciones**
- 14 notificaciones disponibles
- Alertas del sistema
- Actualizaciones de tareas

---

## 🎯 Primeros Pasos Recomendados

### 1️⃣ **Familiarízate con la Interfaz** (2 minutos)
- Abre el dashboard
- Navega por las diferentes secciones
- Revisa las notificaciones pendientes

### 2️⃣ **Prueba el Chat** (5 minutos)
```
Ejemplos para probar:

1. "Hola JARVIS, ¿estás funcionando?"
2. "¿Cuántas tareas tengo pendientes?"
3. "Muéstrame el estado del sistema"
4. "¿Qué archivos has indexado?"
```

### 3️⃣ **Explora las Tareas** (3 minutos)
- Ve a la sección de Tareas
- Revisa las 11 tareas existentes
- Crea una nueva tarea de prueba

### 4️⃣ **Búsqueda de Código** (3 minutos)
- Abre la búsqueda de código
- Busca: "jarvis"
- Busca: "function"
- Prueba búsqueda semántica

### 5️⃣ **Monitoreo en Tiempo Real** (5 minutos)
- Ve a Métricas
- Observa los gráficos actualizándose
- Revisa el uso de recursos
- Ve los archivos siendo monitoreados

---

## 🛠️ Funcionalidades Avanzadas

### **Modo Proactivo**
El sistema está monitoreando **53,262 archivos** automáticamente:
- Detecta cambios en tiempo real
- Sugiere optimizaciones
- Alerta sobre posibles problemas

### **Tareas Autónomas**
Delega tareas complejas a JARVIS:
```javascript
// Ejemplo: Crear tarea desde API
POST http://localhost:7777/api/tasks
{
  "title": "Analizar rendimiento del código",
  "description": "Buscar cuellos de botella",
  "priority": "high",
  "autonomous": true
}
```

### **Sistema de Memoria Neural**
- **2 sesiones activas**
- Consolidación automática cada 5 minutos
- Retención de contexto entre sesiones

### **Búsqueda Avanzada**
```javascript
// Búsqueda semántica
POST http://localhost:7777/api/code-search
{
  "query": "función que valida emails",
  "mode": "semantic",
  "limit": 10
}
```

---

## 🎨 Atajos de Teclado (si están disponibles)

```
Ctrl + K     → Abrir búsqueda rápida
Ctrl + B     → Toggle sidebar
Ctrl + /     → Abrir chat
Esc          → Cerrar modales
```

---

## 🔧 Comandos de Terminal

### **Ver estado de los servicios:**
```bash
# Backend
netstat -ano | findstr :7777

# Frontend
netstat -ano | findstr :5173
```

### **Probar API desde terminal:**
```bash
# Dashboard
curl http://localhost:7777/api/dashboard

# Tareas
curl http://localhost:7777/api/tasks

# Memorias
curl http://localhost:7777/api/memories
```

### **Ejecutar scripts de ejemplo:**
```bash
# Prueba rápida
node quick-test.js

# Prueba completa
node test-api-example.js
```

---

## 📊 Información del Sistema

### **Módulos Activos (12 Core):**
1. ✅ JARVIS Core Bridge
2. ✅ Proactive Agent
3. ✅ Neural Memory System
4. ✅ Code Search & Indexing
5. ✅ Autonomous Agent
6. ✅ Voice Control
7. ✅ Task Scheduler & Workflows
8. ✅ Logging & Monitoring
9. ✅ Settings Manager
10. ✅ Backup & Recovery
11. ✅ Test Runner & QA
12. ✅ Security & Authentication

### **Estadísticas en Tiempo Real:**
```
📁 Archivos monitoreados: 53,262
📊 Código indexado: 7,684 líneas
🔍 Archivos analizables: 35
🧠 Memorias activas: 1
📝 Tareas totales: 11
🔔 Notificaciones: 14
```

---

## 🆘 Solución de Problemas

### **El dashboard no carga:**
1. Verifica que ambos servicios estén corriendo
2. Revisa: `http://localhost:7777/api/dashboard`
3. Recarga la página (F5)
4. Limpia caché del navegador (Ctrl+Shift+Del)

### **Errores de conexión:**
1. Verifica los puertos:
   ```bash
   netstat -ano | findstr :7777
   netstat -ano | findstr :5173
   ```
2. Reinicia los servicios si es necesario

### **El chat no responde:**
- Verifica que el backend esté activo
- Revisa la consola del navegador (F12)
- Comprueba la conexión WebSocket

---

## 📚 Recursos Adicionales

### **Documentación:**
- `JARVIS-V2-COMPLETE-GUIDE.md` - Guía completa del sistema
- `README.md` - Información general
- `web-interface/backend/README.md` - Documentación del backend

### **Scripts útiles:**
- `test-api-example.js` - Ejemplos de uso de la API
- `quick-test.js` - Prueba rápida del sistema
- `start-all.bat` - Script de inicio (si existe)

### **Logs:**
- `web-interface/backend/logs/` - Logs del sistema
- `logs/` - Logs generales

---

## 🎉 ¡Listo para Empezar!

**Tu próxima acción:**
```
1. Abre http://localhost:5173 en tu navegador
2. Explora el dashboard
3. Prueba el chat con JARVIS
4. ¡Disfruta del sistema!
```

---

**Versión:** JARVIS MARK VII
**Estado:** Totalmente Operacional
**Uptime:** 8+ minutos
**Última actualización:** 2025-11-11

---

💡 **Tip:** El sistema aprende de tus patrones de uso. Mientras más lo uses, más inteligente se vuelve.

🤖 **JARVIS está listo para ayudarte!**
