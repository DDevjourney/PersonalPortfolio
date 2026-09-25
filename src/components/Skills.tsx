import SectionHeading from './SectionHeading'
import MotionCarousel from './MotionCarousel'
import { skills } from '../data/portfolio'
import type { Skill } from '../data/types'

/**
 * Sección Skills: cabecera editorial + carrusel deslizable de tarjetas
 * sobrias. Cada tarjeta muestra el nombre en bold y su categoría en gris,
 * igual que la rejilla anterior; el slide activo se escala ligeramente
 * (ver `MotionCarousel`).
 */
export default function Skills() {
  return (
    <section id="skills" className="py-20 md:py-28">
      <div className="container-content">
        <SectionHeading index="001" title="Skills" />

        <div className="mt-12">
          <MotionCarousel
            items={skills}
            getKey={(skill) => skill.name}
            options={{ loop: true, align: 'start' }}
            renderItem={(skill: Skill) => (
              <div className="flex h-full flex-col gap-1 rounded-2xl border border-ink/15 bg-paper p-6">
                <span className="font-archivo text-xl font-bold text-ink">{skill.name}</span>
                <span className="text-xs uppercase tracking-wider text-ink-soft">{skill.category}</span>
              </div>
            )}
          />
        </div>
      </div>
    </section>
  )
}
