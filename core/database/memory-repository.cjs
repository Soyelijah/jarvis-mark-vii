/**
 * JARVIS Mark VII — Memory Repository
 *
 * Capa de abstracción para todas las operaciones de memoria persistente.
 * Reemplaza las escrituras directas a SQLite/JSON con operaciones Prisma/PostgreSQL.
 *
 * Patrón: Repository — desacopla la lógica de negocio de la persistencia.
 *
 * @module core/database/memory-repository
 */

const { prisma } = require('./prisma-client.cjs');

class MemoryRepository {
  /**
   * Guarda un recuerdo en la base de datos.
   * @param {object} params
   * @param {string} params.userId
   * @param {'WORKING'|'SHORT_TERM'|'LONG_TERM'|'EPISODIC'} params.type
   * @param {object} params.content
   * @param {object} [params.context]
   * @param {number} [params.importance=0.5]
   * @param {number[]} [params.embedding=[]]
   * @param {Date}   [params.expiresAt]
   */
  async save({ userId, type, content, context, importance = 0.5, embedding = [], expiresAt }) {
    return prisma.memory.create({
      data: {
        userId,
        type,
        content,
        context,
        importance,
        embedding,
        expiresAt,
      },
    });
  }

  /**
   * Recupera memorias de un usuario filtradas por tipo.
   * @param {string} userId
   * @param {'WORKING'|'SHORT_TERM'|'LONG_TERM'|'EPISODIC'} [type]
   * @param {number} [limit=50]
   */
  async findByUser(userId, type, limit = 50) {
    return prisma.memory.findMany({
      where: {
        userId,
        ...(type && { type }),
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
      orderBy: [
        { importance: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
    });
  }

  /**
   * Elimina memorias expiradas (para ejecutar periódicamente).
   */
  async purgeExpired() {
    const result = await prisma.memory.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
    console.log(`🧹 [MemoryRepository] Purged ${result.count} expired memories`);
    return result.count;
  }

  /**
   * Consolida memorias de SHORT_TERM a LONG_TERM si superan el umbral de importancia.
   * @param {string} userId
   * @param {number} [importanceThreshold=0.7]
   */
  async consolidate(userId, importanceThreshold = 0.7) {
    const promoted = await prisma.memory.updateMany({
      where: {
        userId,
        type: 'SHORT_TERM',
        importance: { gte: importanceThreshold },
      },
      data: { type: 'LONG_TERM' },
    });
    console.log(`🧠 [MemoryRepository] Consolidated ${promoted.count} memories to LONG_TERM`);
    return promoted.count;
  }

  /**
   * Actualiza la importancia de un recuerdo (refuerzo positivo/negativo).
   * @param {string} memoryId
   * @param {number} delta  Valor a sumar/restar a la importancia actual
   */
  async updateImportance(memoryId, delta) {
    const memory = await prisma.memory.findUnique({ where: { id: memoryId } });
    if (!memory) return null;
    const newImportance = Math.min(1.0, Math.max(0.0, memory.importance + delta));
    return prisma.memory.update({
      where: { id: memoryId },
      data: { importance: newImportance },
    });
  }

  /**
   * Obtiene estadísticas de memoria para un usuario.
   * @param {string} userId
   */
  async getStats(userId) {
    const [total, byType] = await Promise.all([
      prisma.memory.count({ where: { userId } }),
      prisma.memory.groupBy({
        by: ['type'],
        where: { userId },
        _count: { id: true },
        _avg: { importance: true },
      }),
    ]);

    return {
      total,
      byType: byType.reduce((acc, row) => {
        acc[row.type] = {
          count: row._count.id,
          avgImportance: row._avg.importance,
        };
        return acc;
      }, {}),
    };
  }
}

module.exports = { MemoryRepository };
