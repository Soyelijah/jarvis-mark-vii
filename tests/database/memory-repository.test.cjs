/**
 * JARVIS Mark VII — Memory Repository Tests
 *
 * Tests unitarios para MemoryRepository usando mocks de Prisma.
 * Estos tests NO requieren una base de datos real.
 */

'use strict';

// Mock del cliente Prisma
jest.mock('../../core/database/prisma-client.cjs', () => ({
  prisma: {
    memory: {
      create: jest.fn(),
      findMany: jest.fn(),
      deleteMany: jest.fn(),
      updateMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
  },
}));

const { prisma } = require('../../core/database/prisma-client.cjs');
const { MemoryRepository } = require('../../core/database/memory-repository.cjs');

describe('MemoryRepository', () => {
  let repo;

  beforeEach(() => {
    repo = new MemoryRepository();
    jest.clearAllMocks();
  });

  // ============================================================
  // save()
  // ============================================================
  describe('save()', () => {
    it('debe crear un recuerdo con los campos correctos', async () => {
      const mockMemory = {
        id: 'mem_001',
        type: 'WORKING',
        content: { text: 'Hola JARVIS' },
        importance: 0.8,
        userId: 'user_001',
        createdAt: new Date(),
      };
      prisma.memory.create.mockResolvedValue(mockMemory);

      const result = await repo.save({
        userId: 'user_001',
        type: 'WORKING',
        content: { text: 'Hola JARVIS' },
        importance: 0.8,
        embedding: [0.1, 0.2, 0.3],
      });

      expect(prisma.memory.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user_001',
          type: 'WORKING',
          importance: 0.8,
        }),
      });
      expect(result).toEqual(mockMemory);
    });

    it('debe usar importance=0.5 por defecto', async () => {
      prisma.memory.create.mockResolvedValue({ id: 'mem_002' });

      await repo.save({ userId: 'user_001', type: 'SHORT_TERM', content: {} });

      expect(prisma.memory.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ importance: 0.5 }),
      });
    });
  });

  // ============================================================
  // findByUser()
  // ============================================================
  describe('findByUser()', () => {
    it('debe retornar memorias del usuario ordenadas por importancia', async () => {
      const mockMemories = [
        { id: 'mem_001', importance: 0.9, type: 'LONG_TERM' },
        { id: 'mem_002', importance: 0.5, type: 'SHORT_TERM' },
      ];
      prisma.memory.findMany.mockResolvedValue(mockMemories);

      const result = await repo.findByUser('user_001', 'LONG_TERM', 10);

      expect(prisma.memory.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ userId: 'user_001', type: 'LONG_TERM' }),
          orderBy: expect.arrayContaining([{ importance: 'desc' }]),
          take: 10,
        })
      );
      expect(result).toHaveLength(2);
    });

    it('debe filtrar memorias expiradas', async () => {
      prisma.memory.findMany.mockResolvedValue([]);

      await repo.findByUser('user_001');

      const callArgs = prisma.memory.findMany.mock.calls[0][0];
      expect(callArgs.where).toHaveProperty('OR');
    });
  });

  // ============================================================
  // purgeExpired()
  // ============================================================
  describe('purgeExpired()', () => {
    it('debe eliminar memorias expiradas y retornar el conteo', async () => {
      prisma.memory.deleteMany.mockResolvedValue({ count: 5 });

      const count = await repo.purgeExpired();

      expect(prisma.memory.deleteMany).toHaveBeenCalledWith({
        where: { expiresAt: { lt: expect.any(Date) } },
      });
      expect(count).toBe(5);
    });
  });

  // ============================================================
  // consolidate()
  // ============================================================
  describe('consolidate()', () => {
    it('debe promover memorias SHORT_TERM con importancia >= umbral a LONG_TERM', async () => {
      prisma.memory.updateMany.mockResolvedValue({ count: 3 });

      const count = await repo.consolidate('user_001', 0.7);

      expect(prisma.memory.updateMany).toHaveBeenCalledWith({
        where: {
          userId: 'user_001',
          type: 'SHORT_TERM',
          importance: { gte: 0.7 },
        },
        data: { type: 'LONG_TERM' },
      });
      expect(count).toBe(3);
    });
  });

  // ============================================================
  // updateImportance()
  // ============================================================
  describe('updateImportance()', () => {
    it('debe actualizar la importancia sin exceder 1.0', async () => {
      prisma.memory.findUnique.mockResolvedValue({ id: 'mem_001', importance: 0.9 });
      prisma.memory.update.mockResolvedValue({ id: 'mem_001', importance: 1.0 });

      await repo.updateImportance('mem_001', 0.5); // 0.9 + 0.5 = 1.4 → clamped a 1.0

      expect(prisma.memory.update).toHaveBeenCalledWith({
        where: { id: 'mem_001' },
        data: { importance: 1.0 },
      });
    });

    it('debe retornar null si el recuerdo no existe', async () => {
      prisma.memory.findUnique.mockResolvedValue(null);

      const result = await repo.updateImportance('nonexistent', 0.1);

      expect(result).toBeNull();
      expect(prisma.memory.update).not.toHaveBeenCalled();
    });
  });

  // ============================================================
  // getStats()
  // ============================================================
  describe('getStats()', () => {
    it('debe retornar estadísticas correctas por tipo', async () => {
      prisma.memory.count.mockResolvedValue(10);
      prisma.memory.groupBy.mockResolvedValue([
        { type: 'WORKING', _count: { id: 3 }, _avg: { importance: 0.6 } },
        { type: 'LONG_TERM', _count: { id: 7 }, _avg: { importance: 0.8 } },
      ]);

      const stats = await repo.getStats('user_001');

      expect(stats.total).toBe(10);
      expect(stats.byType.WORKING.count).toBe(3);
      expect(stats.byType.LONG_TERM.avgImportance).toBe(0.8);
    });
  });
});
