import { useEffect, useState } from 'react'

interface SectionRef {
  id: string
}

/**
 * Id de la sección "activa" mientras se hace scroll (patrón scrollspy): la
 * última cuyo borde superior ya ha cruzado el centro del viewport. Antes de
 * que ninguna lo haya cruzado (el usuario sigue en el Hero) devuelve el id de
 * la primera entrada de `sections`.
 *
 * Se recalcula en cada frame con scroll en vez de con un IntersectionObserver:
 * el observer solo avisa de lo que ve en sus muestreos, y en los saltos
 * animados de Lenis una sección entera puede cruzar la franja central entre
 * dos de ellos, así que la rueda lateral se la saltaba.
 */
export default function useActiveSection<T extends SectionRef>(sections: readonly T[]) {
  const [activeId, setActiveId] = useState(sections[0]?.id)

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const center = window.innerHeight / 2
      let current = sections[0]?.id
      for (const section of sections) {
        const el = document.getElementById(section.id)
        if (el && el.getBoundingClientRect().top <= center) current = section.id
      }
      // Al fondo de la página la última sección puede no llegar al centro
      // (no hay más contenido debajo para empujarla): se da por activa.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      if (atBottom) current = sections[sections.length - 1]?.id ?? current
      setActiveId(current)
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [sections])

  return activeId
}
