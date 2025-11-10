# 🐛 PROBLEMAS CONOCIDOS

**Fecha**: 2025-01-05
**Versión**: J.A.R.V.I.S. PURO v1.0.0

---

## ⚠️ PROBLEMA 1: Banner de Inicialización Duplicado

### Descripción

El banner "INICIALIZANDO SISTEMA CONVERSACIONAL OMNIPOTENTE" aparece **DOS VECES** durante el inicio de JARVIS:

```
════════════════════════════════════════════════════════════
🧠 INICIALIZANDO SISTEMA CONVERSACIONAL OMNIPOTENTE
════════════════════════════════════════════════════════════


════════════════════════════════════════════════════════════
🧠 INICIALIZANDO SISTEMA CONVERSACIONAL OMNIPOTENTE
════════════════════════════════════════════════════════════
```

### Causa Raíz

El método `JarvisConversationalMain.initialize()` se está llamando **DOS VECES** desde algún lugar del código.

### Ubicación del Problema

**Archivo**: `core/jarvis-conversational-main.js:43-54`

Aunque existe una verificación de `this.initialized`:

```javascript
async initialize() {
  // Verificar ANTES de imprimir cualquier cosa
  if (this.initialized) {
    return true;
  }

  // Marcar como en proceso INMEDIATAMENTE
  this.initialized = true;

  console.log('\n' + '═'.repeat(60));
  console.log('🧠 INICIALIZANDO SISTEMA CONVERSACIONAL OMNIPOTENTE');
  console.log('═'.repeat(60) + '\n');
  // ...
}
```

El problema persiste, lo que sugiere que hay una **condición de carrera** (race condition) donde ambas llamadas llegan casi simultáneamente antes de que `this.initialized = true` surta efecto.

### Posibles Orígenes

1. **Llamadas múltiples desde `jarvis-pure.js`**
2. **Imports circulares** entre módulos conversacionales
3. **Race condition** en inicialización asíncrona

### Impacto

- ❌ **Estético**: Banner duplicado confunde al usuario
- ✅ **Funcional**: No afecta la funcionalidad del sistema
- ✅ **Seguridad**: No representa riesgo de seguridad

### Severidad

**BAJA** - Problema cosmético que no afecta operación.

### Workaround Temporal

Ninguno necesario. El sistema funciona correctamente a pesar del banner duplicado.

### Solución Propuesta

**Opción 1**: Agregar mutex/lock en `initialize()`:

```javascript
class JarvisConversationalMain {
  constructor(jarvis) {
    this.jarvis = jarvis;
    this.initialized = false;
    this.initializing = false; // ← NUEVO: flag de "en proceso"
    // ...
  }

  async initialize() {
    // Verificar si ya está inicializado O en proceso
    if (this.initialized || this.initializing) {
      // Esperar a que termine si está en proceso
      while (this.initializing) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      return true;
    }

    // Marcar como "en proceso" INMEDIATAMENTE
    this.initializing = true;

    console.log('\n' + '═'.repeat(60));
    console.log('🧠 INICIALIZANDO SISTEMA CONVERSACIONAL OMNIPOTENTE');
    console.log('═'.repeat(60) + '\n');

    try {
      // ... resto de la inicialización ...

      this.initialized = true;
      this.initializing = false; // ← Marcar como terminado
      return true;

    } catch (error) {
      this.initializing = false; // ← Liberar en caso de error
      throw error;
    }
  }
}
```

**Opción 2**: Investigar todas las llamadas a `conversationalSystem.initialize()`:

```bash
# Buscar en el código dónde se llama initialize()
grep -r "conversationalSystem.initialize()" core/
grep -r "JarvisConversationalMain" core/
```

### Estado

⏳ **PENDIENTE** - Requiere investigación adicional para identificar origen exacto de llamada duplicada.

---

## 📝 OTROS PROBLEMAS MENORES

### HybridBridge: Advertencia si Python no está disponible

**Descripción**: Al iniciar sin Python, se muestra advertencia extensa.

**Severidad**: MUY BAJA - Es comportamiento esperado.

**Estado**: ✅ WORKING AS INTENDED

---

## ✅ PROBLEMAS RESUELTOS

### ~~Saludos no reconocidos~~

**Descripción**: "hola JARVIS como estas?" no era reconocido.

**Solución**: Agregado regex para detectar "cómo estás" standalone.

**Estado**: ✅ RESUELTO en jarvis-pure.js:232-235

### ~~No hay contexto conversacional~~

**Descripción**: Preguntas de seguimiento ("porque?") no funcionaban.

**Solución**: Implementado `conversationContext` en jarvis-pure.js.

**Estado**: ✅ RESUELTO en jarvis-pure.js:56-63

### ~~Regex "porque" fallaba~~

**Descripción**: "porque ?" no era detectado correctamente.

**Solución**: Separado en dos patterns: `/^porque\s*\??$/i` y `/^por\s+qu[ée]\s*\??$/i`

**Estado**: ✅ RESUELTO en jarvis-pure.js:866-867

### ~~Acciones no implementadas~~

**Descripción**: Todas las acciones retornaban "no implementada aún".

**Solución**: Creado sistema de acciones reales en `/actions/` con 5 módulos completos.

**Estado**: ✅ RESUELTO - 5 acciones operacionales

---

## 🔧 REPORTE DE BUGS

Para reportar nuevos bugs:

1. Verificar que no esté en esta lista
2. Reproducir el error consistentemente
3. Anotar:
   - Mensaje de error exacto
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Logs relevantes

---

**Última actualización**: 2025-01-05
**Responsable**: J.A.R.V.I.S. para Ulmer Solier
