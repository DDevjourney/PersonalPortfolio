import { useEffect, useState } from 'react'

interface SectionRef {
  id: string
}

/**
 * Id de la sección "activa" mientras se hace scroll (patrón scrollspy):
 * la última cuya franja central cruzó el centro del viewport. Antes de que
 * cualquiera lo haya cruzado (el usuario sigue en el Hero, por encima de la
 * primera sección) devuelve el id de la primera entrada de `sections`.
 */
export default function useActiveSection<T extends SectionRef>(sections: readonly T[]) {
  const [activeId, setActiveId] = useState(sections[0]?.id)

  useEffect(() => {
    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((entry) => entry.isIntersecting)
        if (intersecting.length === 0) return
        setActiveId(intersecting[intersecting.length - 1].target.id)
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sections])

  return activeId
}
