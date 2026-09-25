import { type RefObject, useEffect, useState } from 'react'

interface LineExtent {
  top: number
  height: number
}

/**
 * Distancia acumulada, subiendo por la cadena de `offsetParent`, desde
 * `node` hasta `ancestor`. A diferencia de `getBoundingClientRect`,
 * `offsetTop` ignora los `transform` CSS — así el resultado no se ve
 * afectado por el `translateY` transitorio del reveal de
 * `useStaggerReveal` mientras anima.
 */
function offsetTopRelativeTo(node: HTMLElement, ancestor: HTMLElement): number {
  let top = 0
  let current: HTMLElement | null = node

  while (current && current !== ancestor) {
    top += current.offsetTop
    current = current.offsetParent as HTMLElement | null
  }

  return top
}

/**
 * Extremos verticales (top/height, en px relativos a `containerRef`) entre
 * el primer y el último elemento que casa con `selector`. Pensado para
 * recortar la línea de un timeline a la altura exacta de sus nodos, en vez
 * de ocupar todo el contenedor.
 */
export default function useNodeLineExtent(
  containerRef: RefObject<HTMLElement | null>,
  selector: string,
) {
  const [extent, setExtent] = useState<LineExtent | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const measure = () => {
      const nodes = container.querySelectorAll<HTMLElement>(selector)
      if (nodes.length === 0) return

      const first = offsetTopRelativeTo(nodes[0], container)
      const last = offsetTopRelativeTo(nodes[nodes.length - 1], container)

      setExtent({ top: first, height: Math.max(0, last - first) })
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [containerRef, selector])

  return extent
}
