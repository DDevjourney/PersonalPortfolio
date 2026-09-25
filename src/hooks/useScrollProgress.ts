import { useEffect, useState } from 'react'

/**
 * Progreso de scroll de la página, de 0 a 1.
 *
 * Lee `window.scrollY` en un loop de `requestAnimationFrame` en lugar de
 * engancharse a la instancia de Lenis: en su modo por defecto (sin
 * wrapper/content propios) Lenis anima el scroll nativo de la ventana, así
 * que `scrollY` ya viene sincronizado con el movimiento suavizado, sin
 * acoplar este hook a los detalles internos de `useSmoothScroll`.
 */
export default function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame: number

    const tick = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      setProgress(scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0)
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  return progress
}
