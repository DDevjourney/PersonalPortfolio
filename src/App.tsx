import Header from './components/Header'
import Hero from './components/Hero'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Education from './components/Education'
import Services from './components/Services'
import Contact from './components/Contact'
import Footer from './components/Footer'
import useSmoothScroll from './hooks/useSmoothScroll'

/**
 * Estructura general de la landing.
 * El orden de secciones sigue la numeración (001 → 006).
 */
export default function App() {
  useSmoothScroll()

  return (
    <>
      {/* Skip link: invisible hasta que recibe el foco, y entonces es lo
          primero que se tabula. `tabIndex={-1}` en el <main> es necesario para
          que el salto mueva el foco además del scroll: sin él, el navegador
          desplaza la página pero el foco se queda en la cabecera. */}
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-4 focus:z-[60] focus:rounded-full focus:border focus:border-ink focus:bg-paper focus:px-5 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink"
      >
        Saltar al contenido
      </a>

      <Header />
      <main id="contenido" tabIndex={-1} className="focus:outline-none">
        {/* 001 — Hero + Skills */}
        <Hero />
        <Skills />
        {/* 002 — Proyectos */}
        <Projects />
        {/* 003 — Experiencia */}
        <Experience />
        {/* 004 — Estudios */}
        <Education />
        {/* 005 — Servicios */}
        <Services />
        {/* 006 — Contacto */}
        <Contact />
      </main>
      <Footer />
    </>
  )
}
