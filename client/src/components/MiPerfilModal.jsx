import React, { useState, useContext, useEffect } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { UserContext } from "../context/UserContext";
import { useAyuntamiento } from "../context/AyuntamientoContext";
import axios from "axios";
import { API_REST_CONSTANTS } from "../config/api";

export default function MiPerfilModal({ show, onHide }) {
  const { usuario, setUsuario } = useContext(UserContext);
  const { ayuntamiento } = useAyuntamiento();

  const [nombre, setNombre] = useState(usuario?.nombre || "");
  const [apellidos, setApellidos] = useState(usuario?.apellidos || "");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const [tiposUsuario, setTiposUsuario] = useState([]);

  // Cargar tipos de usuario
    useEffect(() => {
      async function obtenerTiposUsuario() {
        try {
          const res = await axios.get(API_REST_CONSTANTS.ENDPOINTS.TIPOS_USUARIO);
          setTiposUsuario(res.data);
        } catch (error) {
          console.error("Error al cargar tipos de usuario:", error);
        }
      }
  
      obtenerTiposUsuario();
    }, []);

  const handleGuardar = async () => {
    try {
      const body = {
        nombre,
        apellidos,
        ...(password && { password }),
      };

      const response = await axios.put(
        `${API_REST_CONSTANTS.ENDPOINTS.USUARIOS}/${usuario.idUsuario}`,
        body
      );

      setUsuario(response.data);
      onHide();
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      alert("Hubo un error al actualizar tu perfil.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Mi perfil</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
            
          {usuario?.tipoUsuario !== 0 && (
            <Form.Group className="mb-3">
              <Form.Label className="label-campoForm">Ayuntamiento</Form.Label>
              <Form.Control
                plaintext
                readOnly
                defaultValue={ayuntamiento?.municipio || "Desconocido"}
              />
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label className="label-campoForm">Perfil</Form.Label>
            <Form.Control
              plaintext
              readOnly
              defaultValue= {tiposUsuario.find(tipo => tipo.idTipo === usuario.tipoUsuario)?.tipoUsuario || "Desconocido"}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="label-campoForm">Nombre</Form.Label>
            <Form.Control
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="label-campoForm">Apellidos</Form.Label>
            <Form.Control
              type="text"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <InputGroup>
                <Form.Control
                type={mostrarPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nueva contraseña"
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
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" className="btn-success" onClick={handleGuardar}>
          Guardar cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
