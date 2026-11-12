# Estándares y Requisitos del Proyecto

Checklist completo para el desarrollo del Generador de Hoja de Vida.

---

## 1. Configuración Inicial del Proyecto

- [x] **1.1** Inicializar proyecto Next.js con TypeScript y ESLint
- [x] **1.2** Instalar dependencias base: `firebase`, `firebase-admin`, `zod`, `@vercel/blob`
- [x] **1.3** Instalar dependencias de desarrollo: `vitest`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`
- [x] **1.4** Configurar `env.example` con variables de entorno ficticias
- [x] **1.5** Configurar `.gitignore` para excluir `.env*`, claves y archivos de Vercel
- [x] **1.6** Crear estructura de carpetas: `app/`, `src/components/`, `src/hooks/`, `src/schemas/`, `src/services/`, `src/repositories/`, `src/lib/`
- [x] **1.7** Configurar `tsconfig.json` con `strict: true` y `noUncheckedIndexedAccess`

---

## 2. Configuración de IA (Sección 15 del documento)

- [x] **2.1** Crear `AGENTS.md` con reglas del proyecto para la IA (≤ 100 líneas)
- [x] **2.2** Configurar `opencode.jsonc` con restricciones de permisos
- [x] **2.3** Denegar lectura de `.env*`, `*.pem`, `*.key`, `*firebase-adminsdk*.json`
- [x] **2.4** Configurar `permissions.blockReadsOutsideWorkingDirectories: true`
- [x] **2.5** Configurar sandbox con `filesystem.denyRead: ["~/"]`
- [x] **2.6** Denegar comandos peligrosos: `sudo`, `rm -rf`, `git push --force`, `git reset --hard`
- [x] **2.7** Crear `ia/CONFIGURACION.md` documentando cada barrera
- [x] **2.8** Crear `ia/PRUEBAS-CONTENCION.md` con pruebas de seguridad
- [x] **2.9** Crear `ia/BITACORA.md` para registro de uso de IA
- [x] **2.10** Probar que la IA no puede leer `.env.local`
- [x] **2.11** Probar que la IA no puede salir de la carpeta del proyecto
- [x] **2.12** Probar protección contra prompt injection

---

## 3. Calidad del Código

- [x] **3.1** Configurar script `check` = `typecheck` + `lint` + `format:check` + `test`
- [x] **3.2** Configurar TypeScript strict sin `any`, `@ts-ignore`, `@ts-nocheck`
- [x] **3.3** Configurar ESLint flat config con `eslint-config-next`
- [x] **3.4** Reglas ESLint: `complexity` ≤ 10, `max-lines-per-function` ≤ 50, `max-depth` ≤ 3, `no-console`, `eqeqeq`
- [x] **3.5** Configurar Prettier + `.editorconfig`
- [x] **3.6** Configurar Husky + lint-staged para formateo pre-commit
- [x] **3.7** Configurar CI en GitHub Actions: `npm ci` → `npm run check` → `npm run build` → `npm audit`
- [x] **3.8** Configurar cobertura ≥ 80% en lógica de negocio con Vitest

---

## 4. Estructura de Rutas (App Router)

- [x] **4.1** Crear `app/layout.tsx` con landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`)
- [x] **4.2** Crear `app/page.tsx` (landing page)
- [x] **4.3** Crear `app/login/page.tsx` (inicio de sesión)
- [x] **4.4** Crear `app/mis-cv/page.tsx` (lista de CVs)
- [x] **4.5** Crear `app/cv/[id]/editar/page.tsx` (editor)
- [x] **4.6** Crear `app/cv/[id]/imprimir/page.tsx` (vista impresión)
- [x] **4.7** Crear `app/p/[codigo]/page.tsx` (enlace público)
- [x] **4.8** Crear `app/loading.tsx`, `app/error.tsx`, `app/not-found.tsx`
- [x] **4.9** Crear `app/proxy.ts` (middleware para redirigir a /login)

---

## 5. API REST

- [x] **5.1** Crear `app/api/auth/sesion/route.ts` (POST, DELETE, GET /yo)
- [x] **5.2** Implementar `createSessionCookie` con `auth_time` verificado
- [x] **5.3** Implementar `requerirUsuario(request)` con `verifySessionCookie`
- [x] **5.4** Crear `app/api/cv/route.ts` (CRUD de CVs)
- [x] **5.5** Crear `app/api/cv/[id]/route.ts` (obtener, actualizar, eliminar CV)
- [x] **5.6** Crear `app/api/p/[codigo]/route.ts` (CV público)
- [x] **5.7** Crear `app/api/upload/route.ts` con `handleUpload` de Vercel Blob
- [x] **5.8** Implementar validación de `pathname` en subida (empiece por `usuarios/<uid>/`)
- [x] **5.9** Implementar validación de tipos y tamaños de archivos
- [x] **5.10** Crear envoltorio común `manejar(handler)` para respuestas consistentes
- [x] **5.11** Implementar validación con Zod en todas las rutas
- [x] **5.12** Implementar autorización por objeto (usuario solo toca lo suyo)
- [x] **5.13** Implementar defensa CSRF con `SameSite=Lax` y verificación de `Origin`
- [x] **5.14** Configurar `Cache-Control: no-store` en rutas privadas
- [x] **5.15** Configurar cabeceras de seguridad en `next.config`

---

## 6. Firebase

- [x] **6.1** Configurar Firebase Auth con Email/Password habilitado (documentado en FIREBASE-SETUP.md)
- [x] **6.2** Crear proyecto en Firestore con reglas que niegan todo (firestore.rules creado)
- [x] **6.3** Generar cuenta de servicio para Admin SDK (documentado en FIREBASE-SETUP.md)
- [x] **6.4** Crear `src/lib/firebase-client.ts` (SDK web)
- [x] **6.5** Crear `src/lib/firebase-admin.ts` (Admin SDK)
- [x] **6.6** Crear `src/lib/auth.ts` con funciones de autenticación
- [x] **6.7** Implementar `requerirUsuario(request)` en servidor
- [x] **6.8** Implementar manejo de roles con custom claims
- [x] **6.9** Crear `src/repositories/cv-repository.ts` para acceso a Firestore

---

## 7. Vercel Blob

- [ ] **7.1** Crear store privado con `vercel blob create-store <nombre> --access private`
- [ ] **7.2** Configurar `BLOB_READ_WRITE_TOKEN` solo en servidor
- [ ] **7.3** Implementar subida directa desde navegador con `@vercel/blob/client`
- [ ] **7.4** Implementar notificación al servidor con `onUploadCompleted`
- [ ] **7.5** Implementar entrega de archivos a través de API verificando dueño
- [ ] **7.6** Implementar eliminación de archivos con verificación de propietario

---

## 8. Esquemas Zod

- [x] **8.1** Crear `src/schemas/cv.ts` con esquema completo de CV
- [x] **8.2** Definir esquema para datos personales (nombre, correo, teléfono, etc.)
- [x] **8.3** Definir esquema para experiencia laboral (máx 10)
- [x] **8.4** Definir esquema para estudios (máx 10)
- [x] **8.5** Definir esquema para habilidades e idiomas
- [x] **8.6** Validar fechas: inicio anterior al fin
- [x] **8.7** Validar formato de correo y teléfono
- [x] **8.8** Configurar modo estricto para rechazar campos desconocidos

---

## 9. Servicios (Reglas de Negocio)

- [x] **9.1** Crear `src/services/cv-service.ts` con lógica de CV
- [x] **9.2** Implementar creación de CV con ID único
- [x] **9.3** Implementar actualización de CV
- [x] **9.4** Implementar eliminación de CV
- [x] **9.5** Implementar listado de CVs por usuario
- [x] **9.6** Implementar generación de código público
- [x] **9.7** Implementar verificación de acceso (usuario solo accede lo suyo)
- [x] **9.8** Implementar servicio de foto (subida, eliminación, verificación de dueño)

---

## 10. Componentes de UI

- [x] **10.1** Crear componentes accesibles con `aria-*` cuando sea necesario
- [x] **10.2** Crear `components/Button.tsx` reutilizable
- [x] **10.3** Crear `components/Input.tsx` con `<label>` asociado
- [x] **10.4** Crear `components/TextArea.tsx` con `<label>` asociado
- [x] **10.5** Crear `components/Select.tsx` con `<label>` asociado
- [x] **10.6** Crear `components/Modal.tsx` con foco atrapado
- [x] **10.7** Crear `components/Toast.tsx` con `aria-live`
- [x] **10.8** Crear `components/Skeleton.tsx` para estados de carga
- [x] **10.9** Crear `components/EmptyState.tsx` para estados vacíos
- [x] **10.10** Crear `components/ErrorMessage.tsx` para errores

---

## 11. Editor de CV

- [x] **11.1** Crear formulario por pasos con estado compartido (Context)
- [x] **11.2** Implementar sección de datos personales
- [x] **11.3** Implementar sección de perfil
- [x] **11.4** Implementar sección de experiencia laboral
- [x] **11.5** Implementar sección de estudios
- [x] **11.6** Implementar sección de habilidades
- [x] **11.7** Implementar sección de idiomas
- [x] **11.8** Implementar vista previa en vivo
- [x] **11.9** Implementar reordenamiento de secciones
- [x] **11.10** Implementar reordenamiento de experiencias y estudios
- [x] **11.11** Implementar subida de foto de perfil
- [x] **11.12** Implementar guardado automático (debounce)
- [x] **11.13** Implementar borrador local con `localStorage`

---

## 12. Plantillas

- [x] **12.1** Crear `src/components/plantillas/PlantillaBase.tsx`
- [x] **12.2** Diseñar Plantilla 1 (moderna)
- [x] **12.3** Diseñar Plantilla 2 (clásica)
- [x] **12.4** Diseñar Plantilla 3 (minimalista)
- [x] **12.5** Asegurar que los datos no se pierden al cambiar de plantilla
- [x] **12.6** Implementar selector de plantilla

---

## 13. Impresión y PDF

- [x] **13.1** Crear `app/cv/[id]/imprimir/page.tsx`
- [x] **13.2** Implementar estilos `@media print`
- [x] **13.3** Asegurar que no se corte un puesto de trabajo por la mitad
- [x] **13.4** Implementar botón de impresión con `window.print()`
- [x] **13.5** Asegurar que cabe en página cuando corresponde

---

## 14. Enlace Público

- [x] **14.1** Implementar generación de código único
- [x] **14.2** Implementar `app/api/p/[codigo]/route.ts` (solo si `publica = true`)
- [x] **14.3** Implementar `app/p/[codigo]/page.tsx` (solo lectura)
- [x] **14.4** Retornar 404 si el enlace está desactivado
- [x] **14.5** Escapar contenido de usuarios al mostrar

---

## 15. Seguridad

- [x] **15.1** Ningún secreto en Git ni en variables `NEXT_PUBLIC_*`
- [x] **15.2** Reglas de Firestore: `allow read, write: if false;`
- [x] **15.3** El navegador no importa `firebase/firestore`
- [x] **15.4** Cada ruta privada verifica sesión y autorización por objeto
- [x] **15.5** `proxy.ts` no es la única defensa
- [x] **15.6** Entradas validadas con Zod en cliente y servidor
- [x] **15.7** Contenido de usuarios escapado al mostrar
- [x] **15.8** Cookie de sesión `HttpOnly`, `Secure`, `SameSite=Lax`
- [x] **15.9** Comprobación de `Origin` al modificar datos
- [x] **15.10** Archivos validados por tipo y tamaño en servidor
- [x] **15.11** `pathname` verificado en subida de archivos
- [x] **15.12** Tiendas de Blob revisadas para no exceder cuotas
- [x] **15.13** `npm audit` revisado
- [x] **15.14** Sin secretos en logs
- [x] **15.15** Cabeceras de seguridad configuradas

---

## 16. Accesibilidad (WCAG 2.2 AA)

- [x] **16.1** Enlace "Saltar al contenido"
- [x] **16.2** Todo operable con teclado
- [x] **16.3** Orden de tabulación lógico
- [x] **16.4** Foco siempre visible
- [x] **16.5** Contraste ≥ 4.5:1 en texto
- [x] **16.6** Contraste ≥ 3:1 en controles
- [x] **16.7** Objetivos táctiles ≥ 24×24 px
- [x] **16.8** Formularios con `<label>` asociado
- [x] **16.9** Errores anunciados con `aria-live`
- [x] **16.10** `alt` útil en imágenes
- [x] **16.11** `lang="es"` en `<html>`
- [x] **16.12** Respetar `prefers-reduced-motion`
- [x] **16.13** Respetar `prefers-color-scheme`
- [x] **16.14** Un solo `<h1>` por página
- [x] **16.15** Jerarquía de títulos sin saltos
- [x] **16.16** Semántica HTML: `<button>` para acciones, `<a>` para navegar

---

## 17. Responsivo

- [x] **17.1** Diseño mobile-first
- [x] **17.2** Probado a 360 px (móvil)
- [x] **17.3** Probado a 768 px (tableta)
- [x] **17.4** Probado a 1024 px (escritorio)
- [x] **17.5** Sin scroll horizontal en ninguno
- [x] **17.6** Zoom al 200% sin perder contenido
- [x] **17.7** Reflow sin scroll a 320 px
- [x] **17.8** Uso de `rem`, `clamp()`, Grid y Flexbox
- [x] **17.9** Sin anchos fijos en píxeles
- [x] **17.10** `next/image` con `sizes` apropiados

---

## 18. Rendimiento

- [ ] **18.1** LCP ≤ 2.5 s
- [ ] **18.2** INP ≤ 200 ms
- [ ] **18.3** CLS ≤ 0.1
- [ ] **18.4** Lighthouse Rendimiento ≥ 90
- [ ] **18.5** Lighthouse Accesibilidad ≥ 95
- [ ] **18.6** Lighthouse Buenas prácticas ≥ 95
- [ ] **18.7** Lighthouse SEO ≥ 95
- [ ] **18.8** JavaScript transferido ≤ 200 kB
- [ ] **18.9** Página inicial ≤ 1 MB

---

## 19. Pruebas

- [x] **19.1** Prueba RTL: reordenar experiencias cambia el orden en vista previa
- [x] **19.2** Prueba utilidad: formato de rangos de fecha
- [x] **19.3** Prueba API: leer CV ajeno privado retorna 404
- [x] **19.4** Al menos 3 pruebas de componentes con RTL
- [x] **19.5** Al menos 3 pruebas de API: 401, 400, 403/404
- [x] **19.6** Al menos 1 prueba de integración: ruta → servicio → repositorio

---

## 20. Documentación

- [x] **20.1** Crear `openapi.yaml` con todas las rutas
- [x] **20.2** Crear colección de solicitudes (Bruno o Postman)
- [x] **20.3** Incluir: registro de sesión, caso exitoso, 400, 401, 403/404
- [x] **20.4** Documentar parámetros, cuerpos y códigos de respuesta

---

## 21. Calidad - Evidencias

- [x] **21.1** Crear carpeta `calidad/`
- [x] **21.2** Crear `CALIDAD.md` con índice
- [ ] **21.3** Informes Lighthouse de 3 páginas
- [ ] **21.4** Capturas en 360, 768 y 1024 px
- [ ] **21.5** Resultado de axe DevTools
- [ ] **21.6** Resultado del validador HTML del W3C
- [ ] **21.7** Lista de comprobación manual (teclado, zoom, lector de pantalla)
- [ ] **21.8** Tabla de LCP, INP y CLS
- [ ] **21.9** Retos de excelencia elegidos con evidencia

---

## 22. Despliegue

- [ ] **22.1** Crear proyecto en Vercel
- [ ] **22.2** Configurar variables de entorno en Vercel
- [ ] **22.3** Crear store de Vercel Blob
- [ ] **22.4** Desplegar con `vercel deploy --prod`
- [ ] **22.5** Comprobar `GET /api/auth/yo` en producción
- [ ] **22.6** Comprobar flujo de inicio de sesión en producción
- [ ] **22.7** Comprobar subida de fotos en producción
- [ ] **22.8** Comprobar enlace público en producción

---

## Orden de Implementación Sugerido

1. **Hito 1 (Semana 4):** Configuración inicial + base del proyecto + estructura de rutas + estilos de impresión + configuración de IA
2. **Hito 2 (Semana 7):** Componentes de UI + editor + plantillas + responsivo + accesibilidad
3. **Hito 3 (Semana 12):** API REST + validación + Firestore + Blob + pruebas
4. **Hito 4 (Semana 15):** Integración completa + seguridad + calidad + despliegue

---

## Definición de "Terminado"

Cada tarea se considera terminada cuando:

- ✅ Pasa `npm run check` sin errores
- ✅ Tiene pruebas si aplica
- ✅ Está documentada si aplica
- ✅ Cumple accesibilidad AA
- ✅ Cumple responsivo (360/768/1024)
- ✅ Revisada por el desarrollador
- ✅ Commiteada con mensaje convencional
