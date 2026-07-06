import type { Skill, Project, Service, ExpandableItem } from './types'

/* ------------------------------------------------------------------ */
/* SKILLS — edita libremente esta lista                                */
/* ------------------------------------------------------------------ */
export const skills: Skill[] = [
  { name: 'PHP', category: 'Backend' },
  { name: 'Laravel', category: 'Framework' },
  { name: 'SQL', category: 'Bases de datos' },
  { name: 'MySQL', category: 'Bases de datos' },
  { name: 'JavaScript', category: 'Frontend' },
  { name: 'Docker', category: 'Plataformas' },
]

/* ------------------------------------------------------------------ */
/* PROYECTOS — placeholder, sustitúyelos por los tuyos                 */
/* ------------------------------------------------------------------ */
export const projects: Project[] = [
  {
    id: '01',
    title: 'Gestor de Pedidos',
    stack: 'Laravel',
    description:
      'Aplicación de gestión de pedidos con panel de administración, control de stock y reporting.',
    url: 'https://e-local.onrender.com/', // 
  },
  {
    id: '02',
    title: 'A-Library',
    stack: 'Next.js',
    description:
      'Herramienta para amantes de los libros: reseñas y listas.',
    url: 'https://a-library-s9bp.onrender.com/login',
  },
/*  {
    id: '03',
    title: 'Landing Semar Cocinas',
    stack: 'PHP',
    description:
      'Landing page corporativa a medida con formulario de contacto y galería de proyectos.',
    url: 'https://github.com/DDevjourney',
  }, */
]

/* ------------------------------------------------------------------ */
/* SERVICIOS                                                           */
/* ------------------------------------------------------------------ */
export const services: Service[] = [
  {
    id: '001',
    title: 'DISEÑO WEB',
    description:
      'Sitios web rápidos y a medida, pensados para que tus clientes te encuentren y te contacten.',
  },
  {
    id: '002',
    title: 'DESARROLLO BACKEND',
    description:
      'Automatización de tu negocio: formularios que generan emails, paneles de gestión, exportar datos.',
  },
  {
    id: '003',
    title: 'GOOGLE BUSINESS',
    description:
      'Aparece en Google cuando buscan tu servicio en tu zona. Optimizo tu ficha y tu posicionamiento local.',
  },
]

/* ------------------------------------------------------------------ */
/* EXPERIENCIA — placeholder                                           */
/* ------------------------------------------------------------------ */
export const experience: ExpandableItem[] = [
  {
    id: 'exp-1',
    title: 'Bittacora',
    subtitle: 'Desarrollador Web',
    period: '2026 - Actualidad',
    description:
      'Desarrollo y mantenimiento de aplicaciones web con PHP y Laravel. Implementación de nuevas funcionalidades, integración de APIs y trabajo con bases de datos relacionales en un entorno de equipo.',
  },
  {
    id: 'exp-2',
    title: 'Decathlon',
    subtitle: 'Vendedor deportivo',
    period: '2023 — 2026',
    description:
      'Lideré la iniciativa con una progresión del 47%, coordinando con colaboradores de cada sección, formando al personal y resolviendo incidencias operativas. Desarrollé soluciones digitales a nivel tienda y sección: centralicé herramientas en Google Sites y automaticé la gestión de reservas e inventario mediante Google Sheets.',
  },
  {
    id: 'exp-3',
    title: 'Academia de oposiciones',
    subtitle: 'Community Manager',
    period: '2021 - 2022',
    description:
      'Gestioné la presencia digital de la marca en tres áreas: comunidad, contenido y equipo. Creé y administré el servidor de Discord oficial, diseñé publicaciones para redes sociales con Gimp, Canva y Meta Business Suite, y desarrollé estrategias de comunicación analizando KPIs para apoyar la toma de decisiones.',
  },
]

/* ------------------------------------------------------------------ */
/* ESTUDIOS — placeholder                                              */
/* ------------------------------------------------------------------ */
export const education: ExpandableItem[] = [
  
   {
    id: 'edu-1',
    title: 'MOOC en Ciberseguridad',
    subtitle: 'Curso de especialización en Universidad de Málaga',
    period: '2025 - 2026',
    description:
      'La formación abarca los principales ámbitos de la ciberseguridad, desde los fundamentos hasta las tecnologías más avanzadas. Incluye criptografía aplicada, seguridad en redes, protección de sistemas y programación segura, junto con áreas humanas como la ingeniería social y la privacidad. También aborda temas especializados como seguridad de hardware y sistemas , el análisis de malware, la computación post-cuántica y el diseño de soluciones seguras basadas en blockchain e inteligencia artificial, fomentando una visión integral de la protección digital.',
  },
  {
    id: 'edu-2',
    title: 'CFGS Desarrollo de Aplicaciones Web',
    subtitle: 'Formación Profesional en Ilerna',
    period: '2024 — 2026',
    description:
      'Formación especializada en desarrollo web front-end y back-end: PHP, Laravel, bases de datos, JavaScript, despliegue y metodologías de desarrollo de software.',
  },
   {
    id: 'edu-3',
    title: 'Certificado de Inglés B2',
    subtitle: 'Curso de idioma en Universidad de Cambridge',
    period: '2022',
    description:
      'Nivel intermedio-alto reconocido internacionalmente, que acredita competencia sólida en comprensión oral y escrita, expresión fluida en contextos académicos y profesionales, y dominio gramatical avanzado.',
  },
   {
    id: 'edu-4',
    title: 'Grado en Derecho',
    subtitle: 'Grado universitario en Universidad de Extremadura',
    period: '2015 — 2021',
    description:
      'En mi formación en Derecho, desarrollé habilidades como análisis crítico, razonamiento lógico y resolución de conflictos. Estos conocimientos, junto con mi curiosidad en áreas como economía y política, me dieron una visión integral que aplico en todas mis experiencias profesionales.',
  },
]
