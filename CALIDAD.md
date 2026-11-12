# Evidencias de Calidad

Este documento registra las evidencias de calidad del proyecto Generador de Hoja de Vida.

---

## 1. Rendimiento y Core Web Vitals

### Metas

- LCP ≤ 2.5 s
- INP ≤ 200 ms
- CLS ≤ 0.1
- Lighthouse móvil: Rendimiento ≥ 90 · Accesibilidad ≥ 95 · Buenas prácticas ≥ 95 · SEO ≥ 95

### Evidencias

- [ ] Informe Lighthouse (móvil) - Página principal
- [ ] Informe Lighthouse (móvil) - Página con formulario
- [ ] Informe Lighthouse (móvil) - Página con sesión iniciada
- [ ] Tabla de LCP, INP, CLS (antes y después)

### Ubicación de Evidencias

```
calidad/
├── lighthouse/
│   ├── home-mobile.json
│   ├── home-desktop.json
│   ├── editor-mobile.json
│   ├── editor-desktop.json
│   ├── mis-cv-mobile.json
│   └── mis-cv-desktop.json
```

---

## 2. Responsive: 360 · 768 · 1024 px

### Metas

- Diseño mobile-first
- Probado en 360, 768 y 1024 px
- Zoom al 200% sin perder contenido
- Reflow sin scroll a 320 px

### Evidencias

- [ ] Captura de pantalla en 360 px
- [ ] Captura de pantalla en 768 px
- [ ] Captura de pantalla en 1024 px
- [ ] Prueba de zoom al 200%
- [ ] Prueba de reflow a 320 px

### Ubicación de Evidencias

```
calidad/
├── capturas/
│   ├── home-360.png
│   ├── home-768.png
│   ├── home-1024.png
│   ├── editor-360.png
│   ├── editor-768.png
│   ├── editor-1024.png
│   ├── mis-cv-360.png
│   ├── mis-cv-768.png
│   └── mis-cv-1024.png
```

---

## 3. Accesibilidad (WCAG 2.2 AA)

### Metas

- Todo operable con teclado
- Foco visible
- Contraste ≥ 4.5:1 en texto
- Objetivos táctiles ≥ 24×24 px
- Formularios con `<label>` asociado

### Evidencias

- [ ] Resultado de axe DevTools
- [ ] Resultado del validador HTML del W3C
- [ ] Lista de comprobación manual (teclado, zoom, lector de pantalla)
- [ ] Fecha de verificación

### Ubicación de Evidencias

```
calidad/
├── axe/
│   ├── home-axe.json
│   ├── editor-axe.json
│   └── mis-cv-axe.json
├── html-validator/
│   ├── home-validator.html
│   ├── editor-validator.html
│   └── mis-cv-validator.html
└── checklist-manual.md
```

---

## 4. HTML Semántico y Buenas Prácticas

### Metas

- Landmarks `<header>`, `<nav>`, `<main>`, `<footer>`
- Un solo `<h1>` por página
- Cero `<div onClick>`
- Sin errores en validador HTML
- ESLint sin advertencias

### Evidencias

- [ ] Resultado del validador HTML del W3C
- [ ] Salida de ESLint (`npm run lint`)
- [ ] Salida de TypeScript (`npm run typecheck`)

---

## 5. Retos de Excelencia

### Retos Elegidos

- [ ] 100 en las cuatro categorías de Lighthouse
- [ ] LCP ≤ 1.8 s y CLS = 0
- [ ] Prueba en 3 anchos con Playwright
- [ ] Pruebas de accesibilidad con axe en Vitest
- [ ] Funciona sin JavaScript
- [ ] Modo oscuro y alto contraste
- [ ] Presupuesto estricto ≤ 120 kB
- [ ] Navegación accesible
- [ ] Impresión y SEO avanzado
- [ ] Español e inglés con `lang` correcto

### Evidencias

- [ ] Evidencia de cada reto elegido
- [ ] Cómo reproducir cada reto

---

## 6. Evidencias a Entregar

### Checklist Final

- [ ] Informes de Lighthouse de 3 páginas
- [ ] Capturas en 360, 768 y 1024 px
- [ ] Resultado de axe y validador HTML
- [ ] Lista de comprobación manual con fecha
- [ ] Tabla de LCP, INP y CLS
- [ ] Retos elegidos con evidencia

---

## Cómo Generar Evidencias

### Lighthouse

```bash
# Instalar Lighthouse CLI
npm install -g lighthouse

# Ejecutar Lighthouse
lighthouse http://localhost:3000 --output=json --output-path=./calidad/lighthouse/home.json
lighthouse http://localhost:3000 --output=html --output-path=./calidad/lighthouse/home.html
```

### axe DevTools

1. Instalar extensión de axe DevTools en el navegador
2. Abrir DevTools → axe DevTools
3. Ejecutar análisis en cada página
4. Exportar resultados

### Validador HTML del W3C

1. Ir a https://validator.w3.org/
2. Ingresar URL o pegar código HTML
3. Guardar resultado

### Capturas de Pantalla

1. Abrir DevTools → Modo dispositivo
2. Seleccionar ancho: 360, 768, 1024 px
3. Tomar captura de pantalla
4. Guardar en `calidad/capturas/`

---

## Referencias

- Documento del curso: Sección 14 "Metas de calidad y retos de excelencia"
- Lighthouse: https://developer.chrome.com/docs/lighthouse
- axe DevTools: https://www.deque.com/axe/devtools/
- Validador HTML W3C: https://validator.w3.org/
- PageSpeed Insights: https://pagespeed.web.dev/
