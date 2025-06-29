import React, { useEffect, useState } from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";
import { FaCamera, FaMapMarkedAlt, FaRegSave, FaWpforms} from "react-icons/fa";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import AlertModal from './AlertModal';
import axios from 'axios';
import { API_REST_CONSTANTS } from "../config/api";

export default function GestionIncidenciasModal({ show, onHide, incidencias, estadosIncidencia, tiposIncidencia, onVerImagenes, onRecargarIncidencias}) {
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroFechaDesde, setFiltroFechaDesde] = useState("");
  const [filtroFechaHasta, setFiltroFechaHasta] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 10;

  // Para ver la incidencia en el mapa
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [coordenadasIncidencia, setCoordenadasIncidencia] = useState(null);
  const [direccionIncidencia, setDireccionIncidencia] = useState("");
  const handleVerUbicacion = (geoJsonCoords, direccion) => {
    const [lng, lat] = geoJsonCoords; // GeoJSON: [lng, lat]
    setCoordenadasIncidencia({ lat, lng });
    setDireccionIncidencia(direccion);
    setMostrarMapa(true);
  };

  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState('');
  const mostrarAlertaModal = (mensaje) => {
    setMensajeAlerta(mensaje);
    setMostrarAlerta(true);
  };

  //Para editar incidencia
  const [ediciones, setEdiciones] = useState({});
  const editarIncidencia = (id, campo, valor) => {
    setEdiciones(prev => {
        const nuevosCambios = {
        ...prev[id],
        [campo]: valor,
        };

        // Si se está editando el campo 'resolucion' y no está vacío, añadimos la fecha de resolución
        if (campo === "textoResolucion" && valor.trim() !== "") {
            nuevosCambios.fechaResolucion = new Date().toISOString(); // formato timestamp
        }

        return {
        ...prev,
            [id]: nuevosCambios,
        };
    });
  };

  // Texto resolución de incidencia
  const [mostrarModalResolucion, setMostrarModalResolucion] = useState(false);
  const [idIncidenciaResolviendo, setIdIncidenciaResolviendo] = useState(null);
  const [textoResolucion, setTextoResolucion] = useState("");

  const guardarCambiosIncidencia = async (id) => {
    const cambios = ediciones[id];
    if (!cambios) return;

    try {
        const respuesta = await axios.put(
            `${API_REST_CONSTANTS.ENDPOINTS.INCIDENCIAS}/${id}`,
            cambios,
            {headers: {"Content-Type": "application/json",},}
        );

        mostrarAlertaModal("Incidencia modificada con éxito.");

        // Limpia los cambios locales
        setEdiciones((prev) => {
        const copia = { ...prev };
        delete copia[id];
        return copia;
        });

        //recargar las incidencias
        onRecargarIncidencias();

    } catch (error) {
        console.error("Error al guardar cambios:", error);
        alert("Error al modificar la incidencia.");
    }
    };


  // Reiniciar página al cambiar filtros
  useEffect(() => {
    setPaginaActual(1);
  }, [filtroEstado, filtroTipo, filtroFechaDesde, filtroFechaHasta]);

  // Aplicar filtros
  const incidenciasFiltradas = incidencias
    .filter(i => (filtroEstado === "" || String(i.estado) === filtroEstado))
    .filter(i => (filtroTipo === "" || String(i.tipoIncidencia) === filtroTipo))
    .filter(i => {
        const fechaIncidencia = new Date(i.fechaRegistro);
        const desde = filtroFechaDesde ? new Date(filtroFechaDesde) : null;
        const hasta = filtroFechaHasta ? new Date(filtroFechaHasta) : null;

        if (desde && fechaIncidencia < desde) return false;
        if (hasta && fechaIncidencia > hasta) return false;
        return true;
    });

  // Paginación
  const indiceUltimo = paginaActual * elementosPorPagina;
  const indicePrimero = indiceUltimo - elementosPorPagina;
  const incidenciasPaginadas = incidenciasFiltradas.slice(indicePrimero, indiceUltimo);

  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-ES");
  };

  return (
    <>
    <Modal show={show} onHide={onHide} dialogClassName="modal-xxl" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Gestión de Incidencias</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Filtros */}
        <div className="d-flex align-items-center gap-3 mb-3">
          <Form.Group controlId="filtroEstado" className="mb-0">
            <Form.Label className="mb-1 small label-campoForm">Estado</Form.Label>
            <Form.Select
              value={filtroEstado}
              onChange={e => setFiltroEstado(e.target.value)}
              size="sm"
            >
              <option value="">Todos</option>
              {estadosIncidencia.map(e => (
                <option key={e.idEstado} value={e.idEstado}>
                  {e.estadoIncidencia}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="filtroTipo" className="mb-0">
            <Form.Label className="mb-1 small label-campoForm">Tipo</Form.Label>
            <Form.Select
              value={filtroTipo}
              onChange={e => setFiltroTipo(e.target.value)}
              size="sm"
            >
              <option value="">Todos</option>
              {tiposIncidencia.map(t => (
                <option key={t.idTipo} value={t.idTipo}>
                  {t.tipoIncidencia}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          
          <Form.Group controlId="filtroFechaDesde" className="mb-0">
            <Form.Label className="mb-1 small label-campoForm">Fecha Registro desde</Form.Label>
            <Form.Control
                type="date"
                size="sm"
                value={filtroFechaDesde}
                onChange={e => setFiltroFechaDesde(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="filtroFechaHasta" className="mb-0">
            <Form.Label className="mb-1 small label-campoForm">Fecha Registro hasta</Form.Label>
            <Form.Control
                type="date"
                size="sm"
                value={filtroFechaHasta}
                onChange={e => setFiltroFechaHasta(e.target.value)}
            />
            </Form.Group>
        </div>

        {/* Tabla de incidencias */}
        <Table bordered hover responsive size="sm" className="small">
          <thead>
            <tr>
              <th className="table-head-custom">Fecha alta</th>
              <th className="table-head-custom">Título/Descripción</th>
              <th className="table-head-custom">Dirección</th>
              <th className="table-head-custom">Tipo</th>
              <th className="table-head-custom">Estado</th>
              <th className="table-head-custom">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {incidenciasPaginadas.length > 0 ? (
              incidenciasPaginadas.map(inc => (
                <tr key={inc._id} className={ediciones[inc._id] ? "fila-modificada" : ""}>
                  <td className="text-center">{formatearFecha(inc.fechaRegistro)}</td>
                  <td>
                    <div className="fw-bold">{inc.titulo}</div>
                    <div>{inc.descripcion}</div>
                  </td>
                  <td>{inc.direccion}</td>
                  <td>
                    <Form.Select
                        size="sm"
                        value={
                        ediciones[inc._id]?.tipoIncidencia ?? inc.tipoIncidencia
                        }
                        onChange={e =>
                        editarIncidencia(inc._id, "tipoIncidencia", e.target.value)
                        }
                    >
                        {tiposIncidencia.map(t => (
                        <option key={t.idTipo} value={t.idTipo}>
                            {t.tipoIncidencia}
                        </option>
                        ))}
                    </Form.Select>
                    </td>
                    <td>
                    <Form.Select
                        size="sm"
                        value={ediciones[inc._id]?.estado ?? inc.estado}
                        onChange={e => {
                            const nuevoEstado = e.target.value;
                            if (nuevoEstado === "3") {
                            setIdIncidenciaResolviendo(inc._id);
                            setMostrarModalResolucion(true);
                            }
                            editarIncidencia(inc._id, "estado", nuevoEstado);
                        }}
                    >
                        {estadosIncidencia.map(e => (
                        <option key={e.idEstado} value={e.idEstado}>
                            {e.estadoIncidencia}
                        </option>
                        ))}
                    </Form.Select>
                  </td>
                  <td className="text-center">
                    {inc.imagenes.length > 0 ? (
                      <Button
                        className="btn btn-link p-0 me-2 btn-primary-icon"
                        size="sm"
                        onClick={() => onVerImagenes(inc.imagenes)}
                        title="Ver imágenes"
                      >
                        <FaCamera size={18}/>
                      </Button>
                    ) : (
                        <FaCamera
                            size={18}
                            className="text-secondary me-2"
                            title="Sin imágenes"
                            style={{ opacity: 0.5, cursor: "not-allowed" }}
                        />
                    )}
                    <Button
                        className="btn btn-link p-0 me-2 btn-primary-icon"
                        size="sm"
                        onClick={() => handleVerUbicacion(inc.coordenadas.coordinates, inc.direccion)}
                        title="Ver ubicación en el mapa"
                        >
                        <FaMapMarkedAlt size={18}/>
                    </Button>

                    {(inc.textoResolucion || ediciones[inc._id]?.textoResolucion) ? (
                      <Button
                        className="btn btn-link p-0 me-2 btn-primary-icon"
                        size="sm"
                        onClick={() => {
                            setIdIncidenciaResolviendo(inc._id);
                            setTextoResolucion(inc.textoResolucion);
                            setMostrarModalResolucion(true);
                        }}
                        title="Ver Respuesta/Resolución"
                      >
                        <FaWpforms size={18}/>
                      </Button>
                    ) : (
                        <FaWpforms
                            size={18}
                            className="text-secondary me-2"
                            title="Sin Respuesta/Resolución"
                            style={{ opacity: 0.5, cursor: "not-allowed" }}
                        />
                    )}

                    {ediciones[inc._id] ? (
                      <Button
                        className="btn btn-link p-0 me-2 btn-primary-icon"
                        size="sm"
                        onClick={() => guardarCambiosIncidencia(inc._id)}
                        title="Ver imágenes"
                      >
                        <FaRegSave size={18}/>
                      </Button>
                    ) : (
                        <FaRegSave
                            size={18}
                            className="text-secondary me-2"
                            title="Sin imágenes"
                            style={{ opacity: 0.5, cursor: "not-allowed" }}
                        />
                    )}

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No hay incidencias con estos filtros.
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Navegación de páginas */}
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
            Página {paginaActual} de {Math.ceil(incidenciasFiltradas.length / elementosPorPagina)}
          </span>
          <Button
            variant="primary"
            className="btn-success"
            size="sm"
            disabled={paginaActual === Math.ceil(incidenciasFiltradas.length / elementosPorPagina)}
            onClick={() => setPaginaActual(paginaActual + 1)}
          >
            Siguiente
          </Button>
        </div>
      </Modal.Body>
    </Modal>

    <Modal show={mostrarMapa} onHide={() => setMostrarMapa(false)} size="lg" centered>
    <Modal.Header closeButton>
    </Modal.Header>
    <Modal.Body>
        {coordenadasIncidencia && (
        <>
        <p><strong>Dirección:</strong> {direccionIncidencia}</p>
        <div style={{ height: "400px", width: "100%" }}>
            <MapContainer
            center={[coordenadasIncidencia.lat, coordenadasIncidencia.lng]}
            zoom={16}
            style={{ height: "100%", width: "100%" }}
            >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[coordenadasIncidencia.lat, coordenadasIncidencia.lng]} />
            </MapContainer>
        </div>
        </>
        )}
    </Modal.Body>
    </Modal>

    <Modal show={mostrarModalResolucion} onHide={() => setMostrarModalResolucion(false)} centered>
    <Modal.Header closeButton>
        <Modal.Title>Resolver Incidencia</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <Form.Group>
        <Form.Control
            as="textarea"
            rows={4}
            value={textoResolucion}
            onChange={e => setTextoResolucion(e.target.value)}
            placeholder="Escribe la respuesta/resolución aquí..."
        />
        </Form.Group>
    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModalResolucion(false)}>
        Cancelar
        </Button>
        <Button
        variant="success"
        onClick={() => {
            editarIncidencia(idIncidenciaResolviendo, "textoResolucion", textoResolucion);
            setMostrarModalResolucion(false);
            setTextoResolucion("");
        }}
        >
        Guardar resolución
        </Button>
    </Modal.Footer>
    </Modal>

    <AlertModal
    show={mostrarAlerta}
    onClose={() => setMostrarAlerta(false)}
    message={mensajeAlerta}
    />
    </>
  );
}
