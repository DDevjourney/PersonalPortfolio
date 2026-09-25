import { useEffect, useState } from 'react'

/**
 * Offset de parallax en px, creciendo con el scroll pero acotado a
 * `maxOffset`. Pensado para aplicarse como `translateY` positivo sobre un
 * elemento: como el resto del contenido ya sube 1:1 con el scroll, sumarle
 * este desplazamiento hacia abajo hace que se quede "un poco atrás" (el
 * efecto de lag clásico del parallax), sin desplazarse más de `maxOffset`.
 *
 * Es movimiento puramente decorativo (a diferencia de `useScrollProgress`,
 * que es informativo): con `prefers-reduced-motion: reduce` no arranca y
 * devuelve siempre 0.
 */
export default function useParallax(factor = 0.05, maxOffset = 20) {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame: number

    const tick = () => {
      setOffset(Math.min(window.scrollY * factor, maxOffset))
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [factor, maxOffset])

  return offset
}
