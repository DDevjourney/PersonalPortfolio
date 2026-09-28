# Proyectos: CardSwap sobre la lista existente

## Contexto

La sección Proyectos (`src/components/Projects.tsx`) muestra hoy una lista de filas (número, título + stack, descripción, enlace opcional) a partir de `projects` en `src/data/portfolio.ts`. Se añade el componente open-source [`CardSwap` de React Bits](https://reactbits.dev): una pila de tarjetas en 3D que rota automáticamente, mostrando una "al frente" cada vez. La lista actual **no desaparece**: el `CardSwap` se añade encima, como pieza visual; la lista sigue debajo para quien quiera leer los 4 proyectos completos sin depender de la rotación.

## 1. Componente `CardSwap`

Se añade como `src/components/CardSwap.tsx` + `src/components/CardSwap.css`, adaptado del componente original (JS + CSS):

- **Convertido a TypeScript**, con las props tipadas según la tabla del componente original (`width`, `height`, `cardDistance`, `verticalDistance`, `delay`, `pauseOnHover`, `onCardClick`, `skewAmount`, `easing`, `children`), siguiendo la misma convención que `FolderFloat.tsx` y `MotionCarousel.tsx`.
- Se elimina la directiva `'use client'` de la cabecera (específica de Next.js, sin efecto en este proyecto Vite + SPA).
- La lógica de animación (timeline de GSAP, cálculo de slots, orden circular de las cartas) se mantiene igual que en el original — no se modifica, solo se tipa.

**Nueva dependencia:** `gsap` (runtime).

## 2. Adaptaciones de accesibilidad y movimiento (no vienen en el original)

El componente original no respeta `prefers-reduced-motion` y no es operable por teclado (las cartas solo reaccionan a `onClick` de ratón sobre un `<div>`). Se adapta así, siguiendo el mismo criterio que ya usa el resto del proyecto (`useParallax`, `useLineReveal`, `FolderFloat`):

- **`prefers-reduced-motion: reduce`:** el `useEffect` que arranca la rotación comprueba la preferencia. Si está activa, se posicionan las cartas en su slot inicial (`placeNow`, que ya es instantáneo vía `gsap.set`, no una animación) y **no se llama a `swap()` ni se arranca el `setInterval`**: la pila se queda quieta en la primera carta.
- **Pausa por foco, además de por hover:** `pauseOnHover` se fuerza a `true` en el uso de Proyectos. El mismo efecto que engancha `mouseenter`/`mouseleave` sobre el contenedor añade también `focusin`/`focusout`: si el usuario tabula hasta una carta, la rotación se detiene mientras la tenga enfocada (evita que una carta enfocada por teclado salga volando de la rotación mientras el usuario interactúa con ella).
- **`Card` es un enlace cuando el proyecto tiene `url`:** el subcomponente `Card` (hoy siempre un `<div>`) pasa a aceptar un `href` opcional y renderiza `<a href={href} target="_blank" rel="noopener noreferrer">` en ese caso, o `<div>` si no hay `href` — igual que ya distingue `Projects.tsx` hoy entre fila-enlace y fila-`div`. Un `<a>` es focable y operable con `Enter` de forma nativa, sin necesitar `tabIndex`/`onKeyDown` a mano.

## 3. Contenido de cada carta

Mismo contenido que la fila de la lista actual: número (`project.id`), título (con la flecha `↗` si tiene `url`, igual que en `Projects.tsx`), `stack`, `description`. Fondo `ink`, texto `paper` — mismo lenguaje que la tarjeta "activa" del carrusel de Experiencia (`MotionCarousel` en `Experience.tsx`).

## 4. Integración en `Projects.tsx`

Justo debajo de `<SectionHeading index="002" title="Proyectos" />` y encima de la lista existente (que no cambia), un wrapper con altura explícita y posición relativa (requisito del `CardSwap` original, que se posiciona en `absolute` dentro de su contenedor):

```
<div className="relative mx-auto h-[420px] w-full max-w-md sm:h-[460px] md:h-[500px]">
  <CardSwap width={380} height={240} pauseOnHover>
    {projects.map((project) => (
      <Card key={project.id} href={project.url} className="...">
        ...
      </Card>
    ))}
  </CardSwap>
</div>
```

`cardDistance`, `verticalDistance` y `skewAmount` se dejan en los valores por defecto del componente para empezar, y se ajustan a ojo en el navegador durante la implementación si alguna carta se solapa o se corta contra los límites del wrapper.

## Fuera de alcance

- No se toca `data/portfolio.ts` ni `data/types.ts`: `CardSwap` consume el mismo array `projects` que ya usa la lista.
- No se elimina ni se modifica la lista existente de `Projects.tsx`.
- No se generaliza `CardSwap`/`Card` más allá de tiparlos y de las dos adaptaciones de accesibilidad descritas arriba.
