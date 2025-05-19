import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";

export default function LoginModal({ show, handleClose }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useContext(UserContext);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.get(
        `http://localhost:5005/usuarios?email=${encodeURIComponent(formData.email)}`
      );

      if (response.data.length === 0) {
        setError("Usuario no encontrado");
      } else {
        login(response.data[0]);
        handleClose();
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Identificación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group controlId="formEmail">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formPassword" className="mt-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-4 w-100">
            Iniciar sesión
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}