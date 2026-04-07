/**
 * JARVIS Mark VII — Vector Search Engine
 *
 * Motor de búsqueda semántica enterprise basado en:
 * - OpenAI text-embedding-3-small para generación de embeddings
 * - Pinecone como base de datos vectorial (SaaS, sin infraestructura local)
 * - Fallback a búsqueda por similitud coseno en memoria si Pinecone no está disponible
 *
 * Reemplaza core/neural-memory/semantic-search.cjs que dependía de Ollama local.
 *
 * @module core/vector/vector-search
 */

const { Pinecone } = require('@pinecone-database/pinecone');
const { getAICache, setAICache } = require('../cache/redis-client.cjs');

// ============================================================
// CONFIGURACIÓN
// ============================================================

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_INDEX = process.env.PINECONE_INDEX || 'jarvis-memories';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
const EMBEDDING_MODEL = 'text-embedding-3-small';
const EMBEDDING_DIMENSIONS = 1536;

// ============================================================
// EMBEDDING GENERATOR
// ============================================================

/**
 * Genera un embedding vectorial para un texto usando OpenAI.
 * Usa Redis como caché para evitar llamadas repetidas.
 *
 * @param {string} text
 * @returns {Promise<number[]>}
 */
async function generateEmbedding(text) {
  if (!OPENAI_API_KEY) {
    console.warn('⚠️  [VectorSearch] OPENAI_API_KEY no configurado. Usando embedding nulo.');
    return new Array(EMBEDDING_DIMENSIONS).fill(0);
  }

  // Intentar desde caché Redis primero
  const cacheKey = `embedding:${text.slice(0, 100)}`;
  const cached = await getAICache(EMBEDDING_MODEL, cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(`${OPENAI_BASE_URL}/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: EMBEDDING_MODEL,
        input: text.slice(0, 8000), // Límite del modelo
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const embedding = data.data[0].embedding;

    // Cachear por 24 horas (los embeddings son determinísticos)
    await setAICache(EMBEDDING_MODEL, cacheKey, embedding, 86400);

    return embedding;
  } catch (err) {
    console.error('❌ [VectorSearch] Error generando embedding:', err.message);
    return new Array(EMBEDDING_DIMENSIONS).fill(0);
  }
}

// ============================================================
// PINECONE CLIENT
// ============================================================

let _pineconeIndex = null;

async function getPineconeIndex() {
  if (!PINECONE_API_KEY) return null;

  if (!_pineconeIndex) {
    try {
      const pinecone = new Pinecone({ apiKey: PINECONE_API_KEY });
      _pineconeIndex = pinecone.index(PINECONE_INDEX);
      console.log(`✅ [VectorSearch] Conectado a Pinecone index: ${PINECONE_INDEX}`);
    } catch (err) {
      console.error('❌ [VectorSearch] Error conectando a Pinecone:', err.message);
      return null;
    }
  }

  return _pineconeIndex;
}

// ============================================================
// FALLBACK: COSINE SIMILARITY EN MEMORIA
// ============================================================

/**
 * Calcula la similitud coseno entre dos vectores.
 * @param {number[]} a
 * @param {number[]} b
 * @returns {number} Valor entre -1 y 1 (1 = idénticos)
 */
function cosineSimilarity(a, b) {
  if (a.length !== b.length) return 0;
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// ============================================================
// VECTOR SEARCH ENGINE
// ============================================================

class VectorSearchEngine {
  constructor() {
    this.isInitialized = false;
    this.usePinecone = false;
  }

  async initialize() {
    if (this.isInitialized) return;
    console.log('🔍 [VectorSearch] Inicializando motor de búsqueda vectorial...');

    const index = await getPineconeIndex();
    this.usePinecone = !!index;

    if (this.usePinecone) {
      console.log('✅ [VectorSearch] Modo: Pinecone (cloud)');
    } else {
      console.log('⚠️  [VectorSearch] Modo: Fallback (similitud coseno en memoria)');
    }

    this.isInitialized = true;
  }

  /**
   * Indexa un documento (recuerdo) en el motor vectorial.
   *
   * @param {object} params
   * @param {string} params.id        ID único del documento
   * @param {string} params.text      Texto a indexar
   * @param {object} [params.metadata] Metadatos adicionales (userId, type, etc.)
   * @returns {Promise<number[]>} El embedding generado
   */
  async index({ id, text, metadata = {} }) {
    const embedding = await generateEmbedding(text);

    if (this.usePinecone) {
      const index = await getPineconeIndex();
      await index.upsert([{
        id,
        values: embedding,
        metadata: {
          ...metadata,
          text: text.slice(0, 1000), // Pinecone limita el tamaño de metadata
        },
      }]);
      console.log(`📌 [VectorSearch] Indexado en Pinecone: ${id}`);
    }

    return embedding;
  }

  /**
   * Busca documentos similares a una consulta.
   *
   * @param {string} query            Texto de búsqueda
   * @param {object} [options]
   * @param {number} [options.limit=5]
   * @param {number} [options.minScore=0.7]
   * @param {object} [options.filter]  Filtros de metadata (solo Pinecone)
   * @param {Array}  [options.localVectors] Vectores locales para fallback
   * @returns {Promise<Array<{id: string, score: number, metadata: object}>>}
   */
  async search(query, options = {}) {
    const { limit = 5, minScore = 0.7, filter, localVectors = [] } = options;

    const queryEmbedding = await generateEmbedding(query);

    if (this.usePinecone) {
      return this._searchPinecone(queryEmbedding, { limit, minScore, filter });
    } else {
      return this._searchLocal(queryEmbedding, localVectors, { limit, minScore });
    }
  }

  /**
   * Búsqueda en Pinecone (producción).
   * @private
   */
  async _searchPinecone(queryEmbedding, { limit, minScore, filter }) {
    try {
      const index = await getPineconeIndex();
      const response = await index.query({
        vector: queryEmbedding,
        topK: limit,
        includeMetadata: true,
        ...(filter && { filter }),
      });

      return response.matches
        .filter(match => match.score >= minScore)
        .map(match => ({
          id: match.id,
          score: match.score,
          metadata: match.metadata,
        }));
    } catch (err) {
      console.error('❌ [VectorSearch] Error en búsqueda Pinecone:', err.message);
      return [];
    }
  }

  /**
   * Búsqueda local por similitud coseno (fallback).
   * @private
   */
  _searchLocal(queryEmbedding, localVectors, { limit, minScore }) {
    if (!localVectors.length) return [];

    const results = localVectors
      .map(item => ({
        id: item.id,
        score: cosineSimilarity(queryEmbedding, item.embedding),
        metadata: item.metadata,
      }))
      .filter(item => item.score >= minScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return results;
  }

  /**
   * Elimina un documento del índice vectorial.
   * @param {string} id
   */
  async delete(id) {
    if (this.usePinecone) {
      const index = await getPineconeIndex();
      await index.deleteOne(id);
    }
  }

  /**
   * Obtiene estadísticas del índice.
   * @returns {Promise<object>}
   */
  async getStats() {
    if (!this.usePinecone) {
      return { mode: 'local-fallback', pineconeAvailable: false };
    }

    try {
      const index = await getPineconeIndex();
      const stats = await index.describeIndexStats();
      return {
        mode: 'pinecone',
        pineconeAvailable: true,
        totalVectors: stats.totalRecordCount,
        dimensions: stats.dimension,
        indexFullness: stats.indexFullness,
      };
    } catch (err) {
      return { mode: 'pinecone', pineconeAvailable: false, error: err.message };
    }
  }
}

// Singleton
const vectorSearch = new VectorSearchEngine();

module.exports = { vectorSearch, generateEmbedding, cosineSimilarity };
