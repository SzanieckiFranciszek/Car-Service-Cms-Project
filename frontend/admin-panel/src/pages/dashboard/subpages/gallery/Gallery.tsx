import { useEffect, useRef, useState } from "react";
import styles from "./gallery.module.scss";
import {
  deletePhoto,
  getAllPhotos,
  Photo,
  uploadPhotos,
} from "../../../../apiService";

interface Errors {
  [key: string]: string;
}

const Gallery = () => {
  const [photos, setPhotos] = useState<FileList | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [errors, setErrors] = useState<Errors>({});

  const [photosToDisplay, setPhotosToDisplay] = useState<Photo[]>([]);

  useEffect(() => {
    fetchAllPhotos();
  }, []);

  const fetchAllPhotos = async () => {
    const result = await getAllPhotos();
    if (result) {
      setPhotosToDisplay(result);
    }
  };

  const validateForm = () => {
    let formIsValid = true;
    const errors: Errors = {};

    if (!photos) {
      formIsValid = false;
      errors["file"] = "Dodaj przynajmniej jeden plik.";
    }
    else {
      const validTypes = ["image/png", "image/jpeg"];
      for (let i = 0; i < photos.length; i++) {
        if (!validTypes.includes(photos[i].type)) {
          formIsValid = false;
          errors["file"] = "Dozwolone formaty plików: PNG, JPG.";
          break;
        }
      }
    }  

    setErrors(errors);
    return formIsValid;
  };

  const onPhotosSend = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (validateForm() && photos) {
      setErrors({});
      await uploadPhotos(photos);
      await fetchAllPhotos();
      setPhotos(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const onPhotoDelete = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => {
    e.preventDefault();
    await deletePhoto(id);
    await fetchAllPhotos();
  };

  return (
    <div className={styles.main}>
      <div>
        <p>Zdjęcia widoczne dla użytkowników w Galerii.</p>
      </div>
      <div className={styles.formWrapper}>
        <div>
          <p>Dodaj nowe zdjęcia</p>
        </div>
        <div>
          <input
            multiple
            accept=".png, .jpg"
            ref={fileInputRef}
            type="file"
            onChange={(e) => setPhotos(e.target.files)}
          />
          <button onClick={onPhotosSend}>Wyślij</button>
        </div>
        {errors.file && <p className={styles.fileAlert}>{errors.file}</p>}
      </div>
      <div className={styles.photosWrapper}>
        {photosToDisplay.length > 0 ? (
          <div className={styles.photosGrid}>
            {photosToDisplay.map((photo) => (
              <div key={photo.id} className={styles.photoWrapper}>
                <img src={photo.url} />
                <div>
                  <button onClick={(e) => onPhotoDelete(e, photo.id)}>
                    Usuń zdjęcie
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Brak zdjęć</p>
        )}
      </div>
    </div>
  );
};

export default Gallery;
