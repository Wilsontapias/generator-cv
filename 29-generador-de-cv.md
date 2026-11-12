# 29 · Generador de hoja de vida con PDF

> **Repositorio:** `29-generador-de-cv` (un solo proyecto Next.js con la interfaz y la API)

**En una frase:** Formulario por secciones que genera una hoja de vida con varias plantillas y exportación a PDF.

---

## 1. Problema y usuario

Estudiante que prepara su hoja de vida para prácticas o su primer empleo.

Es un proyecto **atómico**: pequeño y con un solo objetivo claro. Cumpla todos los requisitos y criterios de aceptación de este documento antes de agregar funciones extra. Se construye **desde cero**: este documento es el único insumo.

## 2. Arquitectura

```text
[ Navegador ]  Next.js (App Router) · React · TypeScript
   │  Firebase Auth (SDK web) → cookie de sesión HttpOnly
   │  fetch a la API propia (mismo origen)
   ▼
[ API REST ]  Route Handlers de Next.js (app/api/**) desplegados en Vercel
   │  rutas → servicios → repositorios · Zod · manejo de errores
   ├──────▶ [ Firebase ]  Authentication + Firestore (solo vía Admin SDK)
   └──────▶ [ Vercel Blob ]  archivos
```

**Regla de oro:** todo lo privilegiado vive solo en variables de entorno del servidor (clave privada del Admin SDK, token de Blob, secretos propios). Una variable `NEXT_PUBLIC_*` queda **dentro del JavaScript que descarga cualquiera**: úsela solo para datos públicos (la configuración web de Firebase lo es). El navegador no habla con Firestore, por eso las reglas de Firestore niegan todo.

## 3. Páginas y rutas (App Router)

| Ruta                | Contenido                             |
| ------------------- | ------------------------------------- |
| `/mis-cv`           | Mis hojas de vida                     |
| `/cv/[id]/editar`   | Editor por secciones con vista previa |
| `/cv/[id]/imprimir` | Versión lista para imprimir           |
| `/p/[codigo]`       | Enlace público opcional               |

```text
app/
├── layout.tsx               # landmarks <header>, <nav>, <main>, <footer>; tema; proveedor de sesión
├── loading.tsx · error.tsx · not-found.tsx
├── mis-cv/page.tsx
├── cv/[id]/editar/page.tsx
├── cv/[id]/imprimir/page.tsx
├── p/[codigo]/page.tsx
├── api/                     # Route Handlers (la API REST)
│   └── …/route.ts
proxy.ts                     # redirige a /login si falta la cookie (NO es la seguridad real)
src/
├── components/              # UI reutilizable y accesible
├── hooks/                   # useDebounce, usePolling, …
├── schemas/                 # esquemas Zod compartidos por cliente y servidor
├── services/                # reglas de negocio (puras y testeables)
├── repositories/            # acceso a Firestore (único lugar que lo toca)
└── lib/                     # firebase (cliente y admin), auth, errores, http
tests/ · openapi.yaml · bruno/ (colección de solicitudes)
```

## 4. Interfaz, accesibilidad y diseño responsivo

- **HTML semántico:** `<header>`, `<nav>`, `<main>`, `<footer>`, un solo `<h1>` por página y jerarquía de títulos sin saltos; formularios con `<label>` asociado y `<fieldset>`/`<legend>` donde haya grupos.
- **Teclado y foco:** todo es operable con teclado, el foco siempre es visible y el orden de tabulación es lógico. Los diálogos atrapan y devuelven el foco.
- **Contraste y movimiento:** contraste AA como mínimo; respete `prefers-color-scheme` y `prefers-reduced-motion`; no use solo el color para transmitir información.
- **Responsivo (mobile-first):** diseño probado en **360, 768 y 1024 px** (y con zoom al 200 %) sin desplazamiento horizontal.
- **Estados de la interfaz:** toda pantalla que lea datos muestra **carga** (esqueleto), **vacío**, **error** y **reintento**; los cambios importantes se anuncian con `aria-live`.
- **Metas medibles:** Core Web Vitals, Lighthouse, responsive y accesibilidad tienen cifras concretas en la **sección 14**.

## 5. APIs del navegador (mínimo 2 obligatorias, con alternativa)

| API                                    | Uso en el proyecto                | Si no está disponible |
| -------------------------------------- | --------------------------------- | --------------------- |
| `@media print` y `window.print()`      | Exportar a PDF desde el navegador | Descargar HTML        |
| Drag and Drop                          | Reordenar experiencias y estudios | Botones subir/bajar   |
| `contenteditable` o campos controlados | Edición en la vista previa        | Formulario clásico    |
| `localStorage`                         | Borrador local                    | —                     |

Mejora progresiva: detecte la función (`'geolocation' in navigator`) antes de usarla, pida permisos solo al usar la función y nunca rompa la página si el navegador no la tiene o el usuario la niega.

## 6. React y Next.js (mínimo 3 técnicas)

| Técnica                                     | Uso en el proyecto                   |
| ------------------------------------------- | ------------------------------------ |
| Formulario por pasos con estado compartido  | Context y validación por sección     |
| Plantillas como componentes intercambiables | Misma data, distintas presentaciones |
| `next/image` para la foto                   | Recorte y tamaño controlados         |

Regla: componentes de servidor por defecto; `"use client"` solo donde haya estado, efectos o eventos del navegador.

## 7. Requisitos funcionales

- **RF-01** Secciones: datos personales, perfil, experiencia, estudios, habilidades e idiomas.
- **RF-02** Tres plantillas con la misma información.
- **RF-03** Vista previa en vivo y reordenar secciones.
- **RF-04** Exportar a PDF con el navegador.
- **RF-05** Subir una foto de perfil.
- **RF-06** Enlace público opcional de solo lectura.

## 8. Reglas de validación

- Correo y teléfono válidos; fechas con inicio anterior al fin.
- Máximo 10 experiencias y 10 estudios.
- Texto sin HTML; se escapa al mostrar.
- Las mismas reglas se escriben **una vez** como esquema Zod y se usan en el formulario (cliente) y en el Route Handler (servidor); el servidor es quien decide.

## 9. API REST con Next.js y Firebase

Los Route Handlers (`app/api/**/route.ts`, `export const runtime = "nodejs"`) son la API REST del proyecto. Cumplen lo que el curso pide de una API: organización por capas, asincronía, validación, manejo consistente de errores, persistencia, documentación OpenAPI y pruebas.

### 9.1 Autenticación — Firebase Auth en el navegador y cookie de sesión en el servidor

El **inicio de sesión** lo hace el SDK web de Firebase (`firebase/auth`, correo y contraseña). La configuración web de Firebase
(`NEXT_PUBLIC_FIREBASE_*`) **es pública por diseño**: identifica el proyecto pero no da acceso a datos; la seguridad real está en el servidor.
El navegador **nunca** usa Firestore directamente: solo Firebase Auth. Todo dato pasa por la API.

| Método y ruta             | Cuerpo                                                          | Respuesta                                                                         |
| ------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `POST /api/auth/sesion`   | `{ idToken }` (obtenido con `getIdToken()` tras iniciar sesión) | `204` y `Set-Cookie: sesion=…; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=…` |
| `DELETE /api/auth/sesion` | —                                                               | `204` y borra la cookie (puede revocar los refresh tokens)                        |
| `GET /api/auth/yo`        | —                                                               | `200 { usuario: { uid, correo, rol } }` o `401`                                   |

- El servidor crea la cookie con `createSessionCookie(idToken, { expiresIn })` (entre 5 minutos y 2 semanas; use unos 5 días) y exige un inicio de sesión **reciente** (`auth_time`).
- Cada Route Handler y cada Server Component que toque datos privados llama a `requerirUsuario(request)`, que usa `verifySessionCookie(cookie, true)`.
  Para probar con Bruno o Postman también acepta `Authorization: Bearer <idToken>` (`verifyIdToken`).
- **`proxy.ts`** (en Next.js 16 reemplaza a `middleware.ts`) solo redirige a `/login` si falta la cookie para mejorar la experiencia. **No es una frontera de seguridad**: la verificación real se repite en cada ruta y acción.
- Defensa contra CSRF en peticiones que modifican datos: cookie `SameSite=Lax` y comprobación de que la cabecera `Origin` coincide con el sitio.
- Roles como _custom claims_ (`rol`) asignados con el Admin SDK (`setCustomUserClaims`); un cambio de rol se refleja cuando el usuario obtiene un token nuevo (nueva sesión).
- Errores: sin sesión `401`; con sesión pero sin permiso `403`; para objetos ajenos cuyo conocimiento es sensible, `404`.

### 9.2 Contrato REST común

- Prefijo `/api`, JSON (`Content-Type: application/json`), fechas ISO 8601 UTC, dinero en enteros (centavos).
- Códigos: `200`/`201`/`204`; `400` validación (con detalle por campo); `401`; `403`; `404`; `409` conflicto (duplicado, cupo, estado inválido); `410` vencido; `413` demasiado grande; `415` tipo no permitido; `429` demasiadas solicitudes; `500` sin detalles internos.
- Error siempre `{ "error": "mensaje", "detalles"?: [{ "campo": "…", "mensaje": "…" }] }`.
- Listas con cursor: `GET /api/<recurso>?limite=20&cursor=<id>` → `{ "items": […], "siguienteCursor": "…" | null }` (`limite` máximo 100).
- Arquitectura por capas: **Route Handler** (HTTP, validación Zod) → **servicio** (reglas de negocio) → **repositorio** (Firestore). Un envoltorio común (`manejar(handler)`) convierte errores en respuestas consistentes.
- Rutas privadas con `Cache-Control: no-store`; lecturas públicas con caché (`revalidate` / `s-maxage`). CORS: solo mismo origen; nunca `Access-Control-Allow-Origin: *` en rutas privadas.
- Registro de solicitudes con un identificador por petición, **sin** contraseñas, tokens ni datos personales.

### 9.3 Convenciones de Firestore

- Acceso **solo** con el Admin SDK desde la API. Reglas de Firestore: `allow read, write: if false;`.
- Datos privados bajo `usuarios/{uid}/…` o con un campo de propietario; el `uid` sale **siempre de la sesión verificada**, nunca del cuerpo ni de la URL. Datos compartidos en colecciones raíz que solo escribe la API.
- Campos en `camelCase`; fechas como texto ISO; sin `undefined` (use `null`); un documento pesa máximo 1 MiB.
- Unicidad: use el **id del documento** y `create()` (falla con `ALREADY_EXISTS` → `409`) o una transacción.
- Contadores con `FieldValue.increment` o transacciones; en una transacción todas las lecturas van antes de las escrituras; un `batch` admite hasta 500 operaciones.
- Una consulta con rango en un campo y orden/filtro en otro necesita un **índice compuesto** (`firestore.indexes.json`). Firestore no hace búsqueda de texto parcial: use prefijos, `array-contains` o campos auxiliares.

### 9.4 Datos de este proyecto en Firestore

```text
usuarios/{uid}/cvs/{id}
  titulo, plantilla, publica: boolean, codigo|null, datos: { personales, perfil, experiencia: [], estudios: [], habilidades: [], idiomas: [] }, fotoUrl|null, actualizadoEn
```

**Endpoints propios de este proyecto** (además de los de 9.1 y los de CRUD que usted defina siguiendo 9.2):

- `GET /api/p/:codigo` — público; devuelve el CV solo si `publica = true`.
- Los datos personales se tratan como sensibles: nada en logs.

### 9.5 Archivos con Vercel Blob (store privado)

Archivos de este proyecto: foto de perfil. El token de Blob (`BLOB_READ_WRITE_TOKEN`) existe **solo en el servidor**.

- **Subida directa desde el navegador** con `upload()` de `@vercel/blob/client`, que evita el límite de 4,5 MB por petición de las funciones de Vercel. La ruta `POST /api/<proyecto>/upload` usa `handleUpload`.
- En `onBeforeGenerateToken` **debe** (1) verificar la sesión (si no, `401`), (2) comprobar que el `pathname` empiece por `usuarios/<uid>/`, (3) fijar `allowedContentTypes` y un tamaño máximo (revise el nombre de la opción en la referencia del SDK), y (4) usar `addRandomSuffix` y pasar el `uid` en `tokenPayload`.
- `onUploadCompleted` la llama Vercel Blob al terminar; **en local no funciona sin un túnel** (por ejemplo ngrok con `VERCEL_BLOB_CALLBACK_URL`). Por eso el cliente también notifica a la API con `POST` y la API verifica que el `pathname` sea del usuario antes de registrar el archivo en Firestore.
- Borrar un archivo: solo la API, con `del(url)`, y solo si el archivo pertenece al usuario.
- Si son imágenes, reduzca su tamaño en el navegador (`canvas`) antes de subirlas.
- Estos archivos son sensibles: cree un store **privado** (`vercel blob create-store <nombre> --access private`) y entréguelos **a través de la API** comprobando el dueño (guía «private storage» de la documentación de Vercel Blob). Nunca los exponga con una URL pública.
- **Cuotas (plan Hobby, según la documentación de Vercel consultada en noviembre de 2026; verifíquelas):** 1 GB de almacenamiento, 10 000 operaciones simples y **2 000 operaciones avanzadas al mes, y cada subida cuenta una**. Si se excede no se cobra, pero se **pierde el acceso a Blob 30 días**. No suba archivos en bucles durante las pruebas y borre los de prueba.

### 9.6 Seguridad de la API (se evalúa)

- **Autorización por objeto** en cada ruta (el usuario solo toca lo suyo) y por rol cuando corresponda. El cliente nunca decide precios, cupos, puntajes, roles ni el `uid`.
- Valide todo con Zod en modo estricto (rechace o descarte campos desconocidos) para evitar _mass assignment_.
- Limite la frecuencia de las rutas públicas y de escritura (Firewall de Vercel o un contador propio) y devuelva `429`.
- El contenido de usuarios se escapa al mostrarse; si admite Markdown o HTML, sanéelo. Nada de `dangerouslySetInnerHTML` sin sanear.
- Cabeceras de seguridad en `next.config` (`X-Content-Type-Options`, `Referrer-Policy`, una `Content-Security-Policy` básica).
- Variables de entorno **públicas**: `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`. Variables **solo de servidor**: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` (en Vercel con `\n` literales, conviértalos a saltos de línea al iniciar), `BLOB_READ_WRITE_TOKEN`. Nunca en Git.
- Revise dependencias (`npm audit`) y no registre secretos ni datos personales en los logs.

### 9.7 Documentación y colección de solicitudes

- Archivo `openapi.yaml` con todas las rutas del proyecto: parámetros, cuerpos, códigos de respuesta (incluidos los de error) y esquemas.
- Colección de solicitudes (Bruno o Postman) con al menos: registro de sesión, un caso exitoso, un `400`, un `401` y un `403`/`404` por ruta principal.

## 10. Criterios de aceptación

1. Dada una hoja de vida larga, entonces la versión impresa se divide sin cortar un puesto de trabajo por la mitad.
2. Dado el enlace público desactivado, entonces responde 404.
3. Dada una plantilla distinta, entonces los datos no se pierden.
4. Dado el contraste de la plantilla, entonces cumple AA.

## 11. Pruebas mínimas (Vitest)

- RTL: reordenar experiencias cambia el orden en la vista previa.
- Utilidad: formato de rangos de fecha («ene 2024 – actual»).
- API: leer un CV ajeno privado → 404.
- **Componentes:** Vitest + React Testing Library, consultas por rol y etiqueta (como lo haría un usuario), no por clases CSS. Al menos 3.
- **API:** se llama al manejador exportado (`GET`, `POST`…) con un `new Request(...)` y se simula la capa de Firebase con `vi.mock`. Al menos 3: autenticación (`401`), validación (`400`) y autorización (`403`/`404`).
- **Integración:** al menos una prueba que recorra ruta → servicio → repositorio (con el repositorio simulado) para un caso crítico.

## 12. Reto opcional

Sugerencias de redacción con IA, registrando la bitácora y verificando el resultado.

## 13. Puesta en marcha (resumen)

```bash
npx create-next-app@latest 29-generador-de-cv --ts --app --eslint --src-dir
cd 29-generador-de-cv
npm i firebase firebase-admin zod @vercel/blob
npm i -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom
# .env.local (NUNCA en Git): variables públicas NEXT_PUBLIC_FIREBASE_* y de servidor FIREBASE_*, BLOB_READ_WRITE_TOKEN
npm run dev
```

**Servicios a configurar:** (1) proyecto de Firebase con _Authentication → Email/Password_ habilitado, Firestore en modo producción con reglas que niegan todo y una cuenta de servicio (clave privada); (2) store de Vercel Blob; (3) proyecto en Vercel con las variables de entorno; (4) despliegue con `vercel deploy --prod` y comprobación de `GET /api/auth/yo` y del flujo de inicio de sesión en producción.

## 14. Metas de calidad y retos de excelencia

Los proyectos son pequeños para que haya tiempo de hacerlos **bien**: la meta no es solo que funcionen, sino que se vean, se sientan y se midan como un producto profesional. Estas metas valen para **todos** los proyectos web.

### 1 · Rendimiento y Core Web Vitals

_Se miden en la URL de producción (Vercel), perfil móvil._

- **LCP ≤ 2,5 s** (carga del contenido principal).
- **INP ≤ 200 ms** (respuesta a cada interacción).
- **CLS ≤ 0,1** (sin saltos de diseño).
- Se evalúan al percentil 75. De apoyo (orientativo): FCP ≤ 1,8 s, TTFB ≤ 0,8 s, TBT ≤ 200 ms.
- **Lighthouse móvil:** Rendimiento ≥ 90 · Accesibilidad ≥ 95 · Buenas prácticas ≥ 95 · SEO ≥ 95.
- Presupuesto: JavaScript transferido ≤ 200 kB y página inicial ≤ 1 MB (DevTools → Red, sin caché).
- **Cómo medir:** Lighthouse, PageSpeed Insights y `useReportWebVitals` (`next/web-vitals`). Lighthouse **no mide INP** en laboratorio (usa TBT como aproximación): mídalo interactuando con la página y con las métricas reales.

### 2 · Responsive: 360 · 768 · 1024 px

_Diseño mobile-first, probado en los tres anchos._

- **360 px (móvil):** una columna, sin scroll horizontal, objetivos táctiles ≥ 44×44 px (mínimo WCAG 24×24), texto ≥ 16 px, menú colapsable accesible por teclado.
- **768 px (tableta):** dos columnas donde tenga sentido, navegación visible o menú con el foco bien gestionado, formularios en dos columnas.
- **1024 px (escritorio):** hasta tres columnas, líneas de texto de ≤ 70 caracteres (`max-width: 70ch`), navegación completa.
- En los tres: sin recortes ni solapes, imágenes con `sizes` (`next/image`), `rem`, `clamp()`, Grid y Flexbox, **sin anchos fijos en píxeles**.
- Zoom al 200 % sin perder contenido ni funciones; **reflow** sin scroll horizontal a 320 px (WCAG 1.4.10).
- Vertical y horizontal. Probar en DevTools (modo dispositivo) **y en un teléfono real**.

### 3 · Accesibilidad (WCAG 2.2 nivel AA)

_Lo automático detecta solo una parte: también se revisa a mano._

- Todo se usa **solo con teclado**, en orden lógico y sin trampas; enlace **«Saltar al contenido»**.
- **Foco visible** (nunca `outline: none` sin sustituto) y no tapado por cabeceras fijas (2.4.11).
- Contraste ≥ **4,5:1** en texto y ≥ **3:1** en controles y gráficos (1.4.3, 1.4.11). No usar solo el color para informar.
- Objetivos táctiles ≥ 24×24 px (2.5.8).
- Formularios: `<label>`, errores en texto junto al campo y anunciados (`aria-describedby`, `aria-live`), `autocomplete` (1.3.5), sin pedir lo ya escrito (3.3.7); el inicio de sesión admite gestor de contraseñas y pegar (3.3.8).
- `alt` útil en imágenes (vacío si es decorativa), `lang="es"`, `<title>` único por ruta; cambios de estado y de ruta anunciados a lectores de pantalla.
- Respetar `prefers-reduced-motion` y `prefers-color-scheme`.
- **Verificar con:** Lighthouse + axe DevTools, recorrido solo con teclado y **una pasada con lector de pantalla** (NVDA en Windows o VoiceOver).

### 4 · HTML semántico y buenas prácticas

_Hacer bien lo básico antes de agregar funciones._

- Landmarks `<header>`, `<nav>`, `<main>`, `<footer>`; **un solo `<h1>`** y títulos sin saltar niveles.
- El elemento correcto: `<button>` para acciones y `<a>` para navegar; `<ul>`/`<ol>` para listas; `<table>` solo para datos; `<time>`, `<figure>`, `<dialog>`, `<details>`.
- **Cero `<div onClick>`**: nada interactivo sin elemento nativo; ARIA solo cuando no exista el nativo.
- Sin errores en el validador HTML del W3C ni en la consola; ESLint sin advertencias (reglas `jsx-a11y` de Next.js).
- CSS mobile-first, con variables, sin `!important` innecesario y con una convención consistente (módulos CSS o BEM).
- `next/image` con `width` y `height` (evita CLS) y `next/font` para tipografías; carga diferida de lo que no se ve.
- SEO básico: `<title>`, `description`, Open Graph, `robots`, `sitemap`, página 404 propia y favicon.
- HTTPS, sin contenido mixto y con cabeceras de seguridad.

### 5 · Retos de excelencia

_Elija al menos 3 y justifíquelos con evidencia._

- **100 en las cuatro categorías** de Lighthouse (móvil, producción) en 3 páginas.
- **LCP ≤ 1,8 s y CLS = 0**, con un panel propio de métricas reales (p75) guardadas por su API.
- **Prueba en 3 anchos** con Playwright (360/768/1024): sin scroll horizontal y 0 violaciones de axe (`@axe-core/playwright`).
- **Pruebas de accesibilidad de componentes** con axe dentro de Vitest y React Testing Library.
- **Funciona sin JavaScript** en el flujo principal (mejora progresiva: formularios con `action`, enlaces reales).
- **Modo oscuro y alto contraste** sin romper el contraste en ningún tema.
- **Presupuesto estricto:** JavaScript transferido ≤ 120 kB, con `next/dynamic` para lo pesado.
- **Navegación accesible:** foco movido y título anunciado en cada cambio de ruta, probado con lector de pantalla.
- **Impresión** (`@media print`) y **SEO avanzado** (JSON-LD, `sitemap`, imágenes Open Graph).
- **Español e inglés** con `lang` correcto y formatos `Intl`.

### 6 · Evidencias a entregar

_Carpeta `calidad/` del repositorio y un archivo `CALIDAD.md`._

- Informes de Lighthouse (móvil y escritorio) de 3 páginas: una pública, una con formulario y una con sesión iniciada (desde DevTools).
- Capturas de las páginas principales en **360, 768 y 1024 px**.
- Resultado de axe y del validador HTML, y la lista de comprobación manual (teclado, zoom 200 %, lector de pantalla) con fecha.
- Tabla de **LCP, INP y CLS** y qué hizo para mejorarlas (antes y después).
- Los retos elegidos, cada uno con su evidencia y cómo reproducirla.
- Todo debe poder **demostrarse en vivo** en la sustentación.

## 15. Configuración de la IA del proyecto (reto adicional)

Antes de usar un asistente de IA en este proyecto, el estudiante debe **diseñar y configurar su propia configuración de IA**. No se entrega una configuración hecha: pensarla, construirla y comprobarla es parte del reto. Los requisitos detallados y cómo se evalúan se explican en clase (hoja «Configuración de IA»). La configuración queda versionada en el **primer commit** de el repositorio y debe cubrir:

- **Reglas del proyecto** para la IA: un archivo de instrucciones propio (stack, comandos, estructura, lo que sí y lo que no).
- **Restricciones de seguridad:** la IA **no puede leer** `.env`, claves ni credenciales, **no puede salir de la carpeta** del proyecto y las acciones con efecto fuera de su máquina piden permiso.
- **Reglas de calidad del código** que se comprueban de forma automática, también sobre el código que escriba la IA.
- **Evidencia:** pruebas propias que demuestren que las restricciones funcionan, guardadas en la carpeta `ia/`, y la bitácora de IA.

Todo debe poder **demostrarse en vivo** en la sustentación.

## 16. Entregables por hito y lista de seguridad

| Hito | Semana | Peso | Qué debe existir                                                                                                                                                                                                                                                                                             |
| ---- | ------ | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1    | 4      | 15 % | Vista previa de una hoja de vida con datos de ejemplo y estilos de impresión (`@media print`) que cabe en una página. Consume datos con `fetch`, valida entradas y gestiona carga, vacío y error. Repositorio, guía de ejecución y bitácora de IA. **Configuración de IA (sección 15) en el primer commit.** |
| 2    | 7      | 15 % | Aplicación Next.js/React modular y navegable: componentes reutilizables, rutas, formularios controlados y validados, estados de interfaz, diseño responsivo y pruebas de los casos críticos.                                                                                                                 |
| 3    | 12     | 15 % | API REST por capas con validación, manejo de errores, persistencia en Firestore, configuración por variables de entorno, `openapi.yaml`, colección de solicitudes y pruebas automatizadas.                                                                                                                   |
| 4    | 15     | 15 % | Integración completa con Firebase Auth (cookie de sesión, roles), seguridad, pruebas de integración, **evidencias de calidad (sección 14)**, **despliegue en Vercel**, historial Git y auditoría de la bitácora de IA. **Evidencias de la configuración de IA (sección 15)** demostradas en vivo.            |

**Cada estudiante entrega:** repositorio con historial de commits propio, URL desplegada, `README` con instrucciones, `openapi.yaml`, colección de solicitudes, bitácora de IA (propósito, evidencia, validación, decisión), carpeta `ia/` con las evidencias de la configuración de IA (sección 15) y debe poder **modificar el proyecto en vivo** en la sustentación.

**Lista de verificación de seguridad:**

- [ ] Ningún secreto en Git ni en variables `NEXT_PUBLIC_*` (excepto la configuración web de Firebase, que es pública).
- [ ] Reglas de Firestore: `allow read, write: if false`; el navegador no importa `firebase/firestore`.
- [ ] Cada ruta privada verifica la sesión y la autorización por objeto; `proxy.ts` no es la única defensa.
- [ ] Entradas validadas con Zod; contenido de usuarios escapado o saneado.
- [ ] Cookie de sesión `HttpOnly`, `Secure`, `SameSite`; comprobación de `Origin` al modificar datos.
- [ ] Archivos validados por tipo y tamaño en el servidor; `pathname` verificado; cuotas de Blob revisadas.
- [ ] `npm audit` revisado y sin secretos en los logs.
- [ ] Evidencias de calidad de la sección 14 entregadas (Lighthouse, capturas en 360/768/1024, axe, validador HTML).
- [ ] Configuración de IA propia (sección 15): la IA no lee `.env*` ni claves y no sale de la carpeta del proyecto; evidencias en `ia/`.
