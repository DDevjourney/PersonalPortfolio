# Portfolio — Carlos

Portfolio personal de desarrollador web, construido como SPA con **React + TypeScript + Vite** y estilado con **Tailwind CSS**. Diseño editorial en una sola página: paleta papel/tinta, titulares geométricos, scroll suave por inercia y microanimaciones de entrada en cada sección.

**En producción:** [www.carlosdsp.es](https://www.carlosdsp.es)

---

## Stack

| Pieza | Qué hace |
| --- | --- |
| React 18 + TypeScript | Componentes de la UI, tipados en [`src/data/types.ts`](src/data/types.ts) |
| Vite 5 | Servidor de desarrollo y build de producción |
| Tailwind CSS 3 | Estilos por utilidades, con paleta y fuentes propias en [`tailwind.config.js`](tailwind.config.js) |
| Lenis | Scroll suave por inercia y navegación por anclas |
| anime.js (`animejs`) | Reveal del titular del Hero y de las cabeceras de sección |
| Embla Carousel + Motion | Carrusel de la sección Experiencia, con parallax por slide |
| lucide-react | Iconos (flechas del carrusel) |
| react-simple-typewriter | Efecto máquina de escribir del titular del Hero |
| EmailJS | Envío del formulario de contacto desde el navegador |
| gh-pages | Despliegue del directorio `dist/` |

No hay backend: es un sitio estático.

---

## Comandos

```bash
npm install
```

Copia después `.env.example` a `.env.local` y rellena las credenciales de EmailJS (ver [Formulario de contacto](#formulario-de-contacto)). Sin ellas el sitio funciona, pero el formulario avisa de que el envío no está configurado en vez de mandar el mensaje.

```bash
npm run dev
```

Levanta el servidor de desarrollo en `http://localhost:5173`.

```bash
npm run build
```

Comprueba tipos (`tsc -b`) y genera `dist/`.

```bash
npm run preview
```

Sirve `dist/` en local para revisar el build antes de publicar.

```bash
npm run deploy
```

Publica `dist/` en la rama `gh-pages`. El archivo `CNAME` de `public/` mantiene el dominio propio, y por eso `vite.config.ts` usa `base: '/'` en vez de `/repo/`.

---

## Estructura

```
src/
├── main.tsx                  Punto de entrada; monta React e importa los estilos
├── App.tsx                   Orden de las secciones + montaje de scroll suave, raíl e índice
├── index.css                 Capa base de Tailwind, reduced-motion global y componentes reutilizables
├── vite-env.d.ts             Tipos de las variables de entorno VITE_*
├── hooks/
│   ├── useSmoothScroll.ts    Inicializa y destruye Lenis; gestiona el scroll de anclas
│   ├── useActiveSection.ts   Scrollspy: id de la sección activa (IntersectionObserver)
│   ├── useScrollProgress.ts  Progreso de scroll de la página (0–1), para el raíl vertical
│   ├── useParallax.ts        Offset de parallax acotado para la foto del Hero
│   ├── useLineReveal.ts      Reveal de una línea (bloque) al entrar en el viewport
│   ├── useStaggerReveal.ts   Reveal escalonado de varios hijos al entrar en el viewport
│   └── useNodeLineExtent.ts  Mide el tramo entre el primer y el último nodo de un timeline
├── data/
│   ├── types.ts               Interfaces: Skill, Project, ExpandableItem
│   ├── sections.ts             Secciones navegables (id/índice/título) para el índice fijo
│   └── portfolio.ts            TODO el contenido editable del sitio
└── components/
    ├── Header.tsx               Cabecera fija con menú hamburguesa en móvil
    ├── ScrollProgressRail.tsx   Raíl vertical fijo con el progreso de scroll
    ├── SectionIndexBadge.tsx    Indicador fijo de la sección actual (scrollspy)
    ├── Hero.tsx                 #inicio — titular con efecto typewriter + parallax en la foto
    ├── Skills.tsx                001 · #skills
    ├── Projects.tsx               002 · #proyectos
    ├── Experience.tsx             003 · #experiencia — usa <MotionCarousel>
    ├── Education.tsx              004 · #estudios — envoltorio fino sobre <EducationTimeline>
    ├── EducationTimeline.tsx      Timeline vertical + chips de certificaciones
    ├── MotionCarousel.tsx         Carrusel genérico (Embla + Motion) reutilizado por Experience
    ├── Contact.tsx                005 · #contacto — formulario con EmailJS
    ├── Footer.tsx                 Redes y aviso de copyright
    └── SectionHeading.tsx         Encabezado numerado compartido, con reveal de línea
```

---

## Editar el contenido

Casi todo el texto del sitio vive en **[`src/data/portfolio.ts`](src/data/portfolio.ts)**, en cinco arrays tipados desde [`src/data/types.ts`](src/data/types.ts). No hace falta tocar componentes para actualizar el portfolio:

- **`skills`** — tecnologías, con `name` y `category` (agrupadas visualmente por el orden del array).
- **`projects`** — `id`, `title`, `stack`, `description` y un `url` opcional. Sin `url`, la fila no es clicable.
- **`experience`** — titulaciones... perdón, puestos de trabajo. Comparte la interfaz `ExpandableItem` (`title`, `subtitle`, `period`, `description`) y alimenta el carrusel de `Experience.tsx`.
- **`education`** — titulaciones principales; misma interfaz `ExpandableItem`, alimenta el timeline vertical de `EducationTimeline.tsx`.
- **`certifications`** — cursos y certificados complementarios; misma interfaz, se muestran como chips al final de la sección Estudios (no entran en el timeline).

Los enlaces de navegación están en `navLinks`, arriba del todo en `Header.tsx`; las redes sociales, en `socials` dentro de `Footer.tsx`. El orden e índices (`001`…`005`) de las secciones están duplicados a mano en `SECTIONS` (`src/data/sections.ts`, usado por el índice fijo) y en el prop `index` que recibe cada `<SectionHeading>` — se mantienen sincronizados manualmente porque son solo 5 y cambian rara vez.

---

## Formulario de contacto

`Contact.tsx` envía con **EmailJS**, que manda el correo desde el propio navegador sin backend. Las credenciales se leen de tres variables de entorno documentadas en `.env.example`:

```
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

Van en un **`.env.local`**, que ya está fuera de git por el patrón `*.local` del `.gitignore`. La plantilla de EmailJS tiene que usar las variables `{{name}}`, `{{email}}` y `{{message}}`, y conviene poner `{{email}}` en su campo *Reply To* para poder responder directamente.

Dos avisos:

- **La Public Key es pública por diseño** — viaja en el bundle del navegador y no es un secreto. Lo que la protege de abusos es la lista de dominios permitidos en *Account → Security* de EmailJS: añade ahí `www.carlosdsp.es`.
- **Vite lee las variables en tiempo de build.** Tras cambiarlas hay que reiniciar `npm run dev` y volver a lanzar `npm run build` antes de desplegar.

Si falta cualquiera de las tres, el formulario no rompe: valida igual y muestra un aviso con la dirección de correo directa.

El formulario también incluye:

- **Validación en cliente** antes de llamar a EmailJS (`noValidate` + comprobaciones propias), con foco automático al primer campo inválido y estado anunciado por `role="status"`/`aria-live="polite"`.
- **Un honeypot** (`Contact.tsx:48`): un campo invisible a cualquier usuario real (`aria-hidden` + `tabIndex={-1}`, fuera de la pantalla) que los bots que autorrellenan formularios sí completan. Si llega relleno, se finge un envío correcto en vez de dar un error, para no revelar el motivo del filtro.

---

## Accesibilidad

Varias decisiones del código están ahí específicamente por accesibilidad y conviene no deshacerlas sin motivo:

- **Skip link** (`App.tsx`): invisible hasta que recibe el foco; salta a `<main tabIndex={-1}>` para mover también el foco, no solo el scroll.
- **`prefers-reduced-motion: reduce`** se respeta en cada animación por separado, no con un interruptor global:
  - Lenis (`useSmoothScroll`) no se inicializa; el navegador vuelve al scroll nativo (`index.css` reactiva `scroll-behavior: smooth` cuando `<html>` no tiene la clase `.lenis`).
  - El typewriter del Hero tipea de golpe (`typeSpeed: 0`) en vez de animar letra a letra, y el cursor deja de parpadear.
  - `useParallax`, `useLineReveal` y `useStaggerReveal` no arrancan: los elementos quedan en su posición/opacidad final desde el primer render.
  - Una regla global en `index.css` reduce además cualquier `transition`/`animation` restante (hovers, cartas del carrusel) a 0.01ms, para no romper estados finales que dependen de que la transición termine.
  - El raíl de progreso (`useScrollProgress`) es la excepción deliberada: al ser un indicador informativo continuo (no una animación de entrada), se anima igual con o sin esta preferencia.
- **Foco visible:** los campos del formulario usan `focus-visible:ring-2` en vez de depender del borde (1px es demasiado sutil para WCAG 2.4.11); los enlaces de redes en el footer amplían su área de toque a 36px (WCAG 2.5.8) con `py-2 -my-2` para no descuadrar la fila.
- **Contraste:** `ink-soft` (`#65625C`) da 4,87:1 sobre `paper`, por encima del 4.5:1 que exige AA para texto normal.

---

## Experiencia de scroll y animaciones

El proyecto separa dos tipos de movimiento: **informativo** (progreso de scroll, sección activa) que se anima siempre, y **decorativo** (reveals, parallax) que respeta `prefers-reduced-motion`. Un diseño más detallado de esta fase está en [`docs/superpowers/specs/2026-09-25-lenis-immersive-scroll-design.md`](docs/superpowers/specs/2026-09-25-lenis-immersive-scroll-design.md).

- **`useSmoothScroll`** — arranca Lenis con `autoRaf` y `anchors: { offset: -80 }`, que intercepta los `href="#..."` y descuenta el alto de la cabecera fija.
- **`useScrollProgress`** / **`ScrollProgressRail`** — raíl vertical fijo en el margen izquierdo (oculto en móvil) que se rellena según el scroll de la página, leyendo `window.scrollY` en un loop de `requestAnimationFrame` en vez de engancharse a Lenis directamente.
- **`useActiveSection`** / **`SectionIndexBadge`** — scrollspy con un único `IntersectionObserver` (`rootMargin: '-45% 0px -45% 0px'`) sobre las secciones de `data/sections.ts`; muestra el índice de la sección activa junto al raíl.
- **`useParallax`** — offset acotado (máx. 20px) aplicado a la foto del Hero, para que se quede "un poco atrás" del resto del contenido al hacer scroll.
- **`useLineReveal`** (usado por `SectionHeading`) — cada cabecera de sección sube como un bloque único recortado la primera vez que entra en el viewport (anime.js, `ease: 'out(4)'`), una sola vez.
- **`useStaggerReveal`** (usado por `EducationTimeline`) — revela varios elementos hermanos con fade + slide escalonado (`stagger`) al entrar en pantalla.
- **`useNodeLineExtent`** (usado por `EducationTimeline`) — mide el tramo exacto entre el primer y el último nodo del timeline para que el raíl vertical no ocupe toda la sección, solo el rango con contenido.
- **`MotionCarousel`** (usado por `Experience`) — carrusel genérico sobre Embla Carousel, con parallax de escala/opacidad por slide vía `motion` (adaptado del componente "Motion Carousel" de [animate-ui](https://github.com/imskyleen/animate-ui)).

---

## Decisiones de implementación

Cosas del código que no son evidentes a simple vista y conviene no deshacer por error.

### Lenis y el `scroll-behavior` nativo

El detalle importante está en `index.css`: el `scroll-behavior: smooth` está limitado a `html:not(.lenis)`. Lenis añade la clase `.lenis` al `<html>` al inicializarse, así que la regla se apaga sola en cuanto toma el control — si las dos animaciones conviven, se pelean por la posición del scroll. La regla vive además dentro de `@media (prefers-reduced-motion: no-preference)`, y Lenis directamente no arranca si el sistema pide menos movimiento, de modo que en ese caso el scroll queda nativo e instantáneo.

### El titular del Hero es una sola "palabra" con saltos de línea

`Hero.tsx` usa `react-simple-typewriter` en vez de otras libs del estilo porque su hook (`useTypewriter`) no manipula el DOM a mano — evita el bug conocido de esas libs con `StrictMode`, que monta el efecto dos veces y rompe su instancia imperativa. Como el hook está pensado para tipear/borrar palabras completas y no para mantener varias líneas visibles a la vez, las tres líneas del titular (`Desarrollador` / `Web` / `<Builder />`) se unen con `\n` en una única cadena y se pintan con `whitespace-pre-line`.

### `MotionCarousel` sin `loop` en Experiencia

`Experience.tsx` pasa `options={{ align: 'start', containScroll: 'keepSnaps' }}` sin `loop`: con solo 3 tarjetas no hace falta bucle, y combinarlo con `containScroll: 'keepSnaps'` rompía el propio loop (el botón "siguiente" se quedaba deshabilitado en la última tarjeta). `keepSnaps` solo evita que Embla fusione el snap de la última tarjeta con el anterior cuando no hay distancia suficiente para alinearla a `'start'` — algo que pasa con pocos slides anchos.

### El raíl del timeline de Estudios usa `offsetTop`, no `getBoundingClientRect`

`useNodeLineExtent` acumula `offsetTop` subiendo por la cadena de `offsetParent` en vez de usar `getBoundingClientRect`, porque `offsetTop` ignora los `transform` CSS: así la medición no se ve afectada por el `translateY` transitorio que aplica `useStaggerReveal` mientras anima los nodos del timeline.

### El punto del timeline se ancla a la fila del título, no al bloque completo

En `EducationTimeline.tsx`, el `<span data-timeline-dot>` vive en un `<div className="relative">` que envuelve solo el `<h3>`, no toda la tarjeta. Así el punto queda alineado con el título sin importar cuánto ocupe el `period` o el `subtitle` de al lado. Los valores `left-[-28px]`/`left-[-32px]` no son arbitrarios: son `pl-10`/`pl-12` (40/48px, el padding de la fila) menos `left-3`/`left-4` (12/16px, la posición del raíl) — la misma línea vertical en ambos breakpoints.

### El campo de foco del formulario es un anillo, no un cambio de borde

En `Contact.tsx` había un `focus:border-ink` que era código muerto (comprobado en el navegador: `border-ink/20` le ganaba la cascada, porque Tailwind emite la variante con opacidad después). El único indicador de foco que quedaba era el del navegador, y `focus:outline-none` lo estaba quitando. De ahí el anillo `focus-visible:ring-2` — visible al tabular, no al hacer click con el ratón.

---

## Pendientes conocidos

- **Las credenciales de EmailJS van dentro del bundle público.** Es inevitable sin backend: Vite inlinea las variables `VITE_*` en el JS que descarga el navegador, así que el `serviceId`, el `templateId` y la *public key* son visibles para cualquiera. La *public key* está diseñada para serlo, pero con las tres se puede enviar correo desde la cuenta y agotar la cuota mensual. **Mitigación pendiente, en el panel de EmailJS y no en el código:** restringir el *domain allowlist* a `carlosdsp.es` / `www.carlosdsp.es` y activar el límite por IP. En el formulario ya hay un honeypot que filtra los bots más simples.
- **`ink-faint` (1,67:1 sobre `paper`) no vale para texto.** Sigue en la paleta (`tailwind.config.js`) pero ahora mismo no lo usa nadie; si se recupera, solo para bordes o elementos decorativos.
