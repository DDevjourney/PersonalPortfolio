# Portfolio — Carlos

Portfolio personal de desarrollador web, construido como SPA con **React + TypeScript + Vite** y estilado con **Tailwind CSS**. Diseño editorial en una sola página: paleta papel/tinta, titulares geométricos y navegación por anclas con scroll suave.

**En producción:** [www.carlosdsp.es](https://www.carlosdsp.es)

---

## Stack

| Pieza | Qué hace |
| --- | --- |
| React 18 + TypeScript | Componentes de la UI, tipados en `src/data/types.ts` |
| Vite 5 | Servidor de desarrollo y build de producción |
| Tailwind CSS 3 | Estilos por utilidades, con paleta y fuentes propias en `tailwind.config.js` |
| Lenis | Scroll suave por inercia y navegación por anclas |
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

Publica `dist/` en la rama `gh-pages`. El archivo `CNAME` de la raíz mantiene el dominio propio, y por eso `vite.config.ts` usa `base: '/'` en vez de `/repo/`.

---

## Estructura

```
src/
├── main.tsx              Punto de entrada; monta React e importa los estilos
├── App.tsx               Orden de las secciones + activación del scroll suave
├── index.css             Capa base de Tailwind y componentes reutilizables
├── hooks/
│   └── useSmoothScroll.ts    Inicializa y destruye Lenis
├── data/
│   ├── types.ts          Interfaces: Skill, Project, Service, ExpandableItem
│   └── portfolio.ts      TODO el contenido editable del sitio
└── components/
    ├── Header.tsx        Cabecera fija con menú hamburguesa en móvil
    ├── Hero.tsx          #inicio
    ├── Skills.tsx        001 · #skills
    ├── Projects.tsx      002 · #proyectos
    ├── Experience.tsx    003 · #experiencia  ─┐ ambas usan
    ├── Education.tsx     004 · #estudios     ─┘ <ExpandableCards>
    ├── Services.tsx      005 · #servicios
    ├── Contact.tsx       006 · #contacto
    ├── Footer.tsx        Redes y aviso de copyright
    ├── SectionHeading.tsx    Encabezado numerado compartido
    └── ExpandableCards.tsx   Cartas que se expanden al hacer click
```

---

## Editar el contenido

Casi todo el texto del sitio vive en **`src/data/portfolio.ts`**, en cuatro arrays. No hace falta tocar componentes para actualizar el portfolio:

- **`skills`** — tecnologías, con `name` y `category`.
- **`projects`** — `title`, `stack`, `description` y un `url` opcional. Sin `url`, la tarjeta no es clicable.
- **`services`** — `id` numerado ("001"…), `title` en mayúsculas y `description`.
- **`experience`** y **`education`** — comparten la interfaz `ExpandableItem`: `title`, `subtitle`, `period` y la `description` que se revela al expandir la carta.

Los enlaces de navegación están en `navLinks`, arriba del todo en `Header.tsx`, y las redes sociales en `Footer.tsx`.

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

---

## Decisiones de implementación

Tres cosas del código no son evidentes a simple vista y conviene no deshacerlas por error.

### Lenis y el `scroll-behavior` nativo

`useSmoothScroll` arranca Lenis con `autoRaf` (gestiona su propio `requestAnimationFrame`) y `anchors: { offset: -80 }`, que intercepta los `href="#..."` y descuenta el alto de la cabecera fija para que las secciones no queden tapadas.

El detalle importante está en `index.css`: el `scroll-behavior: smooth` está limitado a `html:not(.lenis)`. Lenis añade la clase `.lenis` al `<html>` al inicializarse, así que la regla se apaga sola en cuanto toma el control — si las dos animaciones conviven, se pelean por la posición del scroll. La regla vive además dentro de `@media (prefers-reduced-motion: no-preference)`, y Lenis directamente no arranca si el sistema pide menos movimiento, de modo que en ese caso el scroll queda nativo e instantáneo.

### Las cartas expandibles

`ExpandableCards` anima el ancho con `flex-grow` (`flex-[3]` la abierta, `flex-[0.6]` las demás, `flex-1` en reposo) y la curva `ease-expo`, definida en `tailwind.config.js` para que las cartas y el scroll se muevan con la misma sensación.

**El `min-width` es idéntico en los tres estados a propósito.** Cuando solo lo tenían las cartas abierta y colapsadas, al contraer desaparecía de golpe mientras el `flex-grow` seguía en su valor inicial: flexbox recalculaba el reparto en un único frame y la carta abierta pegaba un salto de +133px antes de empezar a encogerse. Con la restricción constante, los anchos se mueven de forma monótona en ambos sentidos.

El valor `lg:min-w-[12.5rem]` tampoco es arbitrario: deja 152px de hueco tras el `p-6`, justo para "Ciberseguridad" (148px en Archivo bold a 20px), que es el título más largo del sitio. Por eso el título se queda en `text-xl` y no sube a `text-2xl`. Entre 768px y 1024px cuatro cartas no caben con ese mínimo, así que ahí el `break-words` del `h3` parte la palabra en lugar de recortarla.

### Estado inactivo sin opacidad

Las cartas que no están abiertas se distinguen con `bg-paper-light`, no bajando la opacidad del botón. Como el fondo de la página es `bg-paper`, atenuar la carta entera mezclaba el texto con un fondo casi idéntico y dejaba los subtítulos en un contraste de 2,6:1, por debajo de WCAG AA.

---

## Pendientes conocidos

- **`app.js` y `style.css` en la raíz son restos de la versión anterior** del portfolio (HTML/CSS/JS puro). Ya no los referencia nadie: `index.html` solo carga `/src/main.tsx`. Se pueden borrar, igual que la carpeta `img/`.
- **Falta metadata social:** el `index.html` no tiene Open Graph ni Twitter Cards, así que el enlace se comparte sin imagen ni descripción. Tampoco hay `canonical`, `robots.txt` ni `sitemap.xml`.
- **Contraste por debajo de WCAG AA:** `ink-soft` sobre `paper` da 4,45:1 (el mínimo es 4,5) y `ink-faint` se queda en 1,67:1, que es lo que usa el hover de Servicios.
- **El menú móvil cerrado sigue capturando el foco de teclado:** sus 5 enlaces son enfocables aunque no se vean, porque se ocultan con `max-h-0` y no con `visibility`/`inert`.
