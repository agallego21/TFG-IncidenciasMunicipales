import React, { useEffect, useState } from "react";
import { Modal, Button, Table, Badge, Form } from "react-bootstrap";
import { FaEdit, FaTrash, FaTrashRestore } from "react-icons/fa";
import AyuntamientoModal from "./AyuntamientoModal";
import ConfirmModal from "./ConfirmModal";
import axios from "axios";
import { API_REST_CONSTANTS } from "../config/api";

export default function GestionAyuntamientosModal({ show, onHide }) {
  const [ayuntamientos, setAyuntamientos] = useState([]);
  const [mostrarDesactivados, setMostrarDesactivados] = useState(false);
  const [showAltaModal, setShowAltaModal] = useState(false);
  const [ayuntamientoEdit, setAyuntamientoEdit] = useState(null);

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;
  const indiceUltimo = paginaActual * elementosPorPagina;
  const indicePrimero = indiceUltimo - elementosPorPagina;
  const ayuntamientosFiltrados = mostrarDesactivados
    ? ayuntamientos
    : ayuntamientos.filter(a => a.estado !== 0);
  const ayuntamientosPaginados = ayuntamientosFiltrados.slice(indicePrimero, indiceUltimo);

  //Modal confirmación
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [accionAConfirmar, setAccionAConfirmar] = useState(() => () => {});
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState("");

  const solicitarConfirmacion = (mensaje, accion) => {
    setMensajeConfirmacion(mensaje);
    setAccionAConfirmar(() => accion);
    setMostrarConfirmacion(true);
  };

  useEffect(() => {
    if (show) {
      obtenerAyuntamientos();
    }
  }, [show]);

  const obtenerAyuntamientos = async () => {
    try {
      const res = await axios.get(API_REST_CONSTANTS.ENDPOINTS.AYUNTAMIENTOS);
      setAyuntamientos(res.data);
    } catch (error) {
      console.error("Error cargando ayuntamientos:", error);
    }
  };

  const handleNuevo = () => {
    setAyuntamientoEdit(null);
    setShowAltaModal(true);
  };

  const handleEditar = (ayuntamiento) => {
    setAyuntamientoEdit(ayuntamiento);
    setShowAltaModal(true);
  };

  const handleGuardar = async (formData) => {
    try {
      const data = new FormData();
      data.append("municipio", formData.municipio);
      data.append("direccionPostal", formData.direccionPostal);
      data.append("correoElectronico", formData.correoElectronico);
      data.append("telefono", formData.telefono);
      data.append("fax", formData.fax);

      data.append(
        "coordenadasCentro",
        JSON.stringify({
          type: "Point",
          coordinates: [formData.coordenadasCentro.lng, formData.coordenadasCentro.lat],
        })
      );
      data.append("tipo", "ayuntamientos");
      if (formData.imagen) {
        data.append("imagen", formData.imagen);
      }


      if (formData.idAyuntamiento) {
      /**Actualización */
          await axios.put(
            `${API_REST_CONSTANTS.ENDPOINTS.AYUNTAMIENTOS}/${formData.idAyuntamiento}`,
            data,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
      } else {
      /** Alta nueva  */
        await axios.post(API_REST_CONSTANTS.ENDPOINTS.AYUNTAMIENTOS,
          data,
          {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        });

      }

      setShowAltaModal(false);
      obtenerAyuntamientos(); // Refrescar tabla
    } catch (error) {
      console.error("Error guardando ayuntamiento:", error);
    }
  };

  const handleEliminar = async (ayuntamiento) => {
    solicitarConfirmacion(
        `¿Estás seguro de que quieres eliminar el ayuntamiento de "${ayuntamiento.municipio}"?`,
        async () => {

          try {
            await axios.delete(`${API_REST_CONSTANTS.ENDPOINTS.AYUNTAMIENTOS}/${ayuntamiento.idAyuntamiento}`);

            obtenerAyuntamientos(); // Refrescar tabla
          } catch (error) {
            console.error("Error eliminando ayuntamiento:", error);
            alert("No se pudo eliminar el ayuntamiento. Revisa los logs o la consola para más detalles.");
          }
        }
      )
  };

  
  const handleActivar = async (ayuntamiento) => {
    try {
      const formData = new FormData();
      formData.append("estado", "1"); // Reactivar

      await axios.put(
        `${API_REST_CONSTANTS.ENDPOINTS.AYUNTAMIENTOS}/${ayuntamiento.idAyuntamiento}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      obtenerAyuntamientos(); // Refrescar tabla
    } catch (error) {
      console.error("Error activando ayuntamiento:", error);
      alert("No se pudo activar el ayuntamiento.");
    }
  };

  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-ES");
  };

  return (
    <>
      <Modal show={show} onHide={onHide} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>Gestión de Ayuntamientos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex align-items-center mb-3">
            <Form.Check
              type="checkbox"
              label="Mostrar ayuntamientos desactivados"
              checked={mostrarDesactivados}
              onChange={(e) => setMostrarDesactivados(e.target.checked)}
            />

            <Button variant="primary" onClick={handleNuevo} className="btn-success ms-auto">
              Nuevo Ayuntamiento
            </Button>
          </div>

          <Table striped bordered hover responsive className="small">
            <thead>
              <tr>
                <th className="table-head-custom">ID</th>
                <th className="table-head-custom">Logo</th>
                <th className="table-head-custom">Municipio</th>
                <th className="table-head-custom">Dirección/Teléfono</th>
                <th className="table-head-custom">Correo electrónico</th>
                <th className="table-head-custom">Fecha de alta</th>
                <th className="table-head-custom">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ayuntamientosPaginados.length > 0 ? (
                ayuntamientosPaginados.map((ayto) => (
                  <tr
                    key={ayto.idAyuntamiento}
                    className={ayto.estado === 0 ? "text-muted fst-italic" : ""}
                  >
                    <td>{ayto.idAyuntamiento}</td>
                    <td  style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>{ayto?.idImagen?.path && (
                      <img
                        src={API_REST_CONSTANTS.ENDPOINTS.IMAGEN(ayto.idImagen.path)}
                        alt="Logo"
                        style={{
                          maxHeight: "40px",
                          maxWidth: "80px",
                          objectFit: "contain",
                          border: "1px solid #ccc",
                          padding: "2px",
                          borderRadius: "4px",
                        }}
                      />
                    )}
                    </td>
                    <td>{ayto.municipio}</td>
                    <td>{ayto.direccionPostal}
                      <br/>
                      {ayto.telefono}
                    </td>
                    <td>{ayto.correoElectronico}</td>
                    <td>{formatearFecha(ayto.fechaAlta)}</td>
                    <td align="center">
                      {ayto.estado === 0 ? (
                        <Button
                          className="btn btn-link p-0 me-2 btn-primary-icon"
                          onClick={() => handleActivar(ayto)}
                          title="Activar"
                        >
                          <FaTrashRestore size={18}/>
                        </Button>
                      ) : (
                        <>
                          <Button
                            className="btn btn-link p-0 me-2 btn-primary-icon"
                            title="Editar"
                            onClick={() => handleEditar(ayto)}
                          >
                            <FaEdit size={18} />
                          </Button>

                          <Button
                            className="btn btn-link p-0 me-2 btn-primary-icon"
                            title="Eliminar"
                            onClick={() => handleEliminar(ayto)}
                          >
                            <FaTrash size={18} />
                          </Button>
                        </>
                      )}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center">
                    No hay ayuntamientos registrados.
                  </td>
                </tr>
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
              Página {paginaActual} de{" "}
              {Math.ceil(ayuntamientos.length / elementosPorPagina)}
            </span>
            <Button
              variant="primary"
              className="btn-success"
              size="sm"
              disabled={paginaActual === Math.ceil(ayuntamientos.length / elementosPorPagina)}
              onClick={() => setPaginaActual(paginaActual + 1)}
            >
              Siguiente
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {showAltaModal && (
        <AyuntamientoModal
          show={showAltaModal}
          handleClose={() => setShowAltaModal(false)}
          ayuntamiento={ayuntamientoEdit}
          onSubmit={handleGuardar}
        />
      )}

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
