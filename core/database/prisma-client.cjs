/**
 * JARVIS Mark VII — Prisma Client Singleton
 *
 * Provee una instancia única de PrismaClient para todo el proyecto.
 * Previene múltiples conexiones al pool de PostgreSQL durante hot-reload.
 *
 * @module core/database/prisma-client
 */

const { PrismaClient } = require('@prisma/client');

// Singleton pattern: reutilizar instancia en desarrollo
let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    log: ['error', 'warn'],
    errorFormat: 'minimal',
  });
} else {
  // En desarrollo, guardar en global para evitar múltiples instancias con hot-reload
  if (!global.__prisma) {
    global.__prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
      errorFormat: 'pretty',
    });
  }
  prisma = global.__prisma;
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = { prisma };
