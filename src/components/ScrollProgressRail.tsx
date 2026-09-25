import useScrollProgress from '../hooks/useScrollProgress'

/**
 * Raíl vertical fijo en el margen izquierdo del viewport que se rellena
 * según el progreso de scroll de la página. Alineado con los mismos
 * gutters que `.container-content`. Oculto en móvil: a 24px de margen no
 * hay hueco para un elemento decorativo sin competir con el contenido.
 *
 * Es un indicador informativo continuo, no una animación de entrada, así
 * que se anima igual con o sin `prefers-reduced-motion`.
 */
export default function ScrollProgressRail() {
  const progress = useScrollProgress()

  return (
    <div
      aria-hidden
      className="fixed left-6 top-0 z-40 hidden h-screen w-px bg-ink/15 md:left-10 md:block lg:left-16"
    >
      <div className="w-full bg-ink" style={{ height: `${progress * 100}%` }} />
    </div>
  )
}
