import useActiveSection from '../hooks/useActiveSection'
import { SECTIONS } from '../data/sections'

/**
 * Indicador fijo del número de sección actual, justo a la izquierda de la
 * línea de `ScrollProgressRail` (mismo `left`, desplazado con `translate-x`
 * su propio ancho + un hueco de 1rem). Oculto en móvil por la misma razón
 * que el raíl: a 24px de margen no hay hueco para un elemento fijo
 * adicional.
 */
export default function SectionIndexBadge() {
  const activeId = useActiveSection(SECTIONS)
  const active = SECTIONS.find((section) => section.id === activeId) ?? SECTIONS[0]

  return (
    <div
      aria-hidden
      className="fixed bottom-6 left-6 z-40 hidden -translate-x-[calc(100%+1rem)] font-archivo text-xs tracking-wider text-ink-soft md:left-10 md:bottom-10 md:block lg:left-16"
    >
      {active.index.slice(-2)}
    </div>
  )
}
