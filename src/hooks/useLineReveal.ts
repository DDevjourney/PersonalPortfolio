import { useEffect, useRef } from 'react'
import { animate, utils } from 'animejs'

/**
 * Revela un bloque como una única línea que sube desde abajo.
 *
 * Dos refs, dos roles (igual que el reveal letra a letra del Hero, pero con
 * un solo "carácter"): `wrapperRef` va en un contenedor de altura fija con
 * `overflow-hidden` que actúa de máscara, y `contentRef` en el nodo de
 * dentro que se traslada. El wrapper no se mueve, así que su recorte queda
 * fijo mientras el contenido sube dentro de él.
 *
 * Se dispara una sola vez, la primera vez que el wrapper entra en el
 * viewport. Si el usuario prefiere menos movimiento, no anima nada: el
 * contenido queda visible desde el primer render.
 */
export default function useLineReveal<T extends HTMLElement = HTMLDivElement>() {
  const wrapperRef = useRef<T>(null)
  const contentRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const content = contentRef.current
    if (!wrapper || !content) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Estado inicial explícito: evita el flash en posición final mientras
    // el observer espera a que el wrapper entre en pantalla.
    utils.set(content, { translateY: '100%' })

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return

        animate(content, {
          translateY: ['100%', '0%'],
          duration: 700,
          ease: 'out(4)',
          onComplete: () => utils.set(content, { translateY: '0%' }),
        })

        observer.disconnect()
      },
      { threshold: 0.2 },
    )

    observer.observe(wrapper)
    return () => observer.disconnect()
  }, [])

  return { wrapperRef, contentRef }
}
