
import styles from "./gallery.module.scss";
import CustomSections from "../custom/CustomSection";
import { useState } from "react";
import ReactModal from "react-modal";
import { Page, Photo } from "@shared/types";





interface GalleryProps {
  pageData: Page
  // setPhotosToDisplay: React.Dispatch<React.SetStateAction<Photo[]>>
  photosData: Photo[]
}

const Gallery = (props: GalleryProps) => {

    // const [photosToDisplay, setPhotosToDisplay] = useState<Photo[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | undefined>(undefined);

  
  //  useEffect(() => {
  //    const fetchAllPhotos = async () => {
  //      const result = await getAllPhotos();
  //      if (result) {
  //        props.setPhotosToDisplay(result);
  //      }
  //    };
     
  //     fetchAllPhotos();
  //   }, []);
    
    const onPhotoClick = (photo: Photo) => {
      setSelectedPhoto(photo)
      setIsModalOpen(true)
    }

    const onPhotoClose = () => {
      setSelectedPhoto(undefined)
      setIsModalOpen(false)
    }

  return (
    <div className={styles.main}>
      <CustomSections data={props.pageData.section}/>
      <div className={styles.photosWrapper}>
        {props.photosData.length > 0 ? (
          <div className={styles.photosGrid}>
            {props.photosData.map((photo) => (
              <div key={photo.id} className={styles.photoWrapper}>
                <img src={photo.url} onClick={() => onPhotoClick(photo)}/>
                <div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Brak zdjęć</p>
        )}
      </div>
      <ReactModal isOpen={isModalOpen} className={styles.modal} overlayClassName={styles.overlay}>
        <div className={styles.modalPhotoContent}>
          <div className={styles.modalButtonWrapper}>

          <button onClick={onPhotoClose}>Zamknij</button>
          </div>
          {selectedPhoto?.url && <img src={selectedPhoto.url}/>}
        </div>
      
      </ReactModal>
    
    </div>
  );
};

export default Gallery;
