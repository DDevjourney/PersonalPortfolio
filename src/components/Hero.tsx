import { useState } from 'react'
import { useTypewriter, Cursor } from 'react-simple-typewriter'
import useParallax from '../hooks/useParallax'

/**
 * Líneas del titular, unidas por saltos de línea para el efecto typewriter.
 * El espacio de `<Builder />` es un NBSP (` `): con `whitespace-pre-line`
 * el navegador puede envolver esa línea por su espacio normal si no cabe
 * (a diferencia del `whitespace-nowrap` por línea del diseño anterior).
 */
const HERO_LINES = ['Desarrollador', 'Web', '<Builder />'] as const
const HERO_TEXT = HERO_LINES.join('\n')
/** Índice a partir del cual el texto tipeado pertenece a la línea `<Builder />` (en gris). */
const SOFT_LINE_START = HERO_TEXT.length - HERO_LINES[2].length

/**
 * Hero a dos columnas: titular enorme a la izquierda y, a la derecha,
 * foto circular + presentación breve.
 *
 * El titular se escribe con efecto máquina de escribir
 * (react-simple-typewriter: hook `useTypewriter`, no manipula el DOM a
 * mano como otras libs del estilo — evita el bug conocido de esas con
 * `StrictMode`, que monta el efecto dos veces y rompe su instancia
 * imperativa). Es una única "palabra" con saltos de línea (`\n` +
 * `whitespace-pre-line`) en vez de tres líneas separadas, porque el hook
 * está pensado para tipear/borrar palabras completas, no para mantener
 * varias líneas visibles a la vez.
 */
export default function Hero() {
  const [prefersReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  // typeSpeed: 0 tipea de un tirón en vez de animar, para respetar la
  // preferencia de menos movimiento sin tener que llamar al hook de forma
  // condicional (los hooks no pueden saltarse entre renders).
  const [text] = useTypewriter({ words: [HERO_TEXT], loop: 1, typeSpeed: prefersReducedMotion ? 0 : 45 })
  const parallaxOffset = useParallax()

  return (
    <section id="inicio" className="pt-28 md:pt-36">
      <div className="container-content">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-10">
          {/* Columna izquierda (~60%): titular */}
          <div className="lg:w-3/5">
            <h1 className="font-display whitespace-pre-line text-5xl uppercase leading-[0.95] text-ink sm:text-7xl md:text-8xl lg:text-[7rem]">
              {text.length <= SOFT_LINE_START ? (
                <>
                  {text}
                  <Cursor cursorStyle="▌" cursorColor="#1A1A1A" cursorBlinking={!prefersReducedMotion} />
                </>
              ) : (
                <>
                  {text.slice(0, SOFT_LINE_START)}
                  <span className="text-ink-soft">
                    {text.slice(SOFT_LINE_START)}
                    <Cursor cursorStyle="▌" cursorColor="#65625C" cursorBlinking={!prefersReducedMotion} />
                  </span>
                </>
              )}
            </h1>
          </div>

          {/* Columna derecha (~40%): foto + presentación */}
          <div className="flex flex-col gap-6 lg:w-2/5">
            {/* Foto circular de perfil */}
            <div
              className="flex justify-start lg:justify-center"
              style={{ transform: `translateY(${parallaxOffset}px)` }}
            >
              {/* El recorte va en el contenedor, no en la <img>: la imagen es
                  cuadrada igual que el hueco, así que con `object-cover` a
                  secas se ve entera y encogerla no quita nada de pared, solo
                  la hace más pequeña. El `scale` de dentro es lo que deja
                  fuera del círculo la franja lateral: 1.3 recorta un 15% por
                  cada lado. El origen va arriba y no centrado porque la cabeza
                  empieza a ~10px del borde superior del archivo: centrado, el
                  recorte vertical se la cortaba. Anclado arriba, esos 100px
                  salen todos por abajo, que es camiseta.
                  El aro marca el borde, que sobre el papel se difuminaba. */}
              <div className="h-32 w-32 overflow-hidden rounded-full ring-1 ring-ink/15 md:h-40 md:w-40">
                {/* width/height son los del archivo (432×432): le dan al
                    navegador la proporción para reservar el hueco antes de
                    descargarla. Es la imagen del primer viewport, de ahí la
                    prioridad alta de descarga. */}
                <img
                  src="/perfil.jpg"
                  alt="Carlos, desarrollador web"
                  width={432}
                  height={432}
                  // En minúsculas y por spread a propósito. React 18 no conoce
                  // la forma camelCase `fetchPriority` (llega en React 19): la
                  // descartaba con un aviso en consola y el atributo no acababa
                  // en el HTML, así que la prioridad de descarga no se aplicaba.
                  // En minúsculas sí pasa tal cual al DOM, pero los tipos de
                  // @types/react van por delante del runtime y solo aceptan la
                  // versión camelCase, de ahí el spread para saltárselos.
                  // Al subir a React 19: volver a `fetchPriority="high"`.
                  {...{ fetchpriority: 'high' }}
                  className="h-full w-full origin-top scale-[1.3] object-cover"
                />
              </div>
            </div>

            <p className="text-lg font-bold leading-snug text-ink">
              Soy Carlos, desarrollador web y quiero construir tu identidad digital.
            </p>

            <hr className="hairline" />

            <p className="text-sm leading-relaxed text-ink-soft">
              Profesional del Desarrollo de Aplicaciones Web con base sólida en PHP, JavaScript, Laravel y React. Me gusta crear experiencias intuitivas y
              funcionales para usuarios y negocios.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
