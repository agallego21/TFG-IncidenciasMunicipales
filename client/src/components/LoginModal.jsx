import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { API_REST_CONSTANTS } from "../config/api";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function LoginModal({ show, handleClose, ayuntamiento }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useContext(UserContext);

  const navigate = useNavigate();
  const { idAyuntamiento } = useParams();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        API_REST_CONSTANTS.ENDPOINTS.USUARIO_LOGIN,
        {
          email: formData.email,
          password: formData.password,
        }
      );

      const usuario = response.data.usuario;

      // Validación del ayuntamiento si aplica (excepto para admins)
      if (
        ayuntamiento &&
        usuario.tipoUsuario !== 0 &&
        usuario.idAyuntamiento !== ayuntamiento.idAyuntamiento
      ) {
        setError("El usuario no pertenece a este Ayuntamiento");
        return;
      }

      login(usuario);

      //Redirigimos a su ayuntamiento
      /*if (
        ayuntamiento &&
        usuario.tipoUsuario !== 0 &&
        ayuntamiento.idAyuntamiento !== usuario.idAyuntamiento
      ) {
        navigate(`/ayuntamiento/${usuario.idAyuntamiento}`);
      }*/
      handleClose();

    } catch (err) {
      if (err.response?.status === 401) {
        setError("Contraseña incorrecta");
      } else if (err.response?.status === 404) {
        setError("Usuario no encontrado");
      } else {
        setError("Error al conectar con el servidor");
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Identificación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
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
