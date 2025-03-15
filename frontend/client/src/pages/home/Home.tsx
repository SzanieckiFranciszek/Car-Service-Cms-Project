
import styles from "./home.module.scss";
import { createOpinion, deleteOpinion, getAllOpinions, Opinion, Page } from "../../apiService";
import CustomSections from "../custom/CustomSection";
import { useEffect, useState } from "react";
import Modal from "../../components/modal";
import { User, useUserContext } from "../../contexts/UserContext";
import Posts from "./Posts";

interface NewOpinionModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onCreate: () => Promise<void>
  user: User
  onCreateOpinion: () => Promise<void>
  // onCreateOpinion: (content: string, userId: string) => Promise<void>
}

interface Errors {
  [key: string]: string;
}

const NewOpinionModal = (props: NewOpinionModalProps) => {

  const [opinionContent, setOpinionContent] = useState("");


  const [errors, setErrors] = useState<Errors>({});

  const validateForm = () => {
    let formIsValid = true;
    const errors: Errors = {};

    if (!opinionContent) {
      formIsValid = false;
      errors["content"] = "Podaj treść opinii.";
    }

    setErrors(errors);
    return formIsValid;
  };

  const handleSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (validateForm()) {
      // await createPost(postTitle, postContent, postImage);
      // await props.onCreate();
      await createOpinion(opinionContent, props.user.id)
      await props.onCreateOpinion()
      props.onClose();
    }
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <div className={styles.postModalMain}>
        <div className={styles.postModalHeader}>
          <p>Nowa opinia</p>
        </div>
        <div>
          <div className={styles.postModalInputWrapper}>
            <textarea
              placeholder="Treść"
              className={errors.content && styles.inputError}
              onChange={(e) => setOpinionContent(e.target.value)}
            />
            {errors.content && (
              <p className={styles.inputAlert}>{errors.content}</p>
            )}
          </div>
        </div>
        <div className={styles.postModalButtonWrapper}>
          <button type="submit" onClick={handleSubmit}>
            Utwórz
          </button>
        </div>
      </div>
    </Modal>
  );
};


interface OpinionElementProps {
  data: Opinion;
  onDelete: (id: number) => void;
  user: User | null
}

const OpinionElement = ({ data, onDelete, user }: OpinionElementProps) => {
  const currentDate = data.createdAt ? new Date(data.createdAt) : null;
  const formattedDate = currentDate && currentDate.toLocaleDateString();

  return (
    <div className={styles.opinionElement}>
      <div className={styles.opinionLeft}>
        <div className={styles.opinionInfo}>
          <div className={styles.opinionUser}>{data.user.firstName}</div>
          <div>{formattedDate}</div>
        </div>
        <div className={styles.opinionContent}>{data.content}</div>
      </div>
      <div className={styles.deleteButtonWrapper}>
        {user && (user.id == data.user.id) && <button onClick={() => onDelete(data.id)}>Usuń opinię</button>}
      </div>
    </div>
  );
};

const Opinions = () => {
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [isNewOpinionModalOpen, setNewOpinionModalOpen] = useState(false);

  const {user} = useUserContext()

  useEffect(() => {
    onGetAllOpinions();
  }, []);

  const onGetAllOpinions = async () => {
    const data = await getAllOpinions();
    if (data) {
      setOpinions(data);
    }
  };

  const onDeleteOpinion = async (id: number) => {
    const result = await deleteOpinion(id);
    if(result?.status === 204) {
      setOpinions((prevOpinions) => prevOpinions.filter(opinion => opinion.id !== id))
    }
    // await onGetAllOpinions();
  };

  const onCreateOpinion = async () => {
    await onGetAllOpinions();
  };

  return (
    <div className={styles.opinionsMain}>
      {user && <NewOpinionModal onCreateOpinion={onCreateOpinion} user={user} isOpen={isNewOpinionModalOpen} onClose={() => setNewOpinionModalOpen(false)}/>}
      <div className={styles.header}>
        <h2>Opinie dodawane przez użytkowników:</h2>
      </div>
      <div className={styles.newOpinionSection}>
        {
          user ?
          <div className={styles.newOpinionButtonWrapper}>
            <p>Chcesz wyrazić swoją opinię o tym warsztacie?</p>
            <button onClick={() => setNewOpinionModalOpen(true)}>Dodaj opinię</button>
          </div>
          :
          <p className={styles.newOpinionInfo}>Aby dodać nową opinię musisz być zalogowany.</p>

        }
      </div>
      <div className={styles.opinionsWrapper}>
        {opinions.length > 0 ? (
          opinions.map((opinion) => (
            <OpinionElement
              user={user}
              key={opinion.id}
              data={opinion}
              onDelete={onDeleteOpinion}
            />
          ))
        ) : (
          <p>Brak opinii</p>
        )}
      </div>
    </div>
  );
};

interface HomeProps {
  imageURL: string
  pageData: Page
}

const Home = (props: HomeProps) => {
  
  return (
    <div className={styles.main}>
      <div className={styles.banner} style={{backgroundImage: `url(${props.imageURL})`}}></div>
      <div className={styles.sectionsWrapper}>
      <CustomSections data={props.pageData.section}/>
      </div>
      <Posts/>
      <Opinions/>
    </div>
  );
};

export default Home;
