/**
 * Hero a dos columnas: titular enorme a la izquierda y, a la derecha,
 * foto circular + presentación breve.
 */
export default function Hero() {
  return (
    <section id="inicio" className="pt-28 md:pt-36">
      <div className="container-content">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-10">
          {/* Columna izquierda (~60%): titular */}
          <div className="lg:w-3/5">
            <h1 className="font-display text-5xl uppercase leading-[0.95] text-ink sm:text-7xl md:text-8xl lg:text-[7rem]">
              Desarrollador
              <br />
              Web
              <br />
              <span className="text-ink-soft">&lt;Builder /&gt;</span>
            </h1>
          </div>

          {/* Columna derecha (~40%): foto + presentación */}
          <div className="flex flex-col gap-6 lg:w-2/5">
            {/* Foto circular de perfil */}
            <div className="flex justify-start lg:justify-end">
              <img
                src="/perfil.jpg"
                alt="Carlos, desarrollador web"
                className="h-32 w-32 rounded-full object-cover md:h-40 md:w-40"
              />
            </div>

            <p className="text-lg font-bold leading-snug text-ink">
              Soy Carlos, desarrollador web y quiero construir tu identidad digital.
            </p>

            <hr className="hairline" />

            <p className="text-sm leading-relaxed text-ink-soft">
              Profesional del Desarrollo de Aplicaciones Web con base sólida en PHP, JavaScript, Laravel y React. Me gusta crear experiencias intuitivas y
              funcionales para usuarios y negocios.
            </p>

            <a
              href="#skills"
              className="inline-flex items-center gap-2 text-sm font-bold text-ink transition-opacity duration-300 hover:opacity-60"
            >
              Desliza <span aria-hidden>↓</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
