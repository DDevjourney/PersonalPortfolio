# Experiencia inmersiva de scroll (fase 1): reveal de títulos + raíl de progreso

## Contexto

El proyecto ya usa Lenis (`src/hooks/useSmoothScroll.ts`) solo para scroll suave y anclas del header, y `animejs` (`src/components/Hero.tsx`) para el reveal letra a letra del titular del Hero. El resto de secciones (`SectionHeading.tsx` y sus 6 usos) no tienen ninguna animación de entrada, y no existe ningún indicador de progreso de scroll.

Esta es la primera fase de una lista más amplia de ideas para hacer el scroll más inmersivo (ver conversación previa). Cubre únicamente las dos primeras:

1. Reveal por scroll en los títulos de sección.
2. Raíl vertical de progreso de scroll.

Deliberadamente fuera de scope: parallax en la foto del Hero, pin/scrub en `ExpandableCards`, transiciones de sección con `clip-path`, e índice de sección tipo brújula. Se abordarán en fases posteriores si se decide seguir.

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

## Testing

Ninguno de los dos añade lógica de negocio ni estado persistente: verificación manual en navegador cubre el criterio de aceptación:
- Cada una de las 6 secciones revela su título una sola vez al hacer scroll, y no se repite al subir/bajar repetidamente.
- Con `prefers-reduced-motion: reduce` activado en el SO/navegador, los títulos aparecen estáticos sin animación.
- El raíl de progreso sube de 0% a 100% de forma continua a lo largo de toda la página, visible desde `md:` en adelante, oculto en móvil.
- El raíl se anima igual con o sin `prefers-reduced-motion`.
