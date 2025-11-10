# 🚀 Guía de Deployment - J.A.R.V.I.S. MARK VII

**Fecha:** 10 de Noviembre de 2025
**Versión:** MARK VII - Enterprise Edition
**Estado:** Production Ready

---

## 📋 Requisitos Previos

### Software Necesario
- **Node.js** 18+ → https://nodejs.org
- **Git** → https://git-scm.com
- **Ollama** (opcional, para IA local) → https://ollama.ai

### Cuentas Necesarias
- **GitHub** - Para versionado y CI/CD
- **Vercel/Netlify** (opcional) - Para deployment del frontend
- **Railway/Render** (opcional) - Para deployment del backend

---

## 🔧 Setup Local

### 1. Clonar Repositorio

```bash
git clone https://github.com/TU_USUARIO/jarvis-standalone.git
cd jarvis-standalone
```

### 2. Instalar Dependencias

```bash
# Root dependencies
npm install

# Backend dependencies
cd web-interface/backend
npm install
cd ../..

# Frontend dependencies
cd web-interface/frontend
npm install
cd ../..
```

### 3. Configurar Variables de Entorno

Crear `.env` en el root:

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

### 4. Iniciar Ollama

```bash
# Instalar modelos
ollama pull mistral
ollama pull qwen2.5-coder:32b  # Opcional, 20GB

# Iniciar servicio
ollama serve
```

### 5. Iniciar Aplicación

#### Windows
```bash
# Opción 1: Script automático
INICIAR-TODO.bat

# Opción 2: Manual
# Terminal 1
ollama serve

# Terminal 2
cd web-interface/backend
node server.cjs

# Terminal 3
cd web-interface/frontend
npm run dev
```

#### Linux/macOS
```bash
# Terminal 1
ollama serve

# Terminal 2
cd web-interface/backend
node server.cjs &

# Terminal 3
cd web-interface/frontend
npm run dev
```

---

## 🌐 Deployment a Producción

### Frontend (Vercel - Recomendado)

#### 1. Build Local
```bash
cd web-interface/frontend
npm run build
```

#### 2. Deploy a Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd web-interface/frontend
vercel --prod
```

#### 3. Variables de Entorno en Vercel
```
VITE_API_URL=https://tu-backend.railway.app
VITE_WS_URL=wss://tu-backend.railway.app
```

---

### Backend (Railway - Recomendado)

#### 1. Crear archivo de configuración Railway

`railway.json`:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd web-interface/backend && node server.cjs",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE"
  }
}
```

#### 2. Deploy
```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Inicializar
railway init

# Deploy
railway up
```

#### 3. Variables de Entorno en Railway
```
NODE_ENV=production
PORT=3001
OLLAMA_URL=http://localhost:11434
```

---

### Alternativa: Docker

#### Dockerfile Backend
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY web-interface/backend/package*.json ./web-interface/backend/
COPY web-interface/backend ./web-interface/backend
COPY core ./core

RUN npm ci --only=production
RUN cd web-interface/backend && npm ci --only=production

EXPOSE 3001

CMD ["node", "web-interface/backend/server.cjs"]
```

#### Dockerfile Frontend
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY web-interface/frontend/package*.json ./
RUN npm ci

COPY web-interface/frontend ./
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose
```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
    depends_on:
      - backend
```

---

## 🔄 CI/CD con GitHub Actions

El proyecto ya incluye `.github/workflows/ci.yml` que se ejecuta automáticamente en cada push.

### Workflow Incluye:
- ✅ Tests del backend
- ✅ Tests del frontend
- ✅ Build del frontend
- ✅ Análisis de código
- ✅ Artifacts generados

### Para Deploy Automático

Agregar a `.github/workflows/ci.yml`:

```yaml
  deploy-frontend:
    needs: [build-frontend]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v4
    - uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        working-directory: ./web-interface/frontend
```

---

## 📊 Monitoreo en Producción

### Health Checks

El backend expone:
```
GET /api/health
```

Respuesta:
```json
{
  "status": "ok",
  "timestamp": "2025-11-10T...",
  "service": "JARVIS MARK VII"
}
```

### Logs

```bash
# Ver logs en Railway
railway logs

# Ver logs en Vercel
vercel logs
```

---

## 🔐 Seguridad

### Variables de Entorno

**NUNCA** commitear:
- `.env`
- API keys
- Secrets
- Contraseñas

### CORS

Actualizar `web-interface/backend/server.cjs`:

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));
```

### Rate Limiting

Agregar en backend:

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite por IP
});

app.use('/api/', limiter);
```

---

## 🧪 Testing en Producción

### Smoke Tests

```bash
# Health check
curl https://tu-backend.com/api/health

# Frontend
curl https://tu-frontend.com

# WebSocket
wscat -c wss://tu-backend.com
```

### Load Testing

```bash
# Instalar Apache Bench
apt install apache2-utils

# Test
ab -n 1000 -c 10 https://tu-backend.com/api/health
```

---

## 📈 Escalabilidad

### Horizontal Scaling

#### Railway
- Auto-scaling incluido
- Máx 8 réplicas

#### Vercel
- Edge network global
- Auto-scaling ilimitado

### Database Scaling

Si usas SQLite en producción (NO recomendado):

**Migrar a PostgreSQL:**

```bash
npm install pg
```

Actualizar backend para usar PostgreSQL en producción:

```javascript
const db = process.env.NODE_ENV === 'production'
  ? new PostgreSQL(process.env.DATABASE_URL)
  : new SQLite('./data/jarvis.db');
```

---

## 🚨 Troubleshooting

### Error: EADDRINUSE

```bash
# Puerto ocupado
lsof -ti:3001 | xargs kill -9
```

### Error: Ollama no responde

```bash
# Reiniciar Ollama
pkill ollama
ollama serve &
```

### Error: WebSocket disconnected

```bash
# Verificar CORS
# Verificar firewall
# Verificar proxy/nginx config
```

---

## 📚 Recursos

- **Railway Docs:** https://docs.railway.app
- **Vercel Docs:** https://vercel.com/docs
- **Docker Docs:** https://docs.docker.com
- **Ollama Docs:** https://ollama.ai/docs

---

## ✅ Checklist de Deployment

### Antes de Deployar

- [ ] Tests pasando
- [ ] Build exitoso
- [ ] Variables de entorno configuradas
- [ ] .gitignore actualizado
- [ ] README actualizado
- [ ] Documentación completa

### Durante Deployment

- [ ] Backend deployado
- [ ] Frontend deployado
- [ ] Base de datos migrada
- [ ] Health checks OK
- [ ] WebSocket funcionando

### Después de Deployment

- [ ] Smoke tests pasando
- [ ] Monitoreo configurado
- [ ] Logs funcionando
- [ ] Backups configurados
- [ ] DNS configurado

---

**"Sistema listo para producción. Como siempre, Señor."** ⚡

*- J.A.R.V.I.S. MARK VII*
