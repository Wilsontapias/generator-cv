# Bitácora de Uso de IA

Registro de interacciones con IA durante el desarrollo del proyecto.

---

## Propósito

Documentar el uso de IA como herramienta de desarrollo, incluyendo:

- Casos de éxito donde la IA aportó valor
- Casos donde se rechazó o corrigió el código propuesto por la IA
- Lecciones aprendidas sobre limitaciones y mejores prácticas

---

## Formato de Registro

Cada entrada sigue este formato:

```markdown
### YYYY-MM-DD: [Título breve]

**Propósito:** Qué se intentaba lograr

**Prompt usado:** (resumen del prompt)

**Respuesta de la IA:** (resumen de lo que propuso)

**Validación:** ¿El código era correcto? ¿Pasó `npm run check`?

**Decisión:** Aceptado / Rechazado / Modificado

**Razón:** Por qué se tomó esa decisión

**Evidencia:** (captura de pantalla, diff, o referencia a commit)
```

---

## Registro de Casos

### 2026-11-12: Configuración inicial del proyecto

**Propósito:** Configurar la base del proyecto Next.js con TypeScript, ESLint, y estructura de carpetas según el documento de especificaciones.

**Prompt usado:** "Crea la base del proyecto Next.js con la estructura especificada en el documento 29-generador-de-cv.md"

**Respuesta de la IA:**

- Creó `package.json` con dependencias
- Configuró `tsconfig.json` con strict mode
- Configuró `eslint.config.mjs` con reglas estrictas
- Creó estructura de carpetas `app/`, `src/components/`, `src/hooks/`, etc.
- Creó archivos base: `app/layout.tsx`, `app/page.tsx`, `src/styles/globals.css`

**Validación:**

- ✅ Estructura de carpetas correcta
- ✅ Configuración de TypeScript strict
- ✅ Reglas de ESLint alineadas con requisitos
- ✅ Dependencias correctas

**Decisión:** Aceptado con modificaciones menores

**Razón:** La IA propuso algunas dependencias que no eran necesarias inicialmente. Se ajustó el `package.json` para incluir solo lo esencial del hito 1.

**Evidencia:** Commit inicial del proyecto

---

### 2026-11-12: Configuración de seguridad de IA

**Propósito:** Implementar barreras de seguridad para que la IA no pueda leer archivos sensibles ni ejecutar comandos peligrosos.

**Prompt usado:** "Configura las restricciones de seguridad para la IA según la sección 15 del documento de especificaciones"

**Respuesta de la IA:**

- Creó `opencode.jsonc` con reglas de permisos
- Denegó lectura de `.env*`, `*.pem`, `*.key`, `*firebase-adminsdk*.json`
- Denegó comandos peligrosos: `sudo`, `rm -rf`, `git push --force`, `git reset --hard`
- Configuró efecto `ask` para `vercel` y `git push`

**Validación:**

- ✅ Reglas de permisos correctamente configuradas
- ✅ Sintaxis JSON válida
- ✅ Cubre todos los casos mencionados en el documento

**Decisión:** Aceptado

**Razón:** La configuración cumple con los requisitos del documento de especificaciones. Las reglas son claras y cubren los principales riesgos.

**Evidencia:** Archivo `opencode.jsonc` en el repositorio

---

## Casos de Rechazo o Corrección

### Caso 1: 2026-11-12 - Ajuste de dependencias

**Contexto:** La IA propuso incluir todas las dependencias del proyecto completo desde el inicio.

**Problema:** El documento de especificaciones indica un enfoque por hitos. El hito 1 no requiere todas las dependencias.

**Corrección:** Se ajustó `package.json` para incluir solo:

- Next.js, React, React DOM
- Firebase (solo SDK web para hito 1)
- Zod para validación
- Dependencias de desarrollo básicas (TypeScript, ESLint, Vitest)

**Lección:** La IA tiende a ser ambiciosa y agregar todo de una vez. Es importante guiarla para seguir el enfoque incremental del proyecto.

---

### Caso 2: 2026-11-12 - Configuración de sandbox

**Contexto:** La IA propuso configurar sandbox completo con filesystem restrictions.

**Problema:** En Windows nativo, el sandbox de OpenCode no está disponible. Se requiere WSL2 con bubblewrap.

**Corrección:** Se documentó en `ia/CONFIGURACION.md` que:

- Las reglas de permisos son la primera línea de defensa
- El sandbox completo requiere WSL2 (reto futuro)
- Por ahora, las reglas de `read` y `shell` son suficientes si el usuario supervisa

**Lección:** La IA no siempre considera las limitaciones del entorno específico. Es importante validar que las soluciones propuestas funcionen en el contexto real.

---

### Caso 3: 2026-11-12 - Prompts para Stitch

**Contexto:** La IA generó 12 prompts separados para Stitch con diferentes aspectos del diseño.

**Problema:** El usuario solicitó consolidar en solo 2 prompts completos con toda la información pertinente.

**Corrección:** Se consolidaron los prompts en:

1. **Prompt 1:** Interfaz completa de la aplicación (landing, login, dashboard, editor, impresión, página pública, componentes, responsive, modo oscuro, accesibilidad, impresión)
2. **Prompt 2:** Las 3 plantillas de CV con especificaciones detalladas de diseño, tipografía, colores, y estructura

**Lección:** La IA puede ser demasiado granular en sus respuestas. Es importante ser específico sobre el nivel de detalle y consolidación deseada.

---

## Lecciones Aprendidas

1. **Especificidad en prompts:** Ser muy específico sobre lo que se quiere reduce iteraciones.

2. **Validación continua:** No aceptar código de la IA sin revisar. Ejecutar `npm run check` y verificar que cumpla con los estándares.

3. **Contexto del proyecto:** La IA no conoce el enfoque incremental por hitos a menos que se le indique explícitamente.

4. **Limitaciones del entorno:** Validar que las soluciones propuestas funcionen en el entorno real (Windows vs Linux, versiones específicas, etc.).

5. **Seguridad primero:** Siempre que la IA proponga código que maneje autenticación, datos sensibles o permisos, revisar cuidadosamente.

---

## Estadísticas

| Métrica                          | Valor |
| -------------------------------- | ----- |
| Total de interacciones           | 3     |
| Aceptadas sin cambios            | 1     |
| Aceptadas con modificaciones     | 2     |
| Rechazadas completamente         | 0     |
| Casos de corrección documentados | 3     |

---

## Próximos Pasos

- [ ] Implementar el editor de CV y registrar interacciones con la IA
- [ ] Documentar al menos 3 casos adicionales de corrección o rechazo
- [ ] Actualizar estadísticas mensualmente

---

## Referencias

- `AGENTS.md` - Reglas del proyecto para la IA
- `ia/CONFIGURACION.md` - Documentación de barreras de seguridad
- `ia/PRUEBAS-CONTENCION.md` - Plan de pruebas de seguridad
- Documento del curso: Sección 15 "Configuración de la IA del proyecto"
