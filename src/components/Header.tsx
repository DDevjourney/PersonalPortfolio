import { useEffect, useRef, useState } from 'react'
import useActiveSection from '../hooks/useActiveSection'
import useMediaQuery from '../hooks/useMediaQuery'
import { setScrollLocked } from '../hooks/useSmoothScroll'
import { NAV_ITEMS } from '../data/sections'

/**
 * Cabecera de móvil y tablet (por debajo de lg): logo y un botón "Menú" que
 * abre una capa a pantalla completa con las secciones en Anton, como la rueda
 * de escritorio: la sección actual en negro y las demás en gris. En lg+ se
 * oculta: la navegación pasa a la rueda lateral de `SideNav`.
 */
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const activeId = useActiveSection(NAV_ITEMS)
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const close = () => setMenuOpen(false)

  // Con el menú abierto la página no se mueve por debajo, y se libera al
  // cerrarlo o al desmontar. Escape cierra y devuelve el foco al botón: si
  // se quedara dentro de la capa plegada, el siguiente Tab saltaría desde un
  // punto que ya no se ve.
  useEffect(() => {
    if (!menuOpen) return
    setScrollLocked(true)
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setMenuOpen(false)
      toggleRef.current?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      setScrollLocked(false)
    }
  }, [menuOpen])

  // Si se ensancha la ventana hasta lg+, la capa se oculta pero el estado
  // seguiría abierto: se cierra para soltar el bloqueo del scroll.
  useEffect(() => {
    if (isDesktop) setMenuOpen(false)
  }, [isDesktop])

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-paper/80 backdrop-blur-sm lg:hidden">
        <div className="container-content flex h-16 items-center justify-between md:h-20">
          <a href="#inicio" onClick={close} className="flex items-center gap-2 text-lg font-bold text-ink">
            <span className="text-xl leading-none text-accent">/</span>
            <span>Carlos</span>
          </a>

          <button
            ref={toggleRef}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="menu-movil"
            onClick={() => setMenuOpen((v) => !v)}
            // El alto lleva el objetivo táctil a 44px.
            className="-mr-2 flex h-11 items-center px-2 font-mono text-sm uppercase tracking-wider text-ink underline decoration-accent decoration-2 underline-offset-8"
          >
            {menuOpen ? 'Cerrar' : 'Menú'}
          </button>
        </div>
      </header>

      {/* Capa del menú. Va fuera del <header>: su `backdrop-filter` haría que un
          `fixed` hijo midiera contra la cabecera y no contra la pantalla. Z por
          debajo de la cabecera para que el botón "Cerrar" siga a la vista.
          `invisible` al cerrar saca los enlaces del orden de tabulación. */}
      <div
        id="menu-movil"
        className={`fixed inset-0 z-40 flex flex-col justify-center bg-paper px-6 pb-8 pt-24 transition-[opacity,visibility] duration-300 lg:hidden ${
          menuOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <nav aria-label="Principal">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item, i) => {
              const active = item.id === activeId
              return (
                <li
                  key={item.id}
                  // Entran escalonadas, de abajo arriba al abrir.
                  style={{ transitionDelay: menuOpen ? `${80 + i * 50}ms` : '0ms' }}
                  className={`transition-[opacity,transform] duration-500 ease-expo ${
                    menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                  }`}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={close}
                    aria-current={active ? 'location' : undefined}
                    className={`block py-1 font-display text-[min(17vw,10dvh)] uppercase leading-[1.02] tracking-[0.02em] transition-colors duration-300 focus-visible:outline-none focus-visible:underline focus-visible:decoration-accent focus-visible:decoration-4 focus-visible:underline-offset-8 ${
                      active ? 'text-ink' : 'text-ink-faint'
                    }`}
                  >
                    {item.title}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </>
  )
}
