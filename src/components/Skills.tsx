import { useState } from 'react'
import SectionHeading from './SectionHeading'
import useStaggerReveal from '../hooks/useStaggerReveal'
import { skills } from '../data/portfolio'

/**
 * Sección Skills: muro tipográfico. Todas las tecnologías seguidas a tamaño
 * póster en JetBrains Mono (los titulares van en Anton), separadas por "-",
 * para que se lean de un vistazo sin interactuar. Al pasar por encima de una
 * tecnología se apagan las de las demás categorías.
 */
export default function Skills() {
  const [hovered, setHovered] = useState<string | null>(null)
  const wallRef = useStaggerReveal<HTMLUListElement>('[data-skill]')

  return (
    <section id="skills" className="py-20 md:py-28">
      <div className="container-content">
        <SectionHeading index="001" title="Skills" />

        <ul
          ref={wallRef}
          aria-label="Tecnologías"
          onMouseLeave={() => setHovered(null)}
          className="mt-16 font-mono text-[clamp(1.75rem,4.5vw,4rem)] font-extrabold lowercase leading-[1.1] tracking-tight md:mt-20"
        >
          {skills.map((skill, i) => {
            const dimmed = hovered !== null && hovered !== skill.category
            return (
              <li
                key={skill.name}
                data-skill
                onMouseEnter={() => setHovered(skill.category)}
                className="inline-block whitespace-nowrap"
              >
                <span
                  className={`transition-colors duration-300 ${dimmed ? 'text-ink-faint' : 'text-ink'}`}
                >
                  {skill.name}
                </span>
                {i < skills.length - 1 && (
                  <span aria-hidden className="mx-[0.25em] text-accent">
                    -
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
