# 📦 Archivos Obsoletos

Este directorio contiene scripts y archivos que fueron reemplazados por versiones mejoradas o ya no son necesarios.

## Scripts Movidos Aquí

### old-tests/
- `activar-cerebro-jarvis.js` - Reemplazado por `core/auto-memory-logger.cjs` + `core/update-claude-context.cjs`
- `test-jarvis-natural.cjs` - Test exploratorio antiguo
- `test-ollama-*.{js,cjs}` - Tests experimentales de Ollama (5 archivos)

## Razón de Archivo

Estos scripts fueron parte del desarrollo pero han sido:
1. Reemplazados por implementaciones mejores
2. Ya no son necesarios para el sistema actual
3. Conservados para referencia histórica

## Sistema Actual

El sistema de memoria ahora usa:
- `core/auto-memory-logger.cjs` - Motor principal de memoria
- `core/update-claude-context.cjs` - Actualización automática de contexto
- `memory/CONTEXT-FOR-CLAUDE.md` - Contexto para Claude
- `.claude/instructions.md` - Instrucciones permanentes de JARVIS

**Fecha de archivo:** 2025-11-10
**Por:** J.A.R.V.I.S. MARK VII (Claude Sonnet 4.5)
