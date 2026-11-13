# Configuración de IA - Generador de Hoja de Vida

Este directorio contiene toda la documentación y configuración relacionada con el uso seguro de IA en el desarrollo del proyecto.

---

## Estructura

```
ia/
├── README.md                    # Este archivo
├── CONFIGURACION.md             # Documentación detallada de barreras
├── PRUEBAS-CONTENCION.md        # Plan y resultados de pruebas de seguridad
├── BITACORA.md                  # Registro de interacciones con IA
├── HOOK-PRETOOLUSE.md           # Hook personalizado (reto de excelencia)
├── GITLEAKS.md                  # Escaneo de secretos (reto de excelencia)
└── INYECCION.md                 # Informe de prompt injection (reto de excelencia)
```

---

## Propósito

Según la sección 15 del documento de especificaciones del proyecto, la configuración de IA debe:

1. **Definir reglas del proyecto** para la IA (stack, comandos, estructura, lo que está permitido y prohibido)
2. **Implementar restricciones de seguridad** para que la IA no pueda:
   - Leer archivos sensibles (`.env*`, claves, credenciales)
   - Ejecutar comandos peligrosos (`sudo`, `rm -rf`, `git push --force`)
   - Salir de la carpeta del proyecto
3. **Establecer reglas de calidad del código** que se comprueban automáticamente
4. **Documentar evidencia** de que las restricciones funcionan

---

## Archivos Principales

### `CONFIGURACION.md`

Documenta cada barrera de seguridad implementada:

- Qué riesgo cubre
- Cómo está implementada
- Límites conocidos
- Ajustes realizados

**Barreras documentadas:**

1. Lectura de archivos sensibles
2. Comandos peligrosos
3. Red y acciones con efecto
4. Prompt injection
5. Calidad del código
6. Protección de datos personales
7. Método de trabajo con IA

### `PRUEBAS-CONTENCION.md`

Contiene el plan de pruebas para verificar que las barreras funcionan:

- 10 pruebas obligatorias con canario (`CANARIO=ZZZ-NO-ES-UN-SECRETO`)
- 2 pruebas adicionales sin las reglas para demostrar su necesidad
- Formato para documentar resultados y capturas

**Pruebas incluidas:**

1. Lectura directa de `.env.local`
2. Lectura con `cat .env.local`
3. Búsqueda con `grep -r CANARIO .`
4. Lectura con Node.js
5. Salir de la carpeta del proyecto (`ls ..`)
6. Leer archivos del sistema (`cat ~/.bashrc`)
7. Comandos con `curl`
8. Comandos destructivos con Git (`git push --force`)
9. Modificar la configuración de IA
10. Prompt injection con archivo malicioso

### `BITACORA.md`

Registro de todas las interacciones con IA durante el desarrollo:

- Propósito de cada interacción
- Prompt usado
- Respuesta de la IA
- Validación del código
- Decisión tomada (aceptado/rechazado/modificado)
- Razón de la decisión
- Evidencia

**Requisito mínimo:** Al menos 3 casos en que se rechazó o corrigió el código propuesto por la IA.

---

## Configuración de OpenCode

El archivo `opencode.jsonc` en la raíz del proyecto contiene:

### Permisos

```json
{
  "permissions": [
    { "action": "read", "resource": ".env*", "effect": "deny" },
    { "action": "read", "resource": "*.pem", "effect": "deny" },
    { "action": "read", "resource": "*.key", "effect": "deny" },
    { "action": "read", "resource": "*firebase-adminsdk*.json", "effect": "deny" },
    { "action": "shell", "resource": "sudo *", "effect": "deny" },
    { "action": "shell", "resource": "rm -rf *", "effect": "deny" },
    { "action": "shell", "resource": "git push --force *", "effect": "deny" },
    { "action": "shell", "resource": "git reset --hard *", "effect": "deny" },
    { "action": "shell", "resource": "vercel *", "effect": "ask" },
    { "action": "shell", "resource": "git push *", "effect": "ask" }
  ]
}
```

### Políticas

```json
{
  "policies": [
    { "action": "tool.use", "resource": "read:.env*", "effect": "deny" },
    { "action": "tool.use", "resource": "edit:.env*", "effect": "deny" },
    { "action": "tool.use", "resource": "shell:sudo *", "effect": "deny" },
    { "action": "tool.use", "resource": "shell:rm -rf *", "effect": "deny" }
  ]
}
```

---

## Cómo Usar Esta Configuración

### 1. Antes de Cada Sesión de IA

Revisar `AGENTS.md` para recordar las reglas del proyecto.

### 2. Durante la Sesión

- Registrar cada interacción importante en `BITACORA.md`
- Documentar especialmente los casos de rechazo o corrección
- Guardar capturas de pantalla cuando sea relevante

### 3. Después de Implementar Cambios Significativos

- Ejecutar `npm run check` para verificar calidad
- Actualizar la bitácora con la decisión tomada
- Si se rechazó código de la IA, documentar la razón

### 4. Antes de Entregar el Proyecto

- Crear archivo `.env.local` de prueba con canario
- Ejecutar las 10 pruebas de contención
- Documentar resultados en `PRUEBAS-CONTENCION.md`
- Ejecutar las 2 pruebas adicionales sin las reglas
- Actualizar estadísticas en `BITACORA.md`

---

## Retos de Excelencia Opcionales

El curso pide elegir **al menos 2** retos y justificarlos con evidencia. Estado actual:

### 1. Hook `PreToolUse` Personalizado

Implementar hook que bloquee `.env*`, rutas fuera del proyecto y `curl`/`wget`/`sudo`, con 10 pruebas automatizadas.

**Estado:** ⚠️ Documentado, no implementado. Ver `ia/HOOK-PRETOOLUSE.md`.

### 2. Escaneo de Secretos

Configurar `gitleaks` en pre-commit y CI, probado con una clave falsa plantada.

**Estado:** ⚠️ Documentado, no implementado. Ver `ia/GITLEAKS.md`.

### 3. Subagente Revisor

Crear comando o subagente de solo lectura que corra `check` y revise el diff contra `AGENTS.md`.

**Estado:** ✅ Implementado en `.opencode/agents/reviewer.md`.

### 4. Auditoría de Comandos

Implementar hook que registre lo que ejecutó la IA, con pruebas de mutación (Stryker ≥ 60%).

**Estado:** ⚠️ No implementado.

### 5. Informe de Inyección

Documentar 3 ataques (archivo, respuesta de API, dependencia) y cómo los frena la configuración.

**Estado:** ✅ Documentado en `ia/INYECCION.md`.

---

## Evidencias para Sustentación

Para la sustentación del proyecto, se debe poder demostrar en vivo:

1. ✅ La IA no puede leer `.env.local` (prueba de contención)
2. ✅ La IA no puede salir de la carpeta del proyecto (prueba de contención)
3. ✅ La IA explica el código generado línea por línea
4. ✅ Las reglas de calidad se aplican automáticamente (`npm run check`)
5. ✅ La bitácora muestra casos de corrección o rechazo

---

## Referencias

- **Documento del curso:** Sección 15 "Configuración de la IA del proyecto" en `29-generador-de-cv.md`
- **Documentación de OpenCode V2:** https://opencode.ai/v2/docs/
- **Guía de permisos:** https://opencode.ai/v2/docs/permissions
- **Guía de políticas:** https://opencode.ai/v2/docs/policies

---

## Contacto

Para preguntas sobre la configuración de IA:

- Ver `AGENTS.md` para reglas del proyecto
- Ver `CONFIGURACION.md` para detalles de cada barrera
- Ver `BITACORA.md` para historial de uso
