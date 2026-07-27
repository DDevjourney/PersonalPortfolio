import { useState } from 'react'

/** Enlaces de navegación; el href apunta al id de cada sección. */
const navLinks = [
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Experiencia', href: '#experiencia' },
  { label: 'Sobre mí', href: '#estudios' },
  { label: 'Servicios', href: '#servicios' },
      
]

/**
 * Header fijo: logo a la izquierda, navegación centrada y botón pill a la
 * derecha. En móvil la navegación colapsa en un menú hamburguesa.
 */
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-paper/80 backdrop-blur-sm">
      <div className="container-content flex h-16 items-center justify-between md:h-20">
        {/* Logo */}
        <a href="#inicio" className="flex items-center gap-2 text-lg font-bold text-ink">
          <span className="text-xl leading-none">/</span>
          <span>Carlos</span>
        </a>

        {/* Navegación centrada (desktop) */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
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
          type="button"
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
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

      {/* Menú móvil desplegable */}
      <div
        className={`overflow-hidden border-t border-ink/10 bg-paper transition-[max-height] duration-300 md:hidden ${
          menuOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <nav className="container-content flex flex-col gap-1 py-4">
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
