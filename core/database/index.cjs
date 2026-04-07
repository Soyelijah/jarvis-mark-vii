/**
 * JARVIS Mark VII — Database Module Index
 *
 * Punto de entrada único para todos los repositorios de datos.
 * Importar desde aquí en lugar de importar cada repositorio individualmente.
 *
 * @example
 * const { prisma, MemoryRepository, AuthRepository } = require('./core/database');
 *
 * @module core/database
 */

const { prisma } = require('./prisma-client.cjs');
const { MemoryRepository } = require('./memory-repository.cjs');
const { AuthRepository } = require('./auth-repository.cjs');
const { MetricsRepository, PatternsRepository } = require('./metrics-repository.cjs');

// Instancias singleton de repositorios
const memoryRepo = new MemoryRepository();
const authRepo = new AuthRepository();
const metricsRepo = new MetricsRepository();
const patternsRepo = new PatternsRepository();

module.exports = {
  // Cliente Prisma directo (para consultas avanzadas)
  prisma,

  // Repositorios
  MemoryRepository,
  AuthRepository,
  MetricsRepository,
  PatternsRepository,

  // Instancias singleton listas para usar
  memoryRepo,
  authRepo,
  metricsRepo,
  patternsRepo,
};
