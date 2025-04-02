import { useEffect, useState } from "react";
import styles from "./opinions.module.scss";
import { deleteOpinion, getAllOpinions, Opinion } from "../../../../apiService";

interface OpinionElementProps {
  data: Opinion;
  onDelete: (id: number) => void;
}

const OpinionElement = ({ data, onDelete }: OpinionElementProps) => {
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
        <button onClick={() => onDelete(data.id)}>Usuń opinię</button>
      </div>
    </div>
  );
};

const Opinions = () => {
  const [opinions, setOpinions] = useState<Opinion[]>([]);

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
    await deleteOpinion(id);
    await onGetAllOpinions();
  };

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <p>Opinie dodawane przez użytkowników:</p>
      </div>
      <div>
        {opinions.length > 0 ? (
          opinions.map((opinion) => (
            <OpinionElement
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

export default Opinions;
