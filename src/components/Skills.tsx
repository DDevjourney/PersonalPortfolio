import SectionHeading from './SectionHeading'
import { skills } from '../data/portfolio'

/**
 * Sección Skills: cabecera editorial + rejilla de tarjetas sobrias.
 * Cada tarjeta muestra el nombre en bold y su categoría en gris.
 */
export default function Skills() {
  return (
    <section id="skills" className="py-20 md:py-28">
      <div className="container-content">
        <SectionHeading index="001" title="Skills" />

        <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink/15 bg-ink/15 sm:grid-cols-3 lg:grid-cols-6">
          {skills.map((skill) => (
            <div
              key={skill.name}
              className="group flex flex-col gap-1 bg-paper p-6 transition-colors duration-300 hover:bg-ink"
            >
              <span className="font-archivo text-xl font-bold text-ink transition-colors duration-300 group-hover:text-paper">
                {skill.name}
              </span>
              <span className="text-xs uppercase tracking-wider text-ink-soft transition-colors duration-300 group-hover:text-paper/70">
                {skill.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
