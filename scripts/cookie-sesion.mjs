// Extrae la cookie de sesión iniciando sesión y la imprime para usar con Lighthouse
// Uso: CORREO_PRUEBA=... CLAVE_PRUEBA=... node scripts/cookie-sesion.mjs
import { chromium } from "playwright";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const browser = await chromium.launch();
const contexto = await browser.newContext();
const page = await contexto.newPage();

await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
await page.fill("#email", process.env.CORREO_PRUEBA);
await page.fill("#password", process.env.CLAVE_PRUEBA);
await page.click("button[type=submit]");
await page.waitForURL("**/mis-cv", { timeout: 30000 });

const cookies = await contexto.cookies();
const sesion = cookies.find((c) => c.name === "sesion");
if (!sesion) {
  console.error("No se encontró la cookie de sesión");
  process.exit(1);
}
console.log(sesion.value);
await browser.close();
