// Corre Lighthouse sobre una página con sesión iniciada.
// Login directo con la API REST de Firebase (la apiKey es pública, viene en el
// HTML de la app) y cookie de sesión vía /api/auth/sesion. Evita el formulario.
// Uso: CORREO_PRUEBA=... CLAVE_PRUEBA=... node scripts/lighthouse-privado.mjs [ruta] [salida]
import { chromium } from "playwright";
import { spawnSync } from "node:child_process";
import { writeFileSync, unlinkSync, readFileSync } from "node:fs";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const CORREO = process.env.CORREO_PRUEBA;
const CLAVE = process.env.CLAVE_PRUEBA;
const ruta = process.argv[2] || "/mis-cv";
const salida = process.argv[3] || "calidad/lighthouse/lighthouse-miscv-mobile.html";
const preset = process.argv[4] || ""; // "desktop" para perfil escritorio

const browser = await chromium.launch();
const contexto = await browser.newContext();
const page = await contexto.newPage();

// 1. Obtener la apiKey pública desde los chunks del build (es un valor
// NEXT_PUBLIC, público por diseño: cualquier navegador lo descarga).
import { readdirSync, statSync } from "node:fs";

function buscarApiKey(dir) {
  for (const entrada of readdirSync(dir)) {
    const ruta = `${dir}/${entrada}`;
    try {
      if (statSync(ruta).isDirectory()) {
        const encontrada = buscarApiKey(ruta);
        if (encontrada) return encontrada;
      } else if (ruta.endsWith(".js")) {
        const m = readFileSync(ruta, "utf8").match(/AIza[A-Za-z0-9_-]{20,}/);
        if (m) return m[0];
      }
    } catch {
      /* ignorar archivos ilegibles */
    }
  }
  return null;
}
const apiKey = buscarApiKey(".next/static");
if (!apiKey) {
  console.error("No se encontró la apiKey pública en el build");
  process.exit(1);
}

// 2. Iniciar sesión con la API REST de Firebase
const respLogin = await fetch(
  `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: CORREO, password: CLAVE, returnSecureToken: true }),
  }
);
const login = await respLogin.json();
if (!login.idToken) {
  console.error("No se pudo iniciar sesión:", login.error?.message);
  process.exit(1);
}

// 3. Crear la cookie de sesión del servidor (mismo origen: navegar primero)
await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" });
const respSesion = await page.evaluate(
  async ({ url, idToken }) => {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
    return r.status;
  },
  { url: `${BASE}/api/auth/sesion`, idToken: login.idToken }
);
if (respSesion !== 204) {
  console.error("No se pudo crear la sesión del servidor:", respSesion);
  process.exit(1);
}

const cookies = await contexto.cookies();
const sesion = cookies.find((c) => c.name === "sesion");
await browser.close();

if (!sesion) {
  console.error("No se encontró la cookie de sesión");
  process.exit(1);
}
console.log("Sesión obtenida.");

// 4. Lighthouse con la cookie (se escribe un .cmd temporal para evitar
// problemas de escape de comillas entre shells).
const headers = JSON.stringify({ cookie: `sesion=${sesion.value}` });
const bat = `@echo off
npx.cmd lighthouse ${BASE}${ruta} --output=html --output-path=./${salida} --chrome-flags="--headless --no-sandbox" ${preset ? `--preset=${preset}` : ""} --extra-headers="${headers.replace(/"/g, '\\"')}"
`;
writeFileSync("scripts/_lh-temporal.cmd", bat);
const resultado = spawnSync("cmd.exe", ["/d", "/s", "/c", "scripts\\_lh-temporal.cmd"], {
  stdio: "inherit",
});
unlinkSync("scripts/_lh-temporal.cmd");
if (resultado.error) console.error("Error:", resultado.error);
process.exit(resultado.status ?? 1);
