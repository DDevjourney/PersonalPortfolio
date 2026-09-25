import useActiveSection from '../hooks/useActiveSection'
import { SECTIONS } from '../data/sections'

/**
 * Indicador fijo "01 · 06" en la esquina inferior izquierda. Centrado
 * exactamente sobre la línea de `ScrollProgressRail` (mismo `left`,
 * `-translate-x-1/2`): la propia línea actúa de divisor, con el número
 * actual a su izquierda y el total a su derecha. Oculto en móvil por la
 * misma razón que el raíl: a 24px de margen no hay hueco para un elemento
 * fijo adicional.
 */
export default function SectionIndexBadge() {
  const activeId = useActiveSection(SECTIONS)
  const active = SECTIONS.find((section) => section.id === activeId) ?? SECTIONS[0]

  return (
    <div
      aria-hidden
      className="fixed bottom-6 left-6 z-40 hidden -translate-x-1/2 items-center gap-4 font-archivo text-xs tracking-wider text-ink-soft md:left-10 md:bottom-10 md:flex lg:left-16"
    >
      <span>{active.index.slice(-2)}</span>
      <span>{SECTIONS.length.toString().padStart(2, '0')}</span>
    </div>
  )
}
