import { useRef } from 'react'
import SectionHeading from './SectionHeading'
import useNodeLineExtent from '../hooks/useNodeLineExtent'
import useStaggerReveal from '../hooks/useStaggerReveal'
import type { ExpandableItem } from '../data/types'

interface EducationTimelineProps {
  /** id del <section> para el scroll de navegación (p. ej. "estudios") */
  sectionId: string
  /** Número de sección ("003", "004"...) */
  index: string
  /** Título de la sección */
  title: string
  /** Datos de las titulaciones que forman el timeline */
  items: ExpandableItem[]
  /**
   * Cursos/certificados complementarios: menor peso que las titulaciones de
   * `items`, así que no entran en el timeline — se muestran como chips al
   * final de la sección.
   */
  certifications?: ExpandableItem[]
}

/**
 * Sección Estudios: timeline vertical, deliberadamente distinta del
 * carrusel de Experiencia (`MotionCarousel`). El raíl es una línea estática
 * (sin animación de scroll) que solo ocupa el tramo entre el primer y el
 * último nodo (`useNodeLineExtent`), y cada titulación entra con fade +
 * slide escalonado al llegar al viewport (`useStaggerReveal`), sin
 * depender de drag/click.
 */
export default function EducationTimeline({
  sectionId,
  index,
  title,
  items,
  certifications = [],
}: EducationTimelineProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const lineExtent = useNodeLineExtent(trackRef, '[data-timeline-dot]')
  const itemsRef = useStaggerReveal<HTMLDivElement>('[data-timeline-item]')
  const certsRef = useStaggerReveal<HTMLDivElement>('[data-cert-chip]')

  return (
    <section id={sectionId} className="py-20 md:py-28">
      <div className="container-content">
        <SectionHeading index={index} title={title} />

        <div ref={trackRef} className="relative mt-12">
          {/* Raíl: solo entre el primer y el último punto, no toda la sección. */}
          {lineExtent && (
            <div
              className="absolute left-3 w-px bg-ink/25 md:left-4"
              style={{ top: lineExtent.top, height: lineExtent.height }}
              aria-hidden
            />
          )}

          <div ref={itemsRef} className="flex flex-col gap-12">
            {items.map((item) => (
              <div key={item.id} data-timeline-item className="relative pl-10 md:pl-12">
                <span className="text-xs uppercase tracking-wider text-ink-soft">{item.period}</span>

                {/* El punto se centra en esta fila (relative, solo el
                    título), no en el bloque completo: así queda alineado
                    con el título sin importar la altura del period/subtítulo
                    de al lado. left-[-28px]/[-32px] = pl-10/12 (40/48px) -
                    left-3/4 del raíl (12/16px): la misma línea. */}
                <div className="relative mt-1">
                  <span
                    data-timeline-dot
                    className="absolute left-[-28px] top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-paper md:left-[-32px]"
                    aria-hidden
                  />
                  <h3 className="font-archivo text-xl font-bold leading-tight text-ink">{item.title}</h3>
                </div>
                <p className="mt-1 text-sm text-ink-soft">{item.subtitle}</p>
                <p className="mt-3 max-w-2xl text-justify text-sm leading-relaxed text-ink-soft">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {certifications.length > 0 && (
          <div className="mt-16 border-t border-ink/10 pt-10">
            <span className="text-xs uppercase tracking-wider text-ink-soft">
              Cursos y certificaciones
            </span>

            <div ref={certsRef} className="mt-4 flex flex-wrap gap-3">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  data-cert-chip
                  title={cert.subtitle}
                  className="rounded-full border border-ink/20 px-4 py-2 text-sm text-ink transition-colors duration-300 hover:border-ink/50"
                >
                  <span className="font-medium">{cert.title}</span>
                  <span className="ml-2 text-ink-soft">· {cert.period}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
