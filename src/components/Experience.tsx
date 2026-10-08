import SectionHeading from './SectionHeading'
import FlipCard from './FlipCard'
import useMediaQuery from '../hooks/useMediaQuery'
import { experience } from '../data/portfolio'

/**
 * Sección Experiencia: una `FlipCard` por puesto, las 3 a la vez en fila (a
 * diferencia de Proyectos y Skills, aquí no hay "uno detrás de otro" — cada
 * ficha se gira por separado, como un fichero de tarjetas de archivador).
 * La cara frontal es la ficha cerrada (periodo, puesto, empresa); al
 * girarla aparece la descripción sobre fondo invertido (ink/paper), mismo
 * código de "esto es lo que está en foco" que ya usa `MotionCarousel`.
 */
export default function Experience() {
  const isWide = useMediaQuery('(min-width: 640px)')
  const size = isWide ? { width: 320, height: 400 } : { width: 260, height: 420 }

  return (
    <section id="experiencia" className="py-20 md:py-28">
      <div className="container-content">
        <SectionHeading index="003" title="Experiencia" />

        <div className="mt-12 flex flex-wrap justify-center gap-8">
          {experience.map((item) => (
            <FlipCard
              key={item.id}
              {...size}
              radius={16}
              background="#E8E6E1"
              color="#1A1A1A"
              shadowColor="#1A1A1A"
              shadowOpacity={0.18}
              ariaLabel={`${item.title} en ${item.subtitle} — toca para ver la descripción`}
              front={
                <div className="flex h-full flex-col justify-between rounded-2xl border border-ink/15 bg-paper p-6 text-ink">
                  <span className="text-xs uppercase tracking-wider text-ink-soft">{item.period}</span>
                  <div>
                    <h3 className="font-archivo text-2xl font-bold leading-tight">{item.title}</h3>
                    <p className="mt-1 text-sm text-ink-soft">{item.subtitle}</p>
                  </div>
                </div>
              }
              back={
                <div className="flex h-full flex-col justify-between rounded-2xl bg-ink p-6 text-paper">
                  <span className="text-xs uppercase tracking-wider text-paper/60">{item.period}</span>
                  <div>
                    <h3 className="font-archivo text-lg font-bold leading-tight">{item.title}</h3>
                    <p className="mt-1 text-xs text-paper/70">{item.subtitle}</p>
                    <p className="mt-3 text-sm leading-relaxed text-paper/85">{item.description}</p>
                  </div>
                </div>
              }
            />
          ))}
        </div>
      </div>
    </section>
  )
}
