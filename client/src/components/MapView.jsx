import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
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

// Icono para la posición actual del usuario
const userLocationIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png', // icono  tipo ubicación
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

// Componente para centrar el mapa en una posición cuando cambie "center"
function Recenter({ center , zoom}) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom ?? map.getZoom());
    }
  }, [center, map]);
  return null;
}

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
  const [posUsuario, setPosUsuario] = useState(null); // posición actual usuario

  const { ayuntamiento } = useAyuntamiento();
  const { usuario } = useUser();

  // Definimos el centro inicial:
  // Si hay ayuntamiento usamos su centro,
  // si no, usamos ubicación del usuario si ya se conoce,
  // o Madrid por defecto.
  const centroAyto = ayuntamiento?.centro
    ? [ayuntamiento.centro.lat, ayuntamiento.centro.lng]
    : null;

  const defaultCenter = centroAyto ?? (posUsuario ?? [40.4168, -3.7038]);

  const [center, setCenter] = useState(defaultCenter);
  const [mapZoom, setMapZoom] = useState(13); // valor inicial por defecto

  // Efecto para obtener la ubicación si no hay ayuntamiento (modo admin)
  useEffect(() => {
    if (!centroAyto) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const coords = [pos.coords.latitude, pos.coords.longitude];
            setPosUsuario(coords);
            setCenter(coords);
          },
          (err) => {
            console.warn("No se pudo obtener ubicación", err);
          }
        );
      }
    }
  }, [centroAyto]);

  // Función para centrar mapa en la ubicación actual (botón)
  const handleMiUbicacion = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setPosUsuario(coords);
          setCenter(coords);
          setMapZoom(16); // por ejemplo, zoom más cercano
        },
        (err) => alert("No se pudo obtener la ubicación")
      );
    } else {
      alert("Geolocalización no soportada por el navegador");
    }
  };

  // Resto de tus funciones de formulario e incidencias (igual)

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
    setFormData({ titulo: "", descripcion: "", imagen: null });
    setDireccion("");
  };

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    coordenadas: { lat: "", lng: "" },
    direccion: "",
    tipoIncidencia: 0,
    estado: 0,
    fechaResolucion: null,
    textoResolucion: ""
  });

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
      const incidenciaAGuardar = {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        coordenadas: {
          lat: newIncidencia.lat,
          lng: newIncidencia.lng,
        },
        direccion: direccion,
        tipoIncidencia: 0,
        estado: 0,
        fechaResolucion: null,
        textoResolucion: "",
      };

      const respuesta = await axios.post('http://localhost:5005/incidencias', incidenciaAGuardar);
      console.log('Incidencia guardada:', respuesta.data);
      handleClose();
    } catch (error) {
      console.error('Error guardando incidencia:', error);
    }
  };

  return (
    <div className="map-view" style={{ position: "relative" }}>
      {/* Mostrar botón "Mi ubicación" solo si hay ayuntamiento */}
      {centroAyto && (
        <button
          onClick={handleMiUbicacion}
          style={{
            position: "absolute",
            zIndex: 1000,
            top: 10,
            right: 10,
            padding: "8px 12px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Mi ubicación
        </button>
      )}

      <MapContainer center={center} zoom={13} className="map-container" style={{ height: "98%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Recenter center={center} zoom={mapZoom} />

        <AddMarkerOnClick onAdd={handleAddIncidencia} />

        {/* Marcador para ubicación actual usuario, si existe */}
        {posUsuario && (
          <Marker position={posUsuario} icon={userLocationIcon}>
            {/*<Popup>Tu ubicación actual</Popup>*/}
          </Marker>
        )}

        {/* Marcador para nueva incidencia */}
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
