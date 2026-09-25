/**
 * Interfaces centralizadas para los datos del portfolio.
 * Edita los arrays en sus respectivos archivos de `src/data/`.
 */

export interface Skill {
  /** Nombre de la tecnología (p. ej. "PHP") */
  name: string
  /** Categoría breve mostrada bajo el nombre */
  category: string
}

export interface Project {
  /** Identificador / número mostrado ("01", "02"...) */
  id: string
  /** Título del proyecto */
  title: string
  /** Stack o etiqueta corta (p. ej. "Laravel") */
  stack: string
  /** Descripción breve */
  description: string
  /**
   * Enlace al proyecto (demo, repositorio, etc.). Opcional: si no se define,
   * la tarjeta no es clicable.
   */
  url?: string
}

/**
 * Datos compartidos por las cartas expandibles de Experiencia y Estudios.
 * Ambas secciones reutilizan el mismo componente <ExpandableCards>.
 */
export interface ExpandableItem {
  /** Identificador único */
  id: string
  /** Título mostrado por delante de la carta (puesto o titulación) */
  title: string
  /** Subtítulo: empresa / centro de estudios */
  subtitle: string
  /** Periodo o fechas */
  period: string
  /** Descripción revelada al expandir */
  description: string
}
