/**
 * JARVIS Mark VII — Auth Repository
 *
 * Capa de abstracción para operaciones de usuarios, sesiones y auditoría.
 * Reemplaza el sistema de archivos JSON de auth-manager.cjs con PostgreSQL.
 *
 * @module core/database/auth-repository
 */

const { prisma } = require('./prisma-client.cjs');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

class AuthRepository {
  // ============================================================
  // USERS
  // ============================================================

  /**
   * Crea un nuevo usuario con contraseña hasheada.
   * @param {object} params
   * @param {string} params.username
   * @param {string} params.email
   * @param {string} params.password  Contraseña en texto plano (se hashea aquí)
   * @param {'ADMIN'|'OPERATOR'|'VIEWER'} [params.role='VIEWER']
   */
  async createUser({ username, email, password, role = 'VIEWER' }) {
    const passwordHash = await bcrypt.hash(password, 12);
    return prisma.user.create({
      data: { username, email, passwordHash, role },
      select: { id: true, username: true, email: true, role: true, createdAt: true },
    });
  }

  /**
   * Busca un usuario por username o email.
   * @param {string} identifier
   */
  async findByIdentifier(identifier) {
    return prisma.user.findFirst({
      where: {
        OR: [
          { username: identifier },
          { email: identifier },
        ],
      },
    });
  }

  /**
   * Verifica credenciales y retorna el usuario si son válidas.
   * @param {string} identifier
   * @param {string} password
   */
  async verifyCredentials(identifier, password) {
    const user = await this.findByIdentifier(identifier);
    if (!user) return null;
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return null;
    // No exponer el hash en la respuesta
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  /**
   * Actualiza el rol de un usuario.
   * @param {string} userId
   * @param {'ADMIN'|'OPERATOR'|'VIEWER'} role
   */
  async updateRole(userId, role) {
    return prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, username: true, role: true },
    });
  }

  /**
   * Lista todos los usuarios (sin exponer passwordHash).
   */
  async listUsers() {
    return prisma.user.findMany({
      select: { id: true, username: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ============================================================
  // SESSIONS
  // ============================================================

  /**
   * Crea una nueva sesión para un usuario.
   * @param {string} userId
   * @param {object} meta  Metadatos de la sesión (IP, userAgent)
   * @param {number} [ttlHours=24]
   */
  async createSession(userId, meta = {}, ttlHours = 24) {
    const token = crypto.randomBytes(48).toString('hex');
    const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);
    return prisma.session.create({
      data: {
        userId,
        token,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        expiresAt,
      },
    });
  }

  /**
   * Valida un token de sesión y retorna el usuario asociado.
   * @param {string} token
   */
  async validateSession(token) {
    const session = await prisma.session.findUnique({
      where: { token },
      include: {
        user: {
          select: { id: true, username: true, email: true, role: true },
        },
      },
    });
    if (!session) return null;
    if (session.expiresAt < new Date()) {
      await this.revokeSession(token);
      return null;
    }
    return session.user;
  }

  /**
   * Revoca (elimina) una sesión por token.
   * @param {string} token
   */
  async revokeSession(token) {
    return prisma.session.deleteMany({ where: { token } });
  }

  /**
   * Elimina todas las sesiones expiradas.
   */
  async purgeExpiredSessions() {
    const result = await prisma.session.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
    console.log(`🔐 [AuthRepository] Purged ${result.count} expired sessions`);
    return result.count;
  }

  // ============================================================
  // AUDIT LOG
  // ============================================================

  /**
   * Registra una entrada en el audit trail.
   * @param {object} params
   * @param {string} [params.userId]
   * @param {string} params.action   Acción realizada (ej. 'login', 'memory:write')
   * @param {string} params.resource Recurso afectado (ej. 'user:123', 'memory:456')
   * @param {object} [params.details]
   * @param {string} [params.ipAddress]
   */
  async audit({ userId, action, resource, details, ipAddress }) {
    return prisma.auditLog.create({
      data: { userId, action, resource, details, ipAddress },
    });
  }

  /**
   * Recupera el audit trail con paginación.
   * @param {object} [filters]
   * @param {number} [page=1]
   * @param {number} [pageSize=50]
   */
  async getAuditLog(filters = {}, page = 1, pageSize = 50) {
    const [entries, total] = await Promise.all([
      prisma.auditLog.findMany({
        where: filters,
        orderBy: { timestamp: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          user: { select: { username: true } },
        },
      }),
      prisma.auditLog.count({ where: filters }),
    ]);
    return { entries, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }
}

module.exports = { AuthRepository };
