import EducationTimeline from './EducationTimeline'
import { education, certifications } from '../data/portfolio'

/** Sección Estudios: timeline vertical, distinta del carrusel de Experiencia. */
export default function Education() {
  return (
    <EducationTimeline
      sectionId="estudios"
      index="004"
      title="Estudios"
      items={education}
      certifications={certifications}
    />
  )
}
