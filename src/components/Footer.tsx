/** Enlaces a redes. */
const socials = [
  { label: 'GitHub', href: 'https://github.com/DDevjourney' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/cdsp/' },
  { label: 'Email', href: 'mailto:carlosdsp2308@gmail.com' },
]

/** Footer sencillo: logo, enlaces a redes y copyright. */
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-ink/15 py-12">
      <div className="container-content flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        {/* Logo */}
        <a href="#inicio" className="flex items-center gap-2 text-lg font-bold text-ink">
          <span className="text-xl leading-none">/</span>
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
    </footer>
  )
}
