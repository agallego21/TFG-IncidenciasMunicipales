import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import axios from "axios";
import UsuarioModal from "./UsuarioModal";
import { useAyuntamiento } from "../context/AyuntamientoContext";
import { API_REST_CONSTANTS } from "../config/api";

export default function GestionUsuariosModal({ show, onHide }) {
  const { ayuntamientos } = useAyuntamiento();
  const [usuarios, setUsuarios] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroAyuntamiento, setFiltroAyuntamiento] = useState("");
  const [showUsuarioModal, setShowUsuarioModal] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  //Paginación de tabla
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;
  const indiceUltimo = paginaActual * elementosPorPagina;
  const indicePrimero = indiceUltimo - elementosPorPagina;
  const usuariosPaginados = usuarios.slice(indicePrimero, indiceUltimo);

  // Cargar usuarios filtrados
  useEffect(() => {
    async function obtenerUsuarios() {
        try {
            const baseURL = API_REST_CONSTANTS.ENDPOINTS.USUARIOS;

            const params = new URLSearchParams();

            if (filtroTipo !== undefined && filtroTipo !== '') {
                params.append('tipoUsuario', filtroTipo);
            }
            if (filtroAyuntamiento !== undefined && filtroAyuntamiento !== '') {
                params.append('idAyuntamiento', filtroAyuntamiento);
            }

            const url = `${baseURL}?${params.toString()}`;
            const res = await axios.get(url);

            setUsuarios(res.data);
            
            setPaginaActual(1);
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
        }
    }

    if (show) {
      obtenerUsuarios();
    }
  }, [filtroTipo, filtroAyuntamiento, show]);

  // Abrir modal para nuevo usuario
  const handleNuevoUsuario = () => {
    setUsuarioSeleccionado(null);
    setShowUsuarioModal(true);
  };

  // Abrir modal para editar usuario
  const handleEditarUsuario = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setShowUsuarioModal(true);
  };

  return (
    <>
      <Modal show={show} onHide={onHide} size="xl" centered dialogClassName="modal-custom-height">
        <Modal.Header closeButton>
          <Modal.Title>Gestión de Usuarios</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form className="mb-3 d-flex gap-3">
            <Form.Group controlId="filtroTipo" style={{ minWidth: "150px" }}>
              <Form.Label>Tipo de Usuario</Form.Label>
              <Form.Select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="0">Administrador General</option>
                <option value="1">Administrador Ayuntamiento</option>
                <option value="2">Usuario Normal</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="filtroAyuntamiento" style={{ minWidth: "150px" }}>
              <Form.Label>Ayuntamiento</Form.Label>
              <Form.Select
                value={filtroAyuntamiento}
                onChange={(e) => setFiltroAyuntamiento(e.target.value)}
              >
                <option value="">Todos</option>
                {ayuntamientos?.map((a) => (
                  <option key={a.idAyuntamiento} value={a.idAyuntamiento}>
                    {a.municipio}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Button variant="primary" onClick={handleNuevoUsuario} className="btn-success ms-auto">
              Nuevo Usuario
            </Button>
          </Form>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Email</th>
                <th>Tipo Usuario</th>
                <th>Ayuntamiento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    No hay usuarios que mostrar.
                  </td>
                </tr>
              ) : (
                usuariosPaginados.map((usuario) => (
                  <tr key={usuario._id}>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.apellidos}</td>
                    <td>{usuario.email}</td>
                    <td>
                      {usuario.tipoUsuario === 0
                        ? "Administrador General"
                        : usuario.tipoUsuario === 1
                        ? "Administrador Ayuntamiento"
                        : "Usuario Normal"}
                    </td>
                    <td>{usuario.ayuntamiento?.municipio || "-"}</td>
                    <td>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleEditarUsuario(usuario)}
                      >
                        Editar
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          <div className="d-flex justify-content-center align-items-center mt-3">
            <Button
                variant="outline-primary"
                size="sm"
                disabled={paginaActual === 1}
                onClick={() => setPaginaActual(paginaActual - 1)}
            >
                Anterior
            </Button>

            <span className="mx-3">
                Página {paginaActual} de {Math.ceil(usuarios.length / elementosPorPagina)}
            </span>

            <Button
                variant="outline-primary"
                size="sm"
                disabled={paginaActual === Math.ceil(usuarios.length / elementosPorPagina)}
                onClick={() => setPaginaActual(paginaActual + 1)}
            >
                Siguiente
            </Button>
          </div>

        </Modal.Body>
      </Modal>

      <UsuarioModal
        show={showUsuarioModal}
        onHide={() => setShowUsuarioModal(false)}
        usuario={usuarioSeleccionado}
        onUsuarioCreado={(nuevoUsuario) => {
          // Aquí podrías recargar la lista o actualizar el estado para reflejar el cambio
          setShowUsuarioModal(false);
          // Recargar usuarios o refrescar datos
          setFiltroTipo(""); // Forzar recarga
          setFiltroAyuntamiento("");
        }}
      />
    </>
  );
}
