import SectionHeading from './SectionHeading'
import { projects } from '../data/portfolio'

/**
 * Sección Proyectos: filas tipo "carta" con número, título + stack y
 * descripción, en línea con el estilo de la sección Servicios.
 * Cada proyecto puede tener su propio enlace (`url`); si lo tiene, la
 * tarjeta es clicable y abre el enlace en una pestaña nueva.
 */
export default function Projects() {
  return (
    <section id="proyectos" className="py-20 md:py-28">
      <div className="container-content">
        <SectionHeading index="002" title="Proyectos" />

        <div className="mt-12 border-t border-ink/15">
          {projects.map((project) => {
            const hasLink = Boolean(project.url)

            // Contenido común de la fila (mismo markup tanto si hay enlace
            // como si no, para no duplicar estilos).
            const content = (
              <>
                {/* Número */}
                <span className="font-archivo text-sm font-medium text-ink-soft md:col-span-1">
                  {project.id}
                </span>

                {/* Título + stack */}
                <div className="md:col-span-6">
                  <h3 className="flex items-center gap-2 font-archivo text-2xl font-bold text-ink transition-colors duration-300 group-hover:text-ink-soft md:text-3xl">
                    {project.title}
                    {hasLink && (
                      <span
                        aria-hidden
                        className="inline-block text-xl transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                      >
                        ↗
                      </span>
                    )}
                  </h3>
                  <span className="text-sm uppercase tracking-wider text-ink-soft">
                    {project.stack}
                  </span>
                </div>

                {/* Descripción */}
                <p className="text-sm leading-relaxed text-ink-soft md:col-span-5">
                  {project.description}
                </p>
              </>
            )

            const rowClass =
              'group grid grid-cols-1 items-baseline gap-2 border-b border-ink/15 py-8 transition-colors duration-300 md:grid-cols-12 md:gap-6'

            // Con enlace: <a> que abre en pestaña nueva. Sin enlace: <div>.
            return hasLink ? (
              <a
                key={project.id}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className={rowClass}
              >
                {content}
              </a>
            ) : (
              <div key={project.id} className={rowClass}>
                {content}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
