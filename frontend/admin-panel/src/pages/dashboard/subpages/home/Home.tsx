import { useEffect, useRef, useState } from "react";
import styles from "./home.module.scss";
import {
  changeHomepageImage,
  ContactInfo,
  ContactInfoType,
  createNewContactInfo,
  createNewOpeningHours,
  Days,
  deleteContactInfo,
  deleteOpeningHours,
  getAllContantInfo,
  getAllOpenHours,
  getContactTypeTranslation,
  getHomepageImage,
  OpenHours,
  updateContactInfo,
  updateOpeningHours,
  uploadHomepageImage,
} from "../../../../apiService";

interface Errors {
  [key: string]: string;
}

const MainImage = () => {
  const [imageURL, setImageURL] = useState<string>("");

  const [fileToSend, setFileToSend] = useState<File | undefined>(undefined);

  const [errors, setErrors] = useState<Errors>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const validateForm = () => {
    let formIsValid = true;
    const errors: Errors = {};

    if (!fileToSend) {
      formIsValid = false;
      errors["file"] = "Dodaj plik.";
    }

    setErrors(errors);
    return formIsValid;
  };

  useEffect(() => {
    fetchImage();
  }, []);

  const fetchImage = async () => {
    const result = await getHomepageImage();
    if (result) {
      const url = URL.createObjectURL(result);
      setImageURL(url);
    }
  };

  const onImageSend = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (validateForm() && fileToSend) {
      setErrors({});
      if (imageURL) {
        await changeHomepageImage(fileToSend);
        const url = URL.createObjectURL(fileToSend);
        setImageURL(url);
      } else {
        await uploadHomepageImage(fileToSend);
      }
      setFileToSend(undefined);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className={`${styles.imageSection} ${styles.section}`}>
      <div className={styles.imageSectionInfo}>
        <p>Zdjęcie główne</p>
        <p>Widoczne jest na stronie głównej w aplikacji klienckiej.</p>
        {imageURL && <img src={imageURL} />}
      </div>
      <div className={styles.imageSectionFile}>
        <input
          ref={fileInputRef}
          type="file"
          onChange={(e) =>
            setFileToSend(e.target.files ? e.target.files[0] : undefined)
          }
        />
        <button onClick={onImageSend}>Wyślij</button>
      </div>
      {errors.file && <p className={styles.fileAlert}>{errors.file}</p>}
    </div>
  );
};

const ContactTable = () => {
  const [contactInfoData, setContactInfoData] = useState<ContactInfo[]>([]);

  const [errors, setErrors] = useState<Errors>({});

  const validateForm = (type: ContactInfoType, value: string, desc: string) => {
    let formIsValid = true;
    const errors: Errors = {};

    if (!value) {
      formIsValid = false;
      errors["value"] = "Podaj wartość.";
    }

    if (!desc) {
      formIsValid = false;
      errors["desc"] = "Podaj opis.";
    }

    if (type === ContactInfoType.PHONE) {
      const phoneRegex = /^[0-9]+$/;
      if (!phoneRegex.test(value)) {
        formIsValid = false;
        errors["value"] = "Numer telefonu może zawierać tylko cyfry.";
      }
    } else if (type === ContactInfoType.MAIL) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        formIsValid = false;
        errors["value"] = "Podaj poprawny adres e-mail.";
      }
    }

    setErrors(errors);
    return formIsValid;
  };

  useEffect(() => {
    getAllInfo();
  }, []);

  const getAllInfo = async () => {
    const data = await getAllContantInfo();
    if (data) {
      setContactInfoData(data);
    }
  };

  const onDelete = async (id: string) => {
    const result = await deleteContactInfo(id);

    if (result && (result.status === 200 || result.status === 204)) {
      setContactInfoData((prevData) =>
        prevData.filter((contact) => contact.id !== id)
      );
    }
    setErrors({});
  };

  const onUpdate = async (
    id: string,
    type: ContactInfoType,
    desc: string,
    value: string
  ) => {
    if (validateForm(type, value, desc)) {
      const result = await updateContactInfo(id, type, desc, value);

      if (result && (result.status === 200 || result.status === 204)) {
        setContactInfoData((prevData) =>
          prevData.map((contact) =>
            contact.id == id
              ? { ...contact, type, description: desc, value }
              : contact
          )
        );
      }

      return true;
    } else {
      return false;
    }
  };

  const onCreate = async (
    type: ContactInfoType,
    desc: string,
    value: string
  ) => {
    if (validateForm(type, value, desc)) {
      await createNewContactInfo(type, desc, value);
      await getAllInfo();
      return true;
    } else {
      return false;
    }
  };

  const onEditCancel = () => {
    setErrors({});
  };
  return (
    <div className={styles.tableWrapper}>
      <p>Dane kontaktowe</p>
      <table className={styles.dataTable}>
        <thead>
          <tr className={styles.dataTableHeader}>
            <th>Nazwa</th>
            <th>Typ</th>
            <th>Wartość</th>
            <th>Akcja</th>
          </tr>
        </thead>
        <tbody>
          {contactInfoData.map((contact) => (
            <ContactTableRow
              onEditCancel={onEditCancel}
              onUpdate={onUpdate}
              key={contact.id}
              onDelete={onDelete}
              data={contact}
            />
          ))}

          <NewContactTableRow onCreate={onCreate} />
        </tbody>
      </table>
      {Object.keys(errors).length > 0 ? (
        <div className={styles.errorsRow}>
          {errors.desc && <p className={styles.inputAlert}>{errors.desc}</p>}
          {errors.value && <p className={styles.inputAlert}>{errors.value}</p>}
        </div>
      ) : null}
    </div>
  );
};

interface ContactTableRowI {
  data: ContactInfo;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (
    id: string,
    type: ContactInfoType,
    desc: string,
    value: string
  ) => Promise<boolean>;
  onEditCancel: () => void;
}

const ContactTableRow = (props: ContactTableRowI) => {
  const [isEdit, setIsEdit] = useState(false);

  const [desc, setDesc] = useState(props.data.description);
  const [contactType, setContactType] = useState(props.data.type);
  const [contactValue, setContactValue] = useState(props.data.value);

  const onEditCancel = () => {
    setIsEdit(false);
    setDesc(props.data.description);
    setContactValue(props.data.value);
    setContactType(props.data.type);
    props.onEditCancel();
  };

  const onDelete = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    props.onDelete(props.data.id);
  };

  const onEdit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    const result = await props.onUpdate(
      props.data.id,
      contactType,
      desc,
      contactValue
    );
    if (result) {
      setIsEdit(false);
    }
  };

  return (
    <tr>
      <td>
        <input
          disabled={!isEdit}
          value={desc}
          type="text"
          onChange={(e) => setDesc(e.target.value)}
        />
      </td>
      <td>
        <select
          value={contactType}
          disabled={!isEdit}
          onChange={(e) => setContactType(e.target.value as ContactInfoType)}
        >
          {Object.values(ContactInfoType).map((type) => (
            <option key={type} value={type}>
              {getContactTypeTranslation(type)}
            </option>
          ))}
        </select>
      </td>
      <td>
        <input
          disabled={!isEdit}
          value={contactValue}
          type="text"
          onChange={(e) => setContactValue(e.target.value)}
        />
      </td>
      <td className={styles.tableButtonsWrapper}>
        {isEdit ? <button onClick={onEdit}>Zapisz</button> : null}
        {isEdit ? (
          <button onClick={onEditCancel}>Anuluj</button>
        ) : (
          <button onClick={() => setIsEdit(true)}>Edytuj</button>
        )}
        <button onClick={onDelete}>Usuń</button>
      </td>
    </tr>
  );
};

interface NewContactTableRowI {
  onCreate: (
    type: ContactInfoType,
    desc: string,
    value: string
  ) => Promise<boolean>;
}

const NewContactTableRow = (props: NewContactTableRowI) => {
  const [desc, setDesc] = useState("");
  const [contactType, setContactType] = useState<ContactInfoType>(
    ContactInfoType.PHONE
  );
  const [contactValue, setContactValue] = useState("");

  const onCreate = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    const result = await props.onCreate(contactType, desc, contactValue);
    if (result) {
      setDesc("");
      setContactValue("");
    }
  };

  return (
    <tr>
      <td>
        <input
          value={desc}
          type="text"
          onChange={(e) => setDesc(e.target.value)}
        />
      </td>
      <td>
        <select
          value={contactType}
          onChange={(e) => setContactType(e.target.value as ContactInfoType)}
        >
          {Object.values(ContactInfoType).map((type) => (
            <option key={type} value={type}>
              {getContactTypeTranslation(type)}
            </option>
          ))}
        </select>
      </td>
      <td>
        <input
          value={contactValue}
          type="text"
          onChange={(e) => setContactValue(e.target.value)}
        />
      </td>
      <td className={styles.tableButtonsWrapper}>
        <button onClick={onCreate}>Dodaj</button>
      </td>
    </tr>
  );
};

const validateTime = (time: string) => {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timeRegex.test(time);
};

const OpenHoursTable = () => {
  const [openHoursData, setOpenHoursData] = useState<OpenHours[]>([]);

  const [errors, setErrors] = useState<Errors>({});

  const validateForm = (
    dayFrom: Days,
    dayTo: Days,
    timeFrom: string,
    timeTo: string
  ) => {
    let formIsValid = true;
    const errors: Errors = {};

    if (!dayFrom) {
      formIsValid = false;
      errors["dayFrom"] = "Podaj dzień początkowy.";
    }

    if (!dayTo) {
      formIsValid = false;
      errors["dayTo"] = "Podaj dzień końcowy.";
    }

    if (!validateTime(timeFrom)) {
      formIsValid = false;
      errors["timeFrom"] =
        "Czas początkowy musi być w formacie hh:mm i zawierać poprawne wartości godzin (0-23) i minut (0-59).";
    }

    if (!validateTime(timeTo)) {
      formIsValid = false;
      errors["timeTo"] =
        "Czas końcowy musi być w formacie hh:mm i zawierać poprawne wartości godzin (0-23) i minut (0-59).";
    }

    setErrors(errors);
    return formIsValid;
  };

  useEffect(() => {
    getAllOpenHoursData();
  }, []);

  const getAllOpenHoursData = async () => {
    const data = await getAllOpenHours();
    if (data) {
      setOpenHoursData(data);
    }
  };

  const onDelete = async (id: string) => {
    const result = await deleteOpeningHours(id);

    if (result && (result.status === 200 || result.status === 204)) {
      setOpenHoursData((prevData) =>
        prevData.filter((openHours) => openHours.id !== id)
      );
    }
    setErrors({});
  };

  const onUpdate = async (
    id: string,
    dayfrom: Days,
    dayTo: Days,
    timeFrom: string,
    timeTo: string
  ) => {
    if (validateForm(dayfrom, dayTo, timeFrom, timeTo)) {
      const result = await updateOpeningHours(
        id,
        dayfrom,
        dayTo,
        timeFrom,
        timeTo
      );

      if (result && (result.status === 200 || result.status === 204)) {
        setOpenHoursData((prevData) =>
          prevData.map((openHours) =>
            openHours.id == id
              ? { ...openHours, dayfrom, dayTo, timeFrom, timeTo }
              : openHours
          )
        );
      }

      return true;
    } else {
      return false;
    }
  };

  const onCreate = async (
    dayfrom: Days,
    dayTo: Days,
    timeFrom: string,
    timeTo: string
  ) => {
    if (validateForm(dayfrom, dayTo, timeFrom, timeTo)) {
      await createNewOpeningHours(dayfrom, dayTo, timeFrom, timeTo);
      await getAllOpenHoursData();
      return true;
    } else {
      return false;
    }
  };

  const onEditCancel = () => {
    setErrors({});
  };
  return (
    <div className={styles.tableWrapper}>
      <p>Godziny otwarcia warszatu</p>
      <table className={styles.dataTable}>
        <thead>
          <tr className={styles.dataTableHeader}>
            <th>Dzień od</th>
            <th>Dzień do</th>
            <th>Zakres godzin</th>
            <th>Akcja</th>
          </tr>
        </thead>

        <tbody>
          {openHoursData.map((contact) => (
            <OpenHoursTableRow
              onEditCancel={onEditCancel}
              onUpdate={onUpdate}
              key={contact.id}
              onDelete={onDelete}
              data={contact}
            />
          ))}

          <NewOpenHoursTableRow onCreate={onCreate} />
        </tbody>
      </table>
      {Object.keys(errors).length > 0 ? (
        <div className={styles.errorsRow}>
          {Object.values(errors).map((error) => (
            <p className={styles.inputAlert}>{error}</p>
          ))}
        </div>
      ) : null}
    </div>
  );
};

interface OpenHoursTableRowI {
  data: OpenHours;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (
    id: string,
    dayfrom: Days,
    dayTo: Days,
    timeFrom: string,
    timeTo: string
  ) => Promise<boolean>;
  onEditCancel: () => void;
}

const OpenHoursTableRow = (props: OpenHoursTableRowI) => {
  const [isEdit, setIsEdit] = useState(false);

  const [dayfrom, setDayFrom] = useState<Days>(props.data.dayFrom);
  const [dayTo, setDayTo] = useState<Days>(props.data.dayTo);

  const [timeFrom, setTimeFrom] = useState<string>(props.data.timeFrom);
  const [timeTo, setTimeTo] = useState<string>(props.data.timeTo);

  const onEditCancel = () => {
    setIsEdit(false);
    setDayFrom(props.data.dayFrom);
    setDayTo(props.data.dayTo);
    setTimeFrom(props.data.timeFrom);
    setTimeTo(props.data.timeTo);
    props.onEditCancel();
  };

  const onDelete = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    props.onDelete(props.data.id);
  };

  const onEdit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    const result = await props.onUpdate(
      props.data.id,
      dayfrom,
      dayTo,
      timeFrom,
      timeTo
    );
    if (result) {
      setIsEdit(false);
    }
  };

  return (
    <tr>
      <td>
        <select
          value={dayfrom}
          disabled={!isEdit}
          onChange={(e) => setDayFrom(e.target.value as Days)}
        >
          {Object.values(Days).map((day, index) => (
            <option key={index} value={day}>
              {day}
            </option>
          ))}
        </select>
      </td>
      <td>
        <select
          value={dayTo}
          disabled={!isEdit}
          onChange={(e) => setDayTo(e.target.value as Days)}
        >
          {Object.values(Days).map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </td>
      <td className={styles.hoursWrapper}>
        <div>
          <input
            maxLength={5}
            disabled={!isEdit}
            value={timeFrom}
            type="string"
            onChange={(e) => setTimeFrom(e.target.value)}
          />
          <span>do</span>
          <input
            maxLength={5}
            disabled={!isEdit}
            value={timeTo}
            type="string"
            onChange={(e) => setTimeTo(e.target.value)}
          />
        </div>
      </td>
      <td className={styles.tableButtonsWrapper}>
        {isEdit ? <button onClick={onEdit}>Zapisz</button> : null}
        {isEdit ? (
          <button onClick={onEditCancel}>Anuluj</button>
        ) : (
          <button onClick={() => setIsEdit(true)}>Edytuj</button>
        )}
        <button onClick={onDelete}>Usuń</button>
      </td>
    </tr>
  );
};

interface NewOperHoursTableRowI {
  onCreate: (
    dayfrom: Days,
    dayTo: Days,
    timeFrom: string,
    timeTo: string
  ) => Promise<boolean>;
}

const NewOpenHoursTableRow = (props: NewOperHoursTableRowI) => {
  const [dayfrom, setDayFrom] = useState<Days>(Days.MONDAY);
  const [dayTo, setDayTo] = useState<Days>(Days.MONDAY);

  const [timeFrom, setTimeFrom] = useState<string>("00:00");
  const [timeTo, setTimeTo] = useState<string>("00:00");


  const onCreate = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    const result = await props.onCreate(dayfrom, dayTo, timeFrom, timeTo);
    if (result) {
      setTimeFrom("00:00");
      setTimeTo("00:00");
      setDayFrom(Days.MONDAY);
      setDayTo(Days.MONDAY);
    }
  };

  return (
    <tr className={styles.hoursRow}>
      <td>
        <select onChange={(e) => setDayFrom(e.target.value as Days)}>
          {Object.values(Days).map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </td>
      <td>
        <select onChange={(e) => setDayTo(e.target.value as Days)}>
          {Object.values(Days).map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </td>
      <td className={styles.hoursWrapper}>
        <div>
          <input
            maxLength={5}
            value={timeFrom}
            type="string"
            onChange={(e) => setTimeFrom(e.target.value)}
          />
          <span>do</span>
          <input
            maxLength={5}
            value={timeTo}
            type="string"
            onChange={(e) => setTimeTo(e.target.value)}
          />
        </div>
      </td>
      <td className={styles.tableButtonsWrapper}>
        <button onClick={onCreate}>Dodaj</button>
      </td>
    </tr>
  );
};

const CompanyInfoSection = () => {
  return (
    <div className={`${styles.contactInfo} ${styles.section}`}>
      <ContactTable />
      <OpenHoursTable />
    </div>
  );
};

const Home = () => {
  return (
    <div className={styles.main}>
      <MainImage />
      <CompanyInfoSection />
    </div>
  );
};

export default Home;
