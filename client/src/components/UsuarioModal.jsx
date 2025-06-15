import React, { useEffect, useState } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import axios from "axios";
import { API_REST_CONSTANTS } from "../config/api";

export default function UsuarioModal({ show, onHide, onUsuarioCreado }) {
  const [ayuntamientos, setAyuntamientos] = useState([]);
  const [tiposUsuario, setTiposUsuario] = useState([]);
  const [formData, setFormData] = useState({
    idAyuntamiento: "",
    tipoUsuario: "",
    email: "",
    nombre: "",
    apellidos: "",
  });
  const [errorEmail, setErrorEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  // Obtener ayuntamientos y tipos de usuario
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resAyuntamientos, resTipos] = await Promise.all([
          axios.get(API_REST_CONSTANTS.ENDPOINTS.AYUNTAMIENTOS),
          axios.get(API_REST_CONSTANTS.ENDPOINTS.TIPOS_USUARIO),
        ]);
        console.log(resAyuntamientos.data)
        setAyuntamientos(resAyuntamientos.data);
        setTiposUsuario(resTipos.data.filter(t => t.tipo !== 0));
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }
    };
    if (show) fetchData();
  }, [show]);

  // Comprobar si el email ya existe
  const comprobarEmail = async (email) => {
    try {
      const res = await axios.get(`${API_REST_CONSTANTS.ENDPOINTS.USUARIOS}?email=${encodeURIComponent(email)}`);
      if (res.data.length > 0) {
        setErrorEmail("Ya existe un usuario con ese correo.");
      } else {
        setErrorEmail("");
      }
    } catch (err) {
      console.error("Error comprobando email:", err);
      setErrorEmail("Error al comprobar el correo.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "email") {
      setErrorEmail("");
      if (value.includes("@")) comprobarEmail(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    try {
      const res = await axios.post(API_REST_CONSTANTS.ENDPOINTS.USUARIOS, formData);
      onUsuarioCreado?.(res.data);
      onHide();
    } catch (err) {
      console.error("Error creando usuario:", err);
      alert("No se pudo crear el usuario.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Nuevo Usuario</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Ayuntamiento</Form.Label>
            <Form.Select name="idAyuntamiento"
                value={formData.ayuntamiento}
                onChange={handleChange} required>
              <option value="">Selecciona un ayuntamiento</option>
              {ayuntamientos.map((ayuntamiento) => (
                <option key={ayuntamiento.idAyuntamiento} value={ayuntamiento.idAyuntamiento}>
                  Ayuntamiento de {ayuntamiento.municipio}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tipo de usuario</Form.Label>
            <Form.Select name="tipoUsuario" value={formData.tipoUsuario} onChange={handleChange} required>
              <option value="">Selecciona un tipo</option>
              {tiposUsuario.map((tipoUsuario) => (
                <option key={tipoUsuario.idTipo} value={tipoUsuario.idTipo}>
                  {tipoUsuario.tipoUsuario}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              isInvalid={!!errorEmail}
            />
            <Form.Control.Feedback type="invalid">{errorEmail}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <InputGroup>
                <Form.Control
                type={mostrarPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                />
                <Button
                variant="outline-secondary"
                onClick={() => setMostrarPassword(prev => !prev)}
                tabIndex={-1}
                >
                {mostrarPassword ? <BsEyeSlash /> : <BsEye />}
                </Button>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control name="nombre" value={formData.nombre} onChange={handleChange} required />
          </Form.Group>

          <Form.Group>
            <Form.Label>Apellidos</Form.Label>
            <Form.Control name="apellidos" value={formData.apellidos} onChange={handleChange} required />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancelar</Button>
          <Button variant="primary" type="submit" disabled={enviando || errorEmail}>
            Crear usuario
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
