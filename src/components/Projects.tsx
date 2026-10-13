import { useState } from 'react'
import SectionHeading from './SectionHeading'
import { projects } from '../data/portfolio'

/**
 * Sección Proyectos: índice editorial, una fila por proyecto, todos legibles
 * de un vistazo. La captura no sale al pasar el ratón: al hacer click en una
 * fila se despliega debajo con el enlace al proyecto, y se pliega la que
 * estuviera abierta. Mismo comportamiento con ratón, teclado y táctil.
 */
export default function Projects() {
  const [open, setOpen] = useState<number | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section id="proyectos" className="py-20 md:py-28">
      <div className="container-content">
        <SectionHeading index="002" title="Proyectos" />

        <ul className="mt-12 border-t border-ink/15 md:mt-16" onPointerLeave={() => setHovered(null)}>
          {projects.map((project, i) => {
            const isOpen = open === i
            const highlighted = isOpen || hovered === i
            const panelId = `proyecto-${project.id}`
            return (
              <li key={project.id} className="border-b border-ink/15">
                {/* Patrón de acordeón accesible: el botón va dentro del
                    encabezado (un <h3> no puede ir dentro de un <button>). */}
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    onPointerEnter={() => setHovered(i)}
                    className="grid w-full grid-cols-[auto_1fr_auto] items-baseline gap-x-4 py-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-4 focus-visible:ring-offset-paper md:grid-cols-[3rem_1fr_16rem_auto] md:gap-x-8 md:py-8"
                  >
                    <span
                      className={`font-mono text-sm transition-colors duration-300 ${highlighted ? 'text-accent' : 'text-ink-soft'}`}
                    >
                      {project.id}
                    </span>

                    <span className="min-w-0">
                      <span
                        className={`block font-mono text-2xl font-bold leading-tight text-ink transition-transform duration-500 ease-expo md:text-4xl ${
                          highlighted ? 'translate-x-3' : ''
                        }`}
                      >
                        {project.title}
                      </span>
                      <span className="mt-2 block max-w-xl text-sm leading-relaxed text-ink-soft">
                        {project.description}
                      </span>
                      {/* Stack bajo el título en móvil; en md+ tiene su columna. */}
                      <span className="mt-2 block font-mono text-xs uppercase tracking-wider text-ink-soft md:hidden">
                        {project.stack}
                      </span>
                    </span>

                    <span className="hidden font-mono text-xs uppercase tracking-wider text-ink-soft md:block">
                      {project.stack}
                    </span>

                    {/* "+" que gira a "×" al abrir. */}
                    <span
                      aria-hidden
                      className={`text-3xl leading-none transition-[transform,color] duration-300 ease-expo md:text-4xl ${
                        isOpen ? 'rotate-45 text-accent' : highlighted ? 'text-accent' : 'text-ink'
                      }`}
                    >
                      +
                    </span>
                  </button>
                </h3>

                {/* Panel desplegable: la transición de `grid-template-rows` de
                    0fr a 1fr anima el alto real sin tener que medirlo.
                    `invisible` al cerrar saca el enlace del orden de tabulación. */}
                <div
                  id={panelId}
                  className={`grid transition-[grid-template-rows,visibility] duration-500 ease-expo ${
                    isOpen ? 'visible grid-rows-[1fr]' : 'invisible grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pb-8 md:pl-[5rem] md:pr-[4rem]">
                      {project.image && (
                        // alt vacío: el título del proyecto está justo encima.
                        <img
                          src={project.image}
                          alt=""
                          loading="lazy"
                          className="h-auto w-full max-w-3xl rounded-lg border border-ink/15"
                        />
                      )}
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-5 inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-ink underline decoration-accent underline-offset-4"
                        >
                          Ver proyecto <span aria-hidden>↗</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
