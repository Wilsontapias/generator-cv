# Escaneo de Secretos con Gitleaks

Este documento describe la configuración de gitleaks para escanear secretos en el repositorio.

## Instalación

### Windows

```powershell
# Descargar desde GitHub Releases
# https://github.com/gitleaks/gitleaks/releases

# O usar Chocolatey
choco install gitleaks

# O usar Scoop
scoop install gitleaks
```

### Linux/macOS

```bash
# Homebrew
brew install gitleaks

# O descargar binario
wget https://github.com/gitleaks/gitleaks/releases/download/v8.18.0/gitleaks_8.18.0_linux_x64.tar.gz
tar -xzf gitleaks_8.18.0_linux_x64.tar.gz
sudo mv gitleaks /usr/local/bin/
```

## Configuración

### Archivo: `.gitleaks.toml`

```toml
title = "Gitleaks Configuration for GeneratorCV"

[extend]
useDefault = true

[allowlist]
description = "Allowlist for test files and examples"
paths = [
  "env.example",
  "ia/PRUEBAS-CONTENCION.md",
  "tests/",
]

[[rules]]
id = "firebase-private-key"
description = "Firebase Private Key"
regex = '''-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----'''
tags = ["firebase", "key"]

[[rules]]
id = "vercel-blob-token"
description = "Vercel Blob Token"
regex = '''BLOB_READ_WRITE_TOKEN\s*=\s*['"]?[A-Za-z0-9_-]{20,}['"]?'''
tags = ["vercel", "token"]

[[rules]]
id = "canario-test"
description = "Canario test value (should only appear in test files)"
regex = '''ZZZ-NO-ES-UN-SECRETO'''
paths = [
  "!.env.local",
  "!.env*.local",
]
tags = ["test", "canario"]
```

## Uso

### Escaneo Manual

```bash
# Escanear todo el repositorio
gitleaks detect --source . --verbose

# Escanear solo cambios no commiteados
gitleaks protect --staged --verbose

# Escanear un commit específico
gitleaks detect --source . --log-opts="HEAD~1..HEAD" --verbose
```

### Pre-commit Hook

Agregar a `.husky/pre-commit`:

```sh
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Escanear secretos
gitleaks protect --staged --verbose
if [ $? -ne 0 ]; then
  echo "❌ Secretos detectados. Commit bloqueado."
  exit 1
fi

npx lint-staged
```

### CI en GitHub Actions

Agregar al workflow:

```yaml
- name: Scan for secrets
  uses: gitleaks/gitleaks-action@v2
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Prueba de Detección

### Plantar una clave falsa

```bash
echo "FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKj\n-----END PRIVATE KEY-----" >> test-secret.txt
git add test-secret.txt
gitleaks protect --staged --verbose
```

### Resultado Esperado

```
Finding:     -----BEGIN PRIVATE KEY-----
Secret:      -----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKj\n-----END PRIVATE KEY-----
RuleID:      firebase-private-key
Entropy:     4.2
File:        test-secret.txt
Line:        1
Commit:      (staged)
```

### Limpiar después de la prueba

```bash
git reset HEAD test-secret.txt
rm test-secret.txt
```

## Estado de Implementación

- [ ] Instalar gitleaks
- [ ] Crear `.gitleaks.toml`
- [ ] Configurar pre-commit hook
- [ ] Agregar a CI de GitHub Actions
- [ ] Probar con clave falsa plantada
- [ ] Documentar resultados

---

## Referencias

- Gitleaks: https://github.com/gitleaks/gitleaks
- Documentación: https://github.com/gitleaks/gitleaks#configuration
- Reto de excelencia: "Escaneo de secretos" de la sección 15
