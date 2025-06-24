import React from "react";
import { Modal, Button } from "react-bootstrap";

export default function ConfirmModal({ 
  show, 
  onHide, 
  onConfirm, 
  mensaje = "¿Estás seguro de realizar esta acción?",
  titulo = "Confirmar acción",
  textoConfirmar = "Confirmar",
  textoCancelar = "Cancelar",
  varianteConfirmar = "danger"
}) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{titulo}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{mensaje}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {textoCancelar}
        </Button>
        <Button variant={varianteConfirmar} onClick={onConfirm}>
          {textoConfirmar}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
