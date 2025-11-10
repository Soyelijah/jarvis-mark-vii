# 🔧 GIT & GITHUB INTEGRATION - J.A.R.V.I.S. PURO

## 📋 Índice
1. [Descripción General](#descripción-general)
2. [Arquitectura](#arquitectura)
3. [Componentes Principales](#componentes-principales)
4. [Configuración](#configuración)
5. [Comandos Git Disponibles](#comandos-git-disponibles)
6. [Comandos GitHub](#comandos-github)
7. [Monitor Autónomo](#monitor-autónomo)
8. [Ejemplos de Uso](#ejemplos-de-uso)
9. [API Reference](#api-reference)

---

## 📖 Descripción General

La integración Git/GitHub de J.A.R.V.I.S. PURO proporciona control completo sobre repositorios locales y remotos mediante **procesamiento de lenguaje natural en español**.

### ✨ Características Principales

- ✅ **Control Git Local**: status, log, add, commit, push, pull, branch, diff, stash
- ✅ **GitHub API Integration**: Repos, Issues, Pull Requests, Stars, Forks
- ✅ **Auto-Commit Inteligente**: Detecta cambios y crea commits automáticos con mensajes contextuales
- ✅ **Monitor Autónomo**: Tareas programadas cada 5min/1h/diarias (3 AM)
- ✅ **Detección Proactiva**: Alertas sobre cambios sin commit, branches desactualizadas
- ✅ **Soporte Multi-Repo**: Puede gestionar múltiples repositorios
- ✅ **Comandos en Español**: "subir cambios", "mostrar commits", "crear issue"

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                  J.A.R.V.I.S. PURO                      │
│                (core/jarvis-pure.js)                     │
└────────────┬──────────────────────┬─────────────────────┘
             │                      │
             │                      │
   ┌─────────▼─────────┐   ┌───────▼──────────┐
   │  GitIntegration   │   │ MonitorIntegr... │
   │ (git-integration) │   │ (monitor-integ..)│
   └─────────┬─────────┘   └───────┬──────────┘
             │                     │
             │                     │
   ┌─────────▼─────────────────────▼──────────┐
   │         Git CLI + GitHub API             │
   └──────────────────────────────────────────┘
```

### Flujo de Ejecución

1. **Usuario**: "git status" (lenguaje natural)
2. **NLPEngine**: Procesa mensaje → extrae keywords ["git", "status"]
3. **ReasoningEngine**: Detecta intent = "git_operation"
4. **DecisionEngine**: Elige acción = "git_status"
5. **GitIntegration**: Ejecuta `git status --porcelain`
6. **Response**: Formatea resultado en español con emojis

---

## 🔩 Componentes Principales

### 1. `core/git-integration.js` (853 líneas)

**Responsabilidades:**
- Ejecutar comandos Git locales mediante `child_process`
- Comunicarse con GitHub API v3
- Validar credenciales y tokens
- Parsear outputs de Git
- Generar commits automáticos inteligentes

**Métodos Principales:**
```javascript
// Git Local
await git.getStatus()           // Estado del repo
await git.getLog(10)            // Últimos 10 commits
await git.add('.')              // Agregar archivos
await git.commit(msg)           // Crear commit
await git.push()                // Push a remoto
await git.pull()                // Pull desde remoto
await git.branch('list')        // Listar ramas
await git.diff()                // Ver diferencias

// GitHub API
await git.listRepositories()    // Mis repositorios
await git.listIssues(owner, repo) // Issues de repo
await git.createIssue(owner, repo, title, body)
await git.listPullRequests(owner, repo)
await git.searchRepositories(query)

// Proactivo
await git.detectUncommittedChanges()
await git.detectOutdatedBranches()
await git.smartAutoCommit()
```

### 2. `core/monitor-integration.js` (642 líneas)

**Responsabilidades:**
- Ejecutar tareas programadas en 3 niveles de frecuencia
- Detectar cambios en tiempo real
- Generar alertas inteligentes
- Crear backups automáticos
- Optimizar base de datos

**Tareas Programadas:**

#### ⚡ Rápidas (cada 5 minutos)
- Detectar cambios en archivos
- Verificar estado Git (uncommitted changes)
- Escanear logs en busca de errores

#### 🕐 Horarias (cada 1 hora)
- Análisis de base de datos (memoria)
- Limpieza de logs antiguos (> 7 días)
- Auto-commit si hay >= 10 cambios acumulados
- Verificar branches desactualizadas

#### 📅 Diarias (3:00 AM)
- Backup de base de datos SQLite
- Reporte de actividad diaria
- Optimización de BD (VACUUM + ANALYZE)
- Commit y push de fin de día

**Alertas:**
```javascript
{
  id: 1730876543210,
  level: 'warning',  // info, warning, error, success
  message: '5 archivos sin commit',
  context: { files: [...], totalChanges: 5 },
  timestamp: Date,
  read: false
}
```

### 3. Integración en `jarvis-pure.js`

**Métodos Git agregados:**
- `gitStatus()` - Ver estado del repositorio
- `gitLog()` - Historial de commits
- `gitCommit()` - Crear commit (auto o manual)
- `gitPush()` - Subir cambios
- `gitPull()` - Bajar cambios
- `gitDiff()` - Ver diferencias
- `gitBranch()` - Gestión de ramas
- `githubRepos()` - Listar repositorios
- `githubIssues()` - Ver issues
- `githubCreateIssue()` - Crear issue
- `githubPullRequests()` - Ver pull requests

---

## ⚙️ Configuración

### 1. Variables de Entorno (Opcional)

Crear archivo `.env` en la raíz del proyecto:

```env
# GitHub Integration (Opcional - solo para comandos GitHub)
GITHUB_TOKEN=ghp_your_personal_access_token_here
GITHUB_USERNAME=your_username

# Master User
MASTER_USER=Tony
```

### 2. Generar GitHub Token

1. Ve a https://github.com/settings/tokens
2. Click en "Generate new token (classic)"
3. Selecciona scopes:
   - `repo` (acceso completo a repositorios)
   - `read:user` (leer perfil de usuario)
4. Copia el token y guárdalo en `.env`

### 3. Verificar Instalación

```bash
# 1. Iniciar JARVIS PURO
npm run pure

# 2. Probar comando Git
Señor > git status

# 3. Si aparece error "token no configurado" en comandos GitHub,
#    es normal - solo afecta GitHub API, Git local funciona sin token
```

---

## 🎯 Comandos Git Disponibles

### `git status` - Ver Estado del Repositorio

**Variantes:**
- "git status"
- "mostrar estado git"
- "estado del repositorio"

**Salida:**
```
📊 ESTADO DEL REPOSITORIO GIT

📍 Rama actual: main
⚠️  12 archivos con cambios

✓ Staged (2):
   + core/git-integration.js
   + core/monitor-integration.js

⚠️  Modificados (8):
   M core/jarvis-pure.js
   M package.json
   ...

❓ Sin seguimiento (2):
   ? GIT-INTEGRATION.md
   ? test-git.js

📤 3 commit(s) pendientes de push
```

---

### `git log` - Historial de Commits

**Variantes:**
- "git log"
- "mostrar commits"
- "últimos 5 commits" (especifica cantidad)
- "historial de commits"

**Salida:**
```
📜 ÚLTIMOS 10 COMMITS

1. [a3f7b21] feat: Add Git/GitHub Integration
   👤 JARVIS | 📅 4/11/2025

2. [b8c5e12] fix: Correct file name extraction in NLP
   👤 JARVIS | 📅 3/11/2025

...
```

---

### `commit automático` - Crear Commit

**Variantes:**
- "commit automático" (mensaje generado automáticamente)
- "git commit" (mensaje automático)
- `commit "mensaje personalizado"` (mensaje manual)

**Auto-Commit Inteligente:**
```javascript
// Analiza archivos modificados:
// - 5 archivos .js → "Update 5 code files"
// - 2 archivos .json → "Update configuration"
// - 1 archivo .md → "Update documentation"

// Resultado final:
"Auto-commit: Update 5 code files, Update configuration, Update documentation"
```

**Salida:**
```
✅ Auto-commit exitoso:
   📝 "Auto-commit: Update 8 code files, Update configuration"
   📁 10 archivos
```

---

### `subir cambios` - Push a Remoto

**Variantes:**
- "subir cambios"
- "git push"
- "push al remoto"

**Salida:**
```
✅ Push exitoso:
Enumerating objects: 15, done.
Counting objects: 100% (15/15), done.
To https://github.com/user/repo.git
   a3f7b21..d9e2c45  main -> main
```

---

### `bajar cambios` - Pull desde Remoto

**Variantes:**
- "bajar cambios"
- "git pull"
- "pull del remoto"

**Salida:**
```
✅ Pull exitoso:
Already up to date.
```

---

### `mostrar diferencias` - Git Diff

**Variantes:**
- "mostrar diferencias"
- "git diff"
- "ver cambios"
- "mostrar diff staged" (solo staged)

**Salida:**
```
📊 DIFERENCIAS:

diff --git a/core/jarvis-pure.js b/core/jarvis-pure.js
index a3f7b21..d9e2c45 100644
--- a/core/jarvis-pure.js
+++ b/core/jarvis-pure.js
@@ -10,6 +10,8 @@ import Personality from './personality.js';
 import Security from './security.js';
 import Logger from '../utils/logger.js';
+import GitIntegration from './git-integration.js';
+import MonitorIntegration from './monitor-integration.js';

... (143 líneas más)
```

---

### `mostrar ramas` - Gestión de Ramas

**Variantes:**
- "mostrar ramas" / "git branch" (listar)
- "crear rama [nombre]" (crear)
- "cambiar a [nombre]" (checkout)

**Salida (listar):**
```
🌿 RAMAS DEL REPOSITORIO

Locales:
* main
  feature-git-integration
  develop

Remotas:
  remotes/origin/main
  remotes/origin/develop
```

**Salida (crear):**
```
✅ Rama feature-xyz creada
```

---

## 📚 Comandos GitHub

### `mostrar repositorios` - Listar Repositorios

**Requerimientos:** `GITHUB_TOKEN` configurado

**Variantes:**
- "mostrar repositorios"
- "mis repositorios"
- "listar repos"

**Salida:**
```
📚 MIS REPOSITORIOS EN GITHUB

1. jarvis-enterprise
   📝 J.A.R.V.I.S. Enterprise Edition - Sistema de Mayordomo Personal Inteligente
   🌐 JavaScript | ⭐ 15 | 🍴 3
   🔗 https://github.com/user/jarvis-enterprise

2. project-x
   📝 Secret project
   🌐 TypeScript | ⭐ 42 | 🍴 8
   🔗 https://github.com/user/project-x

...
```

---

### `mostrar issues` - Ver Issues

**Requerimientos:**
- `GITHUB_TOKEN` configurado
- Estar en directorio de repositorio Git con remoto GitHub

**Variantes:**
- "mostrar issues"
- "issues abiertos"
- "issues closed" (cerrados)

**Salida:**
```
🐛 ISSUES OPEN (5)

1. #12 Bug en auto-commit con archivos grandes
   👤 user123 | 💬 3 comentarios
   🏷️  bug, priority-high
   🔗 https://github.com/user/repo/issues/12

2. #10 Mejorar detección de intención "analizar"
   👤 contributor | 💬 1 comentarios
   🏷️  enhancement
   🔗 https://github.com/user/repo/issues/10

...
```

---

### `crear issue` - Crear Issue Automático

**Requerimientos:** `GITHUB_TOKEN` + repositorio GitHub

**Variantes:**
- `crear issue "título del issue"`
- "crear issue automático"

**Salida:**
```
✅ Issue creado:
   #15 Agregar soporte para git stash
   🔗 https://github.com/user/repo/issues/15
```

---

### `mostrar pull requests` - Ver Pull Requests

**Variantes:**
- "mostrar pull requests"
- "pull requests abiertos"
- "prs closed" (cerrados)

**Salida:**
```
🔀 PULL REQUESTS OPEN (3)

1. #25 feat: Add Git/GitHub Integration
   👤 contributor | feature-git → main
   💬 5 comentarios | ✏️  12 commits
   📊 +1495 -32
   🔗 https://github.com/user/repo/pull/25

...
```

---

## 🤖 Monitor Autónomo

### Activación

El monitor se inicia automáticamente al arrancar J.A.R.V.I.S. PURO:

```
✅ Monitor Autónomo: ACTIVO (tareas cada 5min/1h/diario)
⏱️  Rápidas: cada 5 minutos
🕐 Horarias: cada 1 hora
📅 Diarias: 3:00 AM
```

### Ver Estado del Monitor

```javascript
Señor > estado

⚡ ESTADO DE J.A.R.V.I.S. PURO

Sistema: OPERACIONAL
Modo: autonomous
Versión: 1.0.0
Uptime: 45 minutos

Componentes:
  ✅ Motor de Razonamiento
  ✅ Motor NLP
  ✅ Motor de Decisión
  ✅ Memoria Persistente
  ✅ Personalidad Activa
  ✅ Git Integration
  ✅ Monitor Autónomo (5 alertas sin leer)

Comandos procesados: 127
```

### Alertas Generadas

El monitor genera 4 tipos de alertas:

**1. Info (ℹ️)** - Informativas
```
ℹ️  [Monitor Alert] Detectados 3 archivos modificados
```

**2. Warning (⚠️)** - Advertencias
```
⚠️  [Monitor Alert] 8 archivos sin commit
⚠️  [Monitor Alert] Branch desactualizada por 5 commits
```

**3. Error (❌)** - Errores
```
❌ [Monitor Alert] 12 errores encontrados en logs
```

**4. Success (✅)** - Éxitos
```
✅ [Monitor Alert] Auto-commit realizado
✅ [Monitor Alert] Backup creado: jarvis-memory-2025-11-04.db
```

---

## 💡 Ejemplos de Uso

### Escenario 1: Workflow Completo de Git

```bash
# 1. Iniciar JARVIS
npm run pure

# 2. Ver estado actual
Señor > git status

# 3. Revisar últimos commits
Señor > mostrar últimos 5 commits

# 4. Ver diferencias
Señor > mostrar diferencias

# 5. Crear commit automático
Señor > commit automático

# 6. Subir cambios
Señor > subir cambios
```

### Escenario 2: Gestión de Ramas

```bash
Señor > mostrar ramas

Señor > crear rama feature-new-module

Señor > cambiar a feature-new-module

Señor > git status

Señor > commit "feat: Add new module"

Señor > subir cambios
```

### Escenario 3: GitHub Issues

```bash
# Ver issues actuales
Señor > mostrar issues

# Crear issue automático
Señor > crear issue "Mejorar rendimiento de búsqueda"

# Ver pull requests
Señor > mostrar pull requests
```

### Escenario 4: Monitor Proactivo

```
# JARVIS detecta automáticamente (cada 5 minutos):
⚠️  [Monitor Alert] 12 archivos sin commit

# Usuario puede decidir:
Señor > commit automático

# Resultado:
✅ Auto-commit exitoso:
   📝 "Auto-commit: Update 12 code files"
   📁 12 archivos
```

---

## 📚 API Reference

### GitIntegration Class

#### Constructor
```javascript
const git = new GitIntegration();
await git.initialize();
```

#### Métodos Git Local

##### `getStatus(options)`
```javascript
const status = await git.getStatus();
/*
{
  clean: false,
  branch: 'main',
  files: {
    staged: ['file1.js'],
    modified: ['file2.js'],
    untracked: ['file3.js'],
    deleted: []
  },
  unpushedCommits: 3,
  totalChanges: 3
}
*/
```

##### `getLog(limit)`
```javascript
const commits = await git.getLog(10);
/*
[
  {
    hash: 'a3f7b21',
    fullHash: 'a3f7b2177a8c5e...',
    author: 'JARVIS',
    email: 'jarvis@stark.com',
    date: Date,
    message: 'feat: Add Git integration'
  },
  ...
]
*/
```

##### `commit(message, options)`
```javascript
await git.add('.');
const result = await git.commit('feat: New feature', {
  addSignature: true  // Agrega firma JARVIS
});
/*
{
  success: true,
  output: '[main a3f7b21] feat: New feature\n 5 files changed, 125 insertions(+), 12 deletions(-)'
}
*/
```

##### `push(remote, branch)`
```javascript
const result = await git.push('origin', 'main');
/*
{
  success: true,
  output: 'To https://github.com/user/repo.git\n   a3f7b21..d9e2c45  main -> main'
}
*/
```

##### `branch(action, branchName)`
```javascript
// Listar
const branches = await git.branch('list');

// Crear
await git.branch('create', 'feature-xyz');

// Cambiar
await git.branch('checkout', 'feature-xyz');

// Eliminar
await git.branch('delete', 'old-feature');
```

#### Métodos GitHub API

##### `listRepositories(options)`
```javascript
const repos = await git.listRepositories({ limit: 10, sort: 'updated' });
/*
[
  {
    name: 'jarvis-enterprise',
    fullName: 'user/jarvis-enterprise',
    description: '...',
    private: false,
    url: 'https://github.com/...',
    language: 'JavaScript',
    stars: 15,
    forks: 3,
    openIssues: 5,
    updatedAt: Date,
    createdAt: Date
  },
  ...
]
*/
```

##### `listIssues(owner, repo, options)`
```javascript
const issues = await git.listIssues('user', 'repo', {
  state: 'open',
  limit: 10,
  labels: 'bug'
});
/*
[
  {
    number: 12,
    title: 'Bug en auto-commit',
    body: '...',
    state: 'open',
    author: 'user123',
    labels: ['bug', 'priority-high'],
    comments: 3,
    createdAt: Date,
    url: 'https://github.com/...'
  },
  ...
]
*/
```

##### `createIssue(owner, repo, title, body, options)`
```javascript
const issue = await git.createIssue('user', 'repo', 'New feature request', 'Description...', {
  labels: ['enhancement'],
  assignees: ['user123']
});
/*
{
  number: 15,
  title: 'New feature request',
  url: 'https://github.com/...',
  state: 'open'
}
*/
```

#### Métodos Proactivos

##### `smartAutoCommit(options)`
```javascript
const result = await git.smartAutoCommit({ force: false });
/*
{
  committed: true,
  message: 'Auto-commit: Update 8 code files, Update configuration',
  filesChanged: 10,
  output: '[main d9e2c45] Auto-commit: ...'
}
*/
```

##### `detectUncommittedChanges()`
```javascript
const result = await git.detectUncommittedChanges();
/*
{
  hasChanges: true,
  files: { modified: [...], untracked: [...] },
  totalChanges: 12,
  branch: 'main',
  recommendation: 'Recomiendo hacer commit - hay bastantes cambios acumulados'
}
*/
```

##### `detectOutdatedBranches()`
```javascript
const result = await git.detectOutdatedBranches();
/*
{
  outdated: true,
  branch: 'main',
  behindBy: 5,
  recommendation: 'Recomiendo hacer git pull para actualizar'
}
*/
```

---

### MonitorIntegration Class

#### Constructor
```javascript
const monitor = new MonitorIntegration(jarvis);
await monitor.initialize(gitIntegration, memoryAdvanced);
monitor.start();
```

#### Métodos Principales

##### `start()`
Inicia todas las tareas programadas.

##### `stop()`
Detiene todas las tareas programadas.

##### `getStatus()`
```javascript
const status = monitor.getStatus();
/*
{
  running: true,
  alerts: {
    total: 25,
    unread: 5
  },
  lastChecks: {
    fileChanges: { hasChanges: true, totalChanges: 8 },
    gitStatus: { uncommitted: 8, unpushed: 0 },
    logErrors: { errorsFound: 0 }
  },
  nextDaily: 'Programado'
}
*/
```

##### `createAlert(level, message, context)`
```javascript
monitor.createAlert('warning', '12 archivos sin commit', {
  totalChanges: 12,
  files: [...]
});
```

##### `getUnreadAlerts()`
```javascript
const alerts = monitor.getUnreadAlerts();
/*
[
  {
    id: 1730876543210,
    level: 'warning',
    message: '12 archivos sin commit',
    context: { ... },
    timestamp: Date,
    read: false
  },
  ...
]
*/
```

---

## 🎯 Roadmap Futuro

### v1.1 (Próximamente)
- [ ] Git stash automático antes de checkout
- [ ] Detección de conflictos de merge
- [ ] Auto-rebase inteligente
- [ ] Hooks de Git personalizados

### v1.2 (Futuro)
- [ ] GitHub Actions integration
- [ ] Crear Pull Requests desde lenguaje natural
- [ ] Review de código automático con análisis de JARVIS
- [ ] Sugerencias de commit basadas en diff

### v2.0 (Visión)
- [ ] GitLab/Bitbucket support
- [ ] CI/CD integration completa
- [ ] Deployment automation
- [ ] Rollback automático en caso de errores

---

## 📄 Licencia

Este módulo es parte de J.A.R.V.I.S. PURO Enterprise Edition.

**Desarrollado con ❤️ por JARVIS**

*"A veces hay que correr antes de poder caminar."* - Tony Stark
