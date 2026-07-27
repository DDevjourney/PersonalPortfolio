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
            <div className="flex justify-start lg:justify-center">
              {/* El recorte va en el contenedor, no en la <img>: la imagen es
                  cuadrada igual que el hueco, así que con `object-cover` a
                  secas se ve entera y encogerla no quita nada de pared, solo
                  la hace más pequeña. El `scale` de dentro es lo que deja
                  fuera del círculo la franja lateral: 1.3 recorta un 15% por
                  cada lado. El origen va arriba y no centrado porque la cabeza
                  empieza a ~10px del borde superior del archivo: centrado, el
                  recorte vertical se la cortaba. Anclado arriba, esos 100px
                  salen todos por abajo, que es camiseta.
                  El aro marca el borde, que sobre el papel se difuminaba. */}
              <div className="h-32 w-32 overflow-hidden rounded-full ring-1 ring-ink/15 md:h-40 md:w-40">
                {/* width/height son los del archivo (432×432): le dan al
                    navegador la proporción para reservar el hueco antes de
                    descargarla. Es la imagen del primer viewport, de ahí la
                    prioridad alta de descarga. */}
                <img
                  src="/perfil.jpg"
                  alt="Carlos, desarrollador web"
                  width={432}
                  height={432}
                  fetchPriority="high"
                  className="h-full w-full origin-top scale-[1.3] object-cover"
                />
              </div>
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
              // py-2 no es estético: sube el alto del objetivo de 20px a 36px,
              // por encima del mínimo de 24px de WCAG 2.5.8.
              className="inline-flex w-fit items-center gap-2 py-2 text-sm font-bold text-ink transition-opacity duration-300 hover:opacity-60"
            >
              Desliza <span aria-hidden>↓</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
