// Capturas y escaneos axe de rutas privadas (requiere sesión)
// Uso: node scripts/evidencias-privadas.mjs  (requiere `npm run build && npm start`)
import { chromium } from "playwright";
import axe from "axe-core";
import { mkdirSync, writeFileSync } from "node:fs";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const CORREO = process.env.CORREO_PRUEBA;
const CLAVE = process.env.CLAVE_PRUEBA;
const WIDTHS = [360, 768, 1024];

if (!CORREO || !CLAVE) {
  console.error("Defina CORREO_PRUEBA y CLAVE_PRUEBA en el entorno.");
  process.exit(1);
}

const dirCapturas = "calidad/capturas";
const dirAxe = "calidad/axe";
const browser = await chromium.launch();

const contexto = await browser.newContext({ viewport: { width: 1024, height: 900 } });
const page = await contexto.newPage();

// 1. Iniciar sesión por el formulario
await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
await page.fill("#email", CORREO);
await page.fill("#password", CLAVE);
await page.click("button[type=submit]");
await page.waitForURL("**/mis-cv", { timeout: 30000 });
console.log("Sesión iniciada.");

// 2. Crear un CV de prueba vía API
const respuesta = await page.evaluate(async () => {
  const r = await fetch("/api/cv", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      titulo: "CV de prueba",
      plantilla: "moderna",
      datos: {
        datos: { nombre: "Usuario Prueba" },
        perfil: "",
      },
    }),
  });
  return { status: r.status, cuerpo: await r.json() };
});
if (respuesta.status !== 201) {
  console.error("No se pudo crear el CV de prueba:", JSON.stringify(respuesta));
  process.exit(1);
}
const cvId = respuesta.cuerpo.id;
console.log("CV de prueba creado:", cvId);

const resumen = [];

// 3. Capturar las rutas privadas
const rutas = [
  { nombre: "miscv", ruta: "/mis-cv" },
  { nombre: "editor", ruta: `/cv/${cvId}/editar` },
  { nombre: "imprimir", ruta: `/cv/${cvId}/imprimir` },
];

for (const pagina of rutas) {
  for (const ancho of WIDTHS) {
    const paginaNueva = ancho === 1024 ? page : await contexto.newPage();
    if (ancho !== 1024) {
      await paginaNueva.setViewportSize({ width: ancho, height: 800 });
    }
    await paginaNueva.goto(BASE + pagina.ruta, { waitUntil: "networkidle" });
    await paginaNueva.evaluate(async () => {
      for (let y = 0; y <= document.body.scrollHeight; y += 300) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await paginaNueva.waitForTimeout(500);

    mkdirSync(`${dirCapturas}/${ancho}`, { recursive: true });
    await paginaNueva.screenshot({
      path: `${dirCapturas}/${ancho}/${pagina.nombre}-${ancho}.png`,
      fullPage: true,
    });

    if (ancho === 360 || ancho === 1024) {
      await paginaNueva.addScriptTag({ content: axe.source });
      const resultados = await paginaNueva.evaluate(async () => {
        const r = await window.axe.run(document, { resultTypes: ["violations"] });
        return {
          url: location.pathname,
          violations: r.violations.map((v) => ({
            id: v.id,
            impacto: v.impact,
            descripcion: v.help,
            nodos: v.nodes.length,
          })),
          passes: r.passes.length,
        };
      });
      writeFileSync(
        `${dirAxe}/${pagina.nombre}-${ancho}.json`,
        JSON.stringify(resultados, null, 2)
      );
      resumen.push({ pagina: pagina.nombre, ancho, violaciones: resultados.violations.length });
    }
    if (ancho !== 1024) await paginaNueva.close();
  }
}

await browser.close();
writeFileSync(`${dirAxe}/privadas-resumen.json`, JSON.stringify(resumen, null, 2));
console.log(JSON.stringify(resumen, null, 2));
console.log("Capturas privadas generadas.");
