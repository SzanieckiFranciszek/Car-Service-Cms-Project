import { ContactInfo, OpenHours } from "@shared/types";
import styles from "./footer.module.scss";
import { useEffect, useState } from "react";
import { ContactInfoService } from "@shared/api/services";



const Footer = () => {

    const [contactInfoData, setContactInfoData] = useState<ContactInfo[]>([]);
    const [openHoursData, setOpenHoursData] = useState<OpenHours[]>([]);

    useEffect(() => {
        const fetchContactInfo = async () => {
          const data = await ContactInfoService.getAllContantInfo();
          if (data) {
            setContactInfoData(data);
          }
        };

        const fetchAllOpenHoursData = async () => {
            const data = await ContactInfoService.getAllOpenHours();
            if (data) {
              setOpenHoursData(data);
            }
          };
          
        fetchContactInfo();
        fetchAllOpenHoursData();
      }, []);
    

  return (
    <div className={styles.main}>
      <div className={styles.contact}>
        <h3>Kontakt</h3>
        <div className={styles.dataWrapper}>
            {
                contactInfoData.map(contact => (
                    <p key={contact.id}>{`${contact.description}: ${contact.value}`}</p>
                ))
            }
        </div>

      </div>
      <div className={styles.hours}>
        <h3>Godziny otwarcia</h3>
        <div className={styles.dataWrapper}>
            {
                openHoursData.map(openHours => (
                    <div key={openHours.id}>
                        <p>{openHours.dayFrom == openHours.dayTo ? openHours.dayFrom : `${openHours.dayFrom} - ${openHours.dayTo}`}</p>
                        <p>{`${openHours.timeFrom} - ${openHours.timeTo}`}</p>
                    </div>
                ))
            }
        </div>
        
      </div>
    </div>
  );
};

export default Footer;
