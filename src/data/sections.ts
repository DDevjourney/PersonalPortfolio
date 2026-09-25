/**
 * Secciones navegables de la landing, en orden. Replica exactamente los
 * `index`/`title` que ya usan los `SectionHeading` de cada sección — se
 * mantienen sincronizados a mano porque son solo 5 y cambian rara vez.
 */
export const SECTIONS = [
  { id: 'skills', index: '001', title: 'Skills' },
  { id: 'proyectos', index: '002', title: 'Proyectos' },
  { id: 'experiencia', index: '003', title: 'Experiencia' },
  { id: 'estudios', index: '004', title: 'Estudios' },
  { id: 'contacto', index: '005', title: 'Contacto' },
] as const
