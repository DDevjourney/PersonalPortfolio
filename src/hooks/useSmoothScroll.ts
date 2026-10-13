import { useEffect } from 'react'
import Lenis from 'lenis'

/** Alto del header fijo (h-20 en desktop) para que los anclas no queden tapadas. */
const HEADER_OFFSET = -80

/** Instancia viva de Lenis (null si no arrancó por reduced-motion). */
let lenisInstance: Lenis | null = null

/**
 * Desplaza a `#id` con la misma curva que los anclas. Para navegaciones que no
 * nacen de un click en un `<a>` (p. ej. soltar un arrastre en la rueda lateral),
 * donde la intercepción de `anchors` de Lenis no llega.
 */
export function scrollToSection(id: string) {
  const target = document.getElementById(id)
  if (!target) return
  if (lenisInstance) lenisInstance.scrollTo(target, { offset: HEADER_OFFSET })
  else target.scrollIntoView({ behavior: 'smooth' })
}

/**
 * Activa el scroll suave de Lenis durante toda la vida de la app.
 *
 * - `autoRaf` deja que Lenis gestione su propio requestAnimationFrame.
 * - `anchors` intercepta los enlaces `href="#..."` (header, hero, footer) y los
 *   anima con la misma curva, descontando el alto del header fijo.
 * - Si el sistema pide menos movimiento, no se inicializa y el navegador
 *   conserva su scroll nativo (ver el `scroll-behavior` de index.css, que se
 *   apaga en cuanto Lenis añade la clase .lenis a <html>).
 */
export default function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.2,
      // Expo out: arranca rápido y frena largo, el default de Lenis.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      autoRaf: true,
      anchors: { offset: HEADER_OFFSET },
    })
    lenisInstance = lenis

    return () => {
      lenis.destroy()
      lenisInstance = null
    }
  }, [])
}
