/** Enlaces a redes (placeholders — sustitúyelos por los tuyos). */
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
        <nav className="flex flex-wrap gap-6">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              className="text-sm font-medium text-ink-soft transition-colors duration-300 hover:text-ink"
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
