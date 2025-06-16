import React, { useEffect, useState } from "react";
import { Modal, Button, Table } from "react-bootstrap";
import AyuntamientoModal from "./AyuntamientoModal";
import axios from "axios";
import { API_REST_CONSTANTS } from "../config/api";

export default function GestionAyuntamientosModal({ show, onHide }) {
  const [ayuntamientos, setAyuntamientos] = useState([]);
  const [showAltaModal, setShowAltaModal] = useState(false);
  const [ayuntamientoEdit, setAyuntamientoEdit] = useState(null);

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;
  const indiceUltimo = paginaActual * elementosPorPagina;
  const indicePrimero = indiceUltimo - elementosPorPagina;
  const ayuntamientosPaginados = ayuntamientos.slice(indicePrimero, indiceUltimo);

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
      if (formData.idAyuntamiento) {
        // Actualización
        const formData = {
          municipio: formData.municipio,
          coordenadasCentro: {
            type: "Point",
            coordinates: [formData.coordenadasCentro.lng, formData.coordenadasCentro.lat],
          },
        };

        if (formData.imagen) {
          // Si hay nueva imagen, se necesita enviar como FormData
          const data = new FormData();
          data.append("municipio", formData.municipio);
          data.append("coordenadasCentro", JSON.stringify(formData.coordenadasCentro));
          data.append("imagen", formData.imagen);
          data.append("tipo", "ayuntamientos");
          
          await axios.put(
            `${API_REST_CONSTANTS.ENDPOINTS.AYUNTAMIENTOS}/${formData.idAyuntamiento}`,
            data,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
        } else {
          // Si no hay imagen nueva, se puede enviar como JSON
          await axios.put(
            `${API_REST_CONSTANTS.ENDPOINTS.AYUNTAMIENTOS}/${formData.idAyuntamiento}`,
            formData
          );
        }
      } else {
        // Alta nueva
        const data = new FormData();
        data.append("municipio", formData.municipio);
        data.append(
          "coordenadasCentro",
          JSON.stringify({
            type: "Point",
            coordinates: [formData.coordenadasCentro.lng, formData.coordenadasCentro.lat],
          })
        );
        if (formData.imagen) {
          data.append("imagen", formData.imagen);
          data.append("tipo", "ayuntamientos");
        }

        await axios.post(API_REST_CONSTANTS.ENDPOINTS.AYUNTAMIENTOS, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      setShowAltaModal(false);
      obtenerAyuntamientos(); // Refrescar tabla
    } catch (error) {
      console.error("Error guardando ayuntamiento:", error);
    }
  };

  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-ES");
  };

  return (
    <>
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Gestión de Ayuntamientos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex mb-3">
            <Button variant="primary" onClick={handleNuevo} className="btn-success ms-auto">
              Nuevo Ayuntamiento
            </Button>
          </div>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Municipio</th>
                <th>Fecha de alta</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ayuntamientosPaginados.length > 0 ? (
                ayuntamientosPaginados.map((ayto) => (
                  <tr key={ayto.idAyuntamiento}>
                    <td>{ayto.idAyuntamiento}</td>
                    <td>{ayto.municipio}</td>
                    <td>{formatearFecha(ayto.createdAt)}</td>
                    <td>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleEditar(ayto)}
                      >
                        Editar
                      </Button>
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
              variant="outline-primary"
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
              variant="outline-primary"
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
    </>
  );
}
