// Evidencias automatizadas: validador W3C, recorrido de teclado, zoom 200% y chequeo de lector
// Uso: node scripts/evidencias-manuales.mjs  (requiere `npm run build && npm start`)
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const PAGINAS = [
  { nombre: "home", ruta: "/" },
  { nombre: "login", ruta: "/login" },
  { nombre: "registro", ruta: "/register" },
];

mkdirSync("calidad/validador-html", { recursive: true });
mkdirSync("calidad/teclado", { recursive: true });
mkdirSync("calidad/zoom", { recursive: true });
mkdirSync("calidad/lector-pantalla", { recursive: true });

const browser = await chromium.launch();

/* ---------- Punto 3: Validador W3C ---------- */
for (const pagina of PAGINAS) {
  const contexto = await browser.newContext();
  const page = await contexto.newPage();
  await page.goto(BASE + pagina.ruta, { waitUntil: "networkidle" });
  const html = await page.content();

  const respuesta = await fetch("https://validator.w3.org/nu/?out=json", {
    method: "POST",
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "User-Agent": "GeneradorCV-Evidencias/1.0",
    },
    body: html,
  });
  const resultado = await respuesta.json();
  writeFileSync(
    `calidad/validador-html/${pagina.nombre}.json`,
    JSON.stringify(
      {
        url: BASE + pagina.ruta,
        errores: resultado.messages.filter((m) => m.type === "error"),
        advertencias: resultado.messages.filter((m) => m.type !== "error"),
        total: resultado.messages.length,
      },
      null,
      2
    )
  );
  await contexto.close();
}

/* ---------- Puntos 4, 5 y 6 ---------- */
const resumenTeclado = [];
const resumenZoom = [];
const resumenLector = [];

for (const pagina of PAGINAS) {
  const contexto = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await contexto.newPage();
  await page.goto(BASE + pagina.ruta, { waitUntil: "networkidle" });

  // Punto 4: recorrido con teclado
  const paradas = [];
  for (let i = 0; i < 15; i++) {
    await page.keyboard.press("Tab");
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const estilo = getComputedStyle(el);
      return {
        etiqueta: el.tagName.toLowerCase(),
        texto: (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 40),
        focoVisible:
          estilo.outlineStyle !== "none" ||
          estilo.boxShadow !== "none" ||
          estilo.outlineWidth !== "0px",
      };
    });
    if (info) paradas.push(info);
  }
  writeFileSync(
    `calidad/teclado/${pagina.nombre}.json`,
    JSON.stringify({ url: BASE + pagina.ruta, paradas }, null, 2)
  );
  resumenTeclado.push({
    pagina: pagina.nombre,
    paradas: paradas.length,
    focoVisible: paradas.every((p) => p.focoVisible),
  });

  // Punto 5: zoom 200%
  await page.evaluate(() => {
    document.body.style.zoom = "2";
  });
  await page.waitForTimeout(300);
  const zoomInfo = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    sinDesbordamiento: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
  }));
  await page.screenshot({
    path: `calidad/zoom/${pagina.nombre}-200.png`,
    fullPage: true,
  });
  resumenZoom.push({ pagina: pagina.nombre, ...zoomInfo });

  // Punto 6: chequeo automático de estructura para lector de pantalla
  const lector = await page.evaluate(() => ({
    titulo: document.title,
    lang: document.documentElement.lang,
    tieneSkipLink: !!document.querySelector('a[href^="#"], .skip-link'),
    landmarks: {
      header: !!document.querySelector("header, [role=banner]"),
      nav: !!document.querySelector("nav, [role=navigation]"),
      main: !!document.querySelector("main, [role=main]"),
      footer: !!document.querySelector("footer, [role=contentinfo]"),
      h1: document.querySelectorAll("h1").length,
    },
    inputsSinLabel: [...document.querySelectorAll("input, textarea, select")].filter(
      (i) =>
        !i.labels?.length && !i.getAttribute("aria-label") && !i.getAttribute("aria-labelledby")
    ).length,
  }));
  resumenLector.push({ pagina: pagina.nombre, ...lector });
  await contexto.close();
}

/* ---------- Punto 6: notas.md ---------- */
const tablaLector = resumenLector
  .map(
    (r) =>
      `| ${r.pagina} | ${r.titulo} | ${r.lang} | ${r.landmarks.h1} | nav:${r.landmarks.nav} main:${r.landmarks.main} footer:${r.landmarks.footer} | ${r.inputsSinLabel} |`
  )
  .join("\n");

writeFileSync(
  "calidad/lector-pantalla/notas.md",
  `# Lector de pantalla (NVDA)

## Chequeo automático de estructura (Playwright)

| Página | Título | lang | H1 | Landmarks | Inputs sin label |
| ------ | ------ | ---- | -- | --------- | ---------------- |
${tablaLector}

## Prueba manual con NVDA (pendiente)

1. Iniciar NVDA (Ctrl+Alt+N).
2. Recorrer home, login, mis-cv y editor con flechas y tecla H (encabezados).
3. Verificar que los formularios anuncian etiqueta y estado.
4. Verificar anuncio de cambios de página y del overlay de carga.
5. Registrar aquí el resultado y la fecha.
`
);

console.log("TECLADO:", JSON.stringify(resumenTeclado, null, 1));
console.log("ZOOM:", JSON.stringify(resumenZoom, null, 1));
console.log(
  "LECTOR:",
  JSON.stringify(
    resumenLector.map((r) => ({
      p: r.pagina,
      inputsSinLabel: r.inputsSinLabel,
      h1: r.landmarks.h1,
    })),
    null,
    1
  )
);

await browser.close();
console.log("Evidencias W3C, teclado, zoom y lector generadas.");
