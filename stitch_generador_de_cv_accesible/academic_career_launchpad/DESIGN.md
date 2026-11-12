---
name: Academic Career Launchpad
colors:
  surface: "#f8f9ff"
  surface-dim: "#d0dbed"
  surface-bright: "#f8f9ff"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#eff4ff"
  surface-container: "#e6eeff"
  surface-container-high: "#dee9fc"
  surface-container-highest: "#d9e3f6"
  on-surface: "#121c2a"
  on-surface-variant: "#3e4947"
  inverse-surface: "#27313f"
  inverse-on-surface: "#eaf1ff"
  outline: "#6e7977"
  outline-variant: "#bdc9c6"
  surface-tint: "#006a63"
  primary: "#005c55"
  on-primary: "#ffffff"
  primary-container: "#0f766e"
  on-primary-container: "#a3faef"
  inverse-primary: "#80d5cb"
  secondary: "#006b5f"
  on-secondary: "#ffffff"
  secondary-container: "#6df5e1"
  on-secondary-container: "#006f64"
  tertiary: "#005f26"
  on-tertiary: "#ffffff"
  tertiary-container: "#007a33"
  on-tertiary-container: "#a1ffad"
  error: "#ba1a1a"
  on-error: "#ffffff"
  error-container: "#ffdad6"
  on-error-container: "#93000a"
  primary-fixed: "#9cf2e8"
  primary-fixed-dim: "#80d5cb"
  on-primary-fixed: "#00201d"
  on-primary-fixed-variant: "#00504a"
  secondary-fixed: "#71f8e4"
  secondary-fixed-dim: "#4fdbc8"
  on-secondary-fixed: "#00201c"
  on-secondary-fixed-variant: "#005048"
  tertiary-fixed: "#7ffc97"
  tertiary-fixed-dim: "#62df7d"
  on-tertiary-fixed: "#002109"
  on-tertiary-fixed-variant: "#005320"
  background: "#f8f9ff"
  on-background: "#121c2a"
  surface-variant: "#d9e3f6"
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: "700"
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: "700"
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: "600"
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: "600"
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: "600"
    lineHeight: 26px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 20px
  body-md-medium:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "500"
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: "400"
    lineHeight: 16px
  label-code:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: "500"
    lineHeight: 16px
    letterSpacing: 0.02em
  label-badge:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: "600"
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2rem
  margin-sm: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

### Brand Personality & Philosophy

This design system is tailored for university students and early-career candidates navigating the transition from academia to professional employment. The interface projects four distinct attributes:

- **Pragmatic Authority:** Clear, confident, and reliable without bureaucratic friction or overly corporate jargon.
- **Calm Clarity:** Structured layout architecture designed to lower the anxiety often tied to job-hunting and resume writing.
- **Academic Rigor meets Modern Tooling:** Inspired by the visual discipline of Overleaf paired with the fluid editing workflows of modern visual creation suites.

### Design Movement

The system follows a **Functional Minimalist & Structured Editorial** design direction:

- High-contrast visual hierarchy prioritizing scannability and structural organization.
- Deliberate use of strict micro-borders rather than heavy drop shadows to communicate interface affordances.
- Utilitarian data layout optimized for real-time document preview and concurrent form input.
- WCAG 2.2 Level AA compliance built directly into every interactive state and semantic token.

## Colors

### Color Strategy & Contrast Ratios

The color architecture relies on a grounded Teal as the primary focal tone, balancing academic seriousness with modern digital appeal. All text-to-background combinations meet or exceed the WCAG 2.2 AA requirement of 4.5:1 for body copy and 3:1 for large display elements and graphical UI boundaries.

#### Light Mode Palette

- **Primary:** `#0f766e` (Teal 700) – High-emphasis actions, active tab indicators, and primary visual anchors. Achieves 4.8:1 contrast on white.
- **Primary Hover:** `#0d6b63` – Darkened state for pointer interactions.
- **Primary Light / Accent:** `#14b8a6` (Teal 500) – Supporting highlights and subtle indicators.
- **Background Canvas:** `#ffffff` – Pure white ground for the main editor and preview canvas.
- **Surface / Container:** `#f9fafb` – Neutral off-white for secondary panels, toolbars, and inactive inputs.
- **Border / Divider:** `#e5e7eb` – Low-contrast structural rules separating panels and form groupings.
- **Text Primary:** `#1f2937` (Slate 800) – High-contrast copy (12.6:1 against `#ffffff`).
- **Text Secondary:** `#6b7280` (Gray 500) – Field labels, supporting meta-data, and helper text (4.6:1 against `#ffffff`).
- **Semantic Signals:**
  - Critical / Error: `#dc2626` (Red 600)
  - Success: `#16a34a` (Green 600)
  - Warning: `#d97706` (Amber 600)

#### Dark Mode Palette

- **Dark Background:** `#0e1316` – Deep charcoal-teal base, minimizing eye strain during extended work sessions.
- **Dark Surface:** `#161d22` – Elevated card and inspector surfaces.
- **Dark Border:** `#2a343d` – Clear boundary lines matching dark theme luminosity.
- **Dark Primary:** `#2dd4bf` (Teal 400) – Adjusted high-luminance teal passing 8.2:1 against the dark background.
- **Dark Text Primary:** `#e6e9ee` – Primary editorial text.
- **Dark Text Secondary:** `#9ba6b4` – Secondary metadata text.

### Focus Accessibility System

All interactive components enforce a mandatory visible keyboard focus ring:

- Ring width: `3px` solid `#0f766e` (Light Mode) or `#2dd4bf` (Dark Mode).
- Ring offset: `2px` from the element border to guarantee clear separation across any background.

## Typography

### Structural Role Mapping

- **Primary Typeface (Inter):** Applied across all headings, body narrative, labels, inputs, and interactive components. Inter was selected for its neutral grotesque proportions, disambiguated letterforms (`I` vs `l` vs `1`), and optimal rendering across web standard screens.
- **Monospace Typeface (JetBrains Mono):** Applied deliberately to technical metadata, ATS score counters, export diagnostics, and syntax or placeholder hints inside the editor.

### Hierarchy & Scaling

- Headings maintain tight letter spacing (`-0.02em` to `-0.005em`) to preserve visual density in structural section headers.
- Body paragraphs and inputs use relaxed proportional leading (`lineHeight` is at least 1.4× to 1.5× the font size) to support readers with visual or cognitive processing differences.
- Mobile viewports step `headline-xl` down to `26px` to prevent unnatural line wrapping in dual-column metadata cards.

## Layout & Spacing

### Layout Model

The layout uses a split-pane, viewport-optimized architecture configured within a maximum container width of `1280px`:

- **Workspace Split Screen:** Desktop screens allocate a 50/50 or 45/55 split between the structured form input stream on the left and the paper-space live preview (A4/US Letter aspect ratio) on the right.
- **Modular Fluid Grid:** 12-column layout on desktop (`1024px+`), reflowing to an 8-column layout on tablet (`768px - 1023px`), and a single-column stacked layout on mobile (`<768px`).

### Breakpoint Matrix

- **Mobile (< 768px):** Navigation switches to top tabs or a fixed bottom control bar. The live resume preview converts to an expandable drawer or dedicated modal view. Screen margin: `1rem` (`16px`). Gutters: `1rem` (`16px`).
- **Tablet (768px - 1023px):** Editor inputs remain stacked full-width with a sticky preview trigger or tabbed toggle. Margin: `1.5rem` (`24px`).
- **Desktop (1024px - 1280px+):** Concurrent side-by-side editing and rendering. Container centers at `1280px` max with `2rem` (`32px`) margins.

### Touch Target Standard

All clickable elements, toggle buttons, stepper buttons, and navigation tabs adhere strictly to WCAG 2.2 AA target size criteria:

- Minimum physical footprint: `44px × 44px`. If visual icons are smaller (e.g., 20px icon buttons), their interactive touch hit-box must pad to `44px`.

## Elevation & Depth

### Depth Philosophy

This design system avoids heavy shadows and synthetic blurs in favor of **low-contrast micro-outlines and tonal surface stepping**. This approach ensures predictable document rendering, low cognitive overhead, and consistent visual clarity across differing monitors.

### Surface Tiers

- **Tier 0 (Base Ground):** `#ffffff` (Light) / `#0e1316` (Dark). The base layout plane.
- **Tier 1 (Panels & Structural Groups):** `#f9fafb` (Light) / `#161d22` (Dark) with a `1px` border of `#e5e7eb` (Light) / `#2a343d` (Dark). Used for sidebars, step trackers, and form field wrappers.
- **Tier 2 (Elevated Modals & Floating Tools):** Pure surface color surrounded by a `1px` outline plus a low-luminosity ambient shadow: `box-shadow: 0 4px 16px -2px rgba(15, 23, 42, 0.08)`.
- **Document Canvas (The CV Page):** Highlighted with a distinct crisp border (`1px solid #e5e7eb`) and an editorial soft backdrop shadow `0 8px 24px -4px rgba(0, 0, 0, 0.06)` to simulate physical paper sitting on a desk.

## Shapes

### Shape Language

The system adopts an intentional, balanced corner radius scale (`roundedness: 2`):

- Standard interactive elements (inputs, standard buttons, dropdown triggers) use `0.5rem` (`8px`).
- Layout cards, document viewports, and modal dialogs step up to `1rem` (`16px`, `rounded-lg`).
- Outer dialog surfaces and contextual sheets scale to `1.5rem` (`24px`, `rounded-xl`).
- Status tags, indicators, and circular quick-actions use fully rounded pill geometry (`rounded-full`).

This geometry conveys approachable precision: soft enough to feel inviting to first-time resume builders, yet square enough to retain organizational authority.

## Components

### Buttons

All button variants enforce a minimum height of `44px`, horizontal padding of `1rem` (`16px`), `rounded-md` (8px), and standard font `body-md-medium`.

- **Primary:** Solid background `#0f766e`, text `#ffffff`. Hover: `#0d6b63`. Active: `#0f766e` scaled slightly down (`scale-[0.99]`). Dark mode background: `#2dd4bf`, text `#0e1316`.
- **Secondary:** Surface `#ffffff`, border `1px solid #e5e7eb`, text `#1f2937`. Hover: `#f9fafb` with border `#d1d5db`.
- **Ghost:** Background transparent, text `#1f2937`. Hover: background `#f9fafb`.
- **Danger:** Background `#dc2626`, text `#ffffff`. Hover: `#b91c1c`. Secondary danger: transparent with text `#dc2626` and border `#fca5a5`.
- **Accessibility:** `focus-visible:outline focus-visible:outline-3 focus-visible:outline-[#0f766e] focus-visible:outline-offset-2`.

### CV Preview & Live Editor Cards

- **CV Item Card:** Surface `#ffffff`, border `1px solid #e5e7eb`, radius `12px`, padding `1rem`. Houses dragged drag-and-drop handles (44x44px target), dynamic summary text, and inline delete/edit actions.
- **Status Badges / Tags:** Pill shape, padding `0.25rem 0.625rem`, font `label-badge`.
  - Draft: Surface `#f3f4f6`, text `#374151`.
  - Complete / Optimized: Surface `#dcfce7`, text `#15803d`.
  - Attention Needed: Surface `#fef3c7`, text `#92400e`.

### Form Fields & Inputs

- **Text Inputs & Textareas:** Height `44px` (standard input), padding `0.625rem 0.875rem`, border `1px solid #e5e7eb`, radius `8px`, typography `body-md`.
- **Active / Focused:** Border color `#0f766e`, ring `3px` solid `#0f766e` with `2px` offset.
- **Error State:** Border color `#dc2626`, focus ring `#dc2626`. Inline error message sits `0.25rem` below input with leading warning icon, rendered in `body-sm` `#dc2626`.
- **Floating Character / Word Counter:** Monospace format `label-code` in secondary text `#6b7280`.

### Real-Time Live Preview Pane

- Container features a neutral framing surface (`#f3f4f6` Light, `#12181c` Dark) containing an A4 formatted document paper element.
- Scaled through CSS `transform: scale()` or CSS container queries based on split-pane slider position.
- Top control bar includes zoom controls (`-`, `100%`, `+`), layout switches, and an accessible export menu button.

### Navigation Tabs & Multi-Step Flow

- Horizontal segment tabs for CV sections (Personal Info, Education, Experience, Skills, Certifications).
- Active tab indicated by high-contrast bottom bar (`3px solid #0f766e`) and bold text weight (`600`).
- ARIA structure: Container marked with `role="tablist"`, items with `role="tab"`, `aria-selected="true/false"`, and linked to their respective `role="tabpanel"`.

### Skeleton Loaders

- Rendered using an animated background gradient sweeping through `#e5e7eb` to `#f3f4f6`.
- Enforces reduced-motion compliance: when `@media (prefers-reduced-motion: reduce)` is active, animations fall back to static opacity (`0.6`).
