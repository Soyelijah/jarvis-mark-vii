# JARVIS Mark VII — Enterprise-Grade Construction Plan

**Autor:** Manus AI — Análisis Técnico de Arquitectura  
**Fecha:** Abril 2026  
**Versión del Repositorio Analizado:** `v1.0.0-enterprise` (commit actual en `master`)

---

## Resumen Ejecutivo

JARVIS Mark VII es un sistema de asistente personal inteligente con una arquitectura de tres capas (React Frontend, Node.js/Express Backend, AI Engine Layer) que ya cuenta con más de 28,000 líneas de código, 25 subsistemas integrados y un pipeline de CI/CD funcional. Sin embargo, el análisis técnico revela que el proyecto se encuentra en un estado de **madurez media**: la estructura arquitectónica es sólida y bien diseñada, pero múltiples componentes críticos operan en modo simulado (`mock`), la capa de persistencia depende exclusivamente de SQLite y archivos JSON locales, la cobertura de tests es inferior al 5% del código total, y las integraciones externas más valiosas (Smart Home, Visión, Voz, Spotify, Google APIs) están implementadas como stubs condicionales que fallan silenciosamente.

Este plan define la hoja de ruta técnica para llevar el proyecto a un nivel **Enterprise-Grade** real: un sistema que no solo funciona localmente, sino que escala horizontalmente, tolera fallos, garantiza la integridad de los datos, y puede ser auditado, monitoreado y desplegado con confianza en producción.

---

## Estado Actual: Diagnóstico Técnico

Antes de definir el camino hacia adelante, es fundamental entender con precisión el estado actual del sistema. El análisis del repositorio revela los siguientes hallazgos críticos.

### Fortalezas Identificadas

El proyecto tiene una base arquitectónica bien pensada. El patrón de "Integration Modules" en el backend (`auth-integration.cjs`, `ai-integration.cjs`, etc.) es correcto y facilita la extensibilidad. El sistema de memoria neural de 4 capas (`memory-manager.cjs`) está bien diseñado conceptualmente. El pipeline de CI/CD en GitHub Actions ya incluye análisis de código ML, escaneo de seguridad y builds de Docker. La separación de responsabilidades entre el core y el web-interface es clara.

### Deuda Técnica Crítica Identificada

| Área | Problema | Impacto |
|------|----------|---------|
| **Persistencia** | 100% SQLite y JSON local; sin PostgreSQL real | Bloquea escalabilidad horizontal y multi-instancia |
| **Tests** | 6 archivos de test para 59 módulos de core | Sin safety net para refactorizaciones |
| **Integraciones** | Fases 7, 8, 9 corren en modo simulado | Las features más valiosas no funcionan en producción |
| **Memoria Vectorial** | `semantic-search.cjs` depende de Ollama local | Búsqueda semántica no disponible sin Ollama corriendo |
| **Seguridad** | 5 vulnerabilidades HIGH en dependencias (Puppeteer) | Riesgo en despliegue productivo |
| **Estado Global Frontend** | Estado distribuido en props y sockets sin gestor centralizado | Race conditions y bugs difíciles de reproducir |
| **K8s Secrets** | `changeme-in-production` en `k8s/deployment.yml` | Credenciales por defecto en manifiestos de producción |

---

## Arquitectura Objetivo (Target Architecture)

El estado objetivo es un sistema distribuido, observable y auto-reparable con la siguiente topología:

```
┌─────────────────────────────────────────────────────────────────────┐
│                    JARVIS Mark VII — Production                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────────────┐ │
│  │  CDN / Nginx │────►│  React PWA   │     │   AI Microservices   │ │
│  │  (Ingress)   │     │  (Vite/SSR)  │     │  ┌────────────────┐  │ │
│  └──────────────┘     └──────┬───────┘     │  │ Whisper (Voice)│  │ │
│                               │ WebSocket   │  │ YOLOv8 (Vision)│  │ │
│                               │             │  │ Ollama (LLM)   │  │ │
│  ┌────────────────────────────▼──────────┐  │  └────────────────┘  │ │
│  │         Node.js Backend (x3 pods)     │  └──────────────────────┘ │
│  │  Express + Socket.io + JWT + RBAC     │◄──────── gRPC/HTTP ──────┘ │
│  └────────────────────────────┬──────────┘                           │
│                                │                                      │
│  ┌─────────────┬───────────────┼────────────────┬──────────────────┐ │
│  │             │               │                │                  │ │
│  ▼             ▼               ▼                ▼                  ▼ │
│ PostgreSQL   Redis         RabbitMQ          Pinecone          Milvus │
│ (Relacional) (Cache/Sess.) (Message Bus)    (Vectorial RAG)  (Backup) │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │              Observability Stack                                │  │
│  │  Prometheus ──► Grafana │ Jaeger (Tracing) │ ELK Stack (Logs) │  │
│  └────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Sprint 1: Fundamentos de Persistencia Empresarial (2 Semanas)

Este sprint es el más crítico. Sin una capa de persistencia robusta, ninguna otra mejora puede sostenerse en producción.

### 1.1 Migración a PostgreSQL con Prisma ORM

El objetivo es reemplazar todas las escrituras a archivos JSON y SQLite por operaciones contra PostgreSQL, usando Prisma como ORM para gestionar migraciones y garantizar la integridad del esquema.

**Archivos a migrar:**
- `core/neural-memory/memory-manager.cjs` → Tablas `memories`, `sessions`, `episodes`
- `core/security/auth-manager.cjs` → Tablas `users`, `roles`, `sessions`, `audit_log`
- `core/metrics-persistence.cjs` → Tabla `metrics_snapshots`
- `core/learning/pattern-database.cjs` → Tabla `learned_patterns`

**Esquema Prisma propuesto (fragmento):**

```prisma
model Memory {
  id          String   @id @default(cuid())
  type        String   // 'working' | 'short_term' | 'long_term' | 'episodic'
  content     Json
  importance  Float    @default(0.5)
  embedding   Float[]  // Para búsqueda vectorial
  createdAt   DateTime @default(now())
  expiresAt   DateTime?
  userId      String
  user        User     @relation(fields: [userId], references: [id])
}

model User {
  id          String   @id @default(cuid())
  username    String   @unique
  email       String   @unique
  passwordHash String
  role        Role     @default(VIEWER)
  memories    Memory[]
  sessions    Session[]
  auditLogs   AuditLog[]
  createdAt   DateTime @default(now())
}
```

### 1.2 Integración de Base de Datos Vectorial (Pinecone/Milvus)

La búsqueda semántica actual en `core/neural-memory/semantic-search.cjs` depende de Ollama corriendo localmente para generar embeddings. Para producción, se debe desacoplar esto.

**Estrategia:**
1. Usar la API de embeddings de OpenAI (`text-embedding-3-small`) o un modelo local de Ollama como generador de embeddings.
2. Almacenar los vectores en Pinecone (SaaS) o Milvus (self-hosted).
3. Implementar un servicio de búsqueda semántica que sea independiente del estado del servidor Ollama local.

### 1.3 Expansión de Redis para Caché Distribuido

El sistema ya tiene Redis en el `docker-compose.yml` pero su uso es mínimo. Se debe expandir para:
- **Caché de respuestas de IA:** Respuestas idénticas o muy similares no deben re-invocar el LLM.
- **Rate Limiting distribuido:** Compartir el estado de rate limiting entre múltiples instancias del backend.
- **Pub/Sub para WebSockets:** Cuando el backend escala a múltiples pods, los eventos de Socket.io deben sincronizarse usando `socket.io-redis` (adaptador Redis).

---

## Sprint 2: Maduración de los Motores de IA (3 Semanas)

### 2.1 Arquitectura de Agentes con Message Broker

El `advanced-orchestrator.js` actualmente coordina agentes usando eventos en memoria (`EventEmitter`). Esto funciona en un solo proceso pero es inescalable. La solución es introducir RabbitMQ como message broker.

**Flujo propuesto:**
1. El orquestador publica tareas en colas de RabbitMQ (ej. `queue.code-analysis`, `queue.security-audit`).
2. Los agentes especializados son workers independientes que consumen de sus colas.
3. Los resultados se publican de vuelta en una cola de resultados.
4. El orquestador agrega los resultados y actualiza el estado.

Este cambio permite que cada agente corra en su propio contenedor y escale independientemente.

### 2.2 Finalización de Integraciones de Fases 7, 8 y 9

Las integraciones de Smart Home, Visión, Voz y Música son las que más valor aportan al usuario pero están en modo simulado. La estrategia para completarlas es la siguiente:

| Integración | Estado Actual | Acción Requerida | Dependencia |
|-------------|---------------|------------------|-------------|
| **Voz (VOSK)** | Modo simulado si VOSK no está | Contenedor Docker con VOSK preinstalado | `vosk` npm package |
| **Smart Home** | Mock si Home Assistant no disponible | Webhook bidireccional con HA + tests de integración | `HOME_ASSISTANT_TOKEN` en `.env` |
| **Visión (OpenCV)** | Modo limitado si OpenCV no está | Microservicio Python con FastAPI + YOLOv8 | Servidor Python separado |
| **Spotify** | Modo simulado si SDK no disponible | Implementar OAuth2 PKCE flow completo | `SPOTIFY_CLIENT_ID` en `.env` |
| **Google APIs** | Offline si googleapis no disponible | Service Account + OAuth2 refresh token | `GOOGLE_API_KEY` en `.env` |

### 2.3 Circuit Breaker para APIs Externas

Todas las llamadas a APIs externas (OpenAI, Anthropic, Spotify, Google) deben estar protegidas por un Circuit Breaker. Se recomienda usar la librería `opossum` para Node.js.

```javascript
const CircuitBreaker = require('opossum');

const options = {
  timeout: 5000,        // Si la llamada tarda más de 5s, falla
  errorThresholdPercentage: 50, // Abre el circuito si el 50% de las llamadas fallan
  resetTimeout: 30000   // Intenta cerrar el circuito después de 30s
};

const breaker = new CircuitBreaker(callExternalAPI, options);
breaker.fallback(() => ({ status: 'degraded', message: 'Servicio externo no disponible' }));
```

---

## Sprint 3: Seguridad, IAM y Compliance (2 Semanas)

### 3.1 Implementación de OAuth2 / OpenID Connect

El sistema actual tiene un `auth-manager.cjs` con JWT propio. Para Enterprise-Grade, se debe añadir soporte para SSO.

**Implementación con Passport.js:**
- `passport-google-oauth20` para Google.
- `passport-github2` para GitHub.
- `passport-microsoft` para Microsoft Azure AD.

El flujo debe mantener compatibilidad con el sistema de usuarios local existente: si un usuario se autentica con Google, se crea o vincula su cuenta en la base de datos PostgreSQL local.

### 3.2 RBAC Granular y Audit Trail Inmutable

El `auth-manager.cjs` ya implementa roles básicos. Se debe expandir a un sistema RBAC granular donde los permisos se definen a nivel de recurso y acción.

**Estructura de permisos propuesta:**
```
admin: ALL
operator: memory:read, memory:write, tasks:*, ai:interact
viewer: memory:read, tasks:read, ai:interact
```

El Audit Trail debe ser una tabla de base de datos con escritura append-only. Ningún proceso debe poder actualizar o eliminar registros de auditoría. Cada entrada debe incluir: `userId`, `action`, `resource`, `ipAddress`, `userAgent`, `timestamp`, `result` y un hash SHA-256 del registro anterior (cadena de hash).

### 3.3 Resolución de Vulnerabilidades de Seguridad

El `npm audit` reporta 5 vulnerabilidades HIGH en las dependencias de Puppeteer. Las acciones son:
1. Actualizar Puppeteer a la versión más reciente: `npm update puppeteer`.
2. Si la vulnerabilidad persiste, evaluar si Puppeteer es necesario en producción o si puede moverse a `devDependencies`.
3. Reemplazar las credenciales por defecto en `k8s/deployment.yml` con referencias a Kubernetes Secrets gestionados por un sistema como HashiCorp Vault o AWS Secrets Manager.

---

## Sprint 4: Observabilidad y DevOps de Producción (2 Semanas)

### 4.1 OpenTelemetry para Tracing Distribuido

Implementar el SDK de OpenTelemetry en el backend de Node.js para instrumentar automáticamente Express, Socket.io y las llamadas a la base de datos.

```javascript
// En el punto de entrada del backend (antes de cualquier import)
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');

const sdk = new NodeSDK({
  traceExporter: new JaegerExporter({ endpoint: process.env.JAEGER_ENDPOINT }),
  instrumentations: [getNodeAutoInstrumentations()]
});

sdk.start();
```

### 4.2 Helm Charts para Despliegue Parametrizado

Los manifiestos actuales en `k8s/deployment.yml` son un solo archivo monolítico. Se deben convertir a un Helm Chart con la siguiente estructura:

```
k8s/helm/jarvis/
├── Chart.yaml
├── values.yaml          # Valores por defecto
├── values-staging.yaml  # Overrides para staging
├── values-prod.yaml     # Overrides para producción
└── templates/
    ├── backend-deployment.yaml
    ├── frontend-deployment.yaml
    ├── postgres-statefulset.yaml
    ├── redis-deployment.yaml
    ├── ingress.yaml
    └── secrets.yaml
```

### 4.3 Dashboards de Grafana Estandarizados

Crear dashboards de Grafana para las siguientes métricas críticas:
- **Node.js Runtime:** Event Loop Lag, Heap Used, GC Pauses.
- **AI Performance:** Latencia de inferencia por modelo, tokens procesados, tasa de error.
- **WebSocket Health:** Conexiones activas, mensajes por segundo, reconexiones.
- **Business Metrics:** Interacciones de usuario por hora, comandos más usados, predicciones correctas.

### 4.4 Cobertura de Tests al 80%

La cobertura actual es inferior al 5%. El objetivo del sprint es alcanzar el 80% de cobertura en los módulos críticos.

**Prioridad de tests:**
1. `core/neural-memory/memory-manager.cjs` — Tests unitarios para cada operación CRUD.
2. `core/security/auth-manager.cjs` — Tests de seguridad: login fallido, bloqueo de cuenta, expiración de token.
3. `web-interface/backend/server.cjs` — Tests de integración para todos los endpoints REST.
4. `jarvis-ai-integration.cjs` — Tests de contrato para la coordinación entre motores de IA.

---

## Sprint 5: Frontend Enterprise y PWA (2 Semanas)

### 5.1 Gestión de Estado Global con Zustand

El estado actual del frontend está fragmentado entre `useState` local, props drilling y eventos de Socket.io. Esto genera inconsistencias cuando múltiples componentes reaccionan al mismo evento de WebSocket.

**Arquitectura propuesta con Zustand:**

```javascript
// stores/jarvisStore.js
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

const useJarvisStore = create(subscribeWithSelector((set, get) => ({
  // Estado de IA
  aiStatus: { initialized: false, activeEngines: [] },
  memories: [],
  predictions: [],
  
  // Estado de Sistema
  systemMetrics: null,
  connected: false,
  
  // Acciones
  setAIStatus: (status) => set({ aiStatus: status }),
  addMemory: (memory) => set(state => ({ memories: [...state.memories, memory] })),
  
  // Subscripción a WebSocket (se inicializa una vez)
  initSocketSubscriptions: (socket) => {
    socket.on('ai:status', (data) => get().setAIStatus(data));
    socket.on('memory:new', (data) => get().addMemory(data));
  }
})));
```

### 5.2 Transformación a Progressive Web App (PWA)

Para completar la PWA, se deben implementar los siguientes elementos en el proyecto Vite:

1. **`vite-plugin-pwa`:** Genera automáticamente el Service Worker y el manifest.
2. **Estrategia de caché:** Cache-first para assets estáticos, Network-first para llamadas a la API.
3. **Notificaciones Push:** Usar la Web Push API para notificaciones del sistema incluso cuando la app está en segundo plano.
4. **Offline Mode:** Mostrar el último estado conocido del sistema cuando no hay conexión.

### 5.3 Optimización de Performance del Frontend

- Implementar `React.lazy` y `Suspense` para code-splitting por panel (AI Brain, Dashboard, Terminal, etc.). Actualmente todos los componentes se cargan en el bundle inicial.
- Virtualizar listas largas (memorias, logs, eventos) usando `react-virtual` para evitar renderizar miles de elementos DOM.
- Implementar `useMemo` y `useCallback` en los componentes de gráficas (`MetricsChart`, `LearningAnalytics`) que recalculan datos en cada render.

---

## Cronograma Maestro y KPIs de Éxito

### Cronograma de 11 Semanas

| Sprint | Semanas | Entregables Clave | KPI de Éxito |
|--------|---------|-------------------|--------------|
| **Sprint 1: Persistencia** | 1-2 | PostgreSQL + Prisma, Redis expandido, Pinecone RAG | 0 escrituras a JSON local en producción |
| **Sprint 2: AI Core** | 3-5 | RabbitMQ para agentes, Integraciones reales (Smart Home, Voz, Visión) | Smart Home funcional, Voz con 90%+ precisión |
| **Sprint 3: Seguridad** | 6-7 | OAuth2 SSO, RBAC granular, Audit Trail, 0 vulnerabilidades HIGH | `npm audit` sin HIGH/CRITICAL |
| **Sprint 4: DevOps** | 8-9 | Helm Charts, OpenTelemetry, Grafana dashboards, 80% test coverage | Despliegue en K8s con zero-downtime |
| **Sprint 5: Frontend** | 10-11 | Zustand, PWA completa, Code-splitting, Virtualización | Lighthouse Score > 90 en todas las categorías |

### KPIs de Sistema en Producción

| Métrica | Objetivo | Método de Medición |
|---------|----------|-------------------|
| **Uptime** | 99.9% (8.7h downtime/año) | Prometheus + Alertmanager |
| **Latencia P99 API** | < 500ms | Jaeger + Grafana |
| **Latencia P99 IA** | < 3s para respuestas conversacionales | Métricas custom en AI Integration |
| **Cobertura de Tests** | > 80% en módulos críticos | Jest Coverage Reports en CI |
| **Lighthouse Score** | > 90 en Performance, Accessibility, PWA | GitHub Actions + Lighthouse CI |
| **Reconexiones WebSocket** | < 1% de sesiones activas | Socket.io metrics |

---

## Dependencias y Prerequisitos

Para ejecutar este plan, se requieren las siguientes credenciales y recursos que deben configurarse en el archivo `.env` y en los secretos de GitHub Actions:

| Variable | Descripción | Prioridad |
|----------|-------------|-----------|
| `DATABASE_URL` | Cadena de conexión PostgreSQL | Crítica (Sprint 1) |
| `REDIS_URL` | URL de Redis con contraseña | Crítica (Sprint 1) |
| `PINECONE_API_KEY` | API Key de Pinecone | Alta (Sprint 1) |
| `OPENAI_API_KEY` | Para embeddings y fallback LLM | Alta (Sprint 2) |
| `HOME_ASSISTANT_TOKEN` | Token de Home Assistant | Media (Sprint 2) |
| `SPOTIFY_CLIENT_ID/SECRET` | Para integración de música | Media (Sprint 2) |
| `GOOGLE_CLIENT_ID/SECRET` | Para OAuth2 y Calendar/Gmail | Media (Sprint 3) |
| `GITHUB_CLIENT_ID/SECRET` | Para OAuth2 SSO | Media (Sprint 3) |
| `JAEGER_ENDPOINT` | URL del colector de Jaeger | Baja (Sprint 4) |

---

## Skills de Manus Disponibles para Este Proyecto

Se han creado tres skills especializadas para asistir en la construcción de este proyecto. Estas skills están disponibles en la cuenta de Manus y se activarán automáticamente cuando se trabaje en el repositorio JARVIS Mark VII.

| Skill | Cuándo se Activa | Qué Proporciona |
|-------|-----------------|-----------------|
| **`jarvis-backend-integration`** | Al implementar nuevos endpoints, servicios o integraciones en el backend | Patrones de código, estándares de logging, estructura de Integration Modules |
| **`jarvis-ai-core`** | Al trabajar con los motores de IA, memoria neural o búsqueda semántica | Arquitectura de 4 capas de memoria, patrones para nuevos motores de IA |
| **`jarvis-enterprise-deployment`** | Al configurar Docker, Kubernetes, CI/CD o resolver problemas de infraestructura | Comandos de despliegue, estructura de Helm Charts, troubleshooting |

---

*"Sometimes you gotta run before you can walk." — Tony Stark*  
*Este plan es el mapa. La ejecución es lo que construye el legado.*
