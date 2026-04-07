/**
 * JARVIS Mark VII — Metrics & Patterns Repository
 *
 * Capa de abstracción para métricas del sistema y patrones aprendidos.
 * Reemplaza metrics-persistence.cjs (better-sqlite3) con PostgreSQL/Prisma.
 *
 * @module core/database/metrics-repository
 */

const { prisma } = require('./prisma-client.cjs');
const crypto = require('crypto');

class MetricsRepository {
  /**
   * Guarda un snapshot de métricas.
   * @param {'system'|'ai'|'business'} type
   * @param {object} data
   */
  async saveSnapshot(type, data) {
    return prisma.metricSnapshot.create({
      data: { type, data },
    });
  }

  /**
   * Recupera snapshots recientes por tipo.
   * @param {string} type
   * @param {number} [limit=100]
   * @param {Date}   [since]
   */
  async getSnapshots(type, limit = 100, since) {
    return prisma.metricSnapshot.findMany({
      where: {
        type,
        ...(since && { timestamp: { gte: since } }),
      },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  }

  /**
   * Elimina snapshots más antiguos que N días.
   * @param {number} [days=30]
   */
  async purgeOld(days = 30) {
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const result = await prisma.metricSnapshot.deleteMany({
      where: { timestamp: { lt: cutoff } },
    });
    console.log(`📊 [MetricsRepository] Purged ${result.count} old snapshots`);
    return result.count;
  }
}

class PatternsRepository {
  /**
   * Registra o actualiza un patrón aprendido.
   * Si el patrón ya existe (mismo hash), incrementa las ocurrencias y actualiza la confianza.
   * @param {object} params
   * @param {string} params.category
   * @param {string} params.description
   * @param {number} [params.confidenceDelta=0.05]
   */
  async upsert({ category, description, confidenceDelta = 0.05 }) {
    const patternHash = crypto
      .createHash('sha256')
      .update(`${category}:${description}`)
      .digest('hex');

    const existing = await prisma.learnedPattern.findUnique({ where: { patternHash } });

    if (existing) {
      return prisma.learnedPattern.update({
        where: { patternHash },
        data: {
          occurrences: { increment: 1 },
          confidence: Math.min(1.0, existing.confidence + confidenceDelta),
          lastSeen: new Date(),
        },
      });
    }

    return prisma.learnedPattern.create({
      data: { patternHash, category, description, confidence: confidenceDelta },
    });
  }

  /**
   * Recupera los patrones más confiables de una categoría.
   * @param {string} category
   * @param {number} [limit=20]
   * @param {number} [minConfidence=0.3]
   */
  async getTopPatterns(category, limit = 20, minConfidence = 0.3) {
    return prisma.learnedPattern.findMany({
      where: {
        category,
        confidence: { gte: minConfidence },
      },
      orderBy: [
        { confidence: 'desc' },
        { occurrences: 'desc' },
      ],
      take: limit,
    });
  }

  /**
   * Obtiene estadísticas globales de patrones.
   */
  async getStats() {
    const [total, byCategory] = await Promise.all([
      prisma.learnedPattern.count(),
      prisma.learnedPattern.groupBy({
        by: ['category'],
        _count: { id: true },
        _avg: { confidence: true },
        _sum: { occurrences: true },
      }),
    ]);
    return {
      total,
      byCategory: byCategory.map(row => ({
        category: row.category,
        count: row._count.id,
        avgConfidence: row._avg.confidence,
        totalOccurrences: row._sum.occurrences,
      })),
    };
  }
}

module.exports = { MetricsRepository, PatternsRepository };
