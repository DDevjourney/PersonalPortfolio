import { useEffect, useRef } from 'react'
import useMediaQuery from '../hooks/useMediaQuery'
import { socials, CV_URL } from '../data/portfolio'

/** Valor visible de un perfil: la parte de la URL tras el dominio. */
const handle = (href: string) => new URL(href).pathname.replace(/\/$/, '').replace(/^\/(?!in\/)/, '')

/**
 * Filas de la ficha del hero: el CV y los perfiles profesionales (el email ya
 * está en Contacto).
 */
const heroRows = [
  { label: 'CV', value: 'descargar', href: CV_URL, download: true },
  ...socials
    .filter((social) => social.label !== 'Email')
    .map((social) => ({ label: social.label, value: handle(social.href), href: social.href, download: false })),
]

/** Hueco que deja el final del titular respecto al borde derecho al terminar. */
const END_MARGIN = 32

/**
 * Hero asimétrico: el titular, enorme y alineado a la izquierda, no cabe y se
 * sale de la pantalla por la derecha. La sección es más alta que el viewport
 * y su contenido va `sticky`: mientras se hace scroll por ella el titular se
 * desplaza a la izquierda hasta verse entero, y luego la página sigue. Los
 * datos y enlaces van pequeños, en mono, en la esquina inferior derecha.
 *
 * Con `prefers-reduced-motion` no hay desplazamiento: el titular se parte en
 * líneas normales y la sección mide lo que su contenido.
 */
export default function Hero() {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (reducedMotion) return
    let frame = 0
    let x = 0

    const update = () => {
      frame = 0
      const section = sectionRef.current
      const title = titleRef.current
      if (!section || !title) return
      // Cuánto sobresale el titular por la derecha, sin la traslación actual.
      const left = title.getBoundingClientRect().left - x
      const overflow = Math.max(0, left + title.offsetWidth + END_MARGIN - window.innerWidth)
      // Progreso dentro de la sección: 0 arriba, 1 al acabar el tramo sticky.
      const rect = section.getBoundingClientRect()
      const range = rect.height - window.innerHeight
      const progress = range > 0 ? Math.min(1, Math.max(0, -rect.top / range)) : 0
      x = -overflow * progress
      title.style.transform = `translate3d(${x}px, 0, 0)`
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [reducedMotion])

  return (
    // `overflow-x-clip` recorta el titular en el borde del viewport sin crear
    // un contenedor de scroll, así que el `sticky` de dentro sigue funcionando.
    <section
      id="inicio"
      ref={sectionRef}
      className={`relative overflow-x-clip ${reducedMotion ? '' : 'h-[170vh]'}`}
    >
      <div
        className={`container-content flex flex-col justify-end gap-10 pb-8 lg:justify-between pt-28 md:pb-10 lg:pt-16 ${
          reducedMotion ? '' : 'sticky top-0 h-screen'
        }`}
      >
        {/* Tamaño ligado al ancho disponible, para que "Desarrollador" llene
            la línea, y topado por el alto para que las tres líneas quepan. */}
        <h1 className="font-display text-[min(calc((100vw-3rem)/6.9),22vh)] uppercase leading-[0.86] tracking-[0.05em] text-ink md:text-[min(calc((100vw-5rem)/6.9),24vh)] lg:text-[min(calc((100vw-26rem)/6.9),155px,26vh)]">
          <span
            ref={titleRef}
            className={`inline-block will-change-transform ${reducedMotion ? '' : 'whitespace-nowrap'}`}
          >
            Desarrollador
            <br />
            <span className="pl-[0.6em]">web que</span>
            <br />
            entiende el negocio<span className="text-accent">.</span>
          </span>
        </h1>

        <div className="w-full max-w-xs self-end font-mono text-xs text-ink-soft md:text-sm">
          <p className="text-right uppercase tracking-wider">
            Carlos <span className="text-accent">/</span> React - Laravel
          </p>
          {/* Formato ficha: etiqueta, puntos de guía y valor. Cada fila entera
              es el enlace, así el objetivo táctil es la línea completa. */}
          <ul className="mt-3 space-y-1">
            {heroRows.map((row) => (
              <li key={row.label}>
                <a
                  href={row.href}
                  {...(row.download
                    ? { download: true }
                    : { target: '_blank', rel: 'noopener noreferrer' })}
                  className="group flex items-baseline gap-2 py-1 uppercase tracking-wider"
                >
                  <span>{row.label}</span>
                  <span aria-hidden className="flex-1 translate-y-[-0.2em] border-b border-dotted border-ink/40" />
                  <span className="normal-case tracking-normal text-ink underline decoration-transparent underline-offset-4 transition-colors duration-300 group-hover:decoration-accent group-focus-visible:decoration-accent">
                    {row.value} <span aria-hidden>{row.download ? '↓' : '↗'}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
