import { useEffect, useState } from "react";
import Modal from "../../../../components/modal";
import styles from "./pages.module.scss";
import {
  changeSectionOrder,
  createNewSection,
  deleteSection,
  Page,
  Section,
  updateSection,
} from "../../../../apiService";

const findHighestOrderIndex = (array: Section[]) => {
  if (array.length === 0) {
    return 0;
  }
  let highestOrderIndex = 0;
  array.forEach((item) => {
    if (item.orderIndex > highestOrderIndex) {
      highestOrderIndex = item.orderIndex;
    }
  });
  return highestOrderIndex;
};

interface SectionsTableProps {
  data: Section[];
  onPageModalOpen: (page: Section) => void;
  onOrderChange: (id: string, newOrder: number) => Promise<void>;
}

const SectionsTable = (props: SectionsTableProps) => {
  return (
    <table className={styles.pagesTable}>
      <thead>
        <tr className={styles.pagesTableHeader}>
          <th>Nr</th>
          <th>Nazwa</th>
          <th>Ukryta</th>
          <th>Akcje</th>
        </tr>
      </thead>
      <tbody>
        {props.data
          .sort((a: Section, b: Section) => a.orderIndex - b.orderIndex)
          .map((page, index) => (
            <SectionsTableRow
              onOrderChange={props.onOrderChange}
              onPageModalOpen={props.onPageModalOpen}
              pagesCount={props.data.length}
              index={index}
              key={page.id}
              data={page}
            />
          ))}
      </tbody>
    </table>
  );
};

interface SectionsTableRowProps {
  data: Section;
  index: number;
  pagesCount: number;
  onPageModalOpen: (page: Section) => void;
  onOrderChange: (id: string, newOrder: number) => Promise<void>;
}

const SectionsTableRow = (props: SectionsTableRowProps) => {
  const onOrderChange = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    up: boolean
  ) => {
    e.preventDefault();
    e.stopPropagation();
    let newOrder: number;
    if (up) {
      newOrder = props.data.orderIndex - 1;
      props.onOrderChange(props.data.id, newOrder);
    } else {
      newOrder = props.data.orderIndex + 1;
      props.onOrderChange(props.data.id, newOrder);
    }
  };

  return (
    <tr onClick={() => props.onPageModalOpen(props.data)}>
      <td>{props.index + 1}</td>
      <td>{props.data.title}</td>
      <td>{props.data.isVisible ? "Nie" : "Tak"}</td>
      <td className={styles.arrowButtons}>
        {props.index > 0 ? (
          <button onClick={(e) => onOrderChange(e, true)}>/\</button>
        ) : (
          <button style={{ visibility: "hidden" }}>/\</button>
        )}
        {props.index !== props.pagesCount - 1 ? (
          <button onClick={(e) => onOrderChange(e, false)}>\/</button>
        ) : (
          <button style={{ visibility: "hidden" }}>\/</button>
        )}
      </td>
    </tr>
  );
};

interface SectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Section;
  onDelete: (id: string) => Promise<void>;
  onUpdateSection: () => Promise<void>;
}

const SectionModal = (props: SectionModalProps) => {
  const [isEdit, setIsEdit] = useState(false);
  const [title, setTitle] = useState<string>(props.data.title);
  const [content, setContent] = useState<string>(props.data.content);
  const [showInMenu, setShowInMenu] = useState<boolean>(props.data.showInMenu);
  const [isVisible, setIsVisible] = useState<boolean>(props.data.isVisible);

  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    setTitle(props.data.title);
    setContent(props.data.content);
    setIsVisible(props.data.isVisible);
  }, [props.data]);

  const validateForm = () => {
    let formIsValid = true;
    const errors: Errors = {};

    if (!title) {
      formIsValid = false;
      errors["title"] = "Podaj tytuł sekcji";
    }

    if (!content) {
      formIsValid = false;
      errors["content"] = "Wprowadź treść sekcji";
    }

    setErrors(errors);
    return formIsValid;
  };

  const onEditCancel = () => {
    setIsEdit(false);
    setTitle(props.data.title);
    setContent(props.data.content);
    setShowInMenu(props.data.showInMenu);
    setErrors({});
  };

  const onDelete = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setErrors({});
    props.onDelete(props.data.id);
  };

  const onEdit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (validateForm()) {
      const result = await updateSection(
        props.data.id,
        title,
        props.data.isVisible,
        content,
        showInMenu
      );

      if (result && (result.status === 200 || result.status === 204)) {
        setIsEdit(false);
        props.onUpdateSection();
      }
    }
  };

  const onVisibilityChange = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    isVisible: boolean
  ) => {
    event.preventDefault();

    await updateSection(
      props.data.id,
      props.data.title,
      isVisible,
      props.data.content,
      props.data.showInMenu
    );
    await props.onUpdateSection();
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <div className={styles.pageModalMain}>
        <div className={styles.newPageModalTitle}>
          <p>{`Szczegóły sekcji`}</p>
        </div>
        <div className={styles.inputWrapper}>
          <p>Tytuł sekcji</p>
          <input
            disabled={!isEdit}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && <p className={styles.inputAlert}>{errors.title}</p>}
        </div>
        <div className={styles.inputWrapper}>
          <p>Treść</p>
          <textarea
            disabled={!isEdit}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          {errors.content && (
            <p className={styles.inputAlert}>{errors.content}</p>
          )}
        </div>
        <div className={styles.checkboxWrapper}>
          <p>Czy jest widoczna w menu</p>
          <input
            disabled={!isEdit}
            type="checkbox"
            checked={showInMenu}
            onChange={(e) => setShowInMenu(e.target.checked)}
          />
        </div>
        <div className={styles.pageButtonsWrapper}>
          <div>
            {isEdit ? <button onClick={onEdit}>Zapisz</button> : null}
            {isEdit ? (
              <button onClick={onEditCancel}>Anuluj</button>
            ) : (
              <button onClick={() => setIsEdit(true)}>Edytuj</button>
            )}
          </div>
          <div>
            <button onClick={onDelete}>Usuń</button>
            {isVisible ? (
              <button onClick={(e) => onVisibilityChange(e, false)}>
                Ukryj
              </button>
            ) : (
              <button onClick={(e) => onVisibilityChange(e, true)}>
                Odkryj
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

interface NewSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateNewSection: (
    title: string,
    content: string,
    showInMenu: boolean
  ) => Promise<void>;
}

interface Errors {
  [key: string]: string;
}

const NewSectionModal = (props: NewSectionModalProps) => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isVisibleInMenu, setIsVisibleInMenu] = useState<boolean>(true);

  const [errors, setErrors] = useState<Errors>({});

  const validateForm = () => {
    let formIsValid = true;
    const errors: Errors = {};

    if (!title) {
      formIsValid = false;
      errors["title"] = "Podaj tytuł sekcji";
    }

    if (!content) {
      formIsValid = false;
      errors["content"] = "Wprowadź treść sekcji";
    }

    setErrors(errors);
    return formIsValid;
  };

  const onCreate = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (validateForm()) {
      props.onCreateNewSection(title, content, isVisibleInMenu);
      setTitle("");
      setContent("");
    }
  };

  const onClose = () => {
    setErrors({});
    setTitle("");
    setContent("");
    props.onClose();
  };

  return (
    <Modal isOpen={props.isOpen} onClose={onClose}>
      <div className={styles.newSectionModalMain}>
        <div className={styles.newPageModalTitle}>
          <p>Tworzenie nowej sekcji</p>
        </div>
        <div className={styles.inputsWrapper}>
          <div className={styles.inputWrapper}>
            <p>Tytuł</p>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && (
              <p className={styles.inputAlert}>{errors.title}</p>
            )}
          </div>
          <div className={styles.inputWrapper}>
            <p>Treść</p>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            {errors.content && (
              <p className={styles.inputAlert}>{errors.content}</p>
            )}
          </div>
          <div className={styles.checkboxWrapper}>
            <p>Czy jest widoczna w menu</p>
            <input
              type="checkbox"
              checked={isVisibleInMenu}
              onChange={(e) => setIsVisibleInMenu(e.target.checked)}
            />
          </div>
        </div>
        <div className={styles.newPageButtonsWrapper}>
          <button onClick={onCreate}>Utwórz</button>
        </div>
      </div>
    </Modal>
  );
};

interface SectionsProps {
  data: Page;
  onUpdatePage: () => Promise<void>;
}

const Sections = (props: SectionsProps) => {
  const [isNewSectionModalOpen, setNewSectionModalOpen] = useState(false);

  const [sectionsData, setSectionsData] = useState<Section[]>(
    props.data.section ?? []
  );
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  useEffect(() => {
    if (props.data.section) {
      setSectionsData(props.data.section);
      if (selectedSection) {
        setSelectedSection(
          (prev) =>
            (props.data.section &&
              props.data.section.find((page) => page.id == prev?.id)) ||
            null
        );
      }
    }
  }, [props.data]);

  const openNewSectiontModal = () => setNewSectionModalOpen(true);
  const closeNewSectionModal = () => {
    setNewSectionModalOpen(false);
  };

  const onCreateNewSection = async (
    title: string,
    content: string,
    showInMenu: boolean
  ) => {
    const lastOrderIndex = findHighestOrderIndex(sectionsData);
    const newOrderIndex = lastOrderIndex + 1;
    await createNewSection(
      title,
      newOrderIndex,
      content,
      props.data.id,
      showInMenu
    );
    await props.onUpdatePage();
    setNewSectionModalOpen(false);
  };

  const onDeleteSection = async (id: string) => {
    const result = await deleteSection(id);

    if (result && (result.status === 200 || result.status === 204)) {
      setSelectedSection(null);
      props.onUpdatePage();
    }
  };

  const onUpdatePage = async () => {
    props.onUpdatePage();
  };

  const onSectionModalOpen = (section: Section) => {
    setSelectedSection(section);
  };

  const closeSectionModal = () => {
    setSelectedSection(null);
  };

  const onOrderChange = async (id: string, newOrder: number) => {
    await changeSectionOrder(id, newOrder);
    await props.onUpdatePage();
  };

  return (
    <div className={styles.main}>
      <div className={styles.pagesTableInfo}>
        <p>Sekcje widoczne na podstronie</p>
        <button onClick={openNewSectiontModal}>Dodaj nową</button>
      </div>
      <NewSectionModal
        onCreateNewSection={onCreateNewSection}
        onClose={closeNewSectionModal}
        isOpen={isNewSectionModalOpen}
      />
      {selectedSection && (
        <SectionModal
          onUpdateSection={onUpdatePage}
          onDelete={onDeleteSection}
          data={selectedSection}
          isOpen={true}
          onClose={closeSectionModal}
        />
      )}
      <div className={styles.sectionsTableContainer}>
        <SectionsTable
          onOrderChange={onOrderChange}
          onPageModalOpen={onSectionModalOpen}
          data={sectionsData}
        />
      </div>
    </div>
  );
};

export default Sections;
