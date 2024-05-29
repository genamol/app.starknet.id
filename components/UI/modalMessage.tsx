import React from "react";
import styles from "../../styles/components/modalMessage.module.css";
import { FunctionComponent, ReactNode } from "react";
import { Modal } from "@mui/material";
import errorLottie from "../../public/visuals/errorLottie.json";
import Lottie from "lottie-react";

type ModalMessageProps = {
  title: string;
  message: ReactNode;
  closeModal: () => void;
  open: boolean;
};

const ModalMessage: FunctionComponent<ModalMessageProps> = ({
  title,
  message,
  closeModal,
  open,
}) => {
  return (
    <Modal
      disableAutoFocus
      open={open}
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className={styles.menu}>
        <button className={styles.menu_close} onClick={closeModal}>
          <svg viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
        <p className={styles.menu_title}>{title}</p>
        <div className="flex flex-col items-center justify-center sm:-mb-20 sm:-mt-20 -mb-8 -mt-8">
          <Lottie className="w-68" animationData={errorLottie} loop={false} />
        </div>
        {message}
      </div>
    </Modal>
  );
};
export default ModalMessage;
