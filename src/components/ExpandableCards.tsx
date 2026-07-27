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

            const panelId = `${sectionId}-${item.id}-panel`

            return (
              <div
                key={item.id}
                className={[
                  'group relative overflow-hidden rounded-2xl border border-ink/20 text-left',
                  // Solo las propiedades que cambian, con la misma curva que el scroll.
                  'transition-[flex-grow,background-color,border-color] duration-700 ease-expo',
                  // El ancho mínimo es igual en los tres estados a propósito: si
                  // solo lo tuvieran las cartas activa/dimmed, al contraer
                  // desaparecería de golpe mientras flex-grow sigue en su valor
                  // inicial y flexbox recalcularía el reparto en un frame (la
                  // carta abierta pegaba un salto de +133px antes de encogerse).
                  // 12.5rem = 200px: 152px de hueco tras el p-6, suficiente para
                  // "Ciberseguridad" (148px a 20px en Archivo bold), que es el
                  // título más largo de todas las secciones.
                  'md:min-w-[8rem] lg:min-w-[12.5rem]',
                  // Desktop: control del ancho con flex-grow.
                  isActive
                    ? 'md:flex-[3] bg-ink text-paper'
                    : isDimmed
                      ? 'md:flex-[0.6] bg-paper-light text-ink hover:bg-ink/5'
                      : 'md:flex-1 bg-paper text-ink hover:bg-ink/5',
                ].join(' ')}
              >
                {/* El disparador es un botón superpuesto que cubre la carta
                    entera, no un <button> envolviendo todo el contenido. Así
                    la descripción queda FUERA del botón: si está dentro, pasa
                    a formar parte de su nombre accesible y un lector de
                    pantalla recita el párrafo completo al enfocarlo, incluso
                    con la carta cerrada. El aria-label fija ese nombre y el
                    aria-controls apunta al panel que despliega. */}
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-expanded={isActive}
                  aria-controls={panelId}
                  aria-label={`${item.title}. ${item.subtitle}. ${item.period}`}
                  className="absolute inset-0 z-10 rounded-2xl"
                />

                {/* Cara frontal: siempre visible */}
                <div className="flex min-h-[8rem] flex-col justify-between gap-6 p-6 md:min-h-[20rem]">
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className={`text-xs uppercase tracking-wider transition-colors duration-700 ease-expo ${
                        isActive ? 'text-paper/60' : 'text-ink-soft'
                      }`}
                    >
                      {item.period}
                    </span>
                    <span
                      className={`flex h-7 w-7 flex-none items-center justify-center rounded-full border text-xs transition-all duration-500 ease-expo ${
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
                      className={`font-archivo break-words text-xl font-bold leading-tight transition-colors duration-700 ease-expo ${
                        isActive ? 'text-paper' : 'text-ink'
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={`mt-1 text-sm transition-colors duration-700 ease-expo ${
                        isActive ? 'text-paper/70' : 'text-ink-soft'
                      }`}
                    >
                      {item.subtitle}
                    </p>

                    {/* Descripción revelada al expandir: el hueco se abre con
                        grid-rows y el texto entra después, escalonado, para que
                        no compita con el ensanchado de la carta. */}
                    <div
                      id={panelId}
                      // Colapsada, la descripción sigue en el DOM para poder
                      // animarla, pero aria-hidden la saca del árbol de
                      // accesibilidad. Es seguro porque dentro no hay nada
                      // enfocable: el botón está fuera de este panel.
                      aria-hidden={!isActive}
                      // z-20 lo deja por encima del botón superpuesto para que
                      // el texto se pueda seleccionar con el ratón. Colapsado
                      // mide 0 de alto, así que no roba clicks. Como efecto
                      // secundario, hacer click sobre la descripción ya no
                      // cierra la carta: se cierra desde el resto de la carta
                      // o pulsando fuera.
                      className={`relative z-20 grid transition-[grid-template-rows,margin-top] duration-700 ease-expo ${
                        isActive ? 'mt-4 grid-rows-[1fr]' : 'mt-0 grid-rows-[0fr]'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p
                          className={`text-justify text-sm leading-relaxed text-paper/80 transition-[opacity,transform] ease-expo ${
                            isActive
                              ? 'translate-y-0 opacity-100 delay-200 duration-500'
                              : 'translate-y-2 opacity-0 delay-0 duration-150'
                          }`}
                        >
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
