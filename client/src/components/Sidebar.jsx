import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Modal, Card, Button, Carousel, Form, Collapse } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import { useAyuntamiento } from "../context/AyuntamientoContext";
import { UserContext } from "../context/UserContext";
import IncidenciaCard from "./IncidenciaCard";
import { API_REST_CONSTANTS } from "../config/api";

export default function Sidebar({ visible, onClose, incidencias, incidenciasFiltradas, setIncidenciasFiltradas }) {
  const { usuario } = useContext(UserContext);
  const [tiposIncidencia, setTiposIncidencia] = useState([]);
  const [estadosIncidencia, setEstadosIncidencia] = useState([]);
  const [filtroMisIncidencias, setFiltroMisIncidencias] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const { ayuntamiento } = useAyuntamiento();

  useEffect(() => {
    const obtenerTipos = async () => {
      try {
        const res = await axios.get(API_REST_CONSTANTS.ENDPOINTS.TIPOS_INCIDENCIA);
        setTiposIncidencia(res.data);
      } catch (error) {
        console.error("Error al obtener tipos de incidencia:", error);
      }
    };

    const obtenerEstados = async () => {
      try {
        const res = await axios.get(API_REST_CONSTANTS.ENDPOINTS.ESTADOS_INCIDENCIA);
        setEstadosIncidencia(res.data);
      } catch (error) {
        console.error("Error al obtener estados de incidencia:", error);
      }
    };

    if (ayuntamiento) {
      obtenerTipos();
      obtenerEstados();
    }
  }, [ayuntamiento]);

  const getNombreTipo = (idTipo) => {
    const tipo = tiposIncidencia.find((t) => t.idTipo === idTipo);
    return tipo ? tipo.tipoIncidencia : "---";
  };

  const getNombreEstado = (idEstado) => {
    const estado = estadosIncidencia.find((t) => t.idEstado === idEstado);
    return estado ? estado.estadoIncidencia : "---";
  };

  const [showModal, setShowModal] = useState(false);
  const [imagenesModal, setImagenesModal] = useState([]);

  const abrirModalImagenes = (imagenes) => {
    setImagenesModal(imagenes);
    setShowModal(true);
  };

  const aplicarFiltros = () => {
    let resultado = incidencias;

    if (filtroMisIncidencias && usuario) {
      resultado = resultado.filter((inci) => parseInt(inci.idUsuario) === usuario.idUsuario);
    }

    if (filtroTipo) {
      resultado = resultado.filter((inci) => inci.tipoIncidencia === parseInt(filtroTipo));
    }

    if (filtroEstado) {
      resultado = resultado.filter((inci) => inci.estado === parseInt(filtroEstado));
    }

    setIncidenciasFiltradas(resultado);
  };

  return (
    <aside
      className={`sidebar p-3 position-fixed start-0 shadow ${visible ? "d-block" : "d-none"} d-md-block`}
      style={{
        height: "calc(100vh - 120px)",
        zIndex: 1050,
        overflowY: "auto",
      }}
    >
      <div className="d-flex justify-content-between align-items-center d-md-none mb-3">
        <Button className="btn-filtrar" onClick={onClose}>
          <FaTimes />
        </Button>
      </div>

      <h2 className="mb-3">Incidencias registradas</h2>

      <div className="mb-3">
        <Button variant="link" className="text-white" onClick={() => setMostrarFiltros(!mostrarFiltros)}>
          {mostrarFiltros ? "Ocultar filtros" : "Mostrar filtros"}
        </Button>
        <Collapse in={mostrarFiltros}>
          <div>
          <div className="filtros-container">
            { usuario ? (
            <Form.Group className="mb-3">
              <Form.Label className="text-white">Filtrar por</Form.Label>
              <Form.Select
                value={filtroMisIncidencias ? "mis" : "todas"}
                onChange={(e) => setFiltroMisIncidencias(e.target.value === "mis")}
              >
                <option value="todas">Todas</option>
                <option value="mis">Mis incidencias</option>
              </Form.Select>
            </Form.Group>
            ) : null
            }
            <Form.Group className="mt-2">
              <Form.Label>Estado</Form.Label>
              <Form.Select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                <option value="">Todos</option>
                {estadosIncidencia.map((estado) => (
                  <option key={estado.idEstado} value={estado.idEstado}>
                    {estado.estadoIncidencia}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mt-2">
              <Form.Label>Tipo</Form.Label>
              <Form.Select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
                <option value="">Todos</option>
                {tiposIncidencia.map((tipo) => (
                  <option key={tipo.idTipo} value={tipo.idTipo}>
                    {tipo.tipoIncidencia}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Button className="mt-3 w-100 btn-filtrar" onClick={aplicarFiltros}>
              Filtrar incidencias
            </Button>
          </div>
          </div>
        </Collapse>
      </div>

      {incidenciasFiltradas && incidenciasFiltradas.length > 0 ? (
        incidenciasFiltradas.map((incidencia) => (
          <IncidenciaCard
            key={incidencia._id}
            incidencia={incidencia}
            getNombreEstado={getNombreEstado}
            getNombreTipo={getNombreTipo}
            onVerImagenes={abrirModalImagenes}
          />
        ))
      ) : (
        <p>No hay incidencias que mostrar</p>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Imágenes de la incidencia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {imagenesModal.length === 1 ? (
            <img
              src={API_REST_CONSTANTS.ENDPOINTS.IMAGEN(imagenesModal[0].url)}
              alt="Imagen incidencia"
              className="img-fluid"
            />
          ) : (
            <Carousel>
              {imagenesModal.map((img) => (
                <Carousel.Item key={img.id}>
                  <img
                    className="d-block w-100"
                    src={API_REST_CONSTANTS.ENDPOINTS.IMAGEN(img.url)}
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
