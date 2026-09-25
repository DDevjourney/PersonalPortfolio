import SectionHeading from './SectionHeading'
import MotionCarousel from './MotionCarousel'
import { experience } from '../data/portfolio'
import type { ExpandableItem } from '../data/types'

const SLIDE_SIZE_CLASSNAME =
  '[--slide-size:88%] [--slide-spacing:1rem] sm:[--slide-size:70%] md:[--slide-size:52%] lg:[--slide-size:38%]'

/**
 * Sección Experiencia: carrusel de tarjetas (a diferencia de Estudios, que
 * sigue usando `ExpandableCards`). Cada slide muestra ya la descripción
 * completa — al navegar deslizando en vez de expandiendo, no hace falta
 * ocultarla — y la tarjeta activa se invierte a ink/paper, igual que el
 * estado "expandida" de las cartas de Estudios.
 */
export default function Experience() {
  return (
    <section id="experiencia" className="py-20 md:py-28">
      <div className="container-content">
        <SectionHeading index="003" title="Experiencia" />

        <div className="mt-12">
          <MotionCarousel
            items={experience}
            getKey={(item) => item.id}
            // Sin `loop`: con solo 3 tarjetas no hace falta, y combinado con
            // `containScroll: 'keepSnaps'` rompía el propio loop (el botón
            // "siguiente" se quedaba deshabilitado en la última tarjeta).
            // `keepSnaps` solo: por defecto Embla fusiona el snap de la
            // última tarjeta con el anterior cuando no hay suficiente
            // distancia de scroll para alinearla a 'start' (pasa con solo 3
            // slides anchos) — así cada una conserva su propia posición.
            options={{ align: 'start', containScroll: 'keepSnaps' }}
            slideSizeClassName={SLIDE_SIZE_CLASSNAME}
            renderItem={(item: ExpandableItem, isActive) => (
              <div
                className={`flex h-full min-h-[16rem] flex-col justify-between gap-6 rounded-2xl border p-6 transition-colors duration-500 ease-expo ${
                  isActive ? 'border-ink bg-ink text-paper' : 'border-ink/20 bg-paper text-ink'
                }`}
              >
                <span className={`text-xs uppercase tracking-wider ${isActive ? 'text-paper/60' : 'text-ink-soft'}`}>
                  {item.period}
                </span>

                <div>
                  <h3 className="font-archivo break-words text-xl font-bold leading-tight">{item.title}</h3>
                  <p className={`mt-1 text-sm ${isActive ? 'text-paper/70' : 'text-ink-soft'}`}>{item.subtitle}</p>
                  <p
                    className={`mt-4 text-justify text-sm leading-relaxed ${
                      isActive ? 'text-paper/80' : 'text-ink-soft'
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </section>
  )
}
