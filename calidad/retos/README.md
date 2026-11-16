# Retos de excelencia (sección 14.5 del spec)

Retos completados con su evidencia:

## Reto 1: Lighthouse ≥ 95 en las cuatro categorías

- Home: Performance 99, Accesibilidad 96, Buenas prácticas 100, SEO 100.
- Login: Performance 99, Accesibilidad 96, Buenas prácticas 100, SEO 100.
- Evidencia: `calidad/lighthouse/lighthouse-home-mobile.html` y `lighthouse-login-mobile.html` (también versiones desktop).

## Reto 2: CLS < 0.01 (estabilidad visual)

- CLS medido: 0.005 en home y login (objetivo "Bueno" es < 0.1; se superó con margen).
- LCP 0.9 s y TBT 100–130 ms.
- Evidencia: mismos reportes de Lighthouse.

## Reto 3: Cero violaciones de accesibilidad (axe-core)

- Escaneos automáticos con axe-core en home, login y registro (360 y 1024 px): 0 violaciones en todos.
- Foco visible verificado en el recorrido completo con Tab (15 paradas por página, `calidad/teclado/`).
- Evidencia: `calidad/axe/*.json`.

## Reto 4: Soporte de preferencias del sistema

- Modo oscuro con `@media (prefers-color-scheme: dark)` (`src/styles/globals.css`, línea 65).
- `prefers-reduced-motion: reduce` respetado en animaciones, `ScrollReveal` y Spinner.
- Evidencia: código fuente; verificación visual manual opcional.

## Reto 5: Presupuesto de JavaScript

- First Load JS compartido: 103 kB; editor 204 kB tras code-splitting de plantillas con `next/dynamic`.
- Evidencia: salida de `next build` (ver `CALIDAD.md`).
