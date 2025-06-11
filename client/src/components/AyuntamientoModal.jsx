import React, { useState } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function LocationSelector({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return position ? <Marker position={position} /> : null;
}

export default function AyuntamientoModal({ show, handleClose, onSubmit }) {
  const [formData, setFormData] = useState({
    nombre: "",
    //direccion: "",
    //email: "",
    //telefono: "",
    //fax: "",
    coordenadas: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = () => {
    if (!formData.nombre || !formData.coordenadas) {
      alert("Por favor, completa los campos obligatorios y selecciona una ubicación en el mapa.");
      return;
    }
    onSubmit(formData);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Alta nuevo Ayuntamiento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Nombre del municipio *</Form.Label>
            <Form.Control type="text" name="nombre" onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Logo del ayuntamiento</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  imagen: e.target.files[0], // guardamos el File
                }))
              }
          />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Selecciona un punto en el mapa *</Form.Label>
            <MapContainer
              center={[42.846, -2.672]} // coordenadas iniciales
              zoom={13}
              style={{ height: "300px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationSelector
                position={formData.coordenadas}
                setPosition={(coords) =>
                  setFormData((prev) => ({ ...prev, coordenadas: coords }))
                }
              />
            </MapContainer>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="success" onClick={handleGuardar}>
          Guardar Ayuntamiento
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
