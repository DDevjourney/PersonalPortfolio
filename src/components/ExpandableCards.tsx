import { useEffect, useRef, useState } from 'react'
import SectionHeading from './SectionHeading'
import type { ExpandableItem } from '../data/types'

interface ExpandableCardsProps {
  /** id del <section> para el scroll de navegación (p. ej. "experiencia") */
  sectionId: string
  /** Número de sección ("003", "004"...) */
  index: string
  /** Título de la sección */
  title: string
  /** Datos de las cartas (experiencia o estudios) */
  items: ExpandableItem[]
}

/**
 * Sección con cartas expandibles, compartida por Experiencia y Estudios.
 *
 * Comportamiento:
 *  - Por defecto, todas las cartas muestran solo su título.
 *  - Al hacer click en una carta, esta se expande (en desktop crece a lo
 *    ancho usando flex-grow y se "centra" visualmente al ocupar el espacio;
 *    las demás se reducen) revelando la descripción.
 *  - Solo una puede estar expandida a la vez. Click de nuevo o fuera = cerrar.
 *  - En móvil las cartas se apilan y se expanden hacia abajo (max-height).
 */
export default function ExpandableCards({
  sectionId,
  index,
  title,
  items,
}: ExpandableCardsProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Cerrar al hacer click fuera del grupo de cartas.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggle = (id: string) => setActiveId((current) => (current === id ? null : id))

  return (
    <section id={sectionId} className="py-20 md:py-28">
      <div className="container-content">
        <SectionHeading index={index} title={title} />

        <div
          ref={containerRef}
          className="mt-12 flex flex-col gap-4 md:flex-row md:items-stretch"
        >
          {items.map((item) => {
            const isActive = activeId === item.id
            const isDimmed = activeId !== null && !isActive

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggle(item.id)}
                aria-expanded={isActive}
                className={[
                  'group relative overflow-hidden rounded-2xl border border-ink/20 text-left',
                  'transition-all duration-500 ease-in-out',
                  // Desktop: control del ancho con flex-grow.
                  isActive
                    ? 'md:flex-[3] bg-ink text-paper'
                    : isDimmed
                      ? 'md:flex-[0.6] bg-paper text-ink opacity-70 hover:opacity-100'
                      : 'md:flex-1 bg-paper text-ink hover:bg-ink/5',
                ].join(' ')}
              >
                {/* Cara frontal: siempre visible */}
                <div className="flex min-h-[8rem] flex-col justify-between gap-6 p-6 md:min-h-[20rem]">
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className={`text-xs uppercase tracking-wider transition-colors duration-300 ${
                        isActive ? 'text-paper/60' : 'text-ink-soft'
                      }`}
                    >
                      {item.period}
                    </span>
                    <span
                      className={`flex h-7 w-7 flex-none items-center justify-center rounded-full border text-xs transition-transform duration-300 ${
                        isActive
                          ? 'rotate-45 border-paper/40 text-paper'
                          : 'border-ink/30 text-ink-soft'
                      }`}
                      aria-hidden
                    >
                      +
                    </span>
                  </div>

                  <div>
                    <h3
                      className={`font-archivo text-xl font-bold leading-tight transition-colors duration-300 md:text-2xl ${
                        isActive ? 'text-paper' : 'text-ink'
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={`mt-1 text-sm transition-colors duration-300 ${
                        isActive ? 'text-paper/70' : 'text-ink-soft'
                      }`}
                    >
                      {item.subtitle}
                    </p>

                    {/* Descripción revelada al expandir.
                        Desktop: fade + ancho extra. Móvil: max-height. */}
                    <div
                      className={`grid transition-all duration-500 ease-in-out ${
                        isActive
                          ? 'mt-4 grid-rows-[1fr] opacity-100'
                          : 'mt-0 grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <p className="overflow-hidden text-justify text-sm leading-relaxed text-paper/80">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <p className="mt-6 text-xs text-ink-soft">
          Haz click en una carta para ver los detalles.
        </p>
      </div>
    </section>
  )
}
