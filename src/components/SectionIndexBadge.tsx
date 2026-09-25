import useActiveSection from '../hooks/useActiveSection'
import { SECTIONS } from '../data/sections'

/**
 * Indicador fijo tipo "01 | 06" en la esquina inferior izquierda, junto al
 * raíl de progreso. Oculto en móvil por la misma razón que el raíl: a 24px
 * de margen no hay hueco para un elemento fijo adicional.
 */
export default function SectionIndexBadge() {
  const activeId = useActiveSection(SECTIONS)
  const active = SECTIONS.find((section) => section.id === activeId) ?? SECTIONS[0]

  return (
    <div
      aria-hidden
      className="fixed bottom-6 left-6 z-40 hidden items-center gap-2 font-archivo text-xs tracking-wider text-ink-soft md:left-10 md:bottom-10 md:flex lg:left-16"
    >
      <span>{active.index.slice(-2)}</span>
      <span className="text-ink-faint">|</span>
      <span>{SECTIONS.length.toString().padStart(2, '0')}</span>
    </div>
  )
}
