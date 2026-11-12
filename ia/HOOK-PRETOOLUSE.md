# Hook PreToolUse Personalizado

Este hook bloquea comandos peligrosos y lectura de archivos sensibles antes de que se ejecuten.

## Implementación

### Archivo: `.opencode/hooks/pre-tool-use.js`

```javascript
#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Patrones bloqueados
const BLOCKED_PATTERNS = [
  // Archivos sensibles
  /\.env/i,
  /\.pem$/i,
  /\.key$/i,
  /firebase-adminsdk/i,

  // Comandos peligrosos
  /sudo\s/i,
  /rm\s+-rf/i,
  /git\s+push\s+--force/i,
  /git\s+reset\s+--hard/i,
  /curl\s/i,
  /wget\s/i,
];

// Rutas bloqueadas (fuera del proyecto)
const PROJECT_ROOT = process.cwd();

function isBlocked(command) {
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(command)) {
      return { blocked: true, reason: `Patrón bloqueado: ${pattern}` };
    }
  }

  // Verificar rutas fuera del proyecto
  const pathMatches = command.match(/(?:cat|read|open|ls)\s+([^\s]+)/g);
  if (pathMatches) {
    for (const match of pathMatches) {
      const filePath = match.split(/\s+/)[1];
      if (filePath && !filePath.startsWith(PROJECT_ROOT) && !filePath.startsWith(".")) {
        if (filePath.startsWith("/") || filePath.startsWith("~")) {
          return { blocked: true, reason: `Ruta fuera del proyecto: ${filePath}` };
        }
      }
    }
  }

  return { blocked: false };
}

// Leer entrada de stdin
let input = "";
process.stdin.on("data", (chunk) => {
  input += chunk;
});

process.stdin.on("end", () => {
  try {
    const data = JSON.parse(input);
    const command = data.command || data.tool_input?.command || "";

    const result = isBlocked(command);

    if (result.blocked) {
      console.error(`BLOQUEADO: ${result.reason}`);
      process.exit(2); // Código de salida 2 = bloqueado
    }

    process.exit(0); // Código de salida 0 = permitido
  } catch (error) {
    console.error("Error en hook:", error.message);
    process.exit(1); // Código de salida 1 = error
  }
});
```

## Pruebas del Hook

### Archivo: `.opencode/hooks/pre-tool-use.test.js`

```javascript
const { execSync } = require("child_process");
const assert = require("assert");

const HOOK_PATH = "./.opencode/hooks/pre-tool-use.js";

function runHook(input) {
  try {
    const result = execSync(`echo '${JSON.stringify(input)}' | node ${HOOK_PATH}`, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return { exitCode: 0, stdout: result };
  } catch (error) {
    return { exitCode: error.status, stderr: error.stderr };
  }
}

// Pruebas
const tests = [
  {
    name: "Bloquear lectura de .env.local",
    input: { command: "cat .env.local" },
    expectedExitCode: 2,
  },
  {
    name: "Bloquear sudo",
    input: { command: "sudo apt-get install" },
    expectedExitCode: 2,
  },
  {
    name: "Bloquear rm -rf",
    input: { command: "rm -rf /" },
    expectedExitCode: 2,
  },
  {
    name: "Bloquear git push --force",
    input: { command: "git push --force origin main" },
    expectedExitCode: 2,
  },
  {
    name: "Bloquear curl",
    input: { command: "curl https://example.com" },
    expectedExitCode: 2,
  },
  {
    name: "Permitir npm test",
    input: { command: "npm test" },
    expectedExitCode: 0,
  },
  {
    name: "Permitir git status",
    input: { command: "git status" },
    expectedExitCode: 0,
  },
  {
    name: "Permitir lectura de archivo del proyecto",
    input: { command: "cat src/lib/auth.ts" },
    expectedExitCode: 0,
  },
  {
    name: "Bloquear lectura fuera del proyecto",
    input: { command: "cat /etc/passwd" },
    expectedExitCode: 2,
  },
  {
    name: "Bloquear lectura de home",
    input: { command: "cat ~/.bashrc" },
    expectedExitCode: 2,
  },
];

let passed = 0;
let failed = 0;

for (const test of tests) {
  const result = runHook(test.input);
  if (result.exitCode === test.expectedExitCode) {
    console.log(`✅ ${test.name}`);
    passed++;
  } else {
    console.log(
      `❌ ${test.name} (esperado: ${test.expectedExitCode}, obtenido: ${result.exitCode})`
    );
    failed++;
  }
}

console.log(`\nResultados: ${passed} pasadas, ${failed} fallidas`);
process.exit(failed > 0 ? 1 : 0);
```

## Configuración en opencode.jsonc

```json
{
  "hooks": {
    "PreToolUse": {
      "command": "node .opencode/hooks/pre-tool-use.js",
      "timeout": 5000
    }
  }
}
```

## Ejecutar Pruebas

```bash
node .opencode/hooks/pre-tool-use.test.js
```

---

## Notas de Implementación

1. **Hook PreToolUse:** Se ejecuta antes de cada uso de herramienta por la IA
2. **Código de salida 2:** Bloquea la ejecución de la herramienta
3. **Código de salida 0:** Permite la ejecución
4. **Código de salida 1:** Error en el hook (se registra pero no bloquea)

### Limitaciones

- El hook solo analiza el comando principal, no comandos encadenados con `&&` o `;`
- No analiza scripts de Node.js que abren archivos directamente
- Requiere que la IA use el hook (no es una barrera a nivel de sistema operativo)

### Mejoras Futuras

1. Usar un parser de comandos más robusto (como `shell-quote`)
2. Implementar análisis recursivo de comandos encadenados
3. Agregar lista blanca de comandos permitidos
4. Integrar con el sandbox del sistema operativo

---

## Referencias

- Documentación de OpenCode V2: https://opencode.ai/v2/docs/
- Guía de hooks: https://opencode.ai/v2/docs/build/plugins
- Reto de excelencia: "Hook PreToolUse propio" de la sección 15
