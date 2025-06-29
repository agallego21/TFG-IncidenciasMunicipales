import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const AlertModal = ({ show, onClose, message, title = "Aviso" }) => {
  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
            variant="primary"
            className="btn-success"
            size="sm"onClick={onClose}>
          Aceptar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AlertModal;
