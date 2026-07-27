import { useState } from 'react'
import SectionHeading from './SectionHeading'
import { services } from '../data/portfolio'

/**
 * Sección Servicios.
 *  - Cada fila: número, título y descripción en gris a la derecha.
 *  - Al hacer hover sobre una fila, el título y la descripción se aclaran.
 */
export default function Services() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <section id="servicios" className="py-20 md:py-28">
      <div className="container-content">
        {/* Línea separadora fina arriba */}
        <hr className="hairline mb-12" />

        <SectionHeading
          index="005"
          title="Servicios"
          action={
            <a href="#contacto" className="pill">
              Mándame un mensaje
            </a>
          }
        />

        <ul className="mt-12 border-t border-ink/15">
          {services.map((service) => {
            const isHovered = hovered === service.id

            return (
              <li
                key={service.id}
                onMouseEnter={() => setHovered(service.id)}
                onMouseLeave={() => setHovered(null)}
                className="relative border-b border-ink/15"
              >
                <a
                  href="#contacto"
                  className="grid grid-cols-1 items-start gap-3 py-8 md:grid-cols-12 md:items-center md:gap-6"
                >
                  {/* Número */}
                  <span className="font-archivo text-sm font-medium text-ink-soft md:col-span-1">
                    {service.id}
                  </span>

                  {/* El hover oscurece, nunca aclara: `ink-faint` sobre papel
                      queda en 1.69:1 de contraste y el texto desaparecía justo
                      al apuntarlo. El título ya es negro, así que el énfasis lo
                      lleva la descripción, que sube de `ink-soft` a `ink`. */}
                  <h3
                    className="font-display text-3xl uppercase leading-none text-ink transition-colors duration-300 md:col-span-6 md:text-5xl"
                  >
                    {service.title}
                  </h3>

                  {/* Descripción: se oscurece al hover */}
                  <p
                    className={`text-sm leading-relaxed transition-colors duration-300 md:col-span-5 ${
                      isHovered ? 'text-ink' : 'text-ink-soft'
                    }`}
                  >
                    {service.description}
                  </p>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
