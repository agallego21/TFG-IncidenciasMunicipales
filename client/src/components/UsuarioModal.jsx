import React, { useEffect, useState, useContext } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useUser } from "../context/UserContext";
import axios from "axios";
import { API_REST_CONSTANTS } from "../config/api";

export default function UsuarioModal({ show, handleClose, onSubmit, usuario }) {
  const esEdicion = usuario && usuario.idUsuario !== undefined;
const { usuario: usuarioConectado } = useUser();
//    if (!usuarioConectado) return null;

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

        setAyuntamientos(resAyuntamientos.data);
        setTiposUsuario(resTipos.data.filter(t => t.tipo !== 0));
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }

  if (show) {
    if (usuario && esEdicion) {
      setFormData({
        idUsuario: usuario.idUsuario,
        idAyuntamiento: usuario.idAyuntamiento || "",
        tipoUsuario: usuario.tipoUsuario || "",
        email: usuario.email || "",
        password: "", // Por seguridad, dejamos el password vacío en edición
        nombre: usuario.nombre || "",
        apellidos: usuario.apellidos || "",
      });
      setMostrarPassword(false);
      setErrorEmail("");
    } else {
      setFormData({
        idAyuntamiento: usuarioConectado.tipousuario===0?"":usuarioConectado.idAyuntamiento,
        tipoUsuario: "",
        email: "",
        password: "",
        nombre: "",
        apellidos: "",
      });
      setErrorEmail("");
      setMostrarPassword(false);
    }
  }
    };
    if (show) fetchData();
  }, [show, usuario, esEdicion]);

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

    if (name === "email" && !esEdicion) {
      setErrorEmail("");
      if (value.includes("@")) comprobarEmail(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);

    try {
      if (errorEmail) {
        alert("Por favor, corrige los errores antes de continuar.");
        return;
      }

      await onSubmit(formData);
      handleClose();
    } catch (err) {
      console.error("Error al guardar usuario:", err);
      alert("No se pudo guardar el usuario.");
    } finally {
      setEnviando(false);
    }
  };


  return (
    <Modal show={show} centered>
      <Modal.Header closeButton>
        <Modal.Title>{esEdicion ? "Editar Usuario" : "Nuevo Usuario"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Ayuntamiento</Form.Label>
            {usuarioConectado && usuarioConectado.tipoUsuario === 0 ? (
              <Form.Select
                name="idAyuntamiento"
                value={formData.idAyuntamiento}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un ayuntamiento</option>
                {ayuntamientos.map((ayuntamiento) => (
                  <option key={ayuntamiento.idAyuntamiento} value={ayuntamiento.idAyuntamiento}>
                    Ayuntamiento de {ayuntamiento.municipio}
                  </option>
                ))}
              </Form.Select>
            ) : (
              <>
                <div className="form-control-plaintext">
                  Ayuntamiento de{" "}
                  {
                    ayuntamientos.find((a) => a.idAyuntamiento === usuarioConectado.idAyuntamiento)?.municipio || ""
                  }
                </div>
                <input
                  type="hidden"
                  name="idAyuntamiento"
                  value={usuarioConectado?.idAyuntamiento}
                />
              </>
            )}
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
            <Form.Label>Nombre</Form.Label>
            <Form.Control name="nombre" value={formData.nombre} onChange={handleChange} required />
          </Form.Group>

          <Form.Group>
            <Form.Label>Apellidos</Form.Label>
            <Form.Control name="apellidos" value={formData.apellidos} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            {esEdicion ? (
              // Mostrar email como texto estático, sin input
              <div className="form-control-plaintext">{formData.email}</div>
            ) : (
              // En modo creación, mostrar input editable
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                isInvalid={!!errorEmail}
              />
            )}
            {!esEdicion && (
              <Form.Control.Feedback type="invalid">{errorEmail}</Form.Control.Feedback>
            )}
          </Form.Group>

          {!esEdicion && (
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
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          
          <Button variant="primary" className="btn-success" type="submit" disabled={enviando || errorEmail}>
          {enviando
            ? (esEdicion ? "Guardando..." : "Creando...")
            : (esEdicion ? "Guardar cambios" : "Crear usuario")}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
