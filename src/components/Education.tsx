import ExpandableCards from './ExpandableCards'
import { education } from '../data/portfolio'

/** Sección Estudios: mismo componente de cartas expandibles que Experiencia. */
export default function Education() {
  return (
    <ExpandableCards
      sectionId="estudios"
      index="004"
      title="Estudios"
      items={education}
    />
  )
}
