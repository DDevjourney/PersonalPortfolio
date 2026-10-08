import SectionHeading from './SectionHeading'
import DepthCarousel from './DepthCarousel'
import useMediaQuery from '../hooks/useMediaQuery'
import { projects } from '../data/portfolio'

/** Por breakpoint de Tailwind (sm 640, lg 1024, xl 1280). */
const CARD_SIZES = {
  base: { cardWidth: 270, cardHeight: 400, spread: 30 },
  sm: { cardWidth: 420, cardHeight: 420, spread: 70 },
  lg: { cardWidth: 560, cardHeight: 440, spread: 100 },
  xl: { cardWidth: 680, cardHeight: 460, spread: 140 },
}

/**
 * Sección Proyectos: pila de tarjetas en profundidad (`DepthCarousel`).
 * Solo la tarjeta del frente tiene el enlace operable; las de detrás están
 * `aria-hidden`, así que su enlace sale también del orden de tabulación.
 */
export default function Projects() {
  // Tamaño por tramo para que la pila ocupe el ancho disponible sin que el
  // carrusel tenga que encogerla. En móvil, además, sin flechas (se navega
  // deslizando o con los puntos).
  const isWide = useMediaQuery('(min-width: 640px)')
  const isLarge = useMediaQuery('(min-width: 1024px)')
  const isXl = useMediaQuery('(min-width: 1280px)')
  const size = CARD_SIZES[isXl ? 'xl' : isLarge ? 'lg' : isWide ? 'sm' : 'base']

  return (
    <section id="proyectos" className="py-20 md:py-28">
      <div className="container-content">
        <SectionHeading index="002" title="Proyectos" />

        <div className="relative mt-12 h-[500px] sm:h-[560px] lg:h-[580px] xl:h-[600px]">
          <DepthCarousel
            items={projects}
            getKey={(project) => project.id}
            ariaLabel="Proyectos"
            {...size}
            visibleCards={3}
            showControls={isWide}
            renderItem={(project, isActive) => (
              <div className="flex h-full flex-col text-ink">
                {project.image && (
                  // alt vacío: el título del proyecto va justo debajo, así
                  // que la captura es decorativa para un lector de pantalla.
                  <img
                    src={project.image}
                    alt=""
                    loading="lazy"
                    draggable={false}
                    className="pointer-events-none h-36 w-full shrink-0 select-none border-b border-ink/15 object-cover object-top sm:h-48 lg:h-56 xl:h-64"
                  />
                )}

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-baseline gap-3">
                    <span className="font-archivo text-sm font-medium text-ink-soft">{project.id}</span>
                    <h3 className="font-archivo text-2xl font-bold leading-tight">{project.title}</h3>
                  </div>
                  <span className="mt-1 block text-xs uppercase tracking-wider text-ink-soft">
                    {project.stack}
                  </span>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{project.description}</p>

                  {project.url && (
                    <div className="mt-auto pt-4">
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        tabIndex={isActive ? 0 : -1}
                        className={`pill gap-1 ${isActive ? '' : 'pointer-events-none'}`}
                      >
                        Ver proyecto <span aria-hidden>↗</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </section>
  )
}
