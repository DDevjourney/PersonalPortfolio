import Header from './components/Header'
import Hero from './components/Hero'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Education from './components/Education'
import Services from './components/Services'
import Contact from './components/Contact'
import Footer from './components/Footer'

/**
 * Estructura general de la landing.
 * El orden de secciones sigue la numeración (001 → 006).
 */
export default function App() {
  return (
    <>
      <Header />
      <main>
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
