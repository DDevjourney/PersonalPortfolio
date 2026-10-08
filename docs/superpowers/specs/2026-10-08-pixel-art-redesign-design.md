# Rediseño pixel art: "pantalla de 1 bit"

## Contexto y objetivo

El portfolio (`src/`) acumulaba cuatro "momentos" que competían entre sí (typewriter, carpetas con física, pila 3D, fichas giratorias), cuatro motores de animación y contenido escondido detrás de clics. La auditoría del 2026-10-08 concluyó que era un escaparate de componentes, no una identidad.

**Para quién:** empresas que contratan (recruiters y equipos técnicos). Escanean rápido; todo el contenido tiene que estar a la vista.

**Idea:** la web como la pantalla de una consola de 1 bit (Playdate, primer Macintosh). Papel y tinta, que ya eran la paleta, pasan a ser los dos "colores" de la pantalla. Solo hay dos momentos con movimiento y ambos con sentido: el titular del Hero se monta en píxeles al entrar, y las capturas de proyectos se ven en tramado de 1 bit hasta que el cursor las "quema" a color. Un rojo puntual marca lo actual y lo interactivo.

Decisiones tomadas con el usuario (bocetos en `.superpowers/brainstorm/`): dirección A "Pantalla 1 bit"; sin foto; titular que se monta en píxeles; Jersey 10 para titulares; paleta 1 bit + rojo; nombre "Carlos" a secas; orden de secciones de abajo.

## 1. Identidad

### Color (`tailwind.config.js`)

| Token | Valor | Uso |
| --- | --- | --- |
| `paper` | `#E8E6E1` | Fondo de todo. |
| `ink` | `#1A1A1A` | Texto, bordes, superficies sólidas. |
| `ink-soft` | `#65625C` | Texto secundario (4,87:1 sobre papel). |
| `red` | `#E0251B` | Solo: cursor del titular, periodo actual ("2026–hoy"), subrayado de la sección activa en la navegación, sombra del botón de envío y anillo de foco. 4,8:1 sobre papel. |

Se eliminan `paper-light` e `ink-faint`. No hay degradados ni sombras difusas: las sombras, si existen, son bloques sólidos desplazados (estilo píxel), como la del botón.

### Tipografía

- **Jersey 10** (Google Fonts, un solo peso) para titulares, nombres de proyecto, años de la cronología, navegación y botones. Tamaños de la escala: 20 / 30 / 44 / 84 px (titular del Hero en escritorio; 56 px en móvil).
- **Archivo** 400 y 600 para el texto corrido. Línea máxima de unos 70 caracteres (`max-w-[65ch]`); sin `text-justify`.
- Se eliminan Anton e Inter. Para que el titular no salte de fuente al entrar (fallo de la auditoría), el montaje en píxeles del Hero espera a que Jersey 10 esté cargada (`document.fonts.load`, con un tope de 1,5 s). Es más fiable que un `preload`, porque Google Fonts no da una URL estable del archivo de fuente.
- Sin etiquetas en mayúsculas espaciadas (`uppercase tracking-wider`) ni puntos medios como separador decorativo en texto visible.

### Forma

Bordes de 2 px en `ink`, esquinas rectas (`border-radius: 0`) en todo: es una pantalla de píxeles. Los separadores internos de las listas, 1 px en `ink` al 20 %.

## 2. Estructura de la página

Orden nuevo, de lo que más pesa para quien contrata a lo que menos:

1. **Cabecera:** "Carlos" a la izquierda; enlaces Experiencia, Proyectos, Stack, Contacto. La sección visible se marca con un subrayado rojo de 3 px (reutiliza `useActiveSection`). Menú hamburguesa en móvil como ahora.
2. **Hero** (`#inicio`).
3. **Experiencia** (`#experiencia`).
4. **Proyectos** (`#proyectos`).
5. **Stack** (`#stack`, sustituye a `#skills`).
6. **Formación** (`#formacion`, sustituye a `#estudios`).
7. **Contacto** (`#contacto`).
8. **Footer:** como ahora, con las fuentes nuevas.

El encabezado de cada sección es solo el título en Jersey 10 (componente `SectionTitle`). Sin numeración, sin reveal.

### Hero

- Titular "Desarrollador web" en Jersey 10, 84 px, terminado en un bloque rojo de cursor.
- **Pixel Swap** en modo `trigger="manual"`: `firstContent` vacío (papel), `secondContent` el titular; `active` pasa a `true` al montar, una sola vez. El componente exige `aspectRatio`; se fija por breakpoint para que el titular quepa sin desbordar (comprobar a 375, 768, 1024 y 1280 px; el fallo de la auditoría era el titular pisando la foto a 1024 px).
- El titular real es un `<h1>` siempre presente para lectores de pantalla y buscadores; la animación es solo visual (`aria-hidden` en la capa de píxeles).
- Debajo: "Profesional multidisciplinar. Hago aplicaciones web con PHP, Laravel y React; ahora en Bittacora." (texto editable en `portfolio.ts`).
- Con `prefers-reduced-motion: reduce`, Pixel Swap ya muestra el estado final (comportamiento del componente).

### Experiencia y Formación: `Chronology`

Un único componente para las dos secciones: filas con el periodo a la izquierda (Jersey 10) y a la derecha puesto/titulación en negrita, organización y descripción. La fila con `current: true` lleva el periodo en rojo. Formación añade debajo una línea de texto con los cursos complementarios (MOOC Ciberseguridad, Inglés B2). Todo visible, sin interacción. En móvil, el periodo pasa encima del texto.

### Proyectos

- Rejilla de 2 columnas (1 en móvil). Cada proyecto: captura, nombre en Jersey 10, stack y descripción, enlace "Ver proyecto ↗" (la flecha se mantiene: avisa de que abre otra pestaña).
- Captura con **Dither Veil** (`ogl`): tramado de 1 bit en `ink`/`paper` que el cursor revela a color. En dispositivos táctiles (`(pointer: coarse)`) se activa `wander`, que revela la imagen sola sin cursor.
- El canvas lleva `role="img"` y `aria-label` con el nombre del proyecto.
- Con `prefers-reduced-motion: reduce` se muestra la captura a color en un `<img>` normal, sin canvas: el proyecto tiene que verse sí o sí.
- Imágenes redimensionadas a 1400 px de ancho (ahora ~1900 px; `agrhound.webp` pesa 317 kB).

### Stack

Cuatro columnas (2 en móvil), cada una con el nombre del grupo en Jersey 10 y la lista de tecnologías en Archivo: Frontend (JavaScript, TypeScript, React), Backend (PHP, Laravel, Node.js, Express, API REST), Datos (SQL, MySQL, MariaDB), Otros (Docker, UX/UI). Sin interacción.

### Contacto

Formulario actual (validación, honeypot, EmailJS, `aria-live`) con la estética nueva: campos con borde de 2 px, botón "Enviar mensaje" en tinta con sombra roja desplazada 4 px. Mientras envía, **Lattice Loader** (3×3, sin dependencias) junto al botón en lugar de "Enviando…". Las etiquetas de los campos dejan de ir en mayúsculas.

## 3. Componentes y archivos

**Nuevos** (adaptados de React Bits a TypeScript + CSS, paleta del proyecto, sin `'use client'`, mismo criterio que las integraciones anteriores):
- `src/components/PixelSwap.tsx` + `.css`
- `src/components/DitherVeil.tsx` + `.css`
- `src/components/LatticeLoader.tsx` + `.css`
- `src/components/Chronology.tsx`
- `src/components/Stack.tsx` (sustituye a `Skills.tsx`)
- `src/components/SectionTitle.tsx` (sustituye a `SectionHeading.tsx`)

**Reescritos:** `Hero.tsx`, `Experience.tsx`, `Education.tsx`, `Projects.tsx`, `Contact.tsx`, `Header.tsx`, `Footer.tsx`, `App.tsx`, `index.css`, `tailwind.config.js`, `index.html` (fuentes, `theme-color` sin cambios).

**Eliminados:** `FolderFloat`, `DepthCarousel`, `FlipCard`, `EducationTimeline`, `ScrollProgressRail`, `SectionIndexBadge`, `SectionHeading`, `Skills`; hooks `useSmoothScroll`, `useLineReveal`, `useStaggerReveal`, `useParallax`, `useScrollProgress`, `useNodeLineExtent`. Se conservan `useActiveSection` y `useMediaQuery`. `src/data/sections.ts` se actualiza con los ids nuevos.

**Dependencias:** se añade `ogl`. Se quitan `animejs`, `matter-js`, `@types/matter-js`, `gsap`, `motion`, `react-simple-typewriter`, `lenis` y `lucide-react` (solo lo usaban las flechas de los carruseles). Se mantiene `@emailjs/browser`.

**Scroll:** sin Lenis, scroll nativo. `scroll-margin-top` en `[id]` (ya existe en `index.css`) compensa la cabecera fija; `scroll-behavior: smooth` solo con `prefers-reduced-motion: no-preference`.

## 4. Datos (`src/data/`)

- `types.ts`: `ExpandableItem` se sustituye por `ChronologyItem { id, period, role, organization, description?, current? }`. Experiencia usa `role` = puesto y `organization` = empresa (hoy están invertidos respecto al tipo, origen del `aria-label` erróneo).
- `Skill` pasa a `StackGroup { name, items: string[] }`.
- `Project` mantiene sus campos (`image` pasa a obligatorio: todos los proyectos tienen captura).
- Periodos con raya corta y sin espacios: "2026–hoy", "2023–2025".
- Erratas: "React + TypeScript", "sistemas, el análisis".
- Texto del Hero en `portfolio.ts` (`hero.lead`).

## 5. Accesibilidad y calidad

- Foco visible en todo lo interactivo: `outline: 2px solid` rojo con `outline-offset: 2px` (`:focus-visible`), definido una vez en `index.css`.
- Objetivos táctiles de al menos 24×24 px (enlaces de la navegación, del footer y "Ver proyecto").
- Skip link, `lang="es"`, metadatos y JSON-LD se mantienen; el JSON-LD y las descripciones no cambian.
- `prefers-reduced-motion`: titular ya montado, capturas a color en `<img>`, sin `wander`, sin scroll suave.
- Contraste AA en todo el texto (rojo 4,8:1, `ink-soft` 4,87:1 sobre papel).

## 6. Verificación

- `npx tsc -b` y `npm run build` sin errores. El bundle de JS tiene que bajar respecto a los 555 kB actuales (objetivo orientativo: menos de 300 kB sin comprimir).
- En el navegador, a 375, 768, 1024 y 1280 px: sin scroll horizontal, el titular del Hero sin desbordar, texto de las tarjetas de proyecto sin cortarse.
- Dither Veil: revela con el cursor en escritorio; con `wander` en táctil; `<img>` a color con movimiento reducido.
- Navegación por teclado completa con foco visible; formulario con Lattice Loader durante el envío.
- Sin errores en consola.

## Fuera de alcance

- Foto o avatar pixel art.
- Modo oscuro.
- Descarga de CV (se puede añadir después como enlace en Contacto).
- Cambios en SEO/metadatos más allá de las fuentes.
