import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Card, Button, Carousel } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";

import { useAyuntamiento } from "../context/AyuntamientoContext";

export default function Sidebar({ visible, onClose }) {
  const [incidencias, setIncidencias] = useState([]);
  const [tiposIncidencia, setTiposIncidencia] = useState([]);
  const [estadosIncidencia, setEstadosIncidencia] = useState([]);
  
  const { ayuntamiento } = useAyuntamiento();

  useEffect(() => {
    const obtenerIncidencias = async () => {
      try {
        if (!ayuntamiento) return;  //No hay ayuntamiento seleccionado
        const respuesta = await axios.get(`http://localhost:5005/incidencias/ayuntamiento/${ayuntamiento.idAyuntamiento}`);
        setIncidencias(respuesta.data);
      } catch (error) {
        console.error("Error al obtener incidencias:", error);
      }
    };

    const obtenerTipos = async () => {
      try {
        const res = await axios.get("http://localhost:5005/tiposIncidencia");
        setTiposIncidencia(res.data);
      } catch (error) {
        console.error("Error al obtener tipos de incidencia:", error);
      }
    };

    const obtenerEstados = async () => {
      try {
        const res = await axios.get("http://localhost:5005/estadosIncidencia");
        setEstadosIncidencia(res.data);
      } catch (error) {
        console.error("Error al obtener estados de incidencia:", error);
      }
    };

    if (ayuntamiento) {
      obtenerIncidencias();
      obtenerTipos();
      obtenerEstados();
    }

  }, [ayuntamiento]);

  // Función para obtener el nombre del tipo por idTipo
  const getNombreTipo = (idTipo) => {
    const tipo = tiposIncidencia.find((t) => t.idTipo === idTipo);
    return tipo ? tipo.tipoIncidencia : "---";
  };

   // Función para obtener el nombre del estado por idEstado
  const getNombreEstado = (idEstado) => {
    const estado = estadosIncidencia.find((t) => t.idEstado === idEstado);
    return estado ? estado.estadoIncidencia : "---";
  };

  const [showModal, setShowModal] = useState(false);
  const [imagenesModal, setImagenesModal] = useState([]);

  // Función para abrir modal con las imágenes de una incidencia
  const abrirModalImagenes = (imagenes) => {
    setImagenesModal(imagenes);
    setShowModal(true);
  };

  return (
 <aside
      className={`sidebar p-3 position-fixed start-0 h-100 overflow-auto shadow ${
        visible ? "d-block top-0" : "d-none"
      } d-md-block`}
      style={{ width: "320px", zIndex: 1050 }}
    >
      {/* Botón para cerrar en móvil */}
      <div className="d-flex justify-content-between align-items-center d-md-none mb-3">
        <h4 className="m-0">Incidencias</h4>
        <Button variant="light" onClick={onClose}>
          <FaTimes />
        </Button>
      </div>

      <h2 className="mb-4">Incidencias registradas</h2>
      {incidencias.map((incidencia) => (
        <Card key={incidencia._id} className="mb-3 shadow-sm">
          <Card.Body>
            <Card.Title>{incidencia.titulo}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              Estado: {getNombreEstado(incidencia.estado)}
            </Card.Subtitle>
            <Card.Text>{incidencia.descripcion}</Card.Text>
            <Card.Text><strong>Tipo:</strong> {getNombreTipo(incidencia.tipoIncidencia)}</Card.Text>
            <Card.Text className="text-muted small">📍 {incidencia.direccion}</Card.Text>
            {incidencia.imagenes.length > 0 && (
              <Button variant="outline-secondary" size="sm" onClick={() => abrirModalImagenes(incidencia.imagenes)}>
                📷
              </Button>
            )}
          </Card.Body>
        </Card>
      ))}

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Imágenes de la incidencia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {imagenesModal.length === 1 ? (
            <img
              src={"http://localhost:5005/" + imagenesModal[0].url}
              alt="Imagen incidencia"
              className="img-fluid"
            />
          ) : (
            <Carousel>
              {imagenesModal.map((img) => (
                <Carousel.Item key={img.id}>
                  <img
                    className="d-block w-100"
                    src={"http://localhost:5005/" + img.url}
                    alt={`Imagen incidencia ${img.id}`}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </aside>
  );
}