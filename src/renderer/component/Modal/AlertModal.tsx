import React from "react";
import Modal from "react-bootstrap/Modal";
import { RegularButton } from "@Renderer/component/Button";

interface AlertModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  description: string;
}

const AlertModal = ({ showModal, setShowModal, title, description }: AlertModalProps) => (
  <Modal size="md" show={showModal} onHide={() => setShowModal(false)} aria-labelledby="contained-modal-title-vcenter" centered>
    <Modal.Header closeButton>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <div dangerouslySetInnerHTML={{ __html: description }} />
    </Modal.Body>
    <Modal.Footer>
      <RegularButton buttonText="Ok" styles="outline gradient" onClick={() => setShowModal(false)} />
    </Modal.Footer>
  </Modal>
);

export default AlertModal;
