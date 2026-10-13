import { useEffect, useRef, useState } from 'react'
import SectionHeading from './SectionHeading'
import SplitFlapText from './SplitFlapText'
import { education, certifications } from '../data/portfolio'
import type { ExpandableItem } from '../data/types'

/** Titulaciones principales, cada una con su botón. Orden cronológico. */
const TRACKS = [
  { label: 'Derecho', item: education.find((e) => e.id === 'edu-4')! },
  { label: 'Desarrollo web', item: education.find((e) => e.id === 'edu-2')! },
]
/** Al llegar se ve la formación actual: es lo primero que busca quien contrata. */
const DEFAULT_TRACK = 1

/** Año de inicio y de fin de un periodo como "2015 — 2021" o "2022". */
function years(period: string): [string, string] {
  const found = period.match(/\d{4}/g) ?? []
  return [found[0] ?? '', found[found.length - 1] ?? '']
}

/** Ficha de un año, con su etiqueta debajo. Decorativa: el periodo se lee en el centro. */
function YearBoard({ year, label, align }: { year: string; label: string; align: 'start' | 'end' }) {
  return (
    <div className={align === 'end' ? 'justify-self-end text-right' : ''}>
      <SplitFlapText
        aria-hidden
        text={year}
        padTo={4}
        charset="numeric"
        flipDuration={0.1}
        stagger={0.08}
        flipsPerChar={8}
        tileColor="#1A1A1A"
        textColor="#E8E6E1"
        tileRadius={6}
        gap={6}
        fontSize="clamp(2.25rem, 5vw, 4rem)"
      />
      <p className="mt-3 font-mono text-xs uppercase tracking-wider text-ink-soft">{label}</p>
    </div>
  )
}

/**
 * Sección Estudios: un panel de estación. Dos botones eligen la titulación
 * (Derecho / Desarrollo web); a los lados, sus años de inicio y fin en fichas
 * que giran al cambiar, y en el centro el título, el centro y la descripción.
 * Debajo, los cursos complementarios en formato ficha: al pasar el ratón por
 * uno, las fichas giran a sus años y al salir vuelven a los de la titulación.
 *
 * Las fichas arrancan vacías y giran hasta los años al entrar la sección en
 * pantalla, para que el efecto se vea la primera vez.
 */
export default function Education() {
  const [selected, setSelected] = useState(DEFAULT_TRACK)
  const [preview, setPreview] = useState<ExpandableItem | null>(null)
  const [inView, setInView] = useState(false)
  const boardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = boardRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setInView(true)
        observer.disconnect()
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const current = TRACKS[selected].item
  const [start, end] = inView ? years((preview ?? current).period) : ['', '']

  return (
    <section id="estudios" className="py-20 md:py-28">
      <div className="container-content">
        <SectionHeading index="004" title="Estudios" />

        <div role="group" aria-label="Titulación" className="mt-12 flex flex-wrap gap-3 md:mt-16">
          {/* Seleccionado en rojo con texto en tinta: ~5:1. En color papel
              daría 2.8:1, por debajo del mínimo para texto. */}
          {TRACKS.map((track, i) => (
            <button
              key={track.label}
              type="button"
              aria-pressed={i === selected}
              onClick={() => setSelected(i)}
              className={`rounded-full border px-5 py-2 font-mono text-sm uppercase tracking-wider transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
                i === selected ? 'border-accent bg-accent text-ink' : 'border-ink/30 text-ink hover:border-ink'
              }`}
            >
              {track.label}
            </button>
          ))}
        </div>

        {/* Móvil: fichas arriba (inicio | fin) y el texto debajo. md+: en fila. */}
        <div
          ref={boardRef}
          className="mt-10 grid grid-cols-2 items-start gap-x-6 gap-y-8 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-x-10"
        >
          <YearBoard year={start} label="Inicio" align="start" />

          <div className="order-last col-span-2 md:order-none md:col-span-1">
            <h3 className="font-mono text-2xl font-bold leading-tight text-ink md:text-3xl">{current.title}</h3>
            <p className="mt-2 text-sm text-ink-soft">{current.subtitle}</p>
            <p className="sr-only">{current.period}</p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">{current.description}</p>
          </div>

          <YearBoard year={end} label="Fin" align="end" />
        </div>

        {certifications.length > 0 && (
          <div className="mt-16">
            <h3 className="font-mono text-xs uppercase tracking-wider text-ink-soft">También</h3>
            <ul className="mt-4 space-y-4" onMouseLeave={() => setPreview(null)}>
              {certifications.map((cert) => (
                <li key={cert.id} onMouseEnter={() => setPreview(cert)} className="group cursor-default">
                  <div className="flex items-baseline gap-3 font-mono text-sm uppercase tracking-wider md:text-base">
                    <span
                      className={`underline underline-offset-4 transition-colors duration-300 ${
                        preview?.id === cert.id ? 'decoration-accent' : 'decoration-transparent'
                      }`}
                    >
                      {cert.title}
                    </span>
                    <span aria-hidden className="flex-1 translate-y-[-0.2em] border-b border-dotted border-ink/40" />
                    <span className="whitespace-nowrap normal-case tracking-normal text-ink">
                      {cert.period.replace(/\s*[—-]\s*/, '–')}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-ink-soft">{cert.subtitle}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
