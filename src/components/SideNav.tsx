import OptionWheel from './OptionWheel'
import useActiveSection from '../hooks/useActiveSection'
import { scrollToSection } from '../hooks/useSmoothScroll'
import { SECTIONS } from '../data/sections'

/** Items de la rueda: el hero ("Carlos") encima de las secciones numeradas. */
const ITEMS = [{ id: 'inicio', title: 'Carlos' }, ...SECTIONS]
const labels = ITEMS.map((item) => item.title)
const hrefs = ITEMS.map((item) => `#${item.id}`)

/**
 * Navegación principal en desktop (lg+): una rueda fija en la columna
 * izquierda, sustituyendo al header. El item activo lo marca el scrollspy, así
 * que la rueda gira sola al hacer scroll; al elegir uno (click, flechas o
 * arrastre) se desplaza a su sección. Por debajo de lg sigue el header con
 * menú hamburguesa: a ese ancho no hay columna libre para la rueda.
 */
export default function SideNav() {
  const activeId = useActiveSection(ITEMS)
  const activeIndex = Math.max(0, ITEMS.findIndex((item) => item.id === activeId))

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 lg:block">
      <OptionWheel
        ariaLabel="Principal"
        items={labels}
        hrefs={hrefs}
        selected={activeIndex}
        textColor="#B7B3AC"
        activeColor="#1A1A1A"
        side="left"
        fontSize={2.25}
        spacing={1.4}
        curve={1}
        tilt={6}
        blur={1.5}
        fade={0.22}
        smoothing={500}
        inset={96}
        draggable
        className="absolute inset-0 font-display uppercase"
        onChange={(index) => scrollToSection(ITEMS[index].id)}
      />
    </aside>
  )
}
