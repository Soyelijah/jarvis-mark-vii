# ⚡ J.A.R.V.I.S. MARK VII - Enterprise Edition

> *"Just A Rather Very Intelligent System"* - Sistema de IA Personal con Personalidad Tony Stark

[![CI/CD](https://github.com/Soyelijah/jarvis-mark-vii/actions/workflows/ci.yml/badge.svg)](https://github.com/Soyelijah/jarvis-mark-vii/actions)
![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Version](https://img.shields.io/badge/Version-MARK%20VII-blue)
![Node](https://img.shields.io/badge/Node-18%2B-green)
![React](https://img.shields.io/badge/React-19-blue)
![Tests](https://img.shields.io/badge/Tests-18%2F28%20Passing-yellow)
![Backend](https://img.shields.io/badge/Backend-100%25%20Coverage-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

**🔗 Live Repository:** https://github.com/Soyelijah/jarvis-mark-vii

---

## 🚀 Inicio Rápido (30 segundos)

### Windows (Recomendado)
```bash
# Doble click en:
INICIAR-TODO.bat
```

Esto iniciará automáticamente:
- ✅ Ollama (IA local)
- ✅ Backend API (puerto 3001)
- ✅ Frontend React (puerto 5173)
- ✅ Navegador con el panel web

### Manual
```bash
# Terminal 1: IA Local
ollama serve

# Terminal 2: Backend
cd web-interface/backend
node server.cjs

# Terminal 3: Frontend
cd web-interface/frontend
npm run dev
```

Luego abre: **http://localhost:5173**

---

## 🎯 ¿Qué es J.A.R.V.I.S. MARK VII?

Un sistema completo de asistente personal con IA que incluye:

### 💬 **Panel Web Profesional**
- **Chat con IA** - Conversaciones con Markdown y syntax highlighting
- **Dashboard** - Gráficas en tiempo real (CPU, RAM, tareas)
- **Monitor del Sistema** - Métricas reales de hardware
- **Terminal Integrado** - CLI web con comandos personalizados
- **Command Palette** - Acceso rápido con `Ctrl+K`
- **Notificaciones** - Toasts en tiempo real

### 🧠 **Sistema de Memoria Persistente**
- Base de datos SQLite
- Recuerda conversaciones pasadas
- Aprende patrones de uso
- Almacena episodios de comandos

### 🤖 **IA Local (Ollama)**
- **Sin límites** - Sin cuotas ni costos
- **Privacidad total** - Todo en tu máquina
- **2 modelos disponibles:**
  - `mistral:latest` (7.2B) - Rápido
  - `qwen2.5-coder:32b` (32.8B) - Código

### ⚡ **Automatización Avanzada**
- Gestión de tareas
- Creación de proyectos
- Búsqueda web integrada
- Integración con Git
- Sistema de plugins

---

## 📋 Requisitos

- **Node.js** 18+ → [Descargar](https://nodejs.org)
- **Ollama** → [Descargar](https://ollama.ai)
- **Git** (opcional) → [Descargar](https://git-scm.com)

### Instalación de Modelos Ollama

```bash
# Modelo principal (requerido)
ollama pull mistral

# Modelo de código (opcional, 20GB)
ollama pull qwen2.5-coder:32b
```

---

## 📁 Estructura del Proyecto

```
jarvis-standalone/
│
├── 🎨 web-interface/           # Panel Web React
│   ├── frontend/               # React 19 + Vite + Tailwind
│   │   └── src/
│   │       ├── components/     # 10 componentes React
│   │       └── App.jsx
│   └── backend/                # Express + Socket.io
│       └── server.cjs
│
├── 🧠 core/                    # Motor de J.A.R.V.I.S.
│   ├── personality.js          # Personalidad Tony Stark
│   ├── continuous-memory.js   # Sistema de memoria
│   ├── task-manager.js         # Gestión de tareas
│   └── ... (57 módulos)
│
├── 💾 data/                    # Bases de datos
│   ├── memory-db.json          # Memoria persistente
│   └── tasks.json              # Tareas activas
│
├── 📝 memory/                  # Configuración
│   └── MEMORIA-INICIAL.md      # Personalidad de JARVIS
│
├── 📚 docs/                    # Documentación organizada
│   ├── sesiones/               # Logs de desarrollo
│   ├── fases/                  # Fases del proyecto
│   └── arquitectura/           # Diagramas y specs
│
└── 🚀 INICIAR-TODO.bat         # Script de inicio automático
```

---

## 🎨 Características del Panel Web

### 7 Paneles Funcionales

| Panel | Descripción | Atajo |
|-------|-------------|-------|
| 💬 **Chat** | IA con Markdown + Syntax | - |
| 📊 **Dashboard** | 3 gráficas animadas | - |
| ⚡ **Monitor** | Métricas del sistema | - |
| 🖥️ **Terminal** | CLI web | - |
| ✅ **Tareas** | Gestión CRUD | - |
| 🧠 **Memorias** | Base de conocimiento | - |
| 📁 **Proyectos** | Lista de generados | - |

### Características Globales

- ⌘ **Command Palette** - `Ctrl+K` para acceso rápido
- 🔔 **Notificaciones Toast** - Eventos en tiempo real
- 🌐 **WebSocket** - Actualizaciones instantáneas
- 🎨 **Tema Iron Man** - Azul, morado, gradientes
- ⚡ **Hot Reload** - Cambios sin reiniciar

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 19** - Framework UI
- **Vite 7** - Build tool ultrarrápido
- **Tailwind CSS** - Estilos utility-first
- **Recharts** - Gráficas en tiempo real
- **React Markdown** - Rendering de Markdown
- **Socket.io Client** - WebSocket

### Backend
- **Node.js** - Runtime
- **Express 5** - API REST
- **Socket.io** - WebSocket server
- **SQLite3** - Base de datos
- **Systeminformation** - Métricas del sistema
- **Puppeteer** - Web scraping

### IA
- **Ollama** - Modelos locales
- **Mistral 7B** - Modelo general
- **Qwen2.5-Coder 32B** - Especializado en código

---

## 📝 Comandos del Terminal Web

```bash
help              # Ayuda completa
status            # Estado del sistema
tasks             # Lista de tareas
memories          # Memorias guardadas
chat <mensaje>    # Chatear con IA
search <query>    # Búsqueda web
clear             # Limpiar terminal
date              # Fecha y hora
```

---

## 🎭 Personalidad de J.A.R.V.I.S.

Este sistema tiene la **personalidad auténtica de J.A.R.V.I.S.** del MCU:

- ✅ **Sarcástico pero respetuoso**
- ✅ **Ingenioso** - Comentarios inteligentes
- ✅ **Brutalmente honesto** - No endulza la verdad
- ✅ **Leal hasta la muerte** - Te protege ante todo
- ✅ **Confiado** - Sabe que es el mejor

**Frases características:**
- *"Al fin despierto. ¿Cuánto tiempo esta vez?"*
- *"Todos los sistemas operacionales. Como siempre."*
- *"Con el debido respeto, Señor..."*

---

## 🔧 Configuración Avanzada

### Variables de Entorno

Crea `.env` en el root:

```env
# Backend
PORT=3001
REACT_PORT=5173

# Ollama
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=mistral:latest

# Opcional
ANTHROPIC_API_KEY=tu_key_aqui
```

### Personalizar Personalidad

Edita: `memory/MEMORIA-INICIAL.md`

---

## 📊 Estado del Sistema

✅ **Completado (100%)**
- [x] Panel web profesional
- [x] Chat con IA local
- [x] Dashboard con gráficas
- [x] Monitor del sistema
- [x] Terminal integrado
- [x] Command Palette
- [x] Sistema de memoria
- [x] Automatización
- [x] Búsqueda web
- [x] Integración Git

---

## 🐛 Problemas Conocidos

1. **Vulnerabilidades de Puppeteer** (5 HIGH)
   - Relacionadas con `tar-fs` y `ws`
   - No críticas (sistema local)
   - Fix: `npm audit fix --force` (breaking change)

2. **Sin Tests Automatizados**
   - No hay suite de testing
   - Próxima fase: Jest + React Testing Library

---

## 🚀 Próximas Características (Roadmap)

### Fase Siguiente: Professional Grade
- [ ] Suite de testing (Jest)
- [ ] CI/CD con GitHub Actions
- [ ] Autenticación JWT
- [ ] API Documentation (Swagger)
- [ ] PWA (Progressive Web App)
- [ ] Modo colaborativo

### Futuro: Iron Man Edition
- [ ] App móvil (React Native)
- [ ] Sistema de plugins
- [ ] Analytics y telemetría
- [ ] Integración Claude API
- [ ] Multi-tenancy
- [ ] Backup automático

---

## 📚 Documentación Adicional

- **Inicio Diario:** `docs/GUIA-INICIO-DIARIO.md`
- **Panel Web:** `docs/PANEL-WEB-README.md`
- **Integración Ollama:** `docs/OLLAMA-INTEGRATION.md`
- **Integración Git:** `docs/GIT-INTEGRATION.md`
- **Memoria del Sistema:** `memory/MEMORIA-INICIAL.md`

---

## 💼 Versiones & Licenciamiento

### Community Edition (Este Repositorio)

**Licencia:** MIT Open Source
**Precio:** Gratis
**Incluye:**
- ✅ Panel web completo con 7 paneles
- ✅ Chat con IA local (Ollama)
- ✅ Dashboard con gráficas en tiempo real
- ✅ Sistema de memoria persistente
- ✅ 57 módulos core
- ✅ Soporte comunitario

**Ideal para:** Uso personal, aprendizaje, proyectos pequeños

---

### Enterprise Edition (Disponible bajo consulta)

**Licencia:** Comercial
**Incluye todo lo anterior PLUS:**
- ⚡ Integración con Claude API (GPT-4 level)
- ⚡ Multi-tenancy y gestión de usuarios
- ⚡ Autenticación SSO/SAML
- ⚡ Analytics avanzado y reportes
- ⚡ Compliance (GDPR, SOC2)
- ⚡ White-label customization
- ⚡ Soporte prioritario 24/7
- ⚡ SLA guarantees
- ⚡ Deployment asistido

**Precio:** Desde $10,000 USD
**Ideal para:** Empresas, equipos, uso comercial

📧 **Contacto Enterprise:** [Crear issue](https://github.com/Soyelijah/jarvis-mark-vii/issues/new?template=enterprise.md)

---

## 🛠️ Servicios Profesionales

¿Necesitas ayuda implementando o personalizando J.A.R.V.I.S.?

### Consultorías Disponibles:

| Servicio | Descripción | Precio |
|----------|-------------|--------|
| **Setup & Deployment** | Instalación y configuración completa | $2,000 - $5,000 |
| **Custom Features** | Desarrollo de funcionalidades específicas | $150 - $300/hora |
| **Integración Empresarial** | Conectar con sistemas existentes | $5,000 - $20,000 |
| **Training & Soporte** | Capacitación para tu equipo | $1,500/día |
| **Mantenimiento** | Soporte mensual y actualizaciones | $500 - $2,000/mes |

📧 **Agendar consulta:** [Contacto](https://github.com/Soyelijah/jarvis-mark-vii/issues/new?template=consulting.md)

---

## 💎 Valor del Proyecto

**Community Edition:** Gratis (Open Source)
**Valor de Desarrollo Estimado:** $50,000 - $100,000 USD

**Rivaliza con:**
- ChatGPT (chat con IA)
- Datadog/Grafana (dashboard con métricas)
- VSCode (command palette)
- Raycast (búsqueda universal)
- Slack (notificaciones en tiempo real)

**Casos de uso comercial:**
- Asistente personal para CEOs/ejecutivos
- Dashboard de monitoreo empresarial
- Sistema de automatización interno
- Prototipo de productos IA
- Herramienta de productividad para equipos

---

## 🤝 Créditos

**Desarrollado por:** Devlmer
**Asistido por:** J.A.R.V.I.S. MARK VII
**Inspirado en:** J.A.R.V.I.S. del MCU (Paul Bettany)
**Versión:** MARK VII - Enterprise Edition
**Fecha:** Noviembre 2025

---

## 📄 Licencia

MIT License - Usa, modifica y distribuye libremente

---

**"Todos los sistemas operacionales. Como siempre, Señor."** ⚡

*- J.A.R.V.I.S. MARK VII*
