# Configuración de Firebase

Guía paso a paso para configurar Firebase para el proyecto Generador de Hoja de Vida.

---

## 1. Crear Proyecto en Firebase

1. Ir a [Firebase Console](https://console.firebase.google.com/)
2. Clic en "Agregar proyecto"
3. Nombre del proyecto: `generator-cv` (o el que prefieras)
4. Deshabilitar Google Analytics (opcional para este proyecto)
5. Clic en "Crear proyecto"

---

## 2. Habilitar Authentication

1. En el menú lateral, ir a **Authentication**
2. Clic en "Comenzar"
3. En la pestaña "Sign-in method", habilitar **Email/Password**
4. Guardar cambios

---

## 3. Configurar Firestore

1. En el menú lateral, ir a **Firestore Database**
2. Clic en "Crear base de datos"
3. Seleccionar "Modo producción" (las reglas se configuran después)
4. Seleccionar la ubicación más cercana (ej: `us-central1`)
5. Clic en "Habilitar"

### Aplicar Reglas de Firestore

Las reglas están en el archivo `firestore.rules` del proyecto. Para aplicarlas:

```bash
# Usando Firebase CLI (requiere firebase.json y .firebaserc configurados)
firebase deploy --only firestore:rules
```

O manualmente en la consola:

1. Ir a Firestore Database → Reglas
2. Pegar el contenido de `firestore.rules`
3. Clic en "Publicar"

### Crear Índices Compuestos

Los índices están en `firestore.indexes.json`. Para crearlos:

```bash
# Usando Firebase CLI (requiere firebase.json y .firebaserc configurados)
firebase deploy --only firestore:indexes
```

O manualmente en la consola:

1. Ir a Firestore Database → Índices
2. Crear los índices listados en `firestore.indexes.json`

---

## 4. Generar Cuenta de Servicio

1. En el menú lateral, ir a **Configuración del proyecto** (ícono de engranaje)
2. Ir a la pestaña "Cuentas de servicio"
3. Clic en "Generar nueva clave privada"
4. Guardar el archivo JSON descargado (NO commitear en Git)
5. Extraer los valores para las variables de entorno:
   - `FIREBASE_PROJECT_ID` = `project_id`
   - `FIREBASE_CLIENT_EMAIL` = `client_email`
   - `FIREBASE_PRIVATE_KEY` = `private_key` (con `\n` literales)

---

## 5. Obtener Configuración Web

1. En **Configuración del proyecto**, ir a la pestaña "General"
2. En "Tus apps", clic en "Agregar app" → Web (ícono `</>`)
3. Registrar la app con un nombre (ej: "GeneradorCV Web")
4. Copiar los valores de configuración:
   - `NEXT_PUBLIC_FIREBASE_API_KEY` = `apiKey`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` = `authDomain`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID` = `projectId`
   - `NEXT_PUBLIC_FIREBASE_APP_ID` = `appId`

---

## 6. Configurar Variables de Entorno

> **Regla del proyecto:** en el disco de desarrollo **nunca** debe haber secretos reales de producción. Producción vive únicamente en Vercel (variables de entorno del proyecto). El comando `vercel env pull` está **prohibido** porque baja esos secretos al disco.

Para el desarrollo local, usa **una de estas dos opciones** (nunca la cuenta de servicio de producción):

1. **Firebase Emulator Suite** (recomendado): no requiere credenciales reales.

   ```bash
   firebase emulators:start
   ```

2. **Proyecto de Firebase solo de desarrollo**, con una cuenta de servicio de **mínimo privilegio** distinta de la de producción.

Las variables se definen en tu entorno (o en un `.env.local` **local, ignorado por Git y con valores de desarrollo**). Usa `env.example` como plantilla (valores ficticios):

```env
# Públicas
NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key-de-desarrollo
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto-dev.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-project-id-dev
NEXT_PUBLIC_FIREBASE_APP_ID=tu-app-id-dev

# Privadas (solo servidor)
FIREBASE_PROJECT_ID=tu-project-id-dev
FIREBASE_CLIENT_EMAIL=tu-cuenta-de-servicio-dev@tu-proyecto-dev.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nCLAVE_DE_DESARROLLO\n-----END PRIVATE KEY-----\n"
```

- `.env.local` está en `.gitignore`: **nunca** se commitea.
- Si una clave real se filtra: **rótala**; borrarla no basta.

---

## 7. Archivos de Configuración de Firebase

### `firebase.json`

Este archivo le dice a Firebase CLI qué archivos usar para reglas e índices:

```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
}
```

### `.firebaserc`

Este archivo contiene el ID del proyecto de Firebase. **Debe ser configurado antes de ejecutar `firebase deploy`:**

```json
{
  "projects": {
    "default": "tu-project-id-aqui"
  }
}
```

**Importante:** Reemplaza `tu-project-id-aqui` con el ID real de tu proyecto de Firebase. Este archivo está en `.gitignore` porque contiene información específica del proyecto.

### Inicializar Firebase CLI

Si es la primera vez que usas Firebase CLI en este proyecto:

```bash
# 1. Instalar Firebase CLI (si no lo tienes)
npm install -g firebase-tools

# 2. Iniciar sesión
firebase login

# 3. Seleccionar el proyecto
firebase use --add

# 4. Verificar que los archivos estén correctos
firebase deploy --only firestore:rules --dry-run
```

### Verificar Configuración

```bash
# Verificar que Firebase CLI reconozca el proyecto
firebase projects:list

# Verificar que los archivos estén correctos
firebase deploy --only firestore:rules --dry-run
```

---

## 8. Verificar Configuración

1. Iniciar el servidor de desarrollo: `npm run dev`
2. Ir a `http://localhost:3000/login`
3. Intentar registrarse con un correo de prueba
4. Verificar que no haya errores en la consola

---

## Colecciones de Firestore

### Estructura de Datos

```
usuarios/{uid}/cvs/{id}
  ├── titulo: string
  ├── plantilla: string ("moderna" | "clasica" | "minimalista")
  ├── publica: boolean
  ├── codigo: string | null
  ├── datos: {
  │     personales: { nombre, cargo, email, telefono, ciudad, linkedin, portfolio, fotoUrl }
  │     perfil: string
  │     experiencia: [{ id, cargo, empresa, fechaInicio, fechaFin, descripcion }]
  │     estudios: [{ id, titulo, institucion, fechaInicio, fechaFin, descripcion }]
  │     habilidades: [{ id, nombre, nivel }]
  │     idiomas: [{ id, nombre, nivel }]
  │   }
  ├── fotoUrl: string | null
  └── actualizadoEn: string (ISO 8601)
```

---

## Seguridad

- **Reglas de Firestore:** `allow read, write: if false;` (niegan todo acceso desde cliente)
- **Admin SDK:** Solo la API usa Admin SDK para acceder a Firestore
- **Autorización por objeto:** El `uid` se obtiene de la sesión verificada, nunca del cuerpo o URL
- **Cookie de sesión:** `HttpOnly`, `Secure`, `SameSite=Lax`

---

## Referencias

- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Firebase CLI](https://firebase.google.com/docs/cli)
