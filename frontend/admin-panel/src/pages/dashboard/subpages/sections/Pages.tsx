import { useEffect, useState } from "react";
import Modal from "../../../../components/modal";
import styles from "./pages.module.scss";
import {
  changePageOrder,
  createNewPage,
  deletePage,
  getAllPagesWithSections,
  Page,
  updatePage,
} from "../../../../apiService";
import Sections from "./Sections";
import { useUserContext } from "../../../../contexts/UserContext";

const findHighestOrderIndex = (array: Page[]) => {
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
  data: Page[];
  onPageModalOpen: (page: Page) => void;
  onOrderChange: (id: string, newOrder: number) => Promise<void>;
}

const PagesTable = (props: SectionsTableProps) => {
  return (
    <table className={`${styles.pagesTable} ${styles.pagesTableMain}`}>
      <thead>
        <tr className={styles.pagesTableHeader}>
          <th>Nr</th>
          <th>Nazwa</th>
          <th>Ilość sekcji</th>
          <th>Ukryta</th>
          <th>Akcje</th>
        </tr>
      </thead>
      <tbody>
        {props.data.map((page, index) => (
          <PagesTableRow
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

interface PagesTableRowProps {
  data: Page;
  index: number;
  pagesCount: number;
  onPageModalOpen: (page: Page) => void;
  onOrderChange: (id: string, newOrder: number) => Promise<void>;
}

const PagesTableRow = (props: PagesTableRowProps) => {
  const sectionsCount = props.data.section?.length;

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
      <td>{props.data.name}</td>
      <td>{sectionsCount}</td>
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

interface PageModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Page;
  onDelete: (id: string) => Promise<void>;
  onUpdatePage: () => Promise<void>;
  token: string;
}

const PageModal = (props: PageModalProps) => {
  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState(props.data.name);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    setName(props.data.name);
  }, [props.data]);

  const isHomepage = props.data.isHomepage;
  const isRemovable = props.data.isRemovable;

  const validateForm = () => {
    let formIsValid = true;
    const errors: Errors = {};

    if (!name) {
      formIsValid = false;
      errors["name"] = "Podaj nazwę sekcji";
    }

    setErrors(errors);
    return formIsValid;
  };

  const onEditCancel = () => {
    setIsEdit(false);
    setName(props.data.name);
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
      const result = await updatePage(
        props.data.id,
        name,
        props.data.isVisible
      );

      if (result && (result.status === 200 || result.status === 204)) {
        setIsEdit(false);
        props.onUpdatePage();
      }
    }
  };

  const onVisibilityChange = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    isVisible: boolean
  ) => {
    event.preventDefault();

    await updatePage(props.data.id, name, isVisible);
    await props.onUpdatePage();
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <div className={styles.pageModalMain}>
        <div className={styles.newPageModalTitle}>
          <p>{`Szczegóły podstrony ${props.data.name}`}</p>
          {isHomepage && <p>To jest podstrona główna aplikacji klienckiej.</p>}
        </div>
        <div className={styles.inputWrapper}>
          <p>Nazwa podstrony</p>
          <input
            disabled={!isEdit}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className={styles.inputAlert}>{errors.name}</p>}
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
            {isRemovable && <button onClick={onDelete}>Usuń</button>}
            {!props.data.isHomepage && (props.data.isVisible ? (
              <button onClick={(e) => onVisibilityChange(e, false)}>
                Ukryj
              </button>
            ) : (
              <button onClick={(e) => onVisibilityChange(e, true)}>
                Odkryj
              </button>
            ))}
          </div>
        </div>

        <div className={styles.sectionsTableWrapper}>
          <p>Sekcje</p>
          <Sections onUpdatePage={props.onUpdatePage} data={props.data} />
        </div>
      </div>
    </Modal>
  );
};

interface NewPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateNewPage: (name: string) => Promise<void>;
}

interface Errors {
  [key: string]: string;
}

const NewPageModal = (props: NewPageModalProps) => {
  const [name, setName] = useState<string>("");

  const [errors, setErrors] = useState<Errors>({});

  const validateForm = () => {
    let formIsValid = true;
    const errors: Errors = {};

    if (!name) {
      formIsValid = false;
      errors["name"] = "Podaj nazwę sekcji";
    }

    setErrors(errors);
    return formIsValid;
  };

  const onCreate = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (validateForm()) {
      props.onCreateNewPage(name);
      setName("");
    }
  };

  const onClose = () => {
    setErrors({});
    setName("");
    props.onClose();
  };

  return (
    <Modal isOpen={props.isOpen} onClose={onClose}>
      <div className={styles.newPageModalMain}>
        <div className={styles.newPageModalTitle}>
          <p>Tworzenie nowej podstrony</p>
        </div>
        <div className={styles.inputWrapper}>
          <p>Nazwa podstrony</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className={styles.inputAlert}>{errors.name}</p>}
        </div>
        <div className={styles.newPageButtonsWrapper}>
          <button onClick={onCreate}>Utwórz</button>
        </div>
      </div>
    </Modal>
  );
};

const Pages = () => {
  const [isNewPageModalOpen, setNewPageModalOpen] = useState(false);

  const { token } = useUserContext();

  const [pagesData, setPagesData] = useState<Page[]>([]);

  const [selectedPage, setSelectedPage] = useState<Page | null>(null);

  const fetchData = async () => {
    const response = await getAllPagesWithSections();
    if (response) {
      setPagesData(response);
      if (selectedPage) {
        setSelectedPage(
          (prev) => response.find((page) => page.id == prev?.id) || null
        );
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openNewPageModal = () => setNewPageModalOpen(true);
  const closeNewPageModal = () => setNewPageModalOpen(false);

  const onCreateNewPage = async (name: string) => {
    const lastOrderIndex = findHighestOrderIndex(pagesData);
    const newOrderIndex = lastOrderIndex + 1;
    await createNewPage(name, newOrderIndex);
    await fetchData();
    setNewPageModalOpen(false);
  };

  const onDeletePage = async (id: string) => {
    const result = await deletePage(id);

    if (result && (result.status === 200 || result.status === 204)) {
      setSelectedPage(null);
      await fetchData();
    }
  };

  const onUpdatePage = async () => {
    await fetchData();
  };

  const onPageModalOpen = (page: Page) => {
    setSelectedPage(page);
  };

  const closePageModal = () => {
    setSelectedPage(null);
  };

  const onOrderChange = async (id: string, newOrder: number) => {
    await changePageOrder(id, newOrder);
    await fetchData();
  };

  return (
    <div className={styles.main}>
      <div className={styles.pagesTableInfo}>
        <p>Podstrony w aplikacji klienckiej</p>
        <button onClick={openNewPageModal}>Dodaj nową</button>
      </div>

      <NewPageModal
        onCreateNewPage={onCreateNewPage}
        onClose={closeNewPageModal}
        isOpen={isNewPageModalOpen}
      />
      {selectedPage && (
        <PageModal
          token={token}
          onUpdatePage={onUpdatePage}
          onDelete={onDeletePage}
          data={selectedPage}
          isOpen={true}
          onClose={closePageModal}
        />
      )}
      <PagesTable
        onOrderChange={onOrderChange}
        onPageModalOpen={onPageModalOpen}
        data={pagesData}
      />
    </div>
  );
};

export default Pages;
