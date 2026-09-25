import useActiveSection from '../hooks/useActiveSection'
import { SECTIONS } from '../data/sections'

/**
 * Indicador fijo tipo "01 / 06 — SKILLS" en la esquina inferior izquierda,
 * junto al raíl de progreso. Oculto en móvil por la misma razón que el
 * raíl: a 24px de margen no hay hueco para un elemento fijo adicional.
 */
export default function SectionIndexBadge() {
  const activeId = useActiveSection(SECTIONS)
  const active = SECTIONS.find((section) => section.id === activeId) ?? SECTIONS[0]

  return (
    <div
      aria-hidden
      className="fixed bottom-6 left-6 z-40 hidden font-archivo text-xs uppercase tracking-wider text-ink-soft md:left-10 md:bottom-10 md:block lg:left-16"
    >
      {active.index.slice(-2)} / {SECTIONS.length.toString().padStart(2, '0')} — {active.title}
    </div>
  )
}
