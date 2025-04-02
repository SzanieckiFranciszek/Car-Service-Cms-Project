import { ReactNode } from "react";
import styles from "./modal.module.scss";
import ReactModal from "react-modal";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  return (
    <ReactModal
      isOpen={isOpen}
      className={styles.Modal}
      overlayClassName={styles.Overlay}
    >
      <div className={styles.buttonWrapper}>
        <button onClick={onClose}>Zamknij</button>
      </div>
      {children}
    </ReactModal>
  );
};

export default Modal;
