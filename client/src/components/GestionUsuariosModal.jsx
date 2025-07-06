import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import axios from "axios";
import UsuarioModal from "./UsuarioModal";
import ConfirmModal from "./ConfirmModal";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useUser } from "../context/UserContext";
import { useAyuntamiento } from "../context/AyuntamientoContext";
import { API_REST_CONSTANTS } from "../config/api";

export default function GestionUsuariosModal({ show, onHide }) {
  const { ayuntamientos } = useAyuntamiento();
  const { usuario } = useUser();
  const [usuarios, setUsuarios] = useState([]);
  const [tiposUsuario, setTiposUsuario] = useState([]);
  const [listaAyuntamientos, setListaAyuntamientos] = useState([]);
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

  //Modal confirmación
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [accionAConfirmar, setAccionAConfirmar] = useState(() => () => {});
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState("");

  const solicitarConfirmacion = (mensaje, accion) => {
    setMensajeConfirmacion(mensaje);
    setAccionAConfirmar(() => accion);
    setMostrarConfirmacion(true);
  };

    // Función para cargar usuarios
  async function obtenerUsuarios() {
    try {
      const baseURL = API_REST_CONSTANTS.ENDPOINTS.USUARIOS;

      const params = new URLSearchParams();

      if (filtroTipo !== undefined && filtroTipo !== '') {
        params.append('tipoUsuario', filtroTipo);
      }
      if (usuario?.tipoUsuario === 1 || usuario?.tipoUsuario === 2) {
        params.append('idAyuntamiento', usuario.idAyuntamiento);
      } else if (filtroAyuntamiento !== undefined && filtroAyuntamiento !== '') {
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

  // Cargar usuarios filtrados
  useEffect(() => {
     if (show) {
      obtenerUsuarios();
    }
  }, [filtroTipo, filtroAyuntamiento, show]);

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

    if (show) {
      obtenerTiposUsuario();
    }
  }, [show]);

  // Cargar lista ayuntamientos
  useEffect(() => {
    async function obtenerListaAyuntamientos() {
      try {
        const res = await axios.get(API_REST_CONSTANTS.ENDPOINTS.AYUNTAMIENTOS);
        setListaAyuntamientos(res.data);
      } catch (error) {
        console.error("Error al cargar lista de ayuntamientos:", error);
      }
    }

    if (show) {
      obtenerListaAyuntamientos();
    }
  }, [show]);

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

  const handleGuardar = async (formData) => {
    try {
      if (formData.idUsuario) {
        // Edición
        const id = formData.idUsuario;
        await axios.put(`${API_REST_CONSTANTS.ENDPOINTS.USUARIOS}/${id}`, formData);
      } else {
        // Alta nueva
        await axios.post(API_REST_CONSTANTS.ENDPOINTS.USUARIOS, formData);
      }

      setShowUsuarioModal(false);

      // Recargar usuarios tras guardar
      obtenerUsuarios();

    } catch (error) {
      console.error("Error guardando usuario:", error);
    }
  };

  const handleEliminarUsuario = async (usuario) => {
    solicitarConfirmacion(
        `¿Estás seguro de que quieres eliminar al usuario "${usuario.nombre} ${usuario.apellidos}"?`,
        async () => {

          try {
            await axios.delete(`${API_REST_CONSTANTS.ENDPOINTS.USUARIOS}/${usuario.idUsuario}`);

            // Recargar usuarios tras guardar
            obtenerUsuarios();
          } catch (error) {
            console.error("Error eliminando usuario:", error);
            alert("No se pudo eliminar el usuario. Revisa los logs o la consola para más detalles.");
          }
        }
      )
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
                {tiposUsuario.map((tipoUsuario) => (
                  <option key={tipoUsuario.idTipo} value={tipoUsuario.idTipo}>
                    {tipoUsuario.tipoUsuario}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            {/* Sólo se muestra si el usuario es Adminsitrador General */}
            {(usuario?.tipoUsuario === 0) && (
              <Form.Group controlId="filtroAyuntamiento" style={{ minWidth: "150px" }}>
                <Form.Label>Ayuntamiento</Form.Label>
                <Form.Select
                  value={filtroAyuntamiento}
                  onChange={(e) => setFiltroAyuntamiento(e.target.value)}
                >
                  <option value="">Todos</option>
                  {listaAyuntamientos?.map((ayto) => (
                    <option key={ayto.idAyuntamiento} value={ayto.idAyuntamiento}>
                      {ayto.municipio}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}
            {(usuario?.tipoUsuario !== 2) && (
              <Button variant="primary" 
                onClick={handleNuevoUsuario} 
                className="btn-success ms-auto" 
                style={{ alignSelf: "flex-start" }
              }>
                Nuevo Usuario
              </Button>
            )}
          </Form>

          <Table striped bordered hover responsive className="small">
            <thead>
              <tr>
                <th className="table-head-custom">Nombre</th>
                <th className="table-head-custom">Apellidos</th>
                <th className="table-head-custom">Email</th>
                <th className="table-head-custom">Tipo Usuario</th>
                <th className="table-head-custom">Ayuntamiento</th>
                <th className="table-head-custom">Acciones</th>
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
                usuariosPaginados.map((user) => (
                  <tr key={user.idUsuario}>
                    <td>{user.nombre}</td>
                    <td>{user.apellidos}</td>
                    <td>{user.email}</td>
                    <td>
                      {tiposUsuario.find(tipo => tipo.idTipo === user.tipoUsuario)?.tipoUsuario || "Desconocido"}
                    </td>
                    <td>
                        {listaAyuntamientos.find(a => a.idAyuntamiento === user.idAyuntamiento)?.municipio || "-"}
                    </td>
                    <td>
                    {(usuario?.tipoUsuario !== 2) ? (
                      <Button 
                        className="btn btn-link p-0 me-2 btn-primary-icon" 
                        title="Editar" 
                        onClick={() => handleEditarUsuario(user)}
                      >
                        <FaEdit size={18} />
                      </Button>
                    ) : (
                        <FaEdit
                            size={18}
                            className="text-secondary me-2"
                            title="Sin imágenes"
                            style={{ opacity: 0.5, cursor: "not-allowed" }}
                        />
                    )}  

                    {(usuario?.tipoUsuario !== 2) ? (
                      <Button 
                        className="btn btn-link p-0 me-2 btn-primary-icon" 
                        title="eliminar" 
                        onClick={() => handleEliminarUsuario(user)}
                      >
                        <FaTrash size={18} />
                      </Button>
                    ) : (
                        <FaTrash
                            size={18}
                            className="text-secondary me-2"
                            title="Sin imágenes"
                            style={{ opacity: 0.5, cursor: "not-allowed" }}
                        />
                    )}  
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          <div className="d-flex justify-content-center align-items-center mt-3">
            <Button
              variant="primary"
              className="btn-success"
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
              variant="primary"
              className="btn-success"
              size="sm"
              disabled={indiceUltimo >= usuarios.length}
              onClick={() => setPaginaActual(paginaActual + 1)}
            >
              Siguiente
            </Button>
          </div>

        </Modal.Body>
      </Modal>

      <UsuarioModal
        show={showUsuarioModal}
        handleClose={() => setShowUsuarioModal(false)}
        usuario={usuarioSeleccionado}
        onSubmit={handleGuardar}
      />

      <ConfirmModal
        show={mostrarConfirmacion}
        onHide={() => setMostrarConfirmacion(false)}
        onConfirm={() => {
          accionAConfirmar();
          setMostrarConfirmacion(false);
        }}
        mensaje={mensajeConfirmacion}
      />
    </>
  );
}
