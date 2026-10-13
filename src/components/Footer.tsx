import { socials } from '../data/portfolio'

/** Enlace dentro del colofón: en tinta y subrayado rojo al pasar el ratón. */
function Credit({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-ink underline decoration-transparent underline-offset-4 transition-colors duration-300 hover:decoration-accent focus-visible:decoration-accent"
    >
      {children}
    </a>
  )
}

/**
 * Footer: logo, enlaces a redes y copyright, y debajo un colofón con el
 * stack con el que está hecha la web (al estilo del de brittanychiang.com).
 */
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-ink/15 py-12">
      <div className="container-content flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        {/* Logo */}
        <a href="#inicio" className="flex items-center gap-2 text-lg font-bold text-ink">
          <span className="text-xl leading-none text-accent">/</span>
          <span>Carlos</span>
        </a>

        {/* Redes */}
        <nav aria-label="Redes sociales" className="flex flex-wrap gap-6">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              // py-2 sube el alto del objetivo de 20px a 36px, por encima del
              // mínimo de 24px de WCAG 2.5.8 (mismo motivo que en el hero).
              // -my-2 recupera el hueco añadido para no descuadrar la fila.
              className="-my-2 py-2 text-sm font-medium text-ink-soft transition-colors duration-300 hover:text-ink"
            >
              {social.label}
            </a>
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-xs text-ink-soft">
          © {year} Carlos. Todos los derechos reservados.
        </p>
      </div>

      {/* Colofón */}
      <div className="container-content mt-10">
        <p className="max-w-xl text-sm leading-relaxed text-ink-soft">
          Hecha con <Credit href="https://react.dev">React</Credit>,{' '}
          <Credit href="https://www.typescriptlang.org">TypeScript</Credit> y{' '}
          <Credit href="https://tailwindcss.com">Tailwind CSS</Credit> sobre{' '}
          <Credit href="https://vite.dev">Vite</Credit>, con scroll suave de{' '}
          <Credit href="https://lenis.darkroom.engineering">Lenis</Credit> y animaciones con{' '}
          <Credit href="https://gsap.com">GSAP</Credit> y <Credit href="https://animejs.com">anime.js</Credit>, y
          desplegada en <Credit href="https://pages.github.com">GitHub Pages</Credit>. El acordeón de Experiencia y
          las fichas de Estudios son componentes de <Credit href="https://reactbits.dev">React Bits</Credit>, y la
          rueda de navegación está inspirada en su Option Wheel. Los titulares usan{' '}
          <Credit href="https://fonts.google.com/specimen/Anton">Anton</Credit>, el contenido{' '}
          <Credit href="https://fonts.google.com/specimen/JetBrains+Mono">JetBrains Mono</Credit> y el texto{' '}
          <Credit href="https://fonts.google.com/specimen/Inter">Inter</Credit>.
        </p>
      </div>
    </footer>
  )
}
