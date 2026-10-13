import SectionHeading from './SectionHeading'
import AccordionGallery from './AccordionGallery'
import useMediaQuery from '../hooks/useMediaQuery'
import { experience } from '../data/portfolio'

/**
 * Sección Experiencia: acordeón horizontal (`AccordionGallery`), un panel
 * por puesto. Plegado muestra el periodo y la empresa en vertical; el panel
 * expandido (al pasar el ratón, enfocar o tocar) muestra puesto y
 * descripción. Arranca abierto el puesto actual. Por debajo de 520px el
 * acordeón pasa a columna y todos los paneles enseñan su contenido completo.
 */
export default function Experience() {
  // Con menos ancho el panel abierto es más estrecho y la descripción ocupa
  // más líneas: se le da más alto para que no se recorte.
  const isLarge = useMediaQuery('(min-width: 1024px)')

  const items = experience.map((item) => ({
    label: item.title,
    content: (
      <>
        {/* Plegado: periodo arriba, empresa en vertical abajo. */}
        <span className="absolute inset-0 flex flex-col justify-between p-5 transition-opacity duration-300 max-[520px]:hidden [.ag-panel--active_&]:opacity-0">
          <span className="font-mono text-xs uppercase tracking-wider text-paper/60">{item.period}</span>
          <span className="font-mono text-xl font-bold leading-none [writing-mode:vertical-rl] rotate-180">
            {item.title}
          </span>
        </span>

        {/* Expandido. Ancho fijo al del panel abierto (el acordeón expone
            ese tamaño ×1.22 en --ag-media-size) para que el texto no se
            recoloque mientras el panel crece; aparece cuando ya ha abierto. */}
        <span className="absolute inset-y-0 left-0 flex w-[calc(var(--ag-media-size)/1.22)] flex-col justify-between p-6 opacity-0 transition-opacity duration-300 max-[520px]:relative max-[520px]:w-full max-[520px]:opacity-100 [.ag-panel--active_&]:opacity-100 [.ag-panel--active_&]:delay-200">
          <span className="font-mono text-xs uppercase tracking-wider text-paper/60">{item.period}</span>
          <span className="block">
            <span aria-hidden className="mb-4 block h-1 w-10 bg-accent" />
            <span className="block font-mono text-2xl font-bold leading-tight">{item.title}</span>
            {/* Rojo de acento: sobre `ink` da ~5:1, así que aquí sí vale para texto. */}
            <span className="mt-1 block text-sm font-semibold text-accent">{item.subtitle}</span>
            <span className="mt-4 block text-sm leading-relaxed text-paper/85">{item.description}</span>
          </span>
        </span>
      </>
    ),
  }))

  return (
    <section id="experiencia" className="py-20 md:py-28">
      <div className="container-content">
        <SectionHeading index="003" title="Experiencia" />

        <AccordionGallery
          className="mt-12 md:mt-16"
          ariaLabel="Experiencia laboral"
          items={items}
          defaultIndex={0}
          expandRatio={0.6}
          height={isLarge ? 480 : 560}
          gap={12}
          radius={16}
          tilt={4}
          trigger="hover"
          showLabels={false}
          grayscale={false}
          accentColor="#F54949"
          textColor="#E8E6E1"
          panelColor="#1A1A1A"
        />
      </div>
    </section>
  )
}
