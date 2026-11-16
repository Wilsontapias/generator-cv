// Genera capturas y escaneos axe para las evidencias de calidad (sección 14)
// Uso: node scripts/evidencias.mjs
import { chromium } from "playwright";
import axe from "axe-core";
import { mkdirSync, writeFileSync } from "node:fs";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const WIDTHS = [360, 768, 1024];
const PAGINAS = [
  { nombre: "home", ruta: "/" },
  { nombre: "login", ruta: "/login" },
  { nombre: "registro", ruta: "/register" },
];

const dirCapturas = "calidad/capturas";
const dirAxe = "calidad/axe";
mkdirSync(dirCapturas, { recursive: true });
mkdirSync(dirAxe, { recursive: true });

const browser = await chromium.launch();
const resumen = [];

for (const pagina of PAGINAS) {
  for (const ancho of WIDTHS) {
    const contexto = await browser.newContext({
      viewport: { width: ancho, height: 800 },
      reducedMotion: "reduce",
    });
    const page = await contexto.newPage();
    await page.goto(BASE + pagina.ruta, { waitUntil: "networkidle" });
    // Auto-scroll para disparar animaciones reveal y cargar imágenes lazy
    await page.evaluate(async () => {
      for (let y = 0; y <= document.body.scrollHeight; y += 300) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(500);

    // Captura de pantalla completa
    const archivo = `${dirCapturas}/${ancho}/${pagina.nombre}-${ancho}.png`;
    mkdirSync(`${dirCapturas}/${ancho}`, { recursive: true });
    await page.screenshot({ path: archivo, fullPage: true });

    // Escaneo axe solo a 360 y 1024 (una por extremo basta)
    if (ancho === 360 || ancho === 1024) {
      await page.addScriptTag({ content: axe.source });
      const resultados = await page.evaluate(async () => {
        const r = await window.axe.run(document, {
          resultTypes: ["violations"],
        });
        return {
          url: location.href,
          violations: r.violations.map((v) => ({
            id: v.id,
            impacto: v.impact,
            descripcion: v.help,
            nodos: v.nodes.length,
          })),
          passes: r.passes.length,
          incomplete: r.incomplete.length,
        };
      });
      writeFileSync(
        `${dirAxe}/${pagina.nombre}-${ancho}.json`,
        JSON.stringify(resultados, null, 2)
      );
      resumen.push({
        pagina: pagina.nombre,
        ancho,
        violaciones: resultados.violations.length,
        pasa: resultados.passes,
      });
    }
    await contexto.close();
  }
}

await browser.close();
writeFileSync("calidad/axe/resumen.json", JSON.stringify(resumen, null, 2));
console.log(JSON.stringify(resumen, null, 2));
console.log("Capturas y escaneos axe generados.");
