# Generador de Hoja de Vida con PDF

Proyecto de desarrollo web que permite a estudiantes crear, editar y exportar hojas de vida profesionales mediante un formulario interactivo con vista previa en vivo.

**Integrante:** Wilson Enrique Tapias Posada

---

## Descripción del Proyecto

Aplicación web que facilita la creación de hojas de vida para prácticas o primer empleo. El usuario completa secciones estructuradas (datos personales, experiencia, estudios, etc.), elige entre diferentes plantillas y exporta su CV a PDF.

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                        NAVEGADOR                             │
│  Next.js (App Router) · React · TypeScript                  │
│  Firebase Auth (SDK web) → cookie de sesión HttpOnly        │
│  fetch a la API propia (mismo origen)                       │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                      API REST                                │
│  Route Handlers de Next.js (app/api/**)                     │
│  rutas → servicios → repositorios · Zod · manejo de errores │
├──────────────────────────┬──────────────────────────────────┤
│                          │                                   │
│    ┌─────────────────────▼─────────────┐                    │
│    │         FIREBASE                   │                    │
│    │  - Authentication                  │                    │
│    │  - Firestore (Admin SDK)           │                    │
│    └────────────────────────────────────┘                    │
│                          │                                   │
│    ┌─────────────────────▼─────────────┐                    │
│    │       VERCEL BLOB                  │                    │
│    │  - Archivos (fotos)                │                    │
│    │  - Store privado                   │                    │
│    └────────────────────────────────────┘                    │
└──────────────────────────────────────────────────────────────┘
```

### Principios de Seguridad

- **Todo lo privilegiado vive solo en variables de entorno del servidor**
- Variables `NEXT_PUBLIC_*` solo para datos públicos (config web de Firebase)
- El navegador no habla con Firestore directamente
- Reglas de Firestore: `allow read, write: if false;`

---

## Stack Tecnológico

| Capa          | Tecnología                                      |
| ------------- | ----------------------------------------------- |
| Frontend      | Next.js 15+ (App Router), React 18+, TypeScript |
| Estilos       | CSS Modules / Tailwind CSS                      |
| Validación    | Zod (compartido cliente/servidor)               |
| Autenticación | Firebase Auth                                   |
| Base de datos | Firestore (Admin SDK)                           |
| Archivos      | Vercel Blob (store privado)                     |
| Testing       | Vitest, React Testing Library                   |
| Despliegue    | Vercel                                          |

---

## Estructura del Proyecto

```
app/
├── layout.tsx               # Landmarks, tema, proveedor de sesión
├── loading.tsx · error.tsx · not-found.tsx
├── page.tsx                 # Landing
├── login/page.tsx           # Inicio de sesión
├── mis-cv/page.tsx          # Mis hojas de vida
├── cv/[id]/editar/page.tsx  # Editor por secciones con vista previa
├── cv/[id]/imprimir/page.tsx # Versión lista para imprimir
├── p/[codigo]/page.tsx      # Enlace público opcional
├── api/                     # Route Handlers (API REST)
│   ├── auth/
│   │   └── sesion/route.ts  # POST, DELETE, GET /yo
│   ├── cv/
│   │   └── route.ts         # CRUD de CVs
│   ├── upload/route.ts      # Subida de fotos
│   └── p/[codigo]/route.ts  # CV público
src/
├── components/              # UI reutilizable y accesible
├── hooks/                   # useDebounce, useLocalStorage, etc.
├── schemas/                 # Esquemas Zod compartidos
├── services/                # Reglas de negocio (puras)
├── repositories/            # Acceso a Firestore
├── lib/                     # Firebase (cliente/admin), auth, errores
└── styles/                  # Estilos globales
tests/                       # Pruebas con Vitest
├── components/
├── services/
└── api/
ia/                          # Configuración y evidencias de IA
calidad/                     # Evidencias de calidad
openapi.yaml                 # Documentación de la API
bruno/                       # Colección de solicitudes
```

---

## Rutas de la Aplicación

| Ruta                | Contenido                              |
| ------------------- | -------------------------------------- |
| `/`                 | Landing page                           |
| `/login`            | Inicio de sesión con Firebase          |
| `/mis-cv`           | Lista de hojas de vida del usuario     |
| `/cv/[id]/editar`   | Editor por secciones con vista previa  |
| `/cv/[id]/imprimir` | Versión lista para imprimir            |
| `/p/[codigo]`       | Enlace público opcional (solo lectura) |

---

## Requisitos Funcionales

- **RF-01** Secciones: datos personales, perfil, experiencia, estudios, habilidades e idiomas
- **RF-02** Tres plantillas con la misma información
- **RF-03** Vista previa en vivo y reordenar secciones
- **RF-04** Exportar a PDF con el navegador (`window.print()`)
- **RF-05** Subir una foto de perfil
- **RF-06** Enlace público opcional de solo lectura

---

## APIs del Navegador Utilizadas

| API                               | Uso                               |
| --------------------------------- | --------------------------------- |
| `@media print` y `window.print()` | Exportar a PDF desde el navegador |
| Drag and Drop API                 | Reordenar experiencias y estudios |
| `localStorage`                    | Borrador local del CV             |

---

## Variables de Entorno

### Públicas (NEXT_PUBLIC_*)

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### Privadas (solo servidor)

```env
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
BLOB_READ_WRITE_TOKEN=
```

---

## Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Ejecutar pruebas
npm test

# Verificar calidad
npm run check

# Construir para producción
npm run build
```

---

## Despliegue

```bash
# Desplegar a Vercel
vercel deploy --prod
```

---

## Licencia

Ver archivo LICENSE.
