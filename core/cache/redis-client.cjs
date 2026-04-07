/**
 * JARVIS Mark VII — Redis Enterprise Client
 *
 * Cliente Redis centralizado con soporte para:
 * - Caché de respuestas de IA (TTL configurable)
 * - Rate limiting distribuido (sliding window)
 * - Pub/Sub para sincronización de WebSockets entre pods
 * - Gestión de sesiones distribuidas
 *
 * @module core/cache/redis-client
 */

const Redis = require('ioredis');

// ============================================================
// CONFIGURACIÓN
// ============================================================

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const DEFAULT_CONFIG = {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 100, 3000);
    console.warn(`⚠️  [Redis] Reconectando... intento ${times} (delay: ${delay}ms)`);
    return delay;
  },
  lazyConnect: true,
};

// ============================================================
// CLIENTES SINGLETON
// ============================================================

let _client = null;
let _subscriber = null;
let _publisher = null;

function getClient() {
  if (!_client) {
    _client = new Redis(REDIS_URL, DEFAULT_CONFIG);
    _client.on('connect', () => console.log('✅ [Redis] Cliente conectado'));
    _client.on('error', (err) => console.error('❌ [Redis] Error:', err.message));
  }
  return _client;
}

function getSubscriber() {
  if (!_subscriber) {
    _subscriber = new Redis(REDIS_URL, DEFAULT_CONFIG);
    _subscriber.on('connect', () => console.log('✅ [Redis] Subscriber conectado'));
    _subscriber.on('error', (err) => console.error('❌ [Redis] Subscriber error:', err.message));
  }
  return _subscriber;
}

function getPublisher() {
  if (!_publisher) {
    _publisher = new Redis(REDIS_URL, DEFAULT_CONFIG);
    _publisher.on('connect', () => console.log('✅ [Redis] Publisher conectado'));
    _publisher.on('error', (err) => console.error('❌ [Redis] Publisher error:', err.message));
  }
  return _publisher;
}

// ============================================================
// AI RESPONSE CACHE
// ============================================================

const AI_CACHE_PREFIX = 'jarvis:ai:cache:';
const AI_CACHE_DEFAULT_TTL = 3600; // 1 hora

/**
 * Genera una clave de caché para una petición de IA.
 * @param {string} model
 * @param {string} prompt
 * @returns {string}
 */
function buildAICacheKey(model, prompt) {
  const crypto = require('crypto');
  const hash = crypto.createHash('sha256').update(`${model}:${prompt}`).digest('hex').slice(0, 16);
  return `${AI_CACHE_PREFIX}${hash}`;
}

/**
 * Obtiene una respuesta cacheada de IA.
 * @param {string} model
 * @param {string} prompt
 * @returns {Promise<object|null>}
 */
async function getAICache(model, prompt) {
  const client = getClient();
  const key = buildAICacheKey(model, prompt);
  const cached = await client.get(key);
  if (cached) {
    console.log(`🎯 [Redis] Cache HIT para modelo ${model}`);
    return JSON.parse(cached);
  }
  return null;
}

/**
 * Guarda una respuesta de IA en caché.
 * @param {string} model
 * @param {string} prompt
 * @param {object} response
 * @param {number} [ttl=AI_CACHE_DEFAULT_TTL]
 */
async function setAICache(model, prompt, response, ttl = AI_CACHE_DEFAULT_TTL) {
  const client = getClient();
  const key = buildAICacheKey(model, prompt);
  await client.setex(key, ttl, JSON.stringify(response));
  console.log(`💾 [Redis] Cache SET para modelo ${model} (TTL: ${ttl}s)`);
}

// ============================================================
// RATE LIMITING DISTRIBUIDO (Sliding Window)
// ============================================================

const RATE_LIMIT_PREFIX = 'jarvis:ratelimit:';

/**
 * Verifica y aplica rate limiting con ventana deslizante.
 * @param {string} identifier  Identificador único (userId, IP, etc.)
 * @param {string} action      Acción a limitar (ej. 'ai:query', 'auth:login')
 * @param {number} [limit=60]  Máximo de peticiones permitidas
 * @param {number} [window=60] Ventana de tiempo en segundos
 * @returns {Promise<{allowed: boolean, remaining: number, resetIn: number}>}
 */
async function checkRateLimit(identifier, action, limit = 60, window = 60) {
  const client = getClient();
  const key = `${RATE_LIMIT_PREFIX}${action}:${identifier}`;
  const now = Date.now();
  const windowMs = window * 1000;

  // Pipeline para operaciones atómicas
  const pipeline = client.pipeline();
  pipeline.zremrangebyscore(key, 0, now - windowMs);   // Eliminar entradas viejas
  pipeline.zadd(key, now, `${now}-${Math.random()}`);  // Agregar entrada actual
  pipeline.zcard(key);                                  // Contar entradas en ventana
  pipeline.expire(key, window);                         // Expirar la clave

  const results = await pipeline.exec();
  const count = results[2][1];

  const allowed = count <= limit;
  const remaining = Math.max(0, limit - count);
  const resetIn = window; // Simplificado; en producción calcular exactamente

  if (!allowed) {
    console.warn(`🚫 [Redis] Rate limit excedido: ${action} para ${identifier} (${count}/${limit})`);
  }

  return { allowed, remaining, resetIn, count };
}

// ============================================================
// SESSION STORE
// ============================================================

const SESSION_PREFIX = 'jarvis:session:';
const SESSION_DEFAULT_TTL = 86400; // 24 horas

/**
 * Guarda datos de sesión en Redis.
 * @param {string} token
 * @param {object} data
 * @param {number} [ttl=SESSION_DEFAULT_TTL]
 */
async function setSession(token, data, ttl = SESSION_DEFAULT_TTL) {
  const client = getClient();
  await client.setex(`${SESSION_PREFIX}${token}`, ttl, JSON.stringify(data));
}

/**
 * Recupera datos de sesión de Redis.
 * @param {string} token
 * @returns {Promise<object|null>}
 */
async function getSession(token) {
  const client = getClient();
  const data = await client.get(`${SESSION_PREFIX}${token}`);
  return data ? JSON.parse(data) : null;
}

/**
 * Elimina una sesión de Redis.
 * @param {string} token
 */
async function deleteSession(token) {
  const client = getClient();
  await client.del(`${SESSION_PREFIX}${token}`);
}

// ============================================================
// PUB/SUB PARA WEBSOCKETS MULTI-POD
// ============================================================

const SOCKET_CHANNEL = 'jarvis:socket:events';

/**
 * Publica un evento de Socket.io al canal compartido (para multi-pod).
 * @param {string} event
 * @param {object} data
 */
async function publishSocketEvent(event, data) {
  const publisher = getPublisher();
  await publisher.publish(SOCKET_CHANNEL, JSON.stringify({ event, data, ts: Date.now() }));
}

/**
 * Suscribe a eventos de Socket.io del canal compartido.
 * @param {function} callback  Función llamada con (event, data)
 */
function subscribeSocketEvents(callback) {
  const subscriber = getSubscriber();
  subscriber.subscribe(SOCKET_CHANNEL);
  subscriber.on('message', (channel, message) => {
    if (channel === SOCKET_CHANNEL) {
      try {
        const { event, data } = JSON.parse(message);
        callback(event, data);
      } catch (err) {
        console.error('❌ [Redis] Error parseando mensaje Pub/Sub:', err.message);
      }
    }
  });
}

// ============================================================
// HEALTH CHECK
// ============================================================

/**
 * Verifica que Redis está disponible.
 * @returns {Promise<boolean>}
 */
async function healthCheck() {
  try {
    const client = getClient();
    const pong = await client.ping();
    return pong === 'PONG';
  } catch {
    return false;
  }
}

// Graceful shutdown
process.on('beforeExit', async () => {
  if (_client) await _client.quit();
  if (_subscriber) await _subscriber.quit();
  if (_publisher) await _publisher.quit();
});

module.exports = {
  getClient,
  getSubscriber,
  getPublisher,
  // AI Cache
  getAICache,
  setAICache,
  // Rate Limiting
  checkRateLimit,
  // Sessions
  setSession,
  getSession,
  deleteSession,
  // Pub/Sub
  publishSocketEvent,
  subscribeSocketEvents,
  // Utils
  healthCheck,
};
