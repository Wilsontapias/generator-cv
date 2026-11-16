# Prompts para Stitch - Diseño Visual del Generador de CV

Este documento contiene 2 prompts completos para generar el diseño visual de la aplicación usando herramientas como Stitch, Midjourney, DALL-E, v0, o similares.

---

## Prompt 1: Interfaz Completa de la Aplicación

### Descripción

Diseño integral de la interfaz de una aplicación web generadora de hojas de vida (CV) con Next.js, React y TypeScript. La aplicación debe cumplir WCAG 2.2 AA y ser mobile-first.

### Prompt Detallado

```
Diseño completo de aplicación web generadora de hojas de vida (CV), Next.js + React + TypeScript, mobile-first, WCAG 2.2 AA:

PALETA DE COLORES:
- Primary Teal: #0f766e (botones, acentos, sidebar plantilla 1)
- Teal Hover: #0d6b63
- Teal Light: #14b8a6
- Background: #ffffff
- Surface: #f9fafb (fondos secundarios)
- Border: #e5e7eb
- Text Primary: #1f2937
- Text Secondary: #6b7280
- Error: #dc2626
- Success: #16a34a
- Warning: #d97706

TIPOGRAFÍA:
- Headings y body: Inter, system-ui, sans-serif
- Headings weights: 600 (semibold), 700 (bold)
- Body weight: 400 (regular)
- Monospace (código): JetBrains Mono
- Escala: h1=2rem, h2=1.5rem, h3=1.25rem, h4=1.125rem, body=1rem, small=0.875rem

SPACING Y LAYOUT:
- Grid base: 4px, container max-width 1280px
- Gutters: 16px (móvil), 24px (tablet), 32px (escritorio)
- Escala de spacing: xs=4, sm=8, md=16, lg=24, xl=32, 2xl=48, 3xl=64

COMPONENTES A DISEÑAR (mostrar en un sistema de diseño unificado):

1. LANDING PAGE (/):
   - Hero con título "Crea tu hoja de vida profesional", subtítulo y CTA principal
   - Sección de características con 3-4 tarjetas (plantillas, vista previa, PDF, privado)
   - Footer con enlaces

2. LOGIN (/login):
   - Formulario centrado con email y contraseña
   - Botón principal teal, enlace para registrarse
   - Mensajes de error accesibles con aria-live

3. MIS CVs (/mis-cv):
   - Grid de tarjetas mostrando CVs guardados
   - Cada tarjeta: título, miniatura de plantilla, fecha modificación, menú acciones
   - Botón "Crear nuevo CV" destacado
   - Estado vacío con ilustración amigable
   - Estado de carga con skeleton
   - Estado de error con botón de reintentar

4. EDITOR DE CV (/cv/[id]/editar) - VISTA PRINCIPAL:
   - Layout de dos columnas en desktop: formulario izquierda, vista previa derecha
   - En móvil: tabs para alternar entre formulario y preview
   - Sidebar izquierdo con tabs para secciones:
     * Datos personales (nombre, correo, teléfono, ciudad, LinkedIn, foto)
     * Perfil profesional (textarea)
     * Experiencia laboral (repetible, máximo 10)
     * Estudios (repetible, máximo 10)
     * Habilidades (lista editable)
     * Idiomas (lista editable con nivel)
   - Cada sección con campos validados en tiempo real
   - Indicador de guardado automático
   - Botones: Guardar, Imprimir/Descargar PDF, Compartir enlace público

5. FORMULARIOS Y CAMPOS:
   - Inputs con label flotante o superior
   - Estados: default, focus (teal outline), error (rojo con mensaje), disabled
   - Textareas con contador de caracteres
   - Selects con flecha personalizada
   - Drag & drop para reordenar items con feedback visual
   - Botones para agregar/eliminar items

6. VISTA PREVIA DEL CV (panel derecho):
   - Renderizado en vivo del CV con la plantilla seleccionada
   - Selector de plantilla (3 opciones visuales)
   - Zoom in/out y scroll
   - Actualización en tiempo real conforme se escribe

7. VISTA DE IMPRESIÓN (/cv/[id]/imprimir):
   - Layout limpio solo con el CV en formato A4
   - Panel lateral con opciones: tamaño papel, márgenes, mostrar/ocultar foto
   - Botón "Descargar PDF" (usa window.print())
   - Preview exacto de cómo se imprimirá

8. PÁGINA PÚBLICA (/p/[codigo]):
   - Vista de solo lectura del CV compartido
   - Sin controles de edición
   - Opción de imprimir/descargar
   - Badge sutil "CV compartido"
   - Footer con enlace para crear tu propio CV

9. COMPONENTES BASE:
   - Botones: primary (teal con texto blanco), secondary (borde teal), ghost (texto teal), danger (rojo)
   - Estados: default, hover, focus, active, disabled
   - Modales/Dialogs con foco atrapado
   - Toast notifications con aria-live
   - Menús dropdown accesibles
   - Skeleton loaders animados
   - Empty states con ilustraciones

10. NAVEGACIÓN Y LAYOUT GLOBAL:
    - Header con logo "GeneradorCV", nombre de usuario, botón cerrar sesión
    - Link "Saltar al contenido" oculto hasta focus
    - Footer con créditos
    - Menú móvil colapsable accesible por teclado
    - Breadcrumbs donde aplique

11. ESTADOS RESPONSIVE (mostrar las 3 vistas):
    - Móvil (360px): una columna, menús colapsados, tabs para navegación
    - Tablet (768px): dos columnas donde aplique, navegación visible
    - Desktop (1024px): layout completo con sidebar y preview lado a lado

12. MODO OSCURO (alternativa):
    - Background: #0e1316
    - Surface: #161d22
    - Text Primary: #e6e9ee
    - Text Secondary: #9ba6b4
    - Border: #2a343d
    - Primary Teal: #2dd4bf
    - Ajustar contraste AA mantenido en ambos temas

13. DETALLES DE ACCESIBILIDAD:
    - Objetivos táctiles mínimo 44x44px en móvil, 24x24px mínimo absoluto
    - Foco visible con outline teal de 3px
    - Iconos con aria-label descriptivo
    - Formularios con label asociado y autocomplete
    - Jerarquía de títulos sin saltos
    - Un solo h1 por página

14. ESTILOS DE IMPRESIÓN (@media print):
    - Solo contenido del CV, ocultar controles
    - Formato A4 con márgenes apropiados
    - No cortar puestos de trabajo entre páginas
    - Optimizado para impresión en blanco y negro
    - Colores que se traduzcan bien a escala de grises

Referencias visuales: Canva, FlowCV, Novoresumé, Overleaf CV templates
Estilo: limpio, profesional, moderno, confiable
Público: estudiantes universitarios buscando primer empleo o prácticas
```

---

## Prompt 2: Tres Plantillas de CV

### Descripción

Diseño de tres plantillas de hoja de vida (CV) diferentes que comparten la misma estructura de datos pero con estilos visuales distintos. Cada plantilla debe cumplir con estándares de impresión profesional y ser apropiada para diferentes contextos.

### Prompt Detallado

```
Diseño de 3 plantillas de hoja de vida (CV) profesionales para estudiantes, formato A4, optimizadas para impresión y pantalla, todas con la misma estructura de datos pero estilos visuales distintos:

ESTRUCTURA DE DATOS COMÚN (todas las plantillas tienen):
- Foto de perfil (opcional, circular o rectangular según plantilla)
- Nombre completo
- Cargo/título profesional
- Contacto: correo, teléfono, ciudad, LinkedIn, portfolio
- Perfil profesional (resumen 3-4 líneas)
- Experiencia laboral (múltiples entradas con: cargo, empresa, fecha inicio-fin, 3-5 bullets de logros)
- Educación (múltiples entradas con: título, institución, fecha, descripción opcional)
- Habilidades (lista con niveles o categorías)
- Idiomas (idioma + nivel: básico/intermedio/avanzado/nativo)

TIPOGRAFÍA GENERAL:
- Headings: Inter o similar sans-serif, weights 600-700
- Body: sans-serif legible, weight 400
- Tamaño de fuente: nombre 20-24pt, secciones 12-14pt, body 10-11pt
- Espaciado generoso para legibilidad
- Jerarquía clara con tamaños y pesos

---

PLANTILLA 1: "MODERNA" - Para tecnología, diseño, startups

LAYOUT:
- Dos columnas asimétricas (30% sidebar izquierdo, 70% contenido derecho)
- Sidebar con fondo teal oscuro (#0f766e), texto blanco
- Área principal con fondo blanco

SIDEBAR IZQUIERDO (teal):
- Foto de perfil circular en la parte superior (120x120px)
- Nombre en blanco, bold, grande
- Cargo/título debajo en teal light
- Sección "Contacto" con iconos blancos minimalistas:
  * Email, teléfono, ciudad, LinkedIn, portfolio
- Sección "Habilidades" con barras de progreso o tags con fondo teal claro
- Sección "Idiomas" con indicador visual (puntos o barras)

ÁREA PRINCIPAL (blanco):
- Sección "Perfil" al inicio, texto justificado
- Sección "Experiencia" con timeline vertical:
  * Línea teal conectando puntos
  * Cada entrada: cargo en bold, empresa en regular, fechas right-aligned en gris
  * Bullets con logros usando puntos teal
- Sección "Educación" formato similar pero más compacto
- Divisores sutiles entre secciones

ESTILO VISUAL:
- Moderno, contemporáneo, dinámico
- Uso de color teal como identidad
- Iconos consistentes (lucide icons o similar)
- Espacios en blanco generosos
- Ideal para: tecnología, diseño, marketing, startups

VARIANTE MODO OSCURO:
- Sidebar teal más claro (#14b8a6)
- Fondo principal #1a1a1a
- Texto blanco/gris claro

---

PLANTILLA 2: "CLÁSICA" - Para derecho, finanzas, consultoría, academia

LAYOUT:
- Una sola columna, centrada
- Encabezado tradicional centrado
- Contenido en flujo vertical continuo

ENCABEZADO:
- Nombre completo centrado, grande (24pt), bold, negro
- Cargo/título debajo en gris oscuro, italic
- Línea horizontal divisoria de 1px
- Información de contacto en una sola línea separada por " | ":
  * correo | teléfono | ciudad | LinkedIn
- Foto pequeña opcional a la izquierda del nombre (80x80px, cuadrada)

CUERPO:
- Secciones con títulos en MAYÚSCULAS, bold, tamaño 12pt
- Línea horizontal debajo de cada título de sección
- Sección "PERFIL PROFESIONAL": párrafo justificado

- Sección "EXPERIENCIA LABORAL":
  * Cada entrada con formato:
    - Cargo en bold, Empresa en italic - Fechas right-aligned
    - Bullets con logros (puntos negros simples)
  * Espaciado consistente entre entradas

- Sección "EDUCACIÓN":
  * Título en bold, Institución en regular, Fechas right-aligned
  * Descripción opcional en tamaño ligeramente menor

- Sección "HABILIDADES":
  * Lista en columnas (2-3 columnas) separadas por comas
  * O categorías con títulos en bold

- Sección "IDIOMAS":
  * Formato simple: "Español (Nativo), Inglés (Avanzado)"

ESTILO VISUAL:
- Elegante, tradicional, conservador
- Solo negro, blanco y grises
- Serif para títulos (Georgia, Times New Roman) opcional
- Sans-serif para body
- Máxima legibilidad en blanco y negro
- Ideal para: derecho, finanzas, consultoría, academia, gobierno
- Excelente para fotocopias y fax

VENTAJA IMPRESIÓN:
- Funciona perfecto en blanco y negro
- No depende del color para la jerarquía
- Máxima compatibilidad con impresoras antiguas

---

PLANTILLA 3: "MINIMALISTA" - Para diseño, arte, medios, freelance

LAYOUT:
- Una sola columna, alineada a la izquierda
- Uso máximo de whitespace
- Diseño limpio y respirado
- Sin colores de fondo

ENCABEZADO:
- Nombre completo grande (28pt), weight 700, alineado izquierda
- Cargo/título debajo en gris (#6b7280), weight 400, tamaño 14pt
- Espacio generoso
- Foto opcional: círculo pequeño (100x100px) alineado a la derecha del nombre
- Contacto en una línea con separadores sutiles:
  * correo · teléfono · ciudad · LinkedIn

CUERPO:
- Secciones con títulos en tamaño 11pt, weight 600, color teal (#0f766e)
- Sin líneas divisorias, solo espaciado para separar secciones
- Mucho whitespace entre secciones (24-32px)

- Sección "PERFIL":
  * Texto completo, weight 400, max-width 65ch para legibilidad
  * Color gris oscuro (#374151)

- Sección "EXPERIENCIA":
  * Formato: Cargo en bold, Empresa en regular
  * Fecha en gris claro, tamaño 10pt
  * Bullets mínimos (puntos pequeños)
  * Espaciado generoso entre entradas (16-20px)

- Sección "EDUCACIÓN":
  * Formato compacto similar
  * Título en bold, institución en regular

- Sección "HABILIDADES":
  * Tags con borde teal claro, fondo transparente
  * O lista simple con separadores

- Sección "IDIOMAS":
  * Formato: "Español — Nativo"
  * Separador "—" elegante

ESTILO VISUAL:
- Ultra minimalista, contemporáneo, sofisticado
- Whitespace como elemento de diseño
- Tipografía como protagonista
- Toque de color solo en títulos de sección (teal)
- Ideal para: diseño, arte, arquitectura, medios, freelance
- Aspecto "diseñador" sin ser recargado

VARIANTE IMPRESIÓN:
- Los títulos de sección pueden imprimirse en negro si se prefiere
- Mantiene jerarquía sin color
- Excelente en papel de alta calidad

---

ESPECIFICACIONES TÉCNICAS COMUNES (las 3 plantillas):

FORMATO:
- Tamaño: A4 (210 x 297 mm)
- Márgenes: 15-20mm según plantilla
- Optimizado para 1-2 páginas máximo
- No cortar puestos de trabajo entre páginas (page-break-inside: avoid)

RESPONSIVE (vista en pantalla):
- Escalable con zoom
- Mantiene proporciones en móvil, tablet, desktop
- Preview actualizado en tiempo real en el editor

ACCESIBILIDAD:
- Contraste AA mantenido en todas las plantillas
- Texto legible mínimo 9pt en impresión, 10pt recomendado
- Jerarquía de títulos clara (h1 nombre, h2 secciones)
- Estructura semántica (h1, h2, section, article, time)

IMPRESIÓN (@media print):
- Ocultar elementos de UI (botones, controles)
- Mantener solo contenido del CV
- Colores que funcionen en escala de grises
- Sin imágenes de fondo pesadas
- Page breaks controlados
- Tamaño exacto A4

DATOS DE EJEMPLO A USAR EN LAS IMÁGENES:
- Nombre: "María García Rodríguez"
- Cargo: "Desarrolladora Full Stack"
- Email: "maria.garcia@email.com"
- Teléfono: "+57 300 123 4567"
- Ciudad: "Medellín, Colombia"
- LinkedIn: "linkedin.com/in/mariagarcia"
- Perfil: "Desarrolladora con 3 años de experiencia en React, Node.js y TypeScript. Apasionada por crear interfaces accesibles y performantes..."
- Experiencia: 2-3 entradas con empresa, cargo, fechas, logros
- Educación: Ingeniería de Sistemas, Universidad Nacional, 2020-2024
- Habilidades: React, TypeScript, Node.js, PostgreSQL, Git, Docker
- Idiomas: Español (Nativo), Inglés (Avanzado C1)

ENTREGABLES:
1. Vista completa de cada plantilla (A4 completo)
2. Detalle de secciones individuales (experiencia, habilidades)
3. Versión modo claro y modo oscuro (si aplica)
4. Vista de impresión (cómo se ve al imprimir)
5. Las 3 plantillas lado a lado para comparación

ESTILO GENERAL:
- Profesional pero accesible para estudiantes
- Limpio, moderno, legible
- Atractivo visualmente sin ser recargado
- Apropiado para primer empleo/prácticas
- Diferenciado entre las 3 opciones para cubrir diferentes industrias
```

---

## Notas de Uso

### Cómo usar estos prompts

1. **Generar variaciones**: Cada prompt puede generar múltiples resultados. Genera al menos 3-4 opciones por prompt y elige la que mejor represente la visión.

2. **Iterar**: Usa las imágenes generadas como referencia visual, no como especificación pixel-perfect. El objetivo es capturar la esencia del diseño.

3. **Consistencia**: Asegúrate de que ambas imágenes mantengan la misma paleta de colores y tipografía para coherencia visual.

4. **Implementación**: Estas imágenes guían el desarrollo CSS/React, pero deben adaptarse a los requisitos técnicos de Next.js y accesibilidad.

5. **Validación**: Después de implementar, verifica con herramientas como axe DevTools y Lighthouse para cumplir WCAG 2.2 AA.

### Herramientas recomendadas

- **Stitch**: Ideal para UI/UX design systems
- **v0 by Vercel**: Genera componentes React directamente
- **Midjourney**: Excelente para conceptos visuales
- **DALL-E 3**: Bueno para seguir instrucciones detalladas
- **Figma + AI plugins**: Para iteración y prototipado

### Orden de generación sugerido

1. Primero genera la **Plantilla 2 (Clásica)** como referencia base
2. Luego genera la **Interfaz completa** usando la paleta definida
3. Finalmente genera las **Plantillas 1 y 3** manteniendo coherencia
4. Genera variantes de modo oscuro e impresión según necesidad

### Referencias adicionales

Para inspiración complementaria, busca:

- "Modern resume template 2026"
- "Clean CV layout examples"
- "ATS-friendly resume design"
- "Professional resume templates"
- "Minimalist CV design"
