# CALIDAD

Evidencias de calidad del proyecto Generador de Hoja de Vida (sección 14 del spec).

## Lighthouse (producción local, perfil móvil)

| Página                 | Performance | Accesibilidad | Buenas prácticas | SEO | LCP   | CLS   | TBT    |
| ---------------------- | ----------- | ------------- | ---------------- | --- | ----- | ----- | ------ |
| `/` (home)             | 99          | 96            | 100              | 100 | 0.9 s | 0.005 | 100 ms |
| `/login`               | 99          | 96            | 100              | 100 | 0.9 s | 0.005 | 130 ms |
| `/mis-cv` (con sesión) | 100         | 96            | 96               | 100 | ~1 s  | 0     | —      |

Reportes HTML en `calidad/lighthouse-*-mobile.html` y `*-desktop.html`.

## Presupuesto de JavaScript

- Primera carga JS compartida: 103 kB. Editor: 204 kB First Load (con plantillas code-split via `next/dynamic`). Se redujo desde ~306 KiB; Firebase SDK sigue siendo el grueso.

## Responsive

Capturas automáticas (Playwright) en 360 / 768 / 1024 px en `calidad/capturas/` (carpetas `360/`, `768/`, `1024/`): home, login, registro y rutas privadas (mis-cv, editor, imprimir, con cuenta de prueba). Regenerables con `node scripts/evidencias.mjs` y `node scripts/evidencias-privadas.mjs`.

## Validador HTML W3C

Validación automática vía API del W3C (Nu) con el HTML renderizado: `calidad/validador-html/*.json`.

- HTML propio: sin errores.
- 3 errores "CSS: Parse Error" por página provienen del `<style>` inline de la librería Sonner (toasts), no del código del proyecto. Falsos positivos de terceros.

## Teclado

Recorrido con Tab automatizado (15 paradas por página): `calidad/teclado/*.json`. Todas las paradas tienen foco visible (`outline` no `none`). Verificación manual complementaria pendiente.

## Zoom 200%

Emulación de zoom 200% (`body { zoom: 2 }` a 1280 px): sin scroll horizontal en home, login y registro. Capturas en `calidad/zoom/`.

## Lector de pantalla

Chequeo automático de estructura en `calidad/lector-pantalla/notas.md`: un solo `h1` por página, `lang` definido, landmarks (header/nav/main/footer) presentes, 0 inputs sin etiqueta. Prueba manual con NVDA pendiente.

## Accesibilidad

- axe-core (vía Playwright): 0 violaciones en todas las páginas evaluadas (home, login, registro, mis-cv, editor, imprimir — 360 y 1024 px). Reportes JSON en `calidad/axe/`. Resumen en `calidad/axe/resumen.json` y `calidad/axe/privadas-resumen.json`.
- Validador HTML W3C: ver sección anterior.
- Recorrido solo con teclado y lector de pantalla: ver secciones anteriores.

## Cobertura de pruebas

87 pruebas (18 archivos), todas en verde.

| Módulo         | Cobertura |
| -------------- | --------- |
| `src/schemas`  | 100 %     |
| `src/utils`    | 100 %     |
| `src/services` | 91.96 %   |

Objetivo del spec (≥ 80 % en lógica de negocio): cumplido.

## Retos de excelencia

5 retos documentados en `calidad/retos/README.md` (spec pide ≥ 3): Lighthouse ≥ 95 en las 4 categorías, CLS < 0.01, 0 violaciones axe, soporte de `prefers-color-scheme` y `prefers-reduced-motion`, presupuesto de JS.

## Core Web Vitals (lab)

| Métrica                 | Home (móvil) | Login (móvil) | Mis CVs (móvil, con sesión) | Objetivo |
| ----------------------- | ------------ | ------------- | --------------------------- | -------- |
| LCP                     | 0.9 s        | 0.9 s         | ~1 s (score 1.0)            | ≤ 2.5 s  |
| CLS                     | 0.005        | 0.005         | 0 (score 1.0)               | < 0.1    |
| TBT (aprox. INP en lab) | 100–130 ms   | 100–130 ms    | bajo (score 1.0)            | < 200 ms |

INP real no es medible en laboratorio (se usa TBT como aproximación); puede medirse en campo con `useReportWebVitals` (ya integrado, expone las métricas en `window.__webVitals`).

**Qué se hizo para mejorarlas (antes → después):**

- **TBT/JS:** plantillas del CV se cargaban juntas con el editor (~306 KiB de scripts) → code-splitting con `next/dynamic` en `CVPreview`: editor baja a 204 kB First Load JS. Las animaciones se desactivan con `prefers-reduced-motion` para reducir trabajo en el hilo principal.
- **CLS:** animaciones reveal reservan el espacio con `opacity` (no `display`/`height`), las imágenes de plantilla son locales (`public/icon.svg`, sin layout shift) y el overlay de carga es fijo: CLS 0.005 desde el inicio del sistema de diseño.
- **LCP:** fuentes del sistema (`system-ui`), CSS sin frameworks externos y HTML prerrenderizado (públicas estáticas): LCP ~0.9 s.

## Lighthouse con sesión iniciada

- `/mis-cv` (requiere sesión, cookie inyectada): Performance 100, Accesibilidad 96, Buenas prácticas 96, SEO 100.
- Reportes: `calidad/lighthouse/lighthouse-miscv-mobile.html` y `lighthouse-miscv-desktop.html`.
- Regenerar: `node scripts/lighthouse-privado.mjs "/mis-cv" "calidad/lighthouse/lighthouse-miscv-mobile.html"` (con `CORREO_PRUEBA` y `CLAVE_PRUEBA` en el entorno y el servidor corriendo).
