import { useEffect, useRef, useState } from 'react'
import SectionHeading from './SectionHeading'
import useMediaQuery from '../hooks/useMediaQuery'
import { projects } from '../data/portfolio'

/** Desplazamiento de la preview respecto al cursor, para no taparlo. */
const PREVIEW_OFFSET = { x: 24, y: -90 }
/** Fracción del camino al cursor que recorre la preview en cada frame (0–1). */
const FOLLOW_EASE = 0.18

/**
 * Sección Proyectos: índice editorial, una fila por proyecto. Todos se leen
 * de un vistazo; con ratón, al pasar por una fila su captura aparece flotando
 * y sigue al cursor. En táctil (o en pantallas estrechas) la captura va
 * dentro de cada fila.
 */
export default function Projects() {
  // Preview flotante solo con ratón y en lg+: más estrecho no hay hueco para
  // ella junto a las filas, así que va dentro de cada fila como en táctil.
  const canHover = useMediaQuery('(hover: hover) and (pointer: fine) and (min-width: 1024px)')
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [hovered, setHovered] = useState<number | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })

  // La preview persigue al cursor con un lerp por frame: queda "un poco
  // detrás", que es lo que le da peso. Con reduced-motion va pegada.
  useEffect(() => {
    if (!canHover) return
    let frame = 0
    const tick = () => {
      const ease = reducedMotion ? 1 : FOLLOW_EASE
      current.current.x += (target.current.x - current.current.x) * ease
      current.current.y += (target.current.y - current.current.y) * ease
      if (previewRef.current) {
        previewRef.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [canHover, reducedMotion])

  const onPointerMove = (e: React.PointerEvent) => {
    target.current = { x: e.clientX + PREVIEW_OFFSET.x, y: e.clientY + PREVIEW_OFFSET.y }
  }

  const onPointerEnterList = (e: React.PointerEvent) => {
    // Al entrar, la preview arranca ya en el cursor en vez de cruzar la pantalla.
    onPointerMove(e)
    current.current = { ...target.current }
  }

  return (
    <section id="proyectos" className="py-20 md:py-28">
      <div className="container-content">
        <SectionHeading index="002" title="Proyectos" />

        <ul
          className="mt-12 border-t border-ink/15 md:mt-16"
          onPointerEnter={canHover ? onPointerEnterList : undefined}
          onPointerMove={canHover ? onPointerMove : undefined}
          onPointerLeave={() => setHovered(null)}
        >
          {projects.map((project, i) => {
            const active = hovered === i
            const dimmed = hovered !== null && !active
            return (
              <li key={project.id} className="border-b border-ink/15">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onPointerEnter={() => setHovered(i)}
                  onFocus={() => setHovered(i)}
                  onBlur={() => setHovered(null)}
                  className={`grid grid-cols-[auto_1fr_auto] items-baseline gap-x-4 py-6 transition-opacity duration-300 md:grid-cols-[3rem_1fr_16rem_auto] md:gap-x-8 md:py-8 ${
                    dimmed ? 'opacity-40' : ''
                  }`}
                >
                  <span
                    className={`font-mono text-sm transition-colors duration-300 ${active ? 'text-accent' : 'text-ink-soft'}`}
                  >
                    {project.id}
                  </span>

                  <div className="min-w-0">
                    <h3
                      className={`font-mono text-2xl font-bold leading-tight text-ink transition-transform duration-500 ease-expo md:text-4xl ${
                        active ? 'translate-x-3' : ''
                      }`}
                    >
                      {project.title}
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">{project.description}</p>
                    {/* Stack bajo el título en móvil; en md+ tiene su columna. */}
                    <span className="mt-2 block font-mono text-xs uppercase tracking-wider text-ink-soft md:hidden">
                      {project.stack}
                    </span>
                    {!canHover && project.image && (
                      <img
                        src={project.image}
                        alt=""
                        loading="lazy"
                        className="mt-4 h-auto w-full rounded-lg border border-ink/15"
                      />
                    )}
                  </div>

                  <span className="hidden font-mono text-xs uppercase tracking-wider text-ink-soft md:block">
                    {project.stack}
                  </span>

                  <span
                    aria-hidden
                    className={`text-2xl transition-all duration-300 md:text-3xl ${
                      active ? '-translate-y-1 translate-x-1 text-accent' : 'text-ink'
                    }`}
                  >
                    ↗
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Preview flotante (solo con ratón). Decorativa: alt vacío y fuera del
          árbol de accesibilidad, el título ya está en la fila. Todas las
          capturas montadas a la vez para que el cambio entre filas sea un
          fundido y no una carga. */}
      {canHover && (
        <div
          ref={previewRef}
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-30"
        >
          <div
            // Misma proporción que las capturas (~1900×1010) para que no se recorten.
            className={`relative aspect-[1.88] w-[400px] overflow-hidden rounded-lg border border-ink/15 bg-paper shadow-2xl transition-[opacity,transform] duration-300 ease-expo ${
              hovered !== null ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
            }`}
          >
            {projects.map((project, i) =>
              project.image ? (
                <img
                  key={project.id}
                  src={project.image}
                  alt=""
                  className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${
                    hovered === i ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ) : null,
            )}
          </div>
        </div>
      )}
    </section>
  )
}
