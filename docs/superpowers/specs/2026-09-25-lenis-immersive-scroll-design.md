# Experiencia inmersiva de scroll: reveal, raíl de progreso, parallax e índice

## Contexto

El proyecto ya usa Lenis (`src/hooks/useSmoothScroll.ts`) solo para scroll suave y anclas del header, y `animejs` (`src/components/Hero.tsx`) para el reveal letra a letra del titular del Hero. El resto de secciones (`SectionHeading.tsx` y sus 6 usos) no tenían ninguna animación de entrada, y no existía ningún indicador de progreso de scroll.

Lista más amplia de ideas para hacer el scroll más inmersivo (ver conversación previa):

1. Reveal por scroll en los títulos de sección. **(fase 1, implementado)**
2. Raíl vertical de progreso de scroll. **(fase 1, implementado)**
3. Parallax sutil en la foto del Hero. **(fase 2)**
6. Índice de sección fijo tipo brújula editorial. **(fase 2)**

Deliberadamente fuera de scope: pin/scrub en `ExpandableCards` y transiciones de sección con `clip-path` (ideas 4 y 5). Se abordarán en fases posteriores si se decide seguir.

## 1. Reveal de títulos de sección (line-mask)

**Objetivo:** cuando una sección entra en el viewport, su cabecera `(00X) TÍTULO` sube desde abajo como un bloque único recortado, en vez de aparecer de golpe. Mismo lenguaje visual que el Hero (easing `out(4)`, técnica de `clip-path: inset()` + `translateY`), pero como una sola línea, no letra por letra, para no repetir literalmente el momento del Hero seis veces.

**Hook: `useLineReveal<T extends HTMLElement>()`**
- Devuelve un `ref` a adjuntar al contenedor a animar.
- Internamente usa `IntersectionObserver` (`threshold: 0.2`) sobre ese nodo.
- Al observar `isIntersecting` por primera vez:
  - Si `prefers-reduced-motion: reduce` está activo, no anima nada (el contenido ya es visible por CSS, sin `translateY` inicial).
  - Si no, dispara `animate()` de `animejs` sobre el nodo: `translateY: ['100%', '0%']`, `ease: 'out(4)'`, `duration: 700ms` (mismo rango que el Hero), con el nodo envuelto en un `clip-path: inset(0 -100vw 0 -100vw)` fijo (recorta solo eje Y, igual que en `Hero.tsx`).
  - Tras la primera animación, `observer.disconnect()` — no se repite.
- Estado inicial (antes de que el observer dispare): el nodo arranca con `translateY: 100%` fijado vía `utils.set` de animejs, igual que hace `Hero.tsx`, para evitar flash de contenido en su posición final.

**Cambios en `SectionHeading.tsx`:**
- El `<div className="flex flex-wrap ...">` raíz pasa a llevar el `ref` de `useLineReveal` y la clase de `clip-path`.
- Sin cambios en las props públicas del componente ni en sus 6 usos (`Skills`, `Projects`, `Experience`, `Education`, `Services`, `Contact` lo usan tal cual).

**Nota de accesibilidad:** igual que el Hero, si el usuario tiene `prefers-reduced-motion`, no hay ninguna animación — el título es visible de inmediato.

## 2. Raíl vertical de progreso de scroll

**Objetivo:** una línea vertical fina y fija, en el margen izquierdo del viewport, que se rellena de arriba hacia abajo según el progreso de scroll de la página. Refuerza la estética editorial (regla de cuaderno) sin añadir un elemento "de producto" genérico como una barra horizontal arriba.

**Hook: `useScrollProgress()`**
- Devuelve un `number` entre 0 y 1.
- Internamente, un `requestAnimationFrame` loop calcula `window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)` en cada frame y actualiza el estado.
- No depende de la instancia interna de Lenis: como Lenis (en su modo por defecto, sin wrapper/content) anima directamente el scroll nativo de la ventana, leer `window.scrollY` da un valor ya sincronizado con el movimiento suavizado. Esto evita acoplar este hook a los detalles internos de `useSmoothScroll`.
- Cleanup: cancela el `requestAnimationFrame` al desmontar.

**Componente: `ScrollProgressRail.tsx`**
- `position: fixed`, alineado al borde izquierdo del viewport con el mismo offset que los gutters de `.container-content` (`left-6 md:left-10 lg:left-16`), ocupando toda la altura del viewport (`top-0 h-screen`).
- Track: línea de 1px, `bg-ink/15` (mismo tono que `.hairline`), altura completa.
- Relleno: `bg-ink`, ancho igual al track, `height: ${progress * 100}%`, creciendo desde arriba (`top: 0`).
- La animación del relleno es puramente por interpolación de un valor de React en cada frame (no hay "salto" ni pasos discretos), así que se ve suave de forma nativa sin necesitar `transition` CSS ni gating por `prefers-reduced-motion`: es un indicador informativo continuo, no una animación de entrada/decorativa, así que se comporta igual con o sin esa preferencia.
- **Responsive:** oculto por defecto (`hidden md:block`) — en móvil el margen de 24px es demasiado estrecho para un elemento decorativo sin competir con el contenido.
- Se monta una única vez en `App.tsx`, como hermano de `Header`.

## 3. Parallax sutil en la foto del Hero

**Objetivo:** la foto circular del Hero se desplaza ligeramente hacia abajo (respecto al resto del contenido, que sube 1:1 con el scroll) a medida que el usuario baja, dando sensación de profundidad sin ser vistoso. Tope de 20px de desplazamiento total.

**Hook: `useParallax(factor = 0.05, maxOffset = 20)`**
- Devuelve un `number`: el offset actual en px.
- Bucle `requestAnimationFrame` (mismo patrón que `useScrollProgress`) que calcula `Math.min(window.scrollY * factor, maxOffset)`.
- Si `prefers-reduced-motion: reduce` está activo, devuelve siempre `0` y no arranca el loop — a diferencia del raíl de progreso, este es un movimiento decorativo continuo, no informativo, así que sí se gatea.

**Cambios en `Hero.tsx`:**
- El contenedor de la foto circular aplica `style={{ transform: `translateY(${offset}px)` }}` con el offset de `useParallax()`.

## 6. Índice de sección fijo

**Objetivo:** un indicador fijo en la esquina inferior izquierda, junto al raíl de progreso, que muestra la sección actual como `01 / 06 — SKILLS` y cambia según el scroll.

**Datos: `src/data/sections.ts`**
- Array `SECTIONS` con `{ id, index, title }` para las 6 secciones, replicando exactamente los valores que ya usan los `SectionHeading` existentes: `skills` (001) → `contacto` (006).

**Hook: `useActiveSection(sections)`**
- Un único `IntersectionObserver` con `rootMargin: '-45% 0px -45% 0px'` (dispara cuando una sección cruza la franja central del viewport) sobre los 6 `<section id="...">` — patrón scrollspy estándar.
- Devuelve el `id` de la última sección cuya franja central cruzó el observer; si ninguna ha cruzado aún (el usuario sigue dentro del Hero), devuelve por defecto el primer id de `sections` (`skills`).

**Componente: `SectionIndexBadge.tsx`**
- Fijo en la esquina inferior izquierda, mismo offset horizontal que `ScrollProgressRail` (`left-6 md:left-10 lg:left-16`), `bottom-6 md:bottom-10`.
- Texto `font-archivo text-xs uppercase tracking-wider text-ink-soft`, formato `01 / 06 — SKILLS`.
- Oculto en móvil (`hidden md:block`), igual que el raíl.
- Se monta una vez en `App.tsx`, junto a `ScrollProgressRail`.

## Testing

Ninguna de las cuatro piezas añade lógica de negocio ni estado persistente: verificación manual en navegador cubre el criterio de aceptación:
- Cada una de las 6 secciones revela su título una sola vez al hacer scroll, y no se repite al subir/bajar repetidamente.
- Con `prefers-reduced-motion: reduce` activado en el SO/navegador, los títulos aparecen estáticos sin animación, y el offset de parallax se queda en 0.
- El raíl de progreso sube de 0% a 100% de forma continua a lo largo de toda la página, visible desde `md:` en adelante, oculto en móvil. Se anima igual con o sin `prefers-reduced-motion`.
- La foto del Hero se desplaza como máximo 20px, y dicho desplazamiento no crece más allá de ese tope aunque se siga bajando.
- El índice de sección cambia correctamente al cruzar cada una de las 6 secciones, muestra `01 / 06 — SKILLS` por defecto al inicio, y permanece oculto en móvil.
