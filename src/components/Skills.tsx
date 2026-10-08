import SectionHeading from './SectionHeading'
import FolderFloat from './FolderFloat'
import { skills } from '../data/portfolio'

/** Categorías en el orden de primera aparición en `skills`, con sus tecnologías. */
const categories = skills.reduce<{ label: string; items: string[] }[]>((acc, skill) => {
  const group = acc.find((g) => g.label === skill.category)
  if (group) group.items.push(skill.name)
  else acc.push({ label: skill.category, items: [skill.name] })
  return acc
}, [])

/**
 * Sección Skills: una carpeta (`FolderFloat`) por categoría. Al tocarla,
 * suelta las tecnologías de esa categoría como notas flotantes.
 */
export default function Skills() {
  return (
    <section id="skills" className="py-20 md:py-28">
      <div className="container-content">
        <SectionHeading index="001" title="Skills" />

        <div className="mt-20 flex flex-wrap justify-center gap-x-10 gap-y-24 md:mt-24">
          {categories.map((category) => (
            <FolderFloat
              key={category.label}
              label={category.label}
              sublabel={`${category.items.length} ${category.items.length === 1 ? 'tecnología' : 'tecnologías'}`}
              items={category.items}
              trigger="click"
              closeOnSelect={false}
              width={160}
              height={120}
              spread={170}
              lift={28}
              folderColor="#1A1A1A"
              frontColor="#1A1A1A"
              paperColor="#E8E6E1"
              itemColor="#EDEBE7"
              itemTextColor="#1A1A1A"
              labelColor="#E8E6E1"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
