# Modo oscuro

## Contexto

El portfolio tiene hoy un único tema, claro: fondo `paper` `#E8E6E1`, texto `ink` `#1A1A1A`, rojo `accent` `#F54949`. Se añade un tema oscuro con fondo `#242424` y un botón para alternar entre ambos.

**Estructura relevante:**

- **Escritorio (lg+):** sin cabecera. `SideNav` es una columna fija a la izquierda (`w-72`, alto completo) con la rueda de navegación; el contenido va desplazado `lg:pl-72` (`App.tsx`).
- **Móvil y tablet (<lg):** `Header` fijo con el logo a la izquierda y el botón "Menú" a la derecha, que abre una capa a pantalla completa.
- **Colores:** casi todos los componentes usan los tokens `paper`, `ink`, `ink-soft`, `ink-faint` y `accent` de `tailwind.config.js`, definidos como hex. Eso permite cambiar de tema con variables CSS sin tocar la mayoría de los componentes.

## 1. Tokens como variables CSS

En `index.css`, bajo `@layer base`, se declaran los tokens como canales RGB para que los modificadores de opacidad (`border-ink/15`, `bg-paper/80`…) sigan funcionando. `tailwind.config.js` pasa a `rgb(var(--token) / <alpha-value>)`.

| Token | Claro (`:root`) | Oscuro (`[data-theme="dark"]`) | Contraste en oscuro (sobre `#242424`) |
|---|---|---|---|
| `paper` | `#E8E6E1` | `#242424` | — |
| `paper-light` | `#EDEBE7` | `#2B2B2B` | — (no se usa hoy en `src/`; se mantiene por coherencia) |
| `ink` | `#1A1A1A` | `#E8E6E1` | 12,45:1 |
| `ink-soft` | `#65625C` | `#A9A59E` | 6,33:1 |
| `ink-faint` | `#B7B3AC` | `#5E5C57` | 2,32:1 (texto atenuado decorativo, como hoy en claro) |
| `accent` | `#F54949` | `#FF5A5A` | 5,07:1 |

Se añaden tres tokens nuevos para los casos que hoy usan colores fijos o dependen de que `ink` sea oscuro:

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `on-accent` | `#1A1A1A` | `#242424` | Texto sobre fondo `accent`. Hoy es `text-ink`, que en oscuro sería crema sobre rojo (≈2,5:1); con este token queda texto oscuro sobre rojo (≈5:1). Se usa en el botón de titulación seleccionado (`Education.tsx`) y en la etiqueta de la barra de campo (`Contact.tsx`). |
| `accent-on-ink` | `#F54949` | `#B91C1C` | Rojo sobre un bloque `ink`. En claro el bloque es oscuro (≈5:1); en oscuro es crema y el rojo normal daría 2,8:1, así que se oscurece (5,19:1 sobre `#E8E6E1`). |
| `danger` | `#B91C1C` | `#FF8A8A` | Mensaje de error del formulario (`text-red-700` hoy). 6,84:1 sobre `#242424`. |

El tema por defecto (sin atributo) es el claro, de modo que el sitio se ve igual si JS falla.

## 2. Bloques invertidos

Experiencia (panel del acordeón) y Estudios (fichas de años) son hoy bloques oscuros sobre fondo claro. En oscuro se invierten: bloques crema sobre fondo oscuro, conservando el contraste fuerte actual.

Como esos bloques ya son "`ink` de fondo, `paper` de texto", el cambio de tokens los invierte solos. Hay que migrar los hex fijos que los configuran:

- `Experience.tsx`: `panelColor="#1A1A1A"` → `ink`, `textColor="#E8E6E1"` → `paper`, `accentColor="#F54949"` → `accent` (solo pinta el anillo de foco del panel, que se dibuja sobre el fondo de la página, no sobre el panel). El `text-accent` del subtítulo y la barra roja del panel, que sí van sobre el panel, pasan a `text-accent-on-ink` / `bg-accent-on-ink`.
- `Education.tsx`: `tileColor="#1A1A1A"` → `ink`, `textColor="#E8E6E1"` → `paper`.
- `SideNav.tsx`: `textColor="#B7B3AC"` → `ink-faint`, `activeColor="#1A1A1A"` → `ink`.

Estos componentes reciben el color como string de props (`OptionWheel`, `AccordionGallery`, `SplitFlapText`) y lo aplican en estilos en línea o como propiedades CSS personalizadas. Se les pasa `rgb(var(--ink))` y similares; durante la implementación se comprueba que cada uno resuelve la variable bien (en especial `color-mix(...)` de `SplitFlapText.css`) y se cambia el mecanismo solo si alguno no lo hace.

## 3. Lógica del tema: `useTheme`

Hook en `src/hooks/useTheme.ts`:

- Devuelve `{ theme, toggle }`, con `theme` igual a `'light'` o `'dark'`.
- **Valor inicial:** el guardado en `localStorage` (clave `theme`); si no hay, el de `prefers-color-scheme`.
- **Efecto:** pone `data-theme` en `<html>` y actualiza `<meta name="theme-color">` (`#E8E6E1` en claro, `#242424` en oscuro).
- **Persistencia:** `toggle` guarda la elección. Mientras el usuario no haya elegido, el hook sigue los cambios de `prefers-color-scheme` del sistema.
- **Compartido entre botones:** el estado vive en un contexto ligero (`ThemeProvider` en `main.tsx`) para que los dos botones (cabecera y columna) estén siempre sincronizados.
- Todas las lecturas y escrituras de `localStorage` van en `try/catch`.

**Sin parpadeo:** un script inline en el `<head>` de `index.html` lee la misma clave y aplica `data-theme` antes del primer pintado. Usa la misma lógica que el hook, escrita a mano en una línea.

## 4. Botón: `ThemeToggle`

Componente `src/components/ThemeToggle.tsx`, con dos variantes según dónde se use:

- **Columna lateral (escritorio):** abajo a la izquierda de `SideNav`, bajo la rueda, alineado con el margen de la rueda. Icono (`Sun` / `Moon` de `lucide-react`) y texto en mono mayúsculas: muestra "Oscuro" en tema claro y "Claro" en tema oscuro, con el mismo subrayado rojo que el botón "Menú". Como la rueda ocupa todo el alto, el botón va en un contenedor `absolute bottom-… left-…` por encima de ella con `z` suficiente para recibir el foco y los clics.
- **Cabecera (móvil y tablet):** solo icono, objetivo táctil de 44 px (`h-11 w-11`), a la izquierda de "Menú".

Accesibilidad: es un `<button type="button">` con `aria-label` ("Cambiar a modo oscuro" / "Cambiar a modo claro"), icono `aria-hidden` y anillo de foco visible, coherente con el resto de controles.

**Transición:** `body` y el fondo de la capa del menú animan `background-color` y `color` en 300 ms. La regla global de `prefers-reduced-motion` ya reduce las transiciones a un valor imperceptible.

## 5. Otros ajustes

- `Contact.tsx`: `text-red-700` → `text-danger`.
- `Contact.tsx`: la barra de campo inválido usa `bg-ink` con `text-paper`; en oscuro pasa a crema con texto oscuro sin cambios.
- `index.html`: `<meta theme-color>` inicial en `#E8E6E1` (lo actualiza el script/hook). El favicon no cambia.
- Las capturas de proyectos no cambian; su borde `border-ink/15` ya se adapta.
- `::selection` usa `bg-accent text-paper`: en oscuro es rojo claro con texto oscuro, legible (5,07:1).

## Fuera de alcance

- Un tercer modo "sistema" explícito en la interfaz.
- Versiones oscuras de las capturas o del favicon.
- Cambios en el contenido, la tipografía o la estructura de las secciones.

## Verificación

- `npm run build` sin errores de tipos.
- Revisión visual en claro y oscuro, en escritorio (lg+) y en móvil (375 px): hero, skills, proyectos (fila abierta con captura), experiencia, estudios, contacto (incluido el estado de error) y footer.
- Rueda lateral con los colores correctos y el botón sin solapar la rueda ni el titular.
- Recarga con el tema oscuro guardado: sin destello claro.
- Con `localStorage` vacío, el tema inicial sigue `prefers-color-scheme`.
- Contraste de los textos pequeños en oscuro con los valores de la tabla.
