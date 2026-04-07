/**
 * JARVIS Mark VII — Redis Client Tests
 *
 * Tests unitarios para el cliente Redis enterprise.
 * Usa mocks de ioredis para no requerir Redis real.
 */

'use strict';

// Mock de ioredis
const mockPipeline = {
  zremrangebyscore: jest.fn().mockReturnThis(),
  zadd: jest.fn().mockReturnThis(),
  zcard: jest.fn().mockReturnThis(),
  expire: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue([
    [null, 0],  // zremrangebyscore
    [null, 1],  // zadd
    [null, 5],  // zcard (5 requests en ventana)
    [null, 1],  // expire
  ]),
};

const mockRedis = {
  get: jest.fn(),
  set: jest.fn(),
  setex: jest.fn(),
  del: jest.fn(),
  ping: jest.fn().mockResolvedValue('PONG'),
  pipeline: jest.fn().mockReturnValue(mockPipeline),
  subscribe: jest.fn(),
  publish: jest.fn(),
  on: jest.fn(),
  quit: jest.fn(),
};

jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => mockRedis);
});

// Mock del módulo completo para evitar dependencias circulares
jest.mock('../../core/cache/redis-client.cjs', () => {
  const actual = jest.requireActual('../../core/cache/redis-client.cjs');
  return {
    ...actual,
    getClient: jest.fn().mockReturnValue(mockRedis),
    getPublisher: jest.fn().mockReturnValue(mockRedis),
    getSubscriber: jest.fn().mockReturnValue(mockRedis),
  };
});

const {
  getAICache,
  setAICache,
  checkRateLimit,
  setSession,
  getSession,
  deleteSession,
  healthCheck,
} = require('../../core/cache/redis-client.cjs');

describe('Redis Client Enterprise', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRedis.ping.mockResolvedValue('PONG');
  });

  // ============================================================
  // AI Cache
  // ============================================================
  describe('AI Cache', () => {
    it('getAICache debe retornar null si no hay caché', async () => {
      mockRedis.get.mockResolvedValue(null);
      const result = await getAICache('gpt-4', 'Hola mundo');
      expect(result).toBeNull();
    });

    it('getAICache debe retornar el valor cacheado parseado', async () => {
      const cached = { response: 'Hola, soy JARVIS' };
      mockRedis.get.mockResolvedValue(JSON.stringify(cached));
      const result = await getAICache('gpt-4', 'Hola mundo');
      expect(result).toEqual(cached);
    });

    it('setAICache debe guardar la respuesta con TTL', async () => {
      mockRedis.setex.mockResolvedValue('OK');
      await setAICache('gpt-4', 'Hola mundo', { response: 'OK' }, 3600);
      expect(mockRedis.setex).toHaveBeenCalledWith(
        expect.stringContaining('jarvis:ai:cache:'),
        3600,
        expect.any(String)
      );
    });
  });

  // ============================================================
  // Rate Limiting
  // ============================================================
  describe('Rate Limiting', () => {
    it('debe permitir la petición si está dentro del límite', async () => {
      mockPipeline.exec.mockResolvedValue([
        [null, 0], [null, 1], [null, 5], [null, 1], // 5 requests, límite 60
      ]);

      const result = await checkRateLimit('user_001', 'api:general', 60, 60);

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(55);
    });

    it('debe bloquear la petición si excede el límite', async () => {
      mockPipeline.exec.mockResolvedValue([
        [null, 0], [null, 1], [null, 61], [null, 1], // 61 requests, límite 60
      ]);

      const result = await checkRateLimit('user_001', 'api:general', 60, 60);

      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });
  });

  // ============================================================
  // Session Store
  // ============================================================
  describe('Session Store', () => {
    it('setSession debe guardar la sesión con TTL por defecto', async () => {
      mockRedis.setex.mockResolvedValue('OK');
      await setSession('token_abc', { userId: 'user_001', role: 'ADMIN' });
      expect(mockRedis.setex).toHaveBeenCalledWith(
        'jarvis:session:token_abc',
        86400,
        expect.stringContaining('user_001')
      );
    });

    it('getSession debe retornar los datos de sesión', async () => {
      const sessionData = { userId: 'user_001', role: 'ADMIN' };
      mockRedis.get.mockResolvedValue(JSON.stringify(sessionData));
      const result = await getSession('token_abc');
      expect(result).toEqual(sessionData);
    });

    it('getSession debe retornar null si la sesión no existe', async () => {
      mockRedis.get.mockResolvedValue(null);
      const result = await getSession('nonexistent');
      expect(result).toBeNull();
    });

    it('deleteSession debe eliminar la clave de sesión', async () => {
      mockRedis.del.mockResolvedValue(1);
      await deleteSession('token_abc');
      expect(mockRedis.del).toHaveBeenCalledWith('jarvis:session:token_abc');
    });
  });

  // ============================================================
  // Health Check
  // ============================================================
  describe('Health Check', () => {
    it('debe retornar true si Redis responde PONG', async () => {
      mockRedis.ping.mockResolvedValue('PONG');
      const healthy = await healthCheck();
      expect(healthy).toBe(true);
    });

    it('debe retornar false si Redis no está disponible', async () => {
      mockRedis.ping.mockRejectedValue(new Error('Connection refused'));
      const healthy = await healthCheck();
      expect(healthy).toBe(false);
    });
  });
});
