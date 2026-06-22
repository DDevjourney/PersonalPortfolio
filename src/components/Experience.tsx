import ExpandableCards from './ExpandableCards'
import { experience } from '../data/portfolio'

/** Sección Experiencia: reutiliza el componente de cartas expandibles. */
export default function Experience() {
  return (
    <ExpandableCards
      sectionId="experiencia"
      index="003"
      title="Experiencia"
      items={experience}
    />
  )
}
