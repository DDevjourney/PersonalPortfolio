# Rediseño pixel art "pantalla de 1 bit" — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rehacer el portfolio con la identidad "pantalla de 1 bit": papel/tinta, titulares en Jersey 10, un rojo puntual, titular del Hero que se monta en píxeles y capturas de proyectos en tramado que se revelan a color.

**Architecture:** Cada tarea sustituye una sección entera (componente, datos y dependencias que deja de usar) y deja la web compilando y navegable. Tres componentes de React Bits (Pixel Swap, Dither Veil, Lattice Loader) se descargan de su registro en la variante TypeScript + CSS y se adaptan mínimamente. El resto es React + Tailwind propio.

**Tech Stack:** React 18 + TypeScript (strict), Vite 5, Tailwind 3, `ogl` (WebGL para Dither Veil), EmailJS.

**Spec:** `docs/superpowers/specs/2026-10-08-pixel-art-redesign-design.md`

## Global Constraints

- Colores: `paper #E8E6E1`, `ink #1A1A1A`, `ink-soft #65625C`, `red #E0251B`. El rojo solo para: cursor del titular, periodo actual, subrayado de la sección activa, sombra del botón de envío, anillo de foco.
- Tipografía: Jersey 10 (titulares, nombres de proyecto, años, navegación, botones) y Archivo 400/600 (texto). Escala de tamaños pixel: 20 / 30 / 44 / 84 px. Sin Anton ni Inter al terminar.
- Sin `uppercase tracking-wider`, sin `text-justify`, sin puntos medios decorativos en texto visible. Líneas de texto ≤ `max-w-[65ch]`.
- Bordes de 2 px en `ink`, esquinas rectas. Separadores internos 1 px `ink/20`.
- Foco visible en todo lo interactivo (`:focus-visible` rojo, 2 px, offset 2 px). Objetivos táctiles ≥ 24×24 px.
- `prefers-reduced-motion: reduce`: titular ya montado, capturas a color en `<img>`, sin `wander`, sin scroll suave.
- Nombre en la web: "Carlos" a secas.
- El proyecto **no tiene framework de tests**. La verificación de cada tarea es: `npx tsc -b` sin salida, `npm run build` con "✓ built", y comprobaciones en el navegador con los snippets indicados. No se añade un framework de tests (fuera del alcance del spec).
- Cómo probar en el navegador: arrancar el servidor con la herramienta de preview (`preview_start` con `{ name: "portfolio" }`, puerto 5183) o `npm run dev`. Tras cambiar el tamaño de la ventana emulada, **recargar la página**: la emulación no dispara eventos `resize` ni `change` de `matchMedia`.
- Cada commit termina con la línea `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Mapa de archivos

| Archivo | Responsabilidad | Tarea |
| --- | --- | --- |
| `tailwind.config.js` | Tokens de color y fuente | 1, 8 |
| `index.html` | Carga de fuentes | 1, 8 |
| `src/index.css` | Base global: foco, scroll, contenedor | 1, 8 |
| `src/components/SectionTitle.tsx` (nuevo) | Título de sección en Jersey 10 | 2 |
| `src/components/Chronology.tsx` (nuevo) | Lista cronológica (Experiencia y Formación) | 2 |
| `src/components/Stack.tsx` (nuevo, sustituye `Skills.tsx`) | Grupos de tecnologías | 3 |
| `src/components/DitherVeil.tsx/.css` (nuevo) | Captura en tramado revelable | 4 |
| `src/components/PixelSwap.tsx/.css` (nuevo) | Montaje en píxeles del titular | 5 |
| `src/components/LatticeLoader.tsx/.css` (nuevo) | Indicador de envío | 6 |
| `src/data/types.ts`, `src/data/portfolio.ts` | Modelo y contenido | 2–5 |
| `src/data/sections.ts`, `src/hooks/useActiveSection.ts` | Sección activa en la navegación | 7 |
| `Hero`, `Experience`, `Education`, `Projects`, `Contact`, `Header`, `Footer`, `App` | Secciones | 2–7 |

---

### Task 1: Tokens, fuentes y base global; fuera Lenis, raíl e índice fijo

**Files:**
- Modify: `tailwind.config.js`
- Modify: `index.html:45-51`
- Modify: `src/index.css` (reescritura)
- Modify: `src/App.tsx`
- Delete: `src/components/ScrollProgressRail.tsx`, `src/components/SectionIndexBadge.tsx`, `src/hooks/useSmoothScroll.ts`, `src/hooks/useScrollProgress.ts`

**Interfaces:**
- Produces: clases Tailwind `font-pixel`, `font-body`, `text-red`/`bg-red` (color `red.DEFAULT`), `container-content`. Los tokens antiguos (`paper-light`, `ink-faint`, `font-display`, `font-archivo`, `ease-expo`, `.pill`, `.hairline`) **se mantienen** hasta la tarea 8 para que las secciones aún no migradas sigan funcionando.

- [ ] **Step 1: Tokens en `tailwind.config.js`**

Sustituir el archivo entero por:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#E8E6E1',
        ink: '#1A1A1A',
        // 4.87:1 sobre `paper`: AA para texto normal.
        'ink-soft': '#65625C',
        // Objeto y no string: así se fusiona con la escala `red-*` de
        // Tailwind en vez de sustituirla, y `text-red` usa este valor.
        red: { DEFAULT: '#E0251B' },
        // Se eliminan en la tarea 8, cuando ninguna sección los use.
        'paper-light': '#EDEBE7',
        'ink-faint': '#B7B3AC',
      },
      fontFamily: {
        pixel: ['"Jersey 10"', 'sans-serif'],
        body: ['Archivo', 'sans-serif'],
        // Se eliminan en la tarea 8.
        display: ['Anton', 'Archivo', 'sans-serif'],
        archivo: ['Archivo', 'sans-serif'],
      },
      maxWidth: {
        content: '1200px',
      },
      transitionDuration: {
        DEFAULT: '300ms',
      },
      transitionTimingFunction: {
        // Se elimina en la tarea 8.
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 2: Fuentes en `index.html`**

Sustituir el comentario y el `<link>` de Google Fonts (líneas 45-51) por:

```html
    <!-- Google Fonts: Jersey 10 (titulares pixel) y Archivo (texto).
         Anton se retira en la última tarea del rediseño. -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@400;500;600;700&family=Jersey+10&display=swap"
      rel="stylesheet"
    />
```

- [ ] **Step 3: Reescribir `src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  @media (prefers-reduced-motion: no-preference) {
    html {
      scroll-behavior: smooth;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  /* La cabecera es fija: sin esto, un salto a #proyectos deja el título
     debajo de ella. */
  [id] {
    scroll-margin-top: 5rem;
  }

  body {
    @apply bg-paper font-body text-ink antialiased;
  }

  :focus-visible {
    outline: 2px solid theme('colors.red.DEFAULT');
    outline-offset: 2px;
  }

  /* Se elimina en la tarea 8. */
  .font-display {
    letter-spacing: -0.01em;
  }
}

@layer components {
  .container-content {
    @apply mx-auto w-full max-w-content px-6 md:px-10 lg:px-16;
  }

  /* `.pill` y `.hairline` se eliminan en la tarea 8. */
  .pill {
    @apply inline-flex items-center justify-center rounded-full border border-ink/80
           px-5 py-2 text-xs font-semibold uppercase tracking-wider
           transition-all duration-300 hover:bg-ink hover:text-paper;
  }

  .hairline {
    @apply border-t border-ink/15;
  }
}
```

- [ ] **Step 4: `src/App.tsx` sin scroll suave, raíl ni índice**

Quitar los imports de `ScrollProgressRail`, `SectionIndexBadge` y `useSmoothScroll`, la llamada `useSmoothScroll()` y los elementos `<ScrollProgressRail />` y `<SectionIndexBadge />`. El resto del archivo queda igual (se reescribe en la tarea 7).

- [ ] **Step 5: Borrar archivos y desinstalar Lenis**

```bash
git rm src/components/ScrollProgressRail.tsx src/components/SectionIndexBadge.tsx src/hooks/useSmoothScroll.ts src/hooks/useScrollProgress.ts
npm uninstall lenis
```

- [ ] **Step 6: Verificar**

Run: `npx tsc -b` → sin salida. Run: `npm run build` → termina en "✓ built".
En el navegador (1280 px), ejecutar:

```js
({
  lenis: document.documentElement.classList.contains('lenis'),
  rail: !!document.querySelector('[class*="h-screen"][aria-hidden]'),
  bodyFont: getComputedStyle(document.body).fontFamily,
  jersey: await document.fonts.load('400 30px "Jersey 10"').then(f => f.length > 0),
})
```

Expected: `lenis: false`, `rail: false`, `bodyFont` empieza por `Archivo`, `jersey: true`. Pulsar Tab: el primer elemento enfocado (skip link) muestra el anillo rojo.

- [ ] **Step 7: Commit**

```bash
git add -A tailwind.config.js index.html src/index.css src/App.tsx package.json package-lock.json src/components src/hooks
git commit -m "$(cat <<'EOF'
feat: add pixel-art tokens and drop smooth scroll, progress rail and index badge

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Cronología para Experiencia y Formación

**Files:**
- Create: `src/components/SectionTitle.tsx`, `src/components/Chronology.tsx`
- Modify: `src/data/types.ts`, `src/data/portfolio.ts` (bloques `experience`, `education`, `certifications`)
- Modify: `src/components/Experience.tsx`, `src/components/Education.tsx` (reescritura)
- Modify: `src/components/Header.tsx` (enlace de Estudios)
- Delete: `src/components/EducationTimeline.tsx`, `src/components/FlipCard.tsx`, `src/components/FlipCard.css`, `src/hooks/useNodeLineExtent.ts`, `src/hooks/useStaggerReveal.ts`

**Interfaces:**
- Produces: `SectionTitle({ children }: { children: ReactNode })` (default export). `Chronology({ items }: { items: ChronologyItem[] })` (default export). Tipos `ChronologyItem`, `Certification` en `types.ts`. Id de sección `formacion` (antes `estudios`).

- [ ] **Step 1: Tipos**

En `src/data/types.ts`, sustituir la interfaz `ExpandableItem` (con su comentario) por:

```ts
/** Una entrada de Experiencia o Formación. */
export interface ChronologyItem {
  id: string
  /** Con raya corta y sin espacios: "2023–2025", "2026–hoy" */
  period: string
  /** Puesto o titulación */
  role: string
  /** Empresa o centro */
  organization: string
  description?: string
  /** Sigue en curso: su periodo se pinta en rojo */
  current?: boolean
}

/** Curso complementario: se lista en una línea al final de Formación. */
export interface Certification {
  id: string
  name: string
  organization: string
  period: string
}
```

- [ ] **Step 2: Datos**

En `src/data/portfolio.ts`: cambiar el import a `import type { Skill, Project, ChronologyItem, Certification } from './types'` y sustituir los bloques `experience`, `education` y `certifications` (con sus comentarios) por:

```ts
/* ------------------------------------------------------------------ */
/* EXPERIENCIA                                                         */
/* ------------------------------------------------------------------ */
export const experience: ChronologyItem[] = [
  {
    id: 'exp-bittacora',
    period: '2026–hoy',
    role: 'Desarrollador web',
    organization: 'Bittacora',
    current: true,
    description:
      'Desarrollo y mantenimiento de aplicaciones web con React, JavaScript, TypeScript, PHP y Laravel. Implementación de nuevas funcionalidades, integración de APIs y trabajo con bases de datos relacionales en un entorno de equipo.',
  },
  {
    id: 'exp-decathlon',
    period: '2023–2025',
    role: 'Vendedor deportivo',
    organization: 'Decathlon',
    description:
      'Lideré la iniciativa con una progresión del 47%, coordinando con colaboradores de cada sección, formando al personal y resolviendo incidencias operativas. Desarrollé soluciones digitales a nivel tienda y sección: centralicé herramientas en Google Sites y automaticé la gestión de reservas e inventario mediante Google Sheets.',
  },
  {
    id: 'exp-academia',
    period: '2021–2022',
    role: 'Community manager',
    organization: 'Academia de oposiciones',
    description:
      'Gestioné la presencia digital de la marca en tres áreas: comunidad, contenido y equipo. Creé y administré el servidor de Discord oficial, diseñé publicaciones para redes sociales con Gimp, Canva y Meta Business Suite, y desarrollé estrategias de comunicación analizando KPIs para apoyar la toma de decisiones.',
  },
]

/* ------------------------------------------------------------------ */
/* FORMACIÓN                                                           */
/* ------------------------------------------------------------------ */
export const education: ChronologyItem[] = [
  {
    id: 'edu-daw',
    period: '2024–2026',
    role: 'CFGS Desarrollo de Aplicaciones Web',
    organization: 'Ilerna',
    description:
      'Formación especializada en desarrollo web front-end y back-end: PHP, Laravel, bases de datos, JavaScript, despliegue y metodologías de desarrollo de software.',
  },
  {
    id: 'edu-derecho',
    period: '2015–2021',
    role: 'Grado en Derecho',
    organization: 'Universidad de Extremadura',
    description:
      'En mi formación en Derecho, desarrollé habilidades como análisis crítico, razonamiento lógico y resolución de conflictos. Estos conocimientos, junto con mi curiosidad en áreas como economía y política, me dieron una visión integral que aplico en todas mis experiencias profesionales.',
  },
]

export const certifications: Certification[] = [
  { id: 'cert-ciber', name: 'MOOC en Ciberseguridad', organization: 'Universidad de Málaga', period: '2025–2026' },
  { id: 'cert-ingles', name: 'Certificado de Inglés B2', organization: 'Universidad de Cambridge', period: '2022' },
]
```

- [ ] **Step 3: `src/components/SectionTitle.tsx`**

```tsx
import type { ReactNode } from 'react'

/** Título de sección: solo el nombre, en la fuente pixel. */
export default function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="font-pixel text-[44px] leading-none text-ink">{children}</h2>
}
```

- [ ] **Step 4: `src/components/Chronology.tsx`**

```tsx
import type { ChronologyItem } from '../data/types'

/**
 * Lista cronológica: periodo a la izquierda, puesto y organización a la
 * derecha. Es el único sitio de la web con cifras destacadas, porque aquí
 * sí hay un orden. Lo que sigue en curso lleva el periodo en rojo.
 */
export default function Chronology({ items }: { items: ChronologyItem[] }) {
  return (
    <ol className="mt-8 border-t-2 border-ink">
      {items.map((item) => (
        <li
          key={item.id}
          className="grid gap-2 border-b border-ink/20 py-6 sm:grid-cols-[9rem_1fr] sm:gap-8"
        >
          <span className={`font-pixel text-[30px] leading-none ${item.current ? 'text-red' : 'text-ink'}`}>
            {item.period}
          </span>
          <div className="max-w-[65ch]">
            <h3 className="font-semibold">
              {item.role}
              <span className="font-normal text-ink-soft"> en {item.organization}</span>
            </h3>
            {item.description && <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.description}</p>}
          </div>
        </li>
      ))}
    </ol>
  )
}
```

- [ ] **Step 5: Reescribir `src/components/Experience.tsx`**

```tsx
import SectionTitle from './SectionTitle'
import Chronology from './Chronology'
import { experience } from '../data/portfolio'

export default function Experience() {
  return (
    <section id="experiencia" className="py-20 md:py-28">
      <div className="container-content">
        <SectionTitle>Experiencia</SectionTitle>
        <Chronology items={experience} />
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Reescribir `src/components/Education.tsx`**

```tsx
import SectionTitle from './SectionTitle'
import Chronology from './Chronology'
import { certifications, education } from '../data/portfolio'

export default function Education() {
  return (
    <section id="formacion" className="py-20 md:py-28">
      <div className="container-content">
        <SectionTitle>Formación</SectionTitle>
        <Chronology items={education} />
        <p className="mt-6 max-w-[65ch] text-sm text-ink-soft">
          También:{' '}
          {certifications.map((cert) => `${cert.name} (${cert.organization}, ${cert.period})`).join('; ')}.
        </p>
      </div>
    </section>
  )
}
```

- [ ] **Step 7: Enlace de la cabecera**

En `src/components/Header.tsx`, sustituir el elemento de `navLinks` de Estudios (con su comentario de dos líneas) por:

```ts
  { label: 'Formación', href: '#formacion' },
```

- [ ] **Step 8: Borrar lo que queda sin uso y desinstalar `motion`**

```bash
git rm src/components/EducationTimeline.tsx src/components/FlipCard.tsx src/components/FlipCard.css src/hooks/useNodeLineExtent.ts src/hooks/useStaggerReveal.ts
npm uninstall motion
```

Comprobar que no queda ningún uso: `grep -rn "ExpandableItem\|FlipCard\|EducationTimeline\|motion/react\|useStaggerReveal\|useNodeLineExtent" src` → sin resultados.

- [ ] **Step 9: Verificar**

Run: `npx tsc -b` → sin salida. Run: `npm run build` → "✓ built".
En el navegador, a 1280 px y a 375 px (recargando tras cambiar el tamaño):

```js
({
  rows: [...document.querySelectorAll('#experiencia li, #formacion li')].map(li => li.querySelector('h3').textContent),
  currentRed: getComputedStyle(document.querySelector('#experiencia li span')).color,
  certLine: document.querySelector('#formacion p:last-of-type').textContent,
  overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
})
```

Expected: `rows` empieza por "Desarrollador web en Bittacora" (puesto antes que empresa); `currentRed` es `rgb(224, 37, 27)`; `certLine` contiene "MOOC en Ciberseguridad (Universidad de Málaga, 2025–2026)"; `overflowX: false`. El enlace "Formación" de la cabecera lleva a la sección.

- [ ] **Step 10: Commit**

```bash
git add -A src package.json package-lock.json
git commit -m "$(cat <<'EOF'
feat: replace flip cards and timeline with a shared chronology

Experience and education become plain, scannable lists. Fixes role and
company being swapped in the data, and normalises periods to en dashes.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Stack en lugar de las carpetas de Skills

**Files:**
- Create: `src/components/Stack.tsx`
- Modify: `src/data/types.ts` (`Skill` → `StackGroup`), `src/data/portfolio.ts` (bloque `skills`)
- Modify: `src/App.tsx`, `src/components/Header.tsx`
- Delete: `src/components/Skills.tsx`, `src/components/FolderFloat.tsx`, `src/components/FolderFloat.css`

**Interfaces:**
- Consumes: `SectionTitle` (tarea 2).
- Produces: tipo `StackGroup { name: string; items: string[] }`; export `stack: StackGroup[]`; id de sección `stack` (antes `skills`).

- [ ] **Step 1: Tipo**

En `src/data/types.ts`, sustituir la interfaz `Skill` por:

```ts
/** Un grupo del Stack: su nombre y las tecnologías que incluye. */
export interface StackGroup {
  name: string
  items: string[]
}
```

- [ ] **Step 2: Datos**

En `src/data/portfolio.ts`: en el import, cambiar `Skill` por `StackGroup`, y sustituir el bloque `skills` (con su comentario) por:

```ts
/* ------------------------------------------------------------------ */
/* STACK                                                               */
/* ------------------------------------------------------------------ */
export const stack: StackGroup[] = [
  { name: 'Frontend', items: ['JavaScript', 'TypeScript', 'React'] },
  { name: 'Backend', items: ['PHP', 'Laravel', 'Node.js', 'Express', 'API REST'] },
  { name: 'Datos', items: ['SQL', 'MySQL', 'MariaDB'] },
  { name: 'Otros', items: ['Docker', 'UX/UI'] },
]
```

- [ ] **Step 3: `src/components/Stack.tsx`**

```tsx
import SectionTitle from './SectionTitle'
import { stack } from '../data/portfolio'

/** Todas las tecnologías a la vista, agrupadas. */
export default function Stack() {
  return (
    <section id="stack" className="py-20 md:py-28">
      <div className="container-content">
        <SectionTitle>Stack</SectionTitle>
        <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-10 border-t-2 border-ink pt-8 md:grid-cols-4">
          {stack.map((group) => (
            <div key={group.name}>
              <h3 className="font-pixel text-[30px] leading-none text-ink-soft">{group.name}</h3>
              <ul className="mt-3 space-y-1">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Usarlo**

En `src/App.tsx`: sustituir `import Skills from './components/Skills'` por `import Stack from './components/Stack'` y `<Skills />` por `<Stack />`.
En `src/components/Header.tsx`, sustituir `{ label: 'Skills', href: '#skills' },` por `{ label: 'Stack', href: '#stack' },`.

- [ ] **Step 5: Borrar y desinstalar**

```bash
git rm src/components/Skills.tsx src/components/FolderFloat.tsx src/components/FolderFloat.css
npm uninstall matter-js @types/matter-js
```

Comprobar: `grep -rn "FolderFloat\|matter-js\|Skill\b\|skills" src` → sin resultados.

- [ ] **Step 6: Verificar**

Run: `npx tsc -b` → sin salida. Run: `npm run build` → "✓ built".
En el navegador, a 1280 px y a 375 px:

```js
({
  groups: [...document.querySelectorAll('#stack h3')].map(h => h.textContent),
  items: document.querySelectorAll('#stack li').length,
  columns: getComputedStyle(document.querySelector('#stack h3').parentElement.parentElement).gridTemplateColumns.split(' ').length,
})
```

Expected: `groups` = `["Frontend","Backend","Datos","Otros"]`, `items: 13`, `columns` 4 a 1280 px y 2 a 375 px.

- [ ] **Step 7: Commit**

```bash
git add -A src package.json package-lock.json
git commit -m "$(cat <<'EOF'
feat: replace skill folders with a visible stack list

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Proyectos con capturas en tramado (Dither Veil)

**Files:**
- Create: `src/components/DitherVeil.tsx`, `src/components/DitherVeil.css` (descargados)
- Modify: `src/components/Projects.tsx` (reescritura), `src/data/types.ts` (`Project.image` obligatorio), `src/data/portfolio.ts` (errata), `src/components/img/*.webp` (redimensionar)
- Delete: `src/components/DepthCarousel.tsx`, `src/components/DepthCarousel.css`

**Interfaces:**
- Consumes: `SectionTitle` (tarea 2); `useMediaQuery(query: string): boolean` (existente en `src/hooks/useMediaQuery.ts`).
- Produces: `DitherVeil` (default export) con props `src`, `fit`, `wander`, entre otras (ver `DitherVeilProps` en el archivo descargado).

- [ ] **Step 1: Descargar Dither Veil e instalar `ogl`**

```bash
node -e "fetch('https://reactbits.dev/r/'+process.argv[1]+'-TS-CSS.json').then(r=>r.json()).then(j=>{for(const f of j.files){const n=f.path.split('/').pop();require('fs').writeFileSync('src/components/'+n,f.content.replace(/^'use client';\r?\n(\r?\n)?/,''));console.log('wrote',n)}})" DitherVeil
npm install ogl
```

Expected: "wrote DitherVeil.tsx" y "wrote DitherVeil.css". La primera línea de `DitherVeil.tsx` ya no es `'use client';`.

- [ ] **Step 2: Paleta del proyecto en los valores por defecto**

En `src/components/DitherVeil.tsx`, en la desestructuración de props, sustituir:
- `inkColor = '#120f17',` → `inkColor = '#1A1A1A',`
- `paperColor = '#f4f1ea',` → `paperColor = '#E8E6E1',`
- `rimColor = '#a78bfa',` → `rimColor = '#E0251B',`

Añadir, justo encima de `export interface DitherVeilProps`, el comentario de origen:

```ts
/**
 * Foto en tramado de 1 bit que el cursor "quema" hasta mostrarla a color.
 * Componente "Dither Veil" de React Bits (reactbits.dev), variante TS + CSS,
 * sin cambios de lógica; solo los colores por defecto, que son los del sitio.
 */
```

- [ ] **Step 3: Imágenes a 1400 px de ancho**

```bash
python - <<'EOF'
from PIL import Image
import glob
for path in sorted(glob.glob('src/components/img/*.webp')):
    image = Image.open(path)
    if image.width > 1400:
        height = round(image.height * 1400 / image.width)
        image.resize((1400, height), Image.LANCZOS).save(path, 'WEBP', quality=82, method=6)
    print(path, Image.open(path).size)
EOF
```

Expected: las cuatro imágenes con ancho 1400. `ls -la src/components/img` → `agrhound.webp` claramente por debajo de los 317 kB actuales.

- [ ] **Step 4: Tipo y errata**

En `src/data/types.ts`, en `Project`, sustituir el campo `image?` y su comentario por:

```ts
  /** Captura del proyecto (import de Vite). */
  image: string
```

En `src/data/portfolio.ts`, sustituir `stack: 'React + Typescript',` por `stack: 'React + TypeScript',`.

- [ ] **Step 5: Reescribir `src/components/Projects.tsx`**

```tsx
import SectionTitle from './SectionTitle'
import DitherVeil from './DitherVeil'
import useMediaQuery from '../hooks/useMediaQuery'
import { projects } from '../data/portfolio'

/**
 * Proyectos: el único color de la web aparte del rojo. Cada captura se ve en
 * tramado de 1 bit y el cursor la revela a color. En pantallas táctiles no hay
 * cursor, así que `wander` la va revelando sola. Con movimiento reducido se
 * muestra la captura normal: el proyecto tiene que verse siempre.
 */
export default function Projects() {
  const coarsePointer = useMediaQuery('(pointer: coarse)')
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  return (
    <section id="proyectos" className="py-20 md:py-28">
      <div className="container-content">
        <SectionTitle>Proyectos</SectionTitle>

        <ul className="mt-8 grid gap-8 md:grid-cols-2">
          {projects.map((project) => (
            <li key={project.id} className="flex flex-col border-2 border-ink">
              <div className="aspect-[16/9] border-b-2 border-ink">
                {reduceMotion ? (
                  <img
                    src={project.image}
                    alt={`Captura de ${project.title}`}
                    loading="lazy"
                    className="h-full w-full object-cover object-top"
                  />
                ) : (
                  <div role="img" aria-label={`Captura de ${project.title}`} className="h-full w-full">
                    <DitherVeil src={project.image} fit="cover" wander={coarsePointer} />
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-2 p-5">
                <h3 className="font-pixel text-[30px] leading-none">{project.title}</h3>
                <p className="text-sm text-ink-soft">{project.stack}</p>
                <p className="max-w-[65ch] text-sm leading-relaxed">{project.description}</p>
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex min-h-6 items-center gap-1 self-start pt-3 font-pixel text-[20px] leading-none underline decoration-2 underline-offset-4 hover:text-red"
                  >
                    Ver proyecto <span aria-hidden>↗</span>
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Borrar la pila 3D y sus dependencias**

```bash
git rm src/components/DepthCarousel.tsx src/components/DepthCarousel.css
npm uninstall gsap lucide-react
```

Comprobar: `grep -rn "DepthCarousel\|gsap\|lucide-react" src` → sin resultados.

- [ ] **Step 7: Verificar**

Run: `npx tsc -b` → sin salida. Run: `npm run build` → "✓ built".
En el navegador a 1280 px, con la sección Proyectos en pantalla:

```js
({
  canvases: document.querySelectorAll('#proyectos canvas').length,
  labels: [...document.querySelectorAll('#proyectos [role="img"]')].map(el => el.getAttribute('aria-label')),
  links: [...document.querySelectorAll('#proyectos a')].map(a => a.getBoundingClientRect().height >= 24),
  overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
})
```

Expected: `canvases: 4`; `labels` = `["Captura de A-Library","Captura de AGRHound","Captura de Greendrop","Captura de Stremio"]`; todos los `links` en `true`; `overflowX: false`. Mover el cursor sobre una captura la revela a color. A 375 px (recargando): una columna y sin `overflowX`. Sin errores de WebGL en consola.

- [ ] **Step 8: Commit**

```bash
git add -A src package.json package-lock.json
git commit -m "$(cat <<'EOF'
feat: show projects as dithered screenshots revealed by the cursor

Replaces the 3D depth carousel. Screenshots are resized to 1400px.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Hero sin foto, con el titular montándose en píxeles

**Files:**
- Create: `src/components/PixelSwap.tsx`, `src/components/PixelSwap.css` (descargados)
- Modify: `src/components/Hero.tsx` (reescritura), `src/data/portfolio.ts` (export `hero`)
- Delete: `src/hooks/useParallax.ts`

**Interfaces:**
- Produces: export `hero: { title: string; lead: string }` en `portfolio.ts`. `PixelSwap` (default export) con props `firstContent`, `secondContent`, `trigger: 'hover' | 'click' | 'manual'`, `active`, `pattern`, `aspectRatio`.

- [ ] **Step 1: Descargar Pixel Swap**

```bash
node -e "fetch('https://reactbits.dev/r/'+process.argv[1]+'-TS-CSS.json').then(r=>r.json()).then(j=>{for(const f of j.files){const n=f.path.split('/').pop();require('fs').writeFileSync('src/components/'+n,f.content.replace(/^'use client';\r?\n(\r?\n)?/,''));console.log('wrote',n)}})" PixelSwap
```

Expected: "wrote PixelSwap.tsx" y "wrote PixelSwap.css". Comprobar que `PixelSwap.tsx` importa su CSS; si no aparece `import './PixelSwap.css'`, añadirlo debajo del import de `react`. Añadir encima de `export type PixelSwapPattern` el comentario:

```ts
/**
 * Bloques de píxel que montan un contenido y lo sustituyen por otro.
 * Componente "Pixel Swap" de React Bits (reactbits.dev), variante TS + CSS,
 * sin cambios de lógica.
 */
```

- [ ] **Step 2: Texto del Hero en los datos**

Al principio de `src/data/portfolio.ts`, después de los imports:

```ts
/* ------------------------------------------------------------------ */
/* HERO                                                                */
/* ------------------------------------------------------------------ */
export const hero = {
  title: 'Desarrollador web',
  lead: 'Profesional multidisciplinar. Hago aplicaciones web con PHP, Laravel y React; ahora en Bittacora.',
}
```

- [ ] **Step 3: Reescribir `src/components/Hero.tsx`**

```tsx
import { useEffect, useState } from 'react'
import PixelSwap from './PixelSwap'
import { hero } from '../data/portfolio'

/** Tope de espera a la fuente: si tarda más, el titular se monta igual. */
const FONT_WAIT_MS = 1500

/**
 * Hero: el titular se monta en píxeles una sola vez, al entrar, y termina en
 * un cursor rojo.
 *
 * El montaje espera a que Jersey 10 esté cargada: si arrancara antes, los
 * píxeles construirían el titular en la fuente de reserva y luego saltaría a
 * la definitiva (fallo visto en la auditoría con Anton).
 *
 * El tamaño de letra va en unidades del contenedor (`cqw`) para que el
 * titular siempre quepa en la caja de proporción fija que exige Pixel Swap,
 * a cualquier ancho. El `<h1>` real es solo para lectores de pantalla; la
 * capa animada es decorativa.
 */
export default function Hero() {
  const [fontReady, setFontReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    const timeout = new Promise((resolve) => setTimeout(resolve, FONT_WAIT_MS))
    Promise.race([document.fonts.load('400 84px "Jersey 10"'), timeout]).finally(() => {
      if (!cancelled) setFontReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const [firstWord, ...restWords] = hero.title.split(' ')

  const visualTitle = (
    <span aria-hidden className="block font-pixel text-[14cqw] leading-[0.9] text-ink">
      {firstWord}
      <br />
      {restWords.join(' ')}
      <span className="ml-[0.08em] inline-block h-[0.75em] w-[0.22em] bg-red" />
    </span>
  )

  return (
    <section id="inicio" className="pb-16 pt-32 md:pb-24 md:pt-40">
      <div className="container-content">
        <h1 className="sr-only">{hero.title}</h1>
        <div className="w-full max-w-[600px] [container-type:inline-size]">
          <PixelSwap
            firstContent={null}
            secondContent={visualTitle}
            trigger="manual"
            active={fontReady}
            pattern="left-to-right"
            aspectRatio="100 / 30"
          />
        </div>
        <p className="mt-8 max-w-[45ch] text-lg leading-relaxed">{hero.lead}</p>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Borrar parallax y typewriter**

```bash
git rm src/hooks/useParallax.ts
npm uninstall react-simple-typewriter
```

Comprobar: `grep -rn "useParallax\|react-simple-typewriter\|perfil.jpg" src` → sin resultados (`public/perfil.jpg` se queda: lo usan las metaetiquetas Open Graph de `index.html`).

- [ ] **Step 5: Verificar**

Run: `npx tsc -b` → sin salida. Run: `npm run build` → "✓ built".
En el navegador, a 375, 768, 1024 y 1280 px (recargando en cada uno), esperar 2,5 s y ejecutar:

```js
const box = document.querySelector('#inicio .pixel-swap').getBoundingClientRect();
const title = document.querySelector('#inicio .pixel-swap span.font-pixel');
const t = title.getBoundingClientRect();
({
  h1: document.querySelector('h1').textContent,
  active: document.querySelector('#inicio .pixel-swap').dataset.active,
  fits: t.right <= box.right + 1 && t.bottom <= box.bottom + 1,
  font: getComputedStyle(title).fontFamily,
  overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
})
```

Expected en los cuatro anchos: `h1: "Desarrollador web"`, `active: "true"`, `fits: true`, `font` empieza por `"Jersey 10"`, `overflowX: false`. Al recargar, el titular aparece montándose de izquierda a derecha ya en Jersey 10 (sin salto de fuente) y termina con el bloque rojo.

- [ ] **Step 6: Commit**

```bash
git add -A src package.json package-lock.json
git commit -m "$(cat <<'EOF'
feat: rebuild the hero around a pixel-assembled headline

Drops the photo, typewriter and parallax. The headline waits for the
pixel font before assembling, so it never swaps font mid-animation.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Contacto con estética pixel y Lattice Loader

**Files:**
- Create: `src/components/LatticeLoader.tsx`, `src/components/LatticeLoader.css` (descargados)
- Modify: `src/components/Contact.tsx` (ediciones puntuales)
- Delete: `src/components/SectionHeading.tsx`, `src/hooks/useLineReveal.ts`

**Interfaces:**
- Consumes: `SectionTitle` (tarea 2).
- Produces: `LatticeLoader` (default export) con props `label`, `status: 'working' | 'done' | 'error'`, `grid: 3 | 4`, `shape: 'square' | 'round'`.

- [ ] **Step 1: Descargar Lattice Loader**

```bash
node -e "fetch('https://reactbits.dev/r/'+process.argv[1]+'-TS-CSS.json').then(r=>r.json()).then(j=>{for(const f of j.files){const n=f.path.split('/').pop();require('fs').writeFileSync('src/components/'+n,f.content.replace(/^'use client';\r?\n(\r?\n)?/,''));console.log('wrote',n)}})" LatticeLoader
```

Expected: "wrote LatticeLoader.tsx" y "wrote LatticeLoader.css". Añadir encima de `export type LatticeStatus` el comentario:

```ts
/**
 * Rejilla de celdas que se iluminan en ola mientras dura una tarea.
 * Componente "Lattice Loader" de React Bits (reactbits.dev), variante TS + CSS,
 * sin cambios de lógica.
 */
```

- [ ] **Step 2: Título de sección**

En `src/components/Contact.tsx`: sustituir `import SectionHeading from './SectionHeading'` por `import SectionTitle from './SectionTitle'` y añadir debajo `import LatticeLoader from './LatticeLoader'`. Sustituir `<SectionHeading index="005" title="Contacto" />` por `<SectionTitle>Contacto</SectionTitle>`.

- [ ] **Step 3: Campos**

Sustituir el bloque de comentario que precede a `const inputClass` (el que explica el anillo de foco; el foco ahora es global en `index.css`) y la propia constante por:

```ts
  const inputClass =
    'w-full border-2 border-ink bg-paper px-3 py-2 text-base text-ink placeholder:text-ink-soft disabled:opacity-50'
```

En las tres etiquetas (`htmlFor="nombre"`, `"email"`, `"mensaje"`), sustituir `className="text-xs uppercase tracking-wider text-ink-soft"` por `className="text-sm font-semibold text-ink"`.

En el párrafo de estado, sustituir `'text-red-700'` por `'text-red'`.

- [ ] **Step 4: Botón y estado de envío**

Sustituir:

```tsx
            <button
              type="submit"
              disabled={sending}
              className="pill self-start disabled:opacity-50"
            >
              {sending ? 'Enviando…' : 'Enviar'}
            </button>
```

por:

```tsx
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={sending}
                className="bg-ink px-5 py-3 font-pixel text-[20px] leading-none text-paper shadow-[4px_4px_0_0_theme(colors.red.DEFAULT)] transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_theme(colors.red.DEFAULT)] disabled:opacity-50"
              >
                Enviar mensaje
              </button>
              {sending && <LatticeLoader label="Enviando" status="working" grid={3} shape="square" />}
            </div>
```

- [ ] **Step 5: Borrar el encabezado antiguo y anime.js**

```bash
git rm src/components/SectionHeading.tsx src/hooks/useLineReveal.ts
npm uninstall animejs
```

Comprobar: `grep -rn "SectionHeading\|useLineReveal\|animejs" src` → sin resultados.

- [ ] **Step 6: Verificar**

Run: `npx tsc -b` → sin salida. Run: `npm run build` → "✓ built".
En el navegador, en Contacto:
1. Pulsar "Enviar mensaje" con los campos vacíos → aparece "Por favor, completa todos los campos." en rojo y el foco va al campo Nombre, con anillo rojo.
2. Rellenar los tres campos con un email válido y pulsar "Enviar mensaje". Con credenciales de EmailJS en `.env.local`: durante el envío aparece la rejilla 3×3 con "Enviando" junto al botón y desaparece al terminar. Sin credenciales: aparece el aviso "El envío no está configurado…" (la rejilla no llega a mostrarse; es lo esperado, porque el envío no empieza).
3. El botón muestra la sombra roja desplazada y se ve con la fuente pixel.

- [ ] **Step 7: Commit**

```bash
git add -A src package.json package-lock.json
git commit -m "$(cat <<'EOF'
feat: restyle the contact form and show a lattice loader while sending

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Cabecera, footer, orden de secciones y sección activa

**Files:**
- Modify: `src/data/sections.ts`, `src/hooks/useActiveSection.ts`, `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/App.tsx` (reescrituras)

**Interfaces:**
- Produces: `SECTIONS: readonly { id: string; label: string }[]`, `SECTION_IDS: readonly string[]` (incluye `'inicio'` al principio). `useActiveSection(ids: readonly string[]): string | undefined`.

- [ ] **Step 1: `src/data/sections.ts`**

```ts
/** Enlaces de la navegación, en el orden de la página. */
export const SECTIONS = [
  { id: 'experiencia', label: 'Experiencia' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'stack', label: 'Stack' },
  { id: 'contacto', label: 'Contacto' },
] as const

/**
 * Secciones que observa `useActiveSection`. Incluye el Hero para saber cuándo
 * no hay que marcar ningún enlace (al volver arriba del todo).
 */
export const SECTION_IDS = ['inicio', 'experiencia', 'proyectos', 'stack', 'formacion', 'contacto'] as const
```

- [ ] **Step 2: `src/hooks/useActiveSection.ts`**

```ts
import { useEffect, useState } from 'react'

/**
 * Id de la sección cuya franja central cruza el centro del viewport
 * (patrón scrollspy). `undefined` hasta que alguna lo cruce. `ids` tiene que
 * ser estable (una constante de módulo).
 */
export default function useActiveSection(ids: readonly string[]) {
  const [activeId, setActiveId] = useState<string>()

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible.length > 0) setActiveId(visible[visible.length - 1].target.id)
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  return activeId
}
```

- [ ] **Step 3: Reescribir `src/components/Header.tsx`**

```tsx
import { useEffect, useRef, useState } from 'react'
import useActiveSection from '../hooks/useActiveSection'
import { SECTIONS, SECTION_IDS } from '../data/sections'

/** Cabecera fija. La sección visible se marca con un subrayado rojo. */
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const activeId = useActiveSection(SECTION_IDS)

  // Escape cierra el menú y devuelve el foco al botón que lo abrió.
  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setMenuOpen(false)
      toggleRef.current?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  const linkClass = (id: string) =>
    `inline-flex min-h-6 items-center font-pixel text-[20px] leading-none text-ink ${
      activeId === id ? 'shadow-[inset_0_-3px_0_0_theme(colors.red.DEFAULT)]' : 'hover:text-ink-soft'
    }`

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b-2 border-ink bg-paper">
      <div className="container-content flex h-16 items-center justify-between">
        <a href="#inicio" className="font-pixel text-[30px] leading-none text-ink">
          Carlos
        </a>

        <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              aria-current={activeId === section.id ? 'location' : undefined}
              className={linkClass(section.id)}
            >
              {section.label}
            </a>
          ))}
        </nav>

        <button
          ref={toggleRef}
          type="button"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          aria-controls="menu-movil"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span className={`block h-0.5 w-6 bg-ink transition-transform ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block h-0.5 w-6 bg-ink transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-6 bg-ink transition-transform ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </div>

      {/* `invisible` al cerrar saca los enlaces del orden de tabulación. */}
      <div
        id="menu-movil"
        className={`overflow-hidden border-t-2 border-ink bg-paper transition-[max-height,visibility] md:hidden ${
          menuOpen ? 'visible max-h-96' : 'invisible max-h-0 border-t-0'
        }`}
      >
        <nav aria-label="Principal (móvil)" className="container-content flex flex-col gap-3 py-4">
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={() => setMenuOpen(false)}
              aria-current={activeId === section.id ? 'location' : undefined}
              className={`self-start ${linkClass(section.id)}`}
            >
              {section.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
```

- [ ] **Step 4: Reescribir `src/components/Footer.tsx`**

```tsx
const socials = [
  { label: 'GitHub', href: 'https://github.com/DDevjourney' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/cdsp/' },
  { label: 'Email', href: 'mailto:carlosdsp2308@gmail.com' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t-2 border-ink py-10">
      <div className="container-content flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <a href="#inicio" className="font-pixel text-[30px] leading-none text-ink">
          Carlos
        </a>

        <nav aria-label="Redes sociales" className="flex flex-wrap gap-6">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              // py-2 lleva el objetivo táctil por encima de 24 px (WCAG 2.5.8);
              // -my-2 recupera el hueco para no descuadrar la fila.
              className="-my-2 py-2 font-pixel text-[20px] leading-none text-ink hover:text-ink-soft"
            >
              {social.label}
            </a>
          ))}
        </nav>

        <p className="text-sm text-ink-soft">© {year} Carlos</p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 5: Reescribir `src/App.tsx`**

```tsx
import Header from './components/Header'
import Hero from './components/Hero'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Stack from './components/Stack'
import Education from './components/Education'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      {/* Skip link: invisible hasta recibir el foco. `tabIndex={-1}` en <main>
          hace que el salto mueva también el foco, no solo el scroll. */}
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-4 focus:z-[60] focus:border-2 focus:border-ink focus:bg-paper focus:px-5 focus:py-2 focus:font-pixel focus:text-[20px] focus:text-ink"
      >
        Saltar al contenido
      </a>

      <Header />
      <main id="contenido" tabIndex={-1} className="focus:outline-none">
        <Hero />
        <Experience />
        <Projects />
        <Stack />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 6: Verificar**

Run: `npx tsc -b` → sin salida. Run: `npm run build` → "✓ built".
En el navegador a 1280 px, hacer clic en "Proyectos" de la cabecera, esperar 1 s y ejecutar:

```js
({
  order: [...document.querySelectorAll('main > section')].map(s => s.id),
  current: document.querySelector('header a[aria-current]')?.textContent,
  brand: document.querySelector('header a').textContent,
})
```

Expected: `order` = `["inicio","experiencia","proyectos","stack","formacion","contacto"]`, `current: "Proyectos"`, `brand: "Carlos"`. Volver arriba del todo: ningún enlace con `aria-current`. A 375 px: el menú hamburguesa abre, cierra con Escape y devuelve el foco al botón.

- [ ] **Step 7: Commit**

```bash
git add -A src
git commit -m "$(cat <<'EOF'
feat: reorder sections and mark the active one in the header

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: Limpieza de tokens y fuentes, README y verificación final

**Files:**
- Modify: `tailwind.config.js`, `src/index.css`, `index.html`, `README.md`

- [ ] **Step 1: Comprobar que los tokens antiguos ya no se usan**

Run: `grep -rnE "font-display|font-archivo|paper-light|ink-faint|ease-expo|\bpill\b|hairline|uppercase tracking|text-justify" src`
Expected: sin resultados. Si aparece alguno, sustituirlo por su equivalente nuevo (`font-pixel`, `font-body`, `paper`, `ink-soft`) antes de seguir.

- [ ] **Step 2: Quitar los tokens antiguos**

En `tailwind.config.js`: borrar `'paper-light'`, `'ink-faint'` (con su comentario), `display`, `archivo` (con su comentario) y el bloque `transitionTimingFunction` entero.
En `src/index.css`: borrar la regla `.font-display` (con su comentario) y las reglas `.pill` y `.hairline` (con su comentario).

- [ ] **Step 3: Fuentes finales en `index.html`**

Sustituir el comentario y el `<link>` de Google Fonts por:

```html
    <!-- Google Fonts: Jersey 10 (titulares pixel) y Archivo (texto) -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600&family=Jersey+10&display=swap"
      rel="stylesheet"
    />
```

- [ ] **Step 4: README**

En `README.md`:

1. Sustituir el párrafo introductorio (debajo del título) por:
   `Portfolio personal de desarrollador web, construido como SPA con **React + TypeScript + Vite** y estilado con **Tailwind CSS**. Identidad "pantalla de 1 bit": papel y tinta, titulares en Jersey 10 y un rojo puntual. Solo hay dos momentos con movimiento: el titular del Hero se monta en píxeles y las capturas de proyectos se revelan a color bajo el cursor.`
2. Sustituir la tabla de la sección **Stack** por:

| Pieza | Qué hace |
| --- | --- |
| React 18 + TypeScript | Componentes de la UI, tipados en `src/data/types.ts` |
| Vite 5 | Servidor de desarrollo y build de producción |
| Tailwind CSS 3 | Estilos por utilidades; paleta y fuentes en `tailwind.config.js` |
| ogl | WebGL ligero para el tramado de las capturas (Dither Veil) |
| EmailJS | Envío del formulario de contacto desde el navegador |
| gh-pages | Despliegue del directorio `dist/` |

3. Sustituir el bloque de código de la sección **Estructura** por:

```
src/
├── main.tsx                 Punto de entrada
├── App.tsx                  Orden de las secciones y skip link
├── index.css                Base global: foco, scroll, contenedor
├── hooks/
│   ├── useActiveSection.ts  Sección visible, para marcarla en la cabecera
│   └── useMediaQuery.ts     Puntero táctil y movimiento reducido
├── data/
│   ├── types.ts             ChronologyItem, Certification, StackGroup, Project
│   ├── sections.ts          Enlaces de la navegación
│   └── portfolio.ts         TODO el contenido editable
└── components/
    ├── Header.tsx / Footer.tsx
    ├── Hero.tsx             Titular montado con PixelSwap
    ├── Experience.tsx       Cronología de trabajos
    ├── Projects.tsx         Capturas con DitherVeil
    ├── Stack.tsx            Grupos de tecnologías
    ├── Education.tsx        Cronología de formación + cursos
    ├── Contact.tsx          Formulario EmailJS con LatticeLoader
    ├── SectionTitle.tsx / Chronology.tsx
    └── PixelSwap / DitherVeil / LatticeLoader   (React Bits, TS + CSS)
```

4. En **Editar el contenido**, sustituir la lista de arrays por: `hero` (titular y entradilla), `experience` y `education` (`ChronologyItem`: periodo, puesto, organización, descripción y `current` para lo que sigue en curso), `certifications`, `stack` (grupos con sus tecnologías) y `projects` (con su captura importada desde `src/components/img/`).
5. Borrar las secciones **Accesibilidad**, **Experiencia de scroll y animaciones** y **Decisiones de implementación** y sustituirlas por una sola sección:

```markdown
## Decisiones de implementación

- **El titular espera a la fuente.** `Hero.tsx` no arranca el montaje en píxeles hasta que Jersey 10 ha cargado (con un tope de 1,5 s): si no, se montaría en la fuente de reserva y saltaría a la definitiva.
- **El titular se mide en `cqw`.** Pixel Swap exige una caja de proporción fija; con el tamaño de letra en unidades del contenedor, el titular cabe a cualquier ancho.
- **Capturas en móvil y con movimiento reducido.** En pantallas táctiles Dither Veil usa `wander` y se revela solo; con `prefers-reduced-motion` se muestra la captura normal en un `<img>`.
- **Foco global.** `index.css` define un único `:focus-visible` rojo para todo lo interactivo.
- **Rojo con medida.** Solo marca lo actual o interactivo: cursor del titular, periodo en curso, sección activa, sombra del botón y foco. Da 4,8:1 sobre el papel.
```

- [ ] **Step 5: Verificación final**

Run: `npx tsc -b` → sin salida.
Run: `npm run build` → "✓ built"; anotar el tamaño de `dist/assets/index-*.js`. Expected: claramente por debajo de los 555 kB de antes (objetivo orientativo < 300 kB sin comprimir).
Run: `grep -E '"(animejs|gsap|motion|lenis|matter-js|lucide-react|react-simple-typewriter|embla)' package.json` → sin resultados.

En el navegador, a 375, 768, 1024 y 1280 px (recargando en cada uno):

```js
await new Promise(r => setTimeout(r, 2500));
({
  overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  fonts: [...new Set([...document.querySelectorAll('h1,h2,h3,p,a,button,li')].map(el => getComputedStyle(el).fontFamily.split(',')[0]))],
  smallTargets: [...document.querySelectorAll('a,button')].filter(el => { const r = el.getBoundingClientRect(); return r.width > 0 && (r.height < 24 || r.width < 24) && !el.classList.contains('sr-only'); }).map(el => el.textContent.trim()),
})
```

Expected en los cuatro: `overflowX: false`; `fonts` solo contiene `"Jersey 10"` y `Archivo`; `smallTargets` vacío. Recorrer la página entera con Tab: todo lo interactivo muestra el anillo rojo y nada queda oculto bajo la cabecera. Consola sin errores.

- [ ] **Step 6: Commit**

```bash
git add tailwind.config.js src/index.css index.html README.md
git commit -m "$(cat <<'EOF'
chore: remove legacy tokens and fonts, document the pixel-art identity

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```
