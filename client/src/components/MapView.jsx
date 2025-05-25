import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import axios from 'axios';
import { Modal, Button, Form } from "react-bootstrap";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { useAyuntamiento } from "../context/AyuntamientoContext";
import { useUser } from "../context/UserContext";

// Configuración del icono Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

//const center = [42.8467, -2.6716];

function AddMarkerOnClick({ onAdd }) {
  const { usuario } = useUser();
  
  useMapEvents({
    click(e) {
      if (usuario) {
        onAdd(e.latlng);
      }
    }
  });
  return null;
}

export default function MapView() {
  const [newIncidencia, setNewIncidencia] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [direccion, setDireccion] = useState("");

  const { ayuntamiento } = useAyuntamiento();
  const { usuario } = useUser();

  // Por defecto un centro básico (ej. España) si config aún no está cargado
  const center = ayuntamiento?.centro
    ? [ayuntamiento.centro.lat, ayuntamiento.centro.lng]
    : [40.4168, -3.7038]; // Madrid por defecto

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    coordenadas: {
        lat: "",
        lng: "",
      },
      direccion: "",
      tipoIncidencia: 0,
      estado: 0,
      fechaResolucion: null,
      textoResolucion: ""
  });

  // Maneja el click en el mapa para añadir Incidencia
  const handleAddIncidencia = (latlng) => {
    setNewIncidencia(latlng);
    setShowModal(true);
    obtenerDireccion(latlng.lat, latlng.lng);
  };

  const obtenerDireccion = async (lat, lng) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      setDireccion(data.display_name || "Dirección no disponible");
    } catch (err) {
      console.error("Error obteniendo dirección:", err);
      setDireccion("No disponible");
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setNewIncidencia(null);
    /*** TODO - Falta vaciar el estado completo del formulario */
    setFormData({ titulo: "", descripcion: "", imagen: null });
    setDireccion("");
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imagen") {
      setFormData({ ...formData, imagen: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

const guardarIncidencia = async () => {
  try {
    // Preparar objeto con los datos para enviar
    const incidenciaAGuardar = {
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      coordenadas: {
        lat: newIncidencia.lat,
        lng: newIncidencia.lng,
      },
      direccion: direccion,
      // Para simplificar, tipoIncidencia, estado, fechaResolucion, textoResolucion pueden ir con valores por defecto o los que tengas en el form
      tipoIncidencia: 0,  // por ejemplo
      estado: 0,
      fechaResolucion: null,
      textoResolucion: "",
      // Por ahora no incluimos imagen, ya que hay que manejar upload aparte
    };
    
    const respuesta = await axios.post('http://localhost:5005/incidencias', incidenciaAGuardar);
    console.log('Incidencia guardada:', respuesta.data);
    // Aquí puedes limpiar el formulario, cerrar modal, etc.
    handleClose()
  } catch (error) {
    console.error('Error guardando incidencia:', error);
  }
};

  return (
    <div className="map-view">
      <MapContainer center={center} zoom={13} className="map-container" style={{ height: "98%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <AddMarkerOnClick onAdd={handleAddIncidencia} />
        {/*<Marker position={center}>
          <Popup>Ejemplo de ubicación de incidencia en Vitoria-Gasteiz.</Popup>
        </Marker>*/}
        {newIncidencia && (
          <Marker position={newIncidencia}>
            <Popup>Nueva incidencia</Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Modal con formulario */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Nueva incidencia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitulo">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formDescripcion" className="mt-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                name="descripcion"
                rows={3}
                value={formData.descripcion}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Ubicación</Form.Label>
              <Form.Control
                type="text"
                value={
                  newIncidencia
                    ? `${newIncidencia.lat.toFixed(6)}, ${newIncidencia.lng.toFixed(6)}`
                    : ""
                }
                readOnly
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Dirección</Form.Label>
              <Form.Control type="text" value={direccion} readOnly />
            </Form.Group>

            <Form.Group controlId="formImagen" className="mt-3">
              <Form.Label>Adjuntar imagen</Form.Label>
              <Form.Control type="file" name="imagen" onChange={handleChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardarIncidencia}>
            Registrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
