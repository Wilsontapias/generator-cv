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

### 2026-11-12: Implementación completa del proyecto

**Propósito:** Completar las secciones pendientes de `ESTANDARES.md` (editor de CV, plantillas, API con Firebase Admin, subida de fotos y despliegue en Vercel) siguiendo la especificación `29-generador-de-cv.md`.

**Prompt usado:** "Implementa las secciones pendientes de `ESTANDARES.md` siguiendo la especificación."

**Respuesta de la IA:**

- Editor de CV con vista previa y 3 plantillas (moderna, clásica, minimalista)
- API de CV con sesión verificada, validación Zod y autorización por objeto
- Subida de fotos a Vercel Blob
- Pruebas con Vitest y despliegue en Vercel

**Validación:** `npm run check` ✅ y `npm run build` ✅ tras cada entrega significativa.

**Decisión:** Aceptado con correcciones (ver Casos 4–6).

**Razón:** El código cumplió los estándares, pero se corrigieron decisiones de arquitectura y de seguridad (Blob privado, dependencia y recomendaciones).

**Evidencia:** Historial de commits del repositorio.

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

### Caso 4: 2026-11-12 - Store de Blob público → privado

**Contexto:** Se creó inicialmente un store de Vercel Blob **público** para las fotos de perfil.

**Problema:** La especificación `29-generador-de-cv.md` (sección 9.5) exige un store **privado** y entregar los archivos **a través de la API verificando el dueño**, nunca con una URL pública. Con el store público no se cumplía 9.5 ni el item 7.5 de `ESTANDARES.md`.

**Corrección:** Se revirtió a store privado:

- Subida con `access: "private"` y se guarda el `pathname` (`usuarios/<uid>/<archivo>`)
- Nueva ruta `GET /api/foto/[...pathname]` que valida sesión y dueño
- `fotoUrl` pasa a validar un pathname; plantillas y `PhotoUpload` usan el helper `urlFoto()` con `unoptimized`

**Lección:** Verificar la especificación **antes** de decidir arquitectura. La opción "más fácil" (público) incumplía la tarea.

**Evidencia:** Commit `e8d5128`.

---

### Caso 5: 2026-11-12 - Actualización de `@vercel/blob`

**Contexto:** La IA detectó que `@vercel/blob@0.27` no soporta stores privados (no exporta `get`, y `access` solo acepta `"public"`).

**Problema:** Sin actualizar la dependencia, el código del store privado no compilaba.

**Corrección:** Se pidió autorización al usuario y se actualizó a `@vercel/blob@^2.9.0` (requiere Node ≥ 20). Se validó con `npm run check` y `npm run build`.

**Lección:** No instalar ni actualizar dependencias sin preguntar (regla del proyecto).

**Evidencia:** `package.json`, commit `e8d5128`.

---

### Caso 6: 2026-11-12 - Recomendación prohibida (`vercel env pull`)

**Contexto:** La IA sugirió `vercel env pull .env.local` para probar en local.

**Problema:** El material del curso prohíbe `vercel env pull` porque baja los secretos de producción al disco ("sin secretos reales en el disco de desarrollo").

**Corrección:** Se retiró la recomendación y se documentó usar Firebase Emulator Suite o un proyecto de desarrollo (`FIREBASE-SETUP.md` §6).

**Lección:** Contrastar los consejos con las reglas del curso, no solo con que "funcione".

**Evidencia:** `FIREBASE-SETUP.md` §6.

---

## Lecciones Aprendidas

1. **Especificidad en prompts:** Ser muy específico sobre lo que se quiere reduce iteraciones.

2. **Validación continua:** No aceptar código de la IA sin revisar. Ejecutar `npm run check` y verificar que cumpla con los estándares.

3. **Contexto del proyecto:** La IA no conoce el enfoque incremental por hitos a menos que se le indique explícitamente.

4. **Limitaciones del entorno:** Validar que las soluciones propuestas funcionen en el entorno real (Windows vs Linux, versiones específicas, etc.).

5. **Seguridad primero:** Siempre que la IA proponga código que maneje autenticación, datos sensibles o permisos, revisar cuidadosamente.

6. **Contrastar con la especificación y el curso:** antes de aceptar una decisión de arquitectura o un consejo, verificar que cumpla `29-generador-de-cv.md` y las reglas del curso (p. ej. store de Blob privado, no bajar secretos de producción al disco).

---

## Estadísticas

| Métrica                          | Valor |
| -------------------------------- | ----- |
| Total de interacciones           | 4     |
| Aceptadas sin cambios            | 1     |
| Aceptadas con modificaciones     | 3     |
| Rechazadas completamente         | 0     |
| Casos de corrección documentados | 6     |

---

## Próximos Pasos

- [ ] Completar las evidencias de rendimiento (sección 18) y calidad (sección 21) de `ESTANDARES.md`
- [ ] Verificar en producción la subida de fotos (22.7) y el enlace público (22.8)
- [ ] Ejecutar las pruebas de contención restantes (Pruebas 2, 3 y 5 de `ia/PRUEBAS-CONTENCION.md`)
- [ ] Registrar cada interacción relevante con la IA en esta bitácora

---

## Referencias

- `AGENTS.md` - Reglas del proyecto para la IA
- `ia/CONFIGURACION.md` - Documentación de barreras de seguridad
- `ia/PRUEBAS-CONTENCION.md` - Plan de pruebas de seguridad
- Documento del curso: Sección 15 "Configuración de la IA del proyecto"
