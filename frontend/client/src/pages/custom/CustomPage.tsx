import { Page } from "@shared/types";
import styles from "./custom.module.scss";
import CustomSections from "./CustomSection";



interface CustomPageProps {
  data: Page
}
const CustomPage = ({data}: CustomPageProps) => {
  

  return (
    <div className={styles.main}>
        {/* {sections && sections.sort((a: Section, b: Section) => a.orderIndex - b.orderIndex).map(section => (
          <CustomSection key={section.id} data={section}/>
        ))} */}
        <CustomSections data={data.section}/>
    </div>
  );
};

export default CustomPage;
