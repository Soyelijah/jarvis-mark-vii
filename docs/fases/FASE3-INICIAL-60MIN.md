# 🔍 FASE 3 INICIAL - BÚSQUEDA INTELIGENTE (60 MINUTOS)

**Inicio:** 2025-11-07 01:27 UTC-3  
**Fin estimado:** 2025-11-07 02:27 UTC-3  
**Estado:** EJECUCIÓN INMEDIATA  
**Alcance:** FASE 3 Inicial (50% - Foundation)

---

## ⏱️ CRONOGRAMA (60 minutos)

- **00-05 min:** Especificaciones + Dependencias
- **05-20 min:** Módulo search-engine.js
- **20-35 min:** Indexación local + embeddings
- **35-50 min:** Integración en main-ultimate.js
- **50-60 min:** Testing de búsquedas

---

## 📋 ESPECIFICACIONES FASE 3 INICIAL

### Alcance Funcional

**Motores de Búsqueda:**

| Motor | Descripción | API | Rapidez |
|-------|-------------|-----|---------|
| DuckDuckGo | Privacidad, sin tracking | Web scraping | Rápido |
| Wikipedia | Información confiable | API oficial | Muy rápido |
| ArXiv | Papers científicos | API oficial | Rápido |
| Local Index | Archivos locales | Fs-extra | Instantáneo |

**Comandos Principales:**

```javascript
// Búsqueda web
busca en web [query]

// Búsqueda local
busca local [query]

// Resumen de URL
resumen de [url]

// Últimas noticias
últimas noticias

// Buscar con filtro
busca "tema" en [web|local|noticias]
```

### Arquitectura de Búsqueda

```
┌─────────────────────────────────────┐
│       JARVIS Search Engine          │
├─────────────────────────────────────┤
│  Query Parser & Intent Detection    │
├─────────────────────────────────────┤
│   ┌─────────────┐    ┌──────────┐   │
│   │ Web Search  │    │ Local    │   │
│   │ (DuckGo)    │    │ Index    │   │
│   └─────────────┘    └──────────┘   │
│         ↓                    ↓       │
│   ┌─────────────────────────────┐   │
│   │ Semantic Ranking (Embeddings) │  │
│   └─────────────────────────────┘   │
│         ↓                           │
│   ┌─────────────────────────────┐   │
│   │  Result Summarization       │   │
│   └─────────────────────────────┘   │
│         ↓                           │
│   Results Cache (30 min TTL)        │
└─────────────────────────────────────┘
```

---

## 🛠️ PASO 1: PREPARACIÓN (5 minutos)

### 1.1 Instalar dependencias

```bash
cd ~/jarvis-standalone
npm install axios cheerio natural sentence-transformers natural-language-understanding
```

**Descripción:**
- `axios`: HTTP requests para web scraping
- `cheerio`: Parsing de HTML
- `natural`: NLP básico (tokenización)
- `sentence-transformers`: Embeddings para búsqueda semántica

### 1.2 Crear estructura de directorios

```bash
mkdir -p search-engine/indexes
mkdir -p search-engine/cache
mkdir -p data/search-cache
```

---

## 📡 PASO 2: MÓDULO search-engine.js (15 minutos)

**Ubicación:** `core/search-engine.js`  
**Líneas estimadas:** 520  
**Dependencias:** axios, cheerio, natural, fs-extra

### 2.1 Código principal

```javascript
// core/search-engine.js

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');
const { tokenize } = require('natural');

class SearchEngine {
  constructor(logger) {
    this.logger = logger;
    this.cacheDir = path.join(__dirname, '../data/search-cache');
    this.cache = new Map();
    this.resultsCache = new Map();
    this.initializeCache();
  }

  // ===== INICIALIZACIÓN =====
  async initialize() {
    await fs.ensureDir(this.cacheDir);
    this.logger.info('✅ SearchEngine inicializado');
  }

  // ===== BÚSQUEDA WEB (DuckDuckGo) =====
  async searchWeb(query, limit = 5) {
    try {
      // Verificar cache
      const cacheKey = `web_${query}`;
      if (this.resultsCache.has(cacheKey)) {
        const cached = this.resultsCache.get(cacheKey);
        if (Date.now() - cached.timestamp < 30 * 60 * 1000) { // 30 min TTL
          this.logger.info(`📦 Resultados en cache para: ${query}`);
          return cached.results;
        }
      }

      this.logger.info(`🔍 Buscando en web: "${query}"`);

      // Búsqueda en DuckDuckGo
      const results = await this.duckDuckGoSearch(query, limit);

      // Guardar en cache
      this.resultsCache.set(cacheKey, {
        results: results,
        timestamp: Date.now()
      });

      return results;

    } catch (error) {
      this.logger.error('Error en búsqueda web:', error);
      return [];
    }
  }

  // ===== DUCKDUCKGO SEARCH =====
  async duckDuckGoSearch(query, limit) {
    try {
      const encoded = encodeURIComponent(query);
      const url = `https://html.duckduckgo.com/?q=${encoded}&t=h_&ia=web`;

      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      const results = [];

      // Extraer resultados
      $('.result__title').slice(0, limit).each((i, el) => {
        const $el = $(el);
        const title = $el.text().trim();
        const link = $el.find('a').attr('href');
        const description = $(el).parent().find('.result__snippet').text().trim();

        if (title && link) {
          results.push({
            title: title,
            url: link,
            description: description || 'Sin descripción',
            source: 'DuckDuckGo',
            relevance: 1.0 - (i * 0.1) // Relevancia decrece
          });
        }
      });

      this.logger.info(`✅ Encontrados ${results.length} resultados`);
      return results;

    } catch (error) {
      this.logger.warn(`⚠️ Error en DuckDuckGo: ${error.message}`);
      return [];
    }
  }

  // ===== BÚSQUEDA WIKIPEDIA =====
  async searchWikipedia(query, limit = 3) {
    try {
      this.logger.info(`📖 Buscando en Wikipedia: "${query}"`);

      const url = `https://es.wikipedia.org/w/api.php`;
      const params = {
        action: 'query',
        list: 'search',
        srsearch: query,
        srprop: 'snippet',
        srlimit: limit,
        format: 'json'
      };

      const response = await axios.get(url, { params });

      if (!response.data.query || !response.data.query.search) {
        return [];
      }

      const results = response.data.query.search.map((item, i) => ({
        title: item.title,
        url: `https://es.wikipedia.org/wiki/${encodeURIComponent(item.title)}`,
        description: this.stripHtml(item.snippet),
        source: 'Wikipedia',
        relevance: 1.0 - (i * 0.15)
      }));

      return results;

    } catch (error) {
      this.logger.warn(`⚠️ Error en Wikipedia: ${error.message}`);
      return [];
    }
  }

  // ===== BÚSQUEDA LOCAL =====
  async searchLocal(query, limit = 5) {
    try {
      this.logger.info(`🔎 Buscando localmente: "${query}"`);

      const projectsDir = path.join(__dirname, '../projects');
      const memoryDb = path.join(__dirname, '../data/memory-db.json');

      let results = [];

      // Buscar en memoria
      if (fs.existsSync(memoryDb)) {
        const memory = await fs.readJSON(memoryDb);
        const memories = memory.memories || [];

        memories.forEach((mem, i) => {
          if (this.matchesQuery(mem.content, query)) {
            results.push({
              title: mem.content.substring(0, 60),
              url: `memory://${mem.id}`,
              description: mem.content,
              source: 'Memoria Local',
              type: 'memory',
              relevance: 0.9 - (i * 0.05)
            });
          }
        });
      }

      // Buscar en proyectos (README, package.json)
      if (fs.existsSync(projectsDir)) {
        const projects = fs.readdirSync(projectsDir);

        projects.forEach((proj, i) => {
          const readmePath = path.join(projectsDir, proj, 'README.md');
          if (fs.existsSync(readmePath)) {
            const content = fs.readFileSync(readmePath, 'utf-8');
            if (this.matchesQuery(content, query)) {
              results.push({
                title: `Proyecto: ${proj}`,
                url: `project://${proj}`,
                description: content.substring(0, 150),
                source: 'Proyectos Locales',
                type: 'project',
                relevance: 0.8 - (i * 0.05)
              });
            }
          }
        });
      }

      // Ordenar por relevancia y limitar
      results = results
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, limit);

      this.logger.info(`✅ Encontrados ${results.length} resultados locales`);
      return results;

    } catch (error) {
      this.logger.error('Error en búsqueda local:', error);
      return [];
    }
  }

  // ===== BÚSQUEDA COMBINADA (WEB + LOCAL) =====
  async searchAll(query, limit = 5) {
    try {
      const webResults = await this.searchWeb(query, Math.ceil(limit * 0.6));
      const localResults = await this.searchLocal(query, Math.ceil(limit * 0.4));

      // Combinar y ranquear
      const allResults = [...webResults, ...localResults]
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, limit);

      return allResults;

    } catch (error) {
      this.logger.error('Error en búsqueda combinada:', error);
      return [];
    }
  }

  // ===== RESUMEN DE URL =====
  async summarizeUrl(url) {
    try {
      this.logger.info(`📄 Resumiendo: ${url}`);

      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      
      // Extraer texto principal
      const title = $('h1').first().text() || $('title').text();
      const paragraphs = [];

      $('p').each((i, el) => {
        if (i < 3) { // Primeros 3 párrafos
          paragraphs.push($(el).text().trim());
        }
      });

      const content = paragraphs.join('\n');
      const summary = this.generateSummary(content, 100);

      return {
        title: title,
        url: url,
        summary: summary,
        length: paragraphs.length
      };

    } catch (error) {
      this.logger.warn(`⚠️ Error resumiendo URL: ${error.message}`);
      return {
        title: 'Error',
        url: url,
        summary: 'No se pudo acceder a la URL',
        length: 0
      };
    }
  }

  // ===== UTILIDADES =====

  // Limpiar HTML
  stripHtml(html) {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim();
  }

  // Generar resumen (extractivo simple)
  generateSummary(text, maxLength) {
    if (text.length <= maxLength) return text;
    
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    return truncated.substring(0, lastSpace) + '...';
  }

  // Matching de query (simple)
  matchesQuery(text, query) {
    const queryTerms = tokenize(query.toLowerCase());
    const textLower = text.toLowerCase();

    return queryTerms.some(term => textLower.includes(term));
  }

  // ===== ESTADÍSTICAS =====
  async getSearchStats() {
    return {
      cached_results: this.resultsCache.size,
      cache_size: this.resultsCache.size,
      timestamp: new Date().toISOString()
    };
  }

  // ===== EXPORTAR =====
  async exportResults(results, format = 'json') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `search-results-${timestamp}.${format}`;
    const filepath = path.join(this.cacheDir, filename);

    if (format === 'json') {
      await fs.writeJSON(filepath, results, { spaces: 2 });
    } else if (format === 'csv') {
      const csv = this.resultsToCSV(results);
      await fs.writeFile(filepath, csv);
    }

    return filepath;
  }

  // Convertir a CSV
  resultsToCSV(results) {
    const headers = ['Título', 'URL', 'Descripción', 'Fuente', 'Relevancia'];
    const rows = results.map(r => [
      r.title,
      r.url,
      r.description.substring(0, 50),
      r.source,
      r.relevance.toFixed(2)
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(r => r.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csv;
  }
}

module.exports = SearchEngine;
```

---

## 🗂️ PASO 3: INDEXACIÓN LOCAL (15 minutos)

### 3.1 Crear índice local (local-index.js)

**Ubicación:** `core/local-index.js`  
**Líneas estimadas:** 250

```javascript
// core/local-index.js

const fs = require('fs-extra');
const path = require('path');

class LocalIndex {
  constructor(logger) {
    this.logger = logger;
    this.index = {
      memories: [],
      projects: [],
      documentation: [],
      lastIndexed: null
    };
    this.indexPath = path.join(__dirname, '../data/local-index.json');
    this.loadIndex();
  }

  // ===== CARGAR ÍNDICE =====
  async loadIndex() {
    try {
      if (fs.existsSync(this.indexPath)) {
        this.index = await fs.readJSON(this.indexPath);
        this.logger.info(`✅ Índice cargado: ${this.index.memories.length} memorias, ${this.index.projects.length} proyectos`);
      }
    } catch (error) {
      this.logger.warn('Error cargando índice:', error);
    }
  }

  // ===== INDEXAR MEMORIA =====
  async indexMemory(memory) {
    try {
      const entry = {
        id: memory.id,
        content: memory.content,
        tags: memory.tags || [],
        timestamp: memory.timestamp,
        type: 'memory'
      };

      // Buscar si existe
      const existing = this.index.memories.findIndex(m => m.id === memory.id);
      if (existing !== -1) {
        this.index.memories[existing] = entry;
      } else {
        this.index.memories.push(entry);
      }

      await this.saveIndex();
      return true;

    } catch (error) {
      this.logger.error('Error indexando memoria:', error);
      return false;
    }
  }

  // ===== INDEXAR PROYECTOS =====
  async indexProject(projectName, projectPath) {
    try {
      const entry = {
        name: projectName,
        path: projectPath,
        timestamp: new Date().toISOString(),
        type: 'project',
        files: this.scanProjectFiles(projectPath)
      };

      const existing = this.index.projects.findIndex(p => p.name === projectName);
      if (existing !== -1) {
        this.index.projects[existing] = entry;
      } else {
        this.index.projects.push(entry);
      }

      await this.saveIndex();
      return true;

    } catch (error) {
      this.logger.error('Error indexando proyecto:', error);
      return false;
    }
  }

  // ===== SCAN PROJECT FILES =====
  scanProjectFiles(projectPath) {
    try {
      const files = [];
      const extensions = ['.js', '.jsx', '.py', '.ts', '.tsx', '.md', '.json'];

      const scan = (dir, depth = 0) => {
        if (depth > 3) return; // Limitar profundidad

        try {
          fs.readdirSync(dir).forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory() && !file.startsWith('.')) {
              scan(filePath, depth + 1);
            } else if (extensions.includes(path.extname(file))) {
              files.push(file);
            }
          });
        } catch (e) {
          // Ignorar errores de acceso
        }
      };

      scan(projectPath);
      return files;

    } catch (error) {
      return [];
    }
  }

  // ===== BUSCAR EN ÍNDICE =====
  search(query) {
    const results = [];
    const queryLower = query.toLowerCase();

    // Buscar en memorias
    this.index.memories.forEach(mem => {
      if (mem.content.toLowerCase().includes(queryLower)) {
        results.push({
          type: 'memory',
          title: mem.content.substring(0, 50),
          id: mem.id,
          relevance: mem.tags.some(t => t.toLowerCase() === queryLower) ? 1.0 : 0.7
        });
      }
    });

    // Buscar en proyectos
    this.index.projects.forEach(proj => {
      if (proj.name.toLowerCase().includes(queryLower)) {
        results.push({
          type: 'project',
          title: proj.name,
          path: proj.path,
          relevance: 0.8
        });
      }
    });

    return results.sort((a, b) => b.relevance - a.relevance);
  }

  // ===== GUARDAR ÍNDICE =====
  async saveIndex() {
    try {
      this.index.lastIndexed = new Date().toISOString();
      await fs.writeJSON(this.indexPath, this.index, { spaces: 2 });
    } catch (error) {
      this.logger.error('Error guardando índice:', error);
    }
  }

  // ===== ESTADÍSTICAS =====
  getStats() {
    return {
      memories: this.index.memories.length,
      projects: this.index.projects.length,
      total_indexed_items: this.index.memories.length + this.index.projects.length,
      last_indexed: this.index.lastIndexed
    };
  }
}

module.exports = LocalIndex;
```

---

## 🔗 PASO 4: INTEGRACIÓN EN main-ultimate.js (15 minutos)

### 4.1 Agregar imports

```javascript
const SearchEngine = require('./core/search-engine');
const LocalIndex = require('./core/local-index');
```

### 4.2 Agregar inicialización

```javascript
// En función de startup()
const searchEngine = new SearchEngine(logger);
const localIndex = new LocalIndex(logger);
await searchEngine.initialize();
await localIndex.loadIndex();
logger.info('✅ Motor de Búsqueda inicializado');
```

### 4.3 Agregar manejador de comandos

```javascript
// En función de procesamiento de comandos
if (command.match(/busca en web\s+(.+)/i) ||
    command.match(/busca local\s+(.+)/i) ||
    command.match(/busca .+/i) ||
    command.match(/resumen de\s+(.+)/i)) {
  
  return await handleSearchCommands(command);
}
```

### 4.4 Agregar función manejadora

```javascript
async function handleSearchCommands(command) {
  try {
    // Búsqueda web
    if (command.match(/busca en web\s+(.+)/i)) {
      const query = command.replace(/busca en web\s+/i, '');
      const results = await searchEngine.searchWeb(query, 5);
      
      if (results.length === 0) {
        return `❌ No encontré resultados para: "${query}"`;
      }

      let response = `🔍 Resultados de búsqueda:\n\n`;
      results.forEach((r, i) => {
        response += `${i+1}. **${r.title}**\n`;
        response += `   ${r.description}\n`;
        response += `   🔗 ${r.url}\n\n`;
      });

      return response;
    }

    // Búsqueda local
    if (command.match(/busca local\s+(.+)/i)) {
      const query = command.replace(/busca local\s+/i, '');
      const results = await searchEngine.searchLocal(query, 5);
      
      if (results.length === 0) {
        return `❌ No encontré resultados locales para: "${query}"`;
      }

      let response = `📁 Resultados locales:\n\n`;
      results.forEach((r, i) => {
        response += `${i+1}. ${r.title} [${r.source}]\n`;
        response += `   ${r.description.substring(0, 80)}...\n\n`;
      });

      return response;
    }

    // Resumen de URL
    if (command.match(/resumen de\s+(.+)/i)) {
      const url = command.replace(/resumen de\s+/i, '').trim();
      const summary = await searchEngine.summarizeUrl(url);
      
      return `📄 ${summary.title}\n\n${summary.summary}`;
    }

    return '❓ Comando de búsqueda no reconocido';

  } catch (error) {
    logger.error('Error en handleSearchCommands:', error);
    return `❌ Error: ${error.message}`;
  }
}
```

---

## ✅ PASO 5: TESTING (10 minutos)

### 5.1 Iniciar JARVIS

```bash
node main-ultimate.js
```

### 5.2 Ejecutar comandos de testing

**Test 1: Búsqueda Web**
```
busca en web Node.js best practices
```
Esperado: 5 resultados con URLs y descripciones

**Test 2: Búsqueda Local**
```
busca local proyecto
```
Esperado: Proyectos locales que matcheen

**Test 3: Búsqueda Wikipedia**
```
busca en web Albert Einstein
```
Esperado: Resultados que incluyan Wikipedia

**Test 4: Resumen de URL**
```
resumen de https://nodejs.org
```
Esperado: Resumen del contenido de la página

**Test 5: Estadísticas**
```
estadísticas de búsqueda
```
Esperado: Cache stats del motor

---

## 📊 ESTADO FINAL ESPERADO

```
✅ FASE 3 INICIAL - COMPLETADA

Motor de Búsqueda:
  ✅ Búsqueda web (DuckDuckGo)
  ✅ Búsqueda local (Memoria + Proyectos)
  ✅ Resúmenes de URL
  ✅ Caché de resultados (30 min TTL)
  ✅ Búsqueda semántica

Comandos disponibles:
  ✅ busca en web [query]
  ✅ busca local [query]
  ✅ resumen de [url]

Total del sistema:
  ✅ ~31,400 líneas (código + documentación)
```

---

**¿Iniciamos implementación de FASE 3 INICIAL ahora, Señor?** 🔍⚡
