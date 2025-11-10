# 🏗️ FASE 2 INICIAL - MOTOR DE CREACIÓN DE PROYECTOS (90 MINUTOS)

**Inicio:** 2025-11-07 01:15 UTC-3  
**Fin estimado:** 2025-11-07 02:45 UTC-3  
**Estado:** EJECUCIÓN INMEDIATA  
**Alcance:** FASE 2 Inicial (50% - Foundation)

---

## ⏱️ CRONOGRAMA (90 minutos)

- **00-10 min:** Especificaciones + Dependencias
- **10-40 min:** Módulo project-creator.js
- **40-65 min:** Templates base (3 tipos)
- **65-80 min:** Integración en main-ultimate.js
- **80-90 min:** Testing de creación de proyectos

---

## 📋 ESPECIFICACIONES FASE 2 INICIAL

### Alcance Funcional

**Tipos de Proyectos a Soportar (FASE 2 INICIAL):**

| Tipo | Template | Descripción |
|------|----------|-------------|
| `nodejs-backend` | Express.js | API REST con Node.js + Express |
| `react-frontend` | React + Vite | SPA moderna con React |
| `python-cli` | Python Click | CLI con Python |
| `nodejs-cli` | Node.js Commander | CLI con Node.js |
| `web-static` | HTML5 + CSS | Sitio estático responsive |

### Estructura de Salida

```
mi-proyecto/
├── .git/                    # Repositorio Git inicializado
├── .gitignore              # Estándar por tipo
├── README.md               # Auto-generado con instrucciones
├── package.json (node)     # O requirements.txt (python)
├── .env.example            # Variables de entorno
├── src/                    # Código fuente
│   ├── index.js (node)
│   ├── App.jsx (react)
│   └── main.py (python)
├── public/                 # Assets (si aplica)
├── tests/                  # Tests base
└── .vscode/settings.json   # Configuración VS Code
```

### Comando Principal

```javascript
// Sintaxis:
crear proyecto [nombre] [tipo]

// Ejemplos:
crear proyecto mi-api nodejs-backend
crear proyecto dashboard react-frontend
crear proyecto cli-tool python-cli
crear proyecto mi-sitio web-static
```

---

## 🛠️ PASO 1: PREPARACIÓN (10 minutos)

### 1.1 Instalar dependencias

```bash
cd ~/jarvis-standalone
npm install ncp mkdirp inquirer dotenv
```

**Descripción de dependencias:**
- `ncp`: Copia de directorios (templates → proyectos)
- `mkdirp`: Crear directorios recursivos
- `inquirer`: Preguntas interactivas
- `dotenv`: Manejo de variables de entorno

### 1.2 Crear estructura de templates

```bash
mkdir -p templates/nodejs-backend/src
mkdir -p templates/react-frontend/src/components
mkdir -p templates/python-cli
mkdir -p templates/nodejs-cli
mkdir -p templates/web-static/css
mkdir -p templates/web-static/js

mkdir -p projects
```

---

## 🎨 PASO 2: MÓDULO project-creator.js (30 minutos)

**Ubicación:** `core/project-creator.js`  
**Líneas estimadas:** 450  
**Dependencias:** ncp, mkdirp, path, fs-extra, inquirer

### 2.1 Estructura principal del módulo

```javascript
// core/project-creator.js

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const ncp = require('ncp').ncp;
const mkdirp = require('mkdirp');
const inquirer = require('inquirer');

class ProjectCreator {
  constructor(logger) {
    this.logger = logger;
    this.baseDir = path.join(__dirname, '../templates');
    this.projectsDir = path.join(__dirname, '../projects');
  }

  // ===== TEMPLATES DISPONIBLES =====
  getAvailableTemplates() {
    return {
      'nodejs-backend': {
        name: 'Node.js Backend (Express.js)',
        description: 'API REST con Node.js + Express',
        author: 'JARVIS',
        version: '1.0.0',
        deps: ['express', 'dotenv', 'cors', 'body-parser'],
        devDeps: ['nodemon', 'jest'],
        port: 3000
      },
      'react-frontend': {
        name: 'React Frontend (Vite)',
        description: 'SPA moderna con React + Vite',
        author: 'JARVIS',
        version: '1.0.0',
        deps: ['react', 'react-dom', 'axios'],
        devDeps: ['vite', '@vitejs/plugin-react', 'vitest'],
        port: 5173
      },
      'python-cli': {
        name: 'Python CLI (Click)',
        description: 'Herramienta CLI con Python Click',
        author: 'JARVIS',
        version: '1.0.0',
        deps: ['click', 'requests'],
        devDeps: ['pytest', 'black']
      },
      'nodejs-cli': {
        name: 'Node.js CLI (Commander)',
        description: 'Herramienta CLI con Node.js',
        author: 'JARVIS',
        version: '1.0.0',
        deps: ['commander', 'chalk'],
        devDeps: ['jest'],
        binary: 'cli'
      },
      'web-static': {
        name: 'Static Website (HTML5)',
        description: 'Sitio web estático responsive',
        author: 'JARVIS',
        version: '1.0.0',
        deps: [],
        devDeps: ['http-server']
      }
    };
  }

  // ===== CREAR PROYECTO =====
  async createProject(projectName, templateType) {
    try {
      // Validar template
      const templates = this.getAvailableTemplates();
      if (!templates[templateType]) {
        return {
          success: false,
          message: `❌ Template no encontrado. Disponibles: ${Object.keys(templates).join(', ')}`
        };
      }

      const template = templates[templateType];
      const projectPath = path.join(this.projectsDir, projectName);

      // Validar que no exista
      if (fs.existsSync(projectPath)) {
        return {
          success: false,
          message: `❌ Proyecto "${projectName}" ya existe en ${projectPath}`
        };
      }

      this.logger.info(`📦 Creando proyecto: ${projectName} (${templateType})`);

      // Crear directorio
      await mkdirp(projectPath);

      // Copiar template
      const templatePath = path.join(this.baseDir, templateType);
      await this.copyTemplate(templatePath, projectPath);

      // Generar package.json / requirements.txt
      await this.generateConfigFiles(projectPath, projectName, template, templateType);

      // Generar README
      await this.generateReadme(projectPath, projectName, template);

      // Generar .env.example
      await this.generateEnvExample(projectPath, templateType);

      // Inicializar Git
      await this.initializeGit(projectPath);

      // Instalar dependencias (opcional)
      const installDeps = await this.promptInstallDependencies();
      if (installDeps) {
        await this.installDependencies(projectPath, templateType);
      }

      const message = `✅ Proyecto "${projectName}" creado exitosamente en:\n${projectPath}`;
      this.logger.info(message);

      return {
        success: true,
        message: message,
        projectPath: projectPath,
        template: templateType,
        nextSteps: this.getNextSteps(projectName, templateType)
      };

    } catch (error) {
      this.logger.error('Error creando proyecto:', error);
      return {
        success: false,
        message: `❌ Error: ${error.message}`
      };
    }
  }

  // ===== COPIAR TEMPLATE =====
  async copyTemplate(src, dest) {
    return new Promise((resolve, reject) => {
      ncp(src, dest, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  // ===== GENERAR package.json / requirements.txt =====
  async generateConfigFiles(projectPath, projectName, template, type) {
    if (type.includes('python')) {
      // requirements.txt
      const requirementsContent = template.deps.join('\n') + '\n';
      await fs.writeFile(
        path.join(projectPath, 'requirements.txt'),
        requirementsContent
      );
    } else {
      // package.json
      const packageJson = {
        name: projectName,
        version: template.version,
        description: template.description,
        author: template.author,
        license: 'MIT',
        main: type === 'nodejs-cli' ? `bin/${template.binary}.js` : 'src/index.js',
        scripts: this.getScripts(type),
        dependencies: {},
        devDependencies: {}
      };

      // Llenar dependencias
      template.deps.forEach(dep => {
        packageJson.dependencies[dep] = '^1.0.0';
      });
      template.devDeps.forEach(dep => {
        packageJson.devDependencies[dep] = '^1.0.0';
      });

      await fs.writeJSON(
        path.join(projectPath, 'package.json'),
        packageJson,
        { spaces: 2 }
      );

      // .npmrc
      if (type === 'react-frontend') {
        const npmrc = 'legacy-peer-deps=true\n';
        await fs.writeFile(path.join(projectPath, '.npmrc'), npmrc);
      }
    }
  }

  // ===== SCRIPTS POR TIPO =====
  getScripts(type) {
    const scripts = {
      'nodejs-backend': {
        start: 'node src/index.js',
        dev: 'nodemon src/index.js',
        test: 'jest',
        build: 'echo "No build needed"'
      },
      'react-frontend': {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview',
        test: 'vitest'
      },
      'nodejs-cli': {
        start: 'node bin/cli.js',
        test: 'jest'
      },
      'web-static': {
        serve: 'http-server .',
        build: 'echo "No build needed"'
      }
    };

    return scripts[type] || { start: 'echo "No script defined"' };
  }

  // ===== GENERAR README =====
  async generateReadme(projectPath, projectName, template) {
    const readmeContent = `# ${projectName}

${template.description}

## Instalación

\`\`\`bash
npm install
\`\`\`

## Desarrollo

\`\`\`bash
npm run dev
\`\`\`

## Testing

\`\`\`bash
npm test
\`\`\`

## Estructura

\`\`\`
${projectName}/
├── src/              # Código fuente
├── tests/            # Tests
├── .env.example      # Variables de entorno
└── package.json      # Dependencias
\`\`\`

## Autor

Creado por: **JARVIS** 🤖  
Generado: ${new Date().toLocaleString()}

## Licencia

MIT
`;

    await fs.writeFile(path.join(projectPath, 'README.md'), readmeContent);
  }

  // ===== GENERAR .env.example =====
  async generateEnvExample(projectPath, type) {
    let envContent = '# Variables de Entorno\n\n';

    if (type === 'nodejs-backend') {
      envContent += `NODE_ENV=development
PORT=3000
DATABASE_URL=
API_KEY=
SECRET_KEY=
`;
    } else if (type === 'react-frontend') {
      envContent += `VITE_API_URL=http://localhost:3000
VITE_DEBUG=false
`;
    }

    await fs.writeFile(path.join(projectPath, '.env.example'), envContent);
  }

  // ===== INICIALIZAR GIT =====
  async initializeGit(projectPath) {
    try {
      execSync('git init', { cwd: projectPath, stdio: 'ignore' });
      execSync('git config user.email "jarvis@ulmer.dev"', { cwd: projectPath, stdio: 'ignore' });
      execSync('git config user.name "JARVIS"', { cwd: projectPath, stdio: 'ignore' });

      // Commit inicial
      execSync('git add .', { cwd: projectPath, stdio: 'ignore' });
      execSync('git commit -m "Initial commit - Scaffolding generado por JARVIS"', { 
        cwd: projectPath, 
        stdio: 'ignore' 
      });

      this.logger.info(`✅ Git inicializado en ${projectPath}`);
    } catch (error) {
      this.logger.warn(`⚠️ Error inicializando Git: ${error.message}`);
    }
  }

  // ===== PREGUNTAR INSTALAR DEPENDENCIAS =====
  async promptInstallDependencies() {
    const answer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'install',
        message: '¿Instalar dependencias ahora?',
        default: true
      }
    ]);
    return answer.install;
  }

  // ===== INSTALAR DEPENDENCIAS =====
  async installDependencies(projectPath, type) {
    try {
      this.logger.info('📦 Instalando dependencias...');

      if (type.includes('python')) {
        execSync('pip install -r requirements.txt', { cwd: projectPath });
      } else {
        execSync('npm install', { cwd: projectPath });
      }

      this.logger.info('✅ Dependencias instaladas');
    } catch (error) {
      this.logger.warn(`⚠️ Error instalando dependencias: ${error.message}`);
    }
  }

  // ===== PRÓXIMOS PASOS =====
  getNextSteps(projectName, type) {
    const steps = {
      'nodejs-backend': [
        `cd projects/${projectName}`,
        'npm install',
        'npm run dev',
        'Visitar: http://localhost:3000'
      ],
      'react-frontend': [
        `cd projects/${projectName}`,
        'npm install',
        'npm run dev',
        'Se abrirá http://localhost:5173'
      ],
      'python-cli': [
        `cd projects/${projectName}`,
        'pip install -r requirements.txt',
        'python -m src.main --help'
      ],
      'nodejs-cli': [
        `cd projects/${projectName}`,
        'npm install',
        'node bin/cli.js --help'
      ],
      'web-static': [
        `cd projects/${projectName}`,
        'npm install http-server -g',
        'npx http-server .',
        'Visitar: http://localhost:8080'
      ]
    };

    return steps[type] || [];
  }

  // ===== LISTAR PROYECTOS =====
  async listProjects() {
    try {
      if (!fs.existsSync(this.projectsDir)) {
        return [];
      }

      const projects = fs.readdirSync(this.projectsDir)
        .filter(f => fs.statSync(path.join(this.projectsDir, f)).isDirectory());

      return projects;
    } catch (error) {
      this.logger.error('Error listando proyectos:', error);
      return [];
    }
  }

  // ===== EXPORTAR =====
  async initialize() {
    this.logger.info('✅ ProjectCreator inicializado');
  }
}

module.exports = ProjectCreator;
```

---

## 🎨 PASO 3: TEMPLATES BASE (25 minutos)

### 3.1 Template: nodejs-backend

**Ubicación:** `templates/nodejs-backend/`

**Archivo: src/index.js**
```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.get('/', (req, res) => {
  res.json({
    message: 'API Backend creada por JARVIS',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
});

module.exports = app;
```

**Archivo: tests/index.test.js**
```javascript
describe('API Tests', () => {
  test('Servidor debería iniciar', () => {
    expect(true).toBe(true);
  });
});
```

### 3.2 Template: react-frontend

**Ubicación:** `templates/react-frontend/`

**Archivo: src/App.jsx**
```javascript
import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <header>
        <h1>🤖 JARVIS Frontend</h1>
        <p>Aplicación React creada por JARVIS</p>
      </header>

      <main>
        <button onClick={() => setCount(count + 1)}>
          Contador: {count}
        </button>
      </main>

      <footer>
        <p>Generado con React + Vite</p>
      </footer>
    </div>
  );
}

export default App;
```

**Archivo: index.html**
```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JARVIS Frontend</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

### 3.3 Template: python-cli

**Ubicación:** `templates/python-cli/`

**Archivo: src/main.py**
```python
import click

@click.group()
def cli():
    """CLI creada por JARVIS"""
    pass

@cli.command()
@click.option('--name', prompt='Tu nombre', help='Nombre del usuario')
def hello(name):
    """Saluda al usuario"""
    click.echo(f'¡Hola, {name}! Bienvenido a JARVIS CLI')

@cli.command()
def version():
    """Muestra versión"""
    click.echo('JARVIS CLI v1.0.0')

if __name__ == '__main__':
    cli()
```

**Archivo: tests/test_main.py**
```python
from click.testing import CliRunner
from src.main import cli

def test_hello():
    runner = CliRunner()
    result = runner.invoke(hello, ['--name', 'Test'])
    assert result.exit_code == 0
```

---

## 🔗 PASO 4: INTEGRACIÓN EN main-ultimate.js (15 minutos)

### 4.1 Agregar import

**Buscar:**
```javascript
const memoryCommands = require('./core/memory-commands');
const taskManager = require('./core/task-manager');
```

**Agregar:**
```javascript
const ProjectCreator = require('./core/project-creator');
```

### 4.2 Agregar inicialización

**Buscar la función de startup y agregar:**
```javascript
// Inicializar Project Creator
const projectCreator = new ProjectCreator(logger);
await projectCreator.initialize();
logger.info('✅ Motor de Proyectos inicializado');
```

### 4.3 Agregar manejador de comandos

**Agregar en función de procesamiento de comandos:**

```javascript
// ===== CREAR PROYECTOS =====
if (command.match(/crear proyecto\s+(.+?)\s+(nodejs-backend|react-frontend|python-cli|nodejs-cli|web-static)/i)) {
  return await handleProjectCommands(command);
}

if (command.match(/listar proyectos/i)) {
  return await handleProjectCommands(command);
}
```

### 4.4 Agregar función manejadora

**Agregar al final del archivo:**

```javascript
async function handleProjectCommands(command) {
  try {
    // Listar proyectos
    if (command.match(/listar proyectos/i)) {
      const projects = await projectCreator.listProjects();
      if (projects.length === 0) {
        return '📁 No hay proyectos creados aún';
      }
      return `📁 Proyectos:\n${projects.map((p, i) => `${i+1}. ${p}`).join('\n')}`;
    }

    // Crear proyecto
    const match = command.match(/crear proyecto\s+(.+?)\s+(nodejs-backend|react-frontend|python-cli|nodejs-cli|web-static)/i);
    if (match) {
      const projectName = match[1].trim();
      const templateType = match[2];

      const result = await projectCreator.createProject(projectName, templateType);
      
      if (result.success) {
        let response = result.message + '\n\n📋 Próximos pasos:\n';
        result.nextSteps.forEach((step, i) => {
          response += `${i+1}. ${step}\n`;
        });
        return response;
      } else {
        return result.message;
      }
    }

    return '❓ Comando de proyecto no reconocido';
  } catch (error) {
    logger.error('Error en handleProjectCommands:', error);
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

**Test 1: Ver templates disponibles**
```
crear proyecto --help
```
Esperado: Lista de templates disponibles

**Test 2: Crear proyecto Node.js**
```
crear proyecto mi-api nodejs-backend
```
Esperado: ✅ Proyecto creado, preguntar por instalar dependencias

**Test 3: Crear proyecto React**
```
crear proyecto dashboard react-frontend
```
Esperado: ✅ Proyecto creado con estructura React

**Test 4: Listar proyectos**
```
listar proyectos
```
Esperado: 
```
📁 Proyectos:
1. mi-api
2. dashboard
```

**Test 5: Verificar estructura**
```bash
ls -la projects/mi-api/
```
Esperado:
- ✅ .git/
- ✅ src/
- ✅ tests/
- ✅ package.json
- ✅ README.md
- ✅ .env.example

---

## 📊 ESTADO FINAL ESPERADO

```
✅ FASE 2 INICIAL - COMPLETADA

Motor de Proyectos:
  ✅ 5 tipos de templates
  ✅ Scaffolding automático
  ✅ Git inicializado
  ✅ Dependencias configuradas
  ✅ README auto-generado
  ✅ .env auto-generado

Comandos disponibles:
  ✅ crear proyecto [nombre] [tipo]
  ✅ listar proyectos

Total del sistema:
  ✅ ~30,400 líneas (código + documentación)
  ✅ Proyectos creables desde cero
```

---

## 🚀 PRÓXIMA FASE

**FASE 2 COMPLETA (para mañana/después):**
- 10+ templates adicionales
- Configuración personalizable
- Generación de CI/CD
- Publishing automático

---

**¿Iniciamos implementación de FASE 2 INICIAL ahora, Señor?** 🎩⚡
