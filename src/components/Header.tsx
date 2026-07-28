import { useEffect, useRef, useState } from 'react'

/** Enlaces de navegación; el href apunta al id de cada sección. */
const navLinks = [
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Experiencia', href: '#experiencia' },
  // La etiqueta es la de la sección de destino: "Sobre mí" prometía otra cosa
  // y aterrizaba igualmente en el bloque titulado "Estudios".
  { label: 'Estudios', href: '#estudios' },
  { label: 'Servicios', href: '#servicios' },
]

/**
 * Header fijo: logo a la izquierda, navegación centrada y botón pill a la
 * derecha. En móvil la navegación colapsa en un menú hamburguesa.
 */
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  // Escape cierra el menú y devuelve el foco al botón que lo abrió: si el foco
  // se quedara dentro del menú plegado, el siguiente Tab saltaría desde un
  // punto que ya no se ve. Solo se engancha con el menú abierto.
  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setMenuOpen(false)
      toggleRef.current?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-paper/80 backdrop-blur-sm">
      <div className="container-content flex h-16 items-center justify-between md:h-20">
        {/* Logo */}
        <a href="#inicio" className="flex items-center gap-2 text-lg font-bold text-ink">
          <span className="text-xl leading-none">/</span>
          <span>Carlos</span>
        </a>

        {/* Navegación centrada (desktop) */}
        <nav
          aria-label="Principal"
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink transition-colors duration-300 hover:text-ink-soft"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Botón hamburguesa (móvil) */}
        <button
          ref={toggleRef}
          type="button"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          aria-controls="menu-movil"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`block h-0.5 w-6 bg-ink transition-transform duration-300 ${
              menuOpen ? 'translate-y-2 rotate-45' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-ink transition-opacity duration-300 ${
              menuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-ink transition-transform duration-300 ${
              menuOpen ? '-translate-y-2 -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      {/* Menú móvil desplegable.
          `invisible` al cerrar no es decorativo: con solo `max-h-0` el menú
          queda plegado pero sus enlaces siguen recibiendo el foco del teclado,
          así que se tabulaba dentro de un menú que no se ve. `visibility` los
          saca del orden de tabulación, y al ir en la transición se aplica al
          final del plegado (y de inmediato al abrir), sin cortar la animación. */}
      <div
        id="menu-movil"
        className={`overflow-hidden border-t border-ink/10 bg-paper transition-[max-height,visibility] duration-300 md:hidden ${
          menuOpen ? 'visible max-h-96' : 'invisible max-h-0'
        }`}
      >
        <nav aria-label="Principal (móvil)" className="container-content flex flex-col gap-1 py-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="py-2 text-base font-medium text-ink transition-colors duration-300 hover:text-ink-soft"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
