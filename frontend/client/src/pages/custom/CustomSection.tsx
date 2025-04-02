import { Section } from "../../apiService";
import styles from "./custom.module.scss";

interface CustomSectionProps {
  data: Section
}

const CustomSection = ({data}: CustomSectionProps) => {
  return (
    <div id={`section-${data.id}`} className={styles.sectionMain}>
        <h2>{data.title}</h2>
        <p>{data.content}</p>
    </div>
  );
}

interface CustomSectionsProps {
    data: Section[] | undefined
  }

const CustomSections = ({data}: CustomSectionsProps) => {
    const sections = data && data.filter(section => section.isVisible);

    return (
      <div className={styles.sectionsWrapper}>
          {sections && sections.sort((a: Section, b: Section) => a.orderIndex - b.orderIndex).map(section => (
            <CustomSection key={section.id} data={section}/>
          ))}
      </div>
    );
  }
  

export default CustomSections