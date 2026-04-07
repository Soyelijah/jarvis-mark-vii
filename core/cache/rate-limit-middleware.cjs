/**
 * JARVIS Mark VII — Rate Limiting Middleware (Express)
 *
 * Middleware distribuido basado en Redis para proteger los endpoints de la API.
 * Usa el algoritmo de Sliding Window para máxima precisión.
 *
 * @module core/cache/rate-limit-middleware
 */

const { checkRateLimit } = require('./redis-client.cjs');

/**
 * Crea un middleware de rate limiting para Express.
 *
 * @param {object} options
 * @param {string} options.action     Nombre de la acción a limitar (ej. 'api:general')
 * @param {number} [options.limit=60] Máximo de peticiones en la ventana
 * @param {number} [options.window=60] Ventana de tiempo en segundos
 * @param {function} [options.keyFn]  Función para extraer el identificador del request
 *
 * @example
 * // Limitar el endpoint de login a 10 intentos por minuto por IP
 * app.post('/api/auth/login', rateLimitMiddleware({ action: 'auth:login', limit: 10, window: 60 }), handler);
 *
 * // Limitar consultas de IA a 30 por minuto por usuario
 * app.post('/api/ai/query', rateLimitMiddleware({ action: 'ai:query', limit: 30, keyFn: req => req.user?.id }), handler);
 */
function rateLimitMiddleware({ action, limit = 60, window = 60, keyFn }) {
  return async (req, res, next) => {
    try {
      // Determinar el identificador: userId autenticado o IP como fallback
      const identifier = keyFn
        ? keyFn(req)
        : (req.user?.id || req.ip || 'anonymous');

      const { allowed, remaining, resetIn } = await checkRateLimit(identifier, action, limit, window);

      // Agregar headers informativos (estándar de la industria)
      res.setHeader('X-RateLimit-Limit', limit);
      res.setHeader('X-RateLimit-Remaining', remaining);
      res.setHeader('X-RateLimit-Reset', Math.floor(Date.now() / 1000) + resetIn);

      if (!allowed) {
        return res.status(429).json({
          success: false,
          error: 'Too Many Requests',
          message: `Límite de ${limit} peticiones por ${window}s excedido para la acción '${action}'.`,
          retryAfter: resetIn,
        });
      }

      next();
    } catch (err) {
      // Si Redis falla, no bloquear la petición (fail-open para disponibilidad)
      console.error(`⚠️  [RateLimit] Redis no disponible, omitiendo rate limit: ${err.message}`);
      next();
    }
  };
}

// Presets de rate limiting para acciones comunes
const PRESETS = {
  /** Endpoints de autenticación: 10 intentos por minuto */
  auth: rateLimitMiddleware({ action: 'auth', limit: 10, window: 60 }),

  /** Consultas de IA: 30 por minuto por usuario */
  aiQuery: rateLimitMiddleware({ action: 'ai:query', limit: 30, window: 60 }),

  /** API general: 120 peticiones por minuto */
  api: rateLimitMiddleware({ action: 'api:general', limit: 120, window: 60 }),

  /** Endpoints de escritura (memoria, config): 20 por minuto */
  write: rateLimitMiddleware({ action: 'api:write', limit: 20, window: 60 }),
};

module.exports = { rateLimitMiddleware, PRESETS };
