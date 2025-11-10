# 🌐 J.A.R.V.I.S. MARK VII - Panel Web Profesional

> Sistema de IA con interfaz web de nivel enterprise

[![Status](https://img.shields.io/badge/Status-Production-success.svg)]()
[![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-green.svg)](https://nodejs.org)

---

## 🚀 Inicio Rápido

### Opción 1: Script Automático (Recomendado)

```bash
# Windows: Doble click en
INICIAR-TODO.bat

# Esto inicia automáticamente:
# ✅ Ollama (IA Local)
# ✅ Backend API (puerto 3001)
# ✅ Frontend React (puerto 5173)
# ✅ Abre el navegador
```

### Opción 2: Manual

```bash
# Terminal 1: Backend
cd web-interface/backend
node server.cjs

# Terminal 2: Frontend
cd web-interface/frontend
npm run dev

# Abrir: http://localhost:5173
```

---

## ✨ Características del Panel Web

### 📊 Dashboard con Gráficas en Tiempo Real
- Gráfico de área: CPU/RAM (actualiza cada 3s)
- Gráfico circular: Distribución de tareas
- Gráfico de barras: Actividad semanal
- Cards animados con gradientes Iron Man

### 💬 Chat con IA Premium
- **Markdown completo**: H1-H6, listas, blockquotes, links
- **Syntax Highlighting**: Código coloreado (VSCode theme)
- **Copiar código**: Click para copiar bloques
- **Avatares animados**: JARVIS 🤖 vs Usuario 👤
- **Indicador de escritura**: 3 puntos mientras procesa
- **IA local ilimitada**: Mistral 7B vía Ollama

### ⚡ Monitor del Sistema
- **Métricas reales**: CPU, RAM, Disco, Uptime
- **Logs en vivo**: WebSocket en tiempo real
- **Estado de servicios**: Backend, Frontend, Ollama, DB
- **Barras animadas**: Progreso visual

### 🖥️ Terminal Integrado
- Comandos: `help`, `status`, `tasks`, `chat`, `search`
- Historial con ↑↓
- Estilo hacker con colores
- Botones rápidos

### ⌘ Command Palette
- **Atajo**: `Ctrl+K` (Cmd+K en Mac)
- **Búsqueda universal**: Comandos, tareas, acciones
- **Navegación por teclado**: ↑↓ Enter ESC
- **Filtros en tiempo real**

### 🔔 Notificaciones Toast
- Eventos automáticos (tareas, memoria, conexión)
- Animaciones slide-in
- Auto-dismiss configurable
- Colores por tipo

---

## 🛠️ Stack Tecnológico

### Frontend
```json
{
  "react": "19.0.0",
  "vite": "7.2.2",
  "tailwindcss": "3.4.18",
  "recharts": "2.x",
  "react-markdown": "^9.0.0",
  "react-syntax-highlighter": "^15.5.0",
  "socket.io-client": "4.8.1",
  "axios": "1.13.2"
}
```

### Backend
```json
{
  "express": "5.1.0",
  "socket.io": "4.8.1",
  "sqlite3": "5.1.6",
  "systeminformation": "^5.x",
  "puppeteer": "21.0.0"
}
```

---

## 📁 Arquitectura

```
┌──────────────────────────────────┐
│   FRONTEND (React 19 + Vite)    │
│   http://localhost:5173          │
│   - 7 paneles principales        │
│   - WebSocket real-time          │
│   - Hot Module Replacement       │
└──────────────────────────────────┘
              ↕ REST + WS
┌──────────────────────────────────┐
│   BACKEND (Express + Socket.io)  │
│   http://localhost:3001          │
│   - 24+ API endpoints            │
│   - Métricas del sistema         │
│   - JARVIS Bridge                │
└──────────────────────────────────┘
              ↕
┌──────────────────────────────────┐
│   SERVICIOS                      │
│   - Ollama (Mistral 7B)          │
│   - SQLite Database              │
│   - File System                  │
└──────────────────────────────────┘
```

---

## 🎯 Paneles Disponibles

| Panel | Descripción | Características |
|-------|-------------|----------------|
| 💬 **Chat** | Conversación con IA | Markdown, Syntax, Avatares |
| 📊 **Dashboard** | Métricas visuales | 3 gráficas animadas |
| ⚡ **Monitor** | Sistema en vivo | CPU, RAM, Logs, Servicios |
| 🖥️ **Terminal** | CLI web | 8+ comandos, historial |
| ✅ **Tareas** | Gestión de tareas | CRUD completo |
| 🧠 **Memorias** | Base de conocimiento | Búsqueda semántica |
| 📁 **Proyectos** | Proyectos generados | Lista + detalles |

---

## ⌨️ Atajos de Teclado

| Atajo | Función |
|-------|---------|
| `Ctrl+K` | Abrir Command Palette |
| `Enter` | Enviar mensaje/comando |
| `Shift+Enter` | Nueva línea (Chat) |
| `↑↓` | Navegar historial |
| `ESC` | Cerrar modales |

---

## 🔧 Troubleshooting

### Frontend no carga
```bash
cd web-interface/frontend
rm -rf node_modules/.vite
npm run dev
```

### Backend crashea
```bash
cd web-interface/backend
rm -rf node_modules
npm install
node server.cjs
```

### Ollama no conecta
```bash
# Windows
taskkill /F /IM ollama.exe
"C:\Users\zeNk0\AppData\Local\Programs\Ollama\ollama.exe" serve

# Verificar
curl http://localhost:11434/api/tags
```

---

## 📊 Métricas de Rendimiento

- ⚡ Carga inicial: < 1s
- 🔄 HMR: < 200ms
- 🤖 Respuesta IA: 1-3s
- 📈 Update métricas: 3s
- 🌐 WebSocket latency: < 50ms

---

## 🎨 Capturas Conceptuales

### Dashboard
```
┌────────────────────────────────────────┐
│ 📊 Dashboard MARK VII                 │
├────────────────────────────────────────┤
│ [🧠 Memorias] [📋 Tareas] [✅ Compl.] │
│                                        │
│  ┌─────────────────────────────────┐  │
│  │   📈 Gráfica CPU/RAM            │  │
│  │   (Área animada tiempo real)    │  │
│  └─────────────────────────────────┘  │
│                                        │
│  ┌──────────┐  ┌──────────┐          │
│  │ 🎯 Tareas│  │ 📊 Semana│          │
│  │ (Círculo)│  │ (Barras) │          │
│  └──────────┘  └──────────┘          │
└────────────────────────────────────────┘
```

### Chat
```
┌────────────────────────────────────────┐
│ 💬 Chat con J.A.R.V.I.S.              │
├────────────────────────────────────────┤
│  🤖 Buen día, Señor.                  │
│     Soy J.A.R.V.I.S...                │
│                                        │
│                 Explícame React 👤     │
│                                        │
│  🤖 **React es...**                   │
│                                        │
│     ```javascript                      │
│     function App() { ... }             │
│     ```                                │
│     [📋 Copiar código]                 │
│                                        │
│  [Pregúntale lo que quieras...]  [📤] │
└────────────────────────────────────────┘
```

### Monitor
```
┌────────────────────────────────────────┐
│ ⚡ Monitor del Sistema                │
├────────────────────────────────────────┤
│ [💻 CPU 4%] [🧠 RAM 74%] [💾 Disk 67%]│
│                                        │
│ 📝 Logs en Tiempo Real:                │
│ ┌────────────────────────────────────┐ │
│ │ [23:45] ✅ Task created            │ │
│ │ [23:46] 📌 Memory saved            │ │
│ │ [23:47] ⚠️ High CPU usage          │ │
│ └────────────────────────────────────┘ │
│                                        │
│ 🔌 Servicios: [✅✅✅✅✅✅]            │
└────────────────────────────────────────┘
```

---

## 🚀 Roadmap Futuro

- [ ] PWA (Progressive Web App)
- [ ] Modo oscuro/claro toggle
- [ ] Autenticación JWT
- [ ] GitHub integration visual
- [ ] Exportar métricas a PDF
- [ ] Speech-to-text para chat
- [ ] Temas personalizables
- [ ] Multi-usuario
- [ ] Mobile responsive mejorado
- [ ] Dashboard customizable

---

## 💡 Tips de Uso

1. **Usa Ctrl+K constantemente** - Es la forma más rápida de navegar
2. **Pregunta código a la IA** - Responde con syntax highlighting
3. **Monitorea el sistema** - Panel Monitor en segundo monitor
4. **Terminal web** - Mejor que abrir cmd para comandos rápidos
5. **Notificaciones** - No te pierdas eventos importantes

---

**"Como siempre, Señor." - J.A.R.V.I.S. ⚡**

---

*Desarrollado con ❤️ • Powered by Ollama • Built with React 19*
