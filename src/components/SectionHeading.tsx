interface SectionHeadingProps {
  /** Número de sección, p. ej. "001" (se mostrará como "(001)") */
  index: string
  /** Título de la sección en mayúsculas */
  title: string
  /** Contenido opcional a la derecha (p. ej. un botón pill) */
  action?: React.ReactNode
}

/**
 * Cabecera editorial compartida por todas las secciones:
 * "(00X)" en gris a la izquierda + título grande en negro,
 * y un slot opcional a la derecha.
 */
export default function SectionHeading({ index, title, action }: SectionHeadingProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex items-baseline gap-4">
        <span className="font-archivo text-sm font-medium text-ink-soft">({index})</span>
        <h2 className="font-display text-4xl uppercase leading-none text-ink sm:text-5xl md:text-6xl">
          {title}
        </h2>
      </div>
      {action}
    </div>
  )
}
