import { useEffect, useRef } from 'react'
import { animate, stagger, utils } from 'animejs'

/**
 * Revela los hijos que casan con `itemSelector` dentro de un contenedor,
 * con fade + slide escalonado (animejs `stagger`), disparado una única vez
 * cuando el contenedor entra en el viewport. Mismo criterio que
 * `useLineReveal`: con `prefers-reduced-motion: reduce` no anima nada y los
 * hijos quedan visibles desde el primer render.
 */
export default function useStaggerReveal<T extends HTMLElement = HTMLDivElement>(itemSelector: string) {
  const containerRef = useRef<T>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const items = container.querySelectorAll<HTMLElement>(itemSelector)
    if (items.length === 0) return

    utils.set(items, { translateY: 24, opacity: 0 })

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return

        animate(items, {
          translateY: [24, 0],
          opacity: [0, 1],
          duration: 600,
          delay: stagger(120),
          ease: 'out(3)',
        })

        observer.disconnect()
      },
      { threshold: 0.15 },
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [itemSelector])

  return containerRef
}
