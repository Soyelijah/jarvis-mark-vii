# 🚀 JARVIS - Quick Start Guide

## Inicio Rápido en 3 Pasos

### 1️⃣ Instalar Ollama (IA Local - Una sola vez)

**Windows:**
1. Descargar desde: https://ollama.com/download/windows
2. Ejecutar instalador
3. Abrir CMD y ejecutar:
```bash
ollama pull qwen2.5-coder:latest
```

**macOS/Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama pull qwen2.5-coder:latest
```

### 2️⃣ Iniciar Ollama

```bash
# En una terminal separada (déjala corriendo):
ollama serve
```

### 3️⃣ Iniciar JARVIS

```bash
# En otra terminal:
npm run jarvis
```

---

## 🎯 Primeros Comandos

Una vez iniciado JARVIS, prueba:

### Ejemplo 1: Aprender sobre un tema
```
JARVIS> learn React hooks tutorial
```

### Ejemplo 2: Ejecutar tarea autónoma
```
JARVIS> autonomous Crear un validador de email con tests y documentación
```

### Ejemplo 3: Ver estadísticas
```
JARVIS> stats
```

### Ejemplo 4: Consultar conocimiento
```
JARVIS> query ¿Cómo usar useState en React?
```

---

## ❓ Problemas Comunes

### "Error: connect ECONNREFUSED"
**Solución:** Ollama no está corriendo. Ejecuta `ollama serve` en otra terminal.

### "Model not found"
**Solución:** Descarga el modelo: `ollama pull qwen2.5-coder:latest`

### "Cannot find module"
**Solución:** Instala dependencias: `npm install`

---

## 📚 Documentación Completa

- [Sistema Autónomo Completo](./AUTONOMOUS-SYSTEM.md)
- [Arquitectura del Sistema](./ARCHITECTURE.md)
- Documentación inline en cada módulo

---

## 🎉 ¡Listo!

JARVIS está listo para trabajar autónomamente 🤖

Comandos útiles:
- `help` - Ver todos los comandos
- `status` - Ver estado de sistemas
- `exit` - Salir

---

**¿Necesitas ayuda?** Escribe `help` dentro de JARVIS 💙
