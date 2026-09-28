# Skills como carpetas flotantes (FolderFloat)

## Contexto

La sección Skills (`src/components/Skills.tsx`) muestra hoy una rejilla de tarjetas: una por tecnología (`skills` en `src/data/portfolio.ts`), con el nombre en negrita y la categoría (`Frontend`, `Backend`, `Bases de datos`, `Diseño`, `Plataformas`) en gris debajo. Se sustituye por el componente open-source [`FolderFloat` de React Bits](https://reactbits.dev): una carpeta que se abre y deja salir "notas" flotantes, con un motor de físicas (`matter-js`) que permite arrastrarlas una vez fuera.

**Objetivo:** una carpeta por categoría (5 en total, mismo orden que hoy: Frontend → Backend → Bases de datos → Diseño → Plataformas), que al abrirse muestra las tecnologías de esa categoría como notas flotantes.

## 1. Componente `FolderFloat`

Se añade como `src/components/FolderFloat.tsx` + `src/components/FolderFloat.css`, adaptado del componente original (JS + CSS) de la siguiente forma:

- **Convertido a TypeScript**, con las props tipadas según la tabla del componente original (`items`, `label`, `sublabel`, `trigger`, `defaultOpen`, `closeOnSelect`, `physics`, `drift`, `onSelect`, `onOpenChange`, colores, medidas, timings). El resto de `src/` es 100% `.tsx`; este componente sigue esa convención igual que `MotionCarousel.tsx`.
- Se elimina la directiva `'use client'` de la cabecera del archivo original: es específica de Next.js (App Router) y no tiene efecto ni sentido en un proyecto Vite + React SPA como este.
- La lógica interna (layout de notas, motor de físicas con Matter.js, drag por puntero, reveal con stagger/spring, gating de `prefers-reduced-motion`) se mantiene tal cual la trae el componente original — no se modifica, solo se tipa.
- Se mantiene como componente **genérico y reutilizable** (no acoplado a "skills"): mismo criterio que ya se siguió con `MotionCarousel`, que se adaptó de un ejemplo externo a la paleta del proyecto sin atarlo a un único uso.

**Nueva dependencia:** `matter-js` (runtime) + `@types/matter-js` (dev), añadidas a `package.json`.

## 2. Agrupación de datos en `Skills.tsx`

`Skills.tsx` deja de iterar `skills` como lista plana. Agrupa el array por `category`, preservando el orden de primera aparición (ya es Frontend → Backend → Bases de datos → Diseño → Plataformas en `portfolio.ts`, así que **no hace falta tocar `data/portfolio.ts` ni `data/types.ts`**). Cada grupo produce una carpeta:

- `label`: nombre de la categoría (`skill.category`).
- `items`: los `skill.name` de esa categoría, como strings simples (el componente acepta `string | { label, value }`; con string basta, no hay acción asociada a elegir una nota).
- `sublabel`: se deja en el valor por defecto del propio componente (cuenta de notas, ej. "3 technologies" → se usará el copy en español pasando explícitamente `sublabel` como `"${n} tecnologías"` para mantener el idioma del resto del sitio).

## 3. Layout

El contenedor de la rejilla actual (`grid grid-cols-2 ... rounded-2xl border ...`) se sustituye por:

```
<div className="mt-12 flex flex-wrap justify-center gap-x-10 gap-y-20">
  {categorías.map((cat) => <FolderFloat key={cat.label} ... />)}
</div>
```

dentro del mismo `<div className="container-content">` y debajo del `<SectionHeading index="001" title="Skills" />` existente, sin cambios en `SectionHeading`.

**Tamaño:** se reduce el `width`/`height`/`spread` por defecto del ejemplo original (pensado para una sola carpeta grande) para que quepan varias carpetas por fila en desktop sin que las notas de una se solapen con las de la vecina al abrirse. Valores de partida: `width={160}` `height={120}` `spread={130}` `lift={22}` — se ajustan a ojo en el navegador durante la implementación si se solapan o quedan desproporcionadas. En móvil, `flex-wrap` las apila en una o dos columnas según ancho disponible; no se fuerza un `grid-cols` fijo.

## 4. Interacción

- `trigger="click"` en las 5 carpetas (no `"hover"`): con hover, en móvil (sin puntero de precisión) las carpetas nunca se abrirían al tocar. Click/tap funciona igual en todos los tamaños.
- `closeOnSelect={false}`: a diferencia del ejemplo original (elegir una nota de feedback y cerrar), aquí las notas son solo informativas — tocar una tecnología no debe cerrar la carpeta, porque el usuario probablemente quiere seguir viendo las demás.
- `physics` activado (valor por defecto `true`, sin pasar `drift` explícito → usa el 0.5 por defecto): las notas flotan y se pueden arrastrar una vez fuera de la carpeta.
- No se pasa `onSelect` (no hay ninguna acción asociada a tocar una nota) ni `onOpenChange`.

## 5. Color

Se sustituye la paleta zinc por defecto del componente por la paleta editorial del proyecto (`tailwind.config.js`):

| Prop | Valor |
| --- | --- |
| `folderColor` | `#1A1A1A` (ink) |
| `frontColor` | `#1A1A1A` (ink) — el propio CSS del componente ya aclara este color con un gradiente hacia blanco al 92% para la solapa, así no hace falta un segundo tono a mano |
| `paperColor` | `#E8E6E1` (paper) |
| `itemColor` | `#EDEBE7` (paper-light) — para que las notas se distingan ligeramente del papel de fondo |
| `itemTextColor` | `#1A1A1A` (ink) |
| `labelColor` | `#E8E6E1` (paper) |

Estos valores se ajustan a ojo en el navegador si el contraste no es suficiente (especialmente `itemTextColor` sobre `itemColor`, que debe cumplir el mismo criterio AA que el resto del sitio).

## 6. Accesibilidad

El componente original ya trae su propio manejo de `prefers-reduced-motion` (desactiva el motor de físicas y las transiciones de apertura/cierre se reducen a un fade), consistente con el patrón que ya usa el resto del proyecto (`useParallax`, `useLineReveal`, `useStaggerReveal`), así que **no se modifica esa parte**. El botón de cada carpeta ya expone `aria-expanded` y `aria-label` (`"${label}, ${sublabel}"`); las notas, cuando la carpeta está cerrada, llevan `aria-hidden` y `tabIndex={-1}` para no ser alcanzables por teclado.

## Fuera de alcance

- No se toca `data/portfolio.ts` ni `data/types.ts`: la agrupación por categoría vive solo en `Skills.tsx`.
- No se añade ninguna acción a `onSelect`: las notas son puramente informativas, no enlazan a nada.
- No se generaliza el componente para otros usos del sitio (p. ej. Proyectos o Experiencia) más allá de tiparlo como reutilizable — solo se integra en Skills.
