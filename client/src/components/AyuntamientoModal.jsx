import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
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
  return position ? (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const nuevaPos = e.target.getLatLng();
          setPosition(nuevaPos);
        },
      }}
    />
  ) : null;
}

function FlyToLocation({ coords }) {
  const map = useMap();

  useEffect(() => {
    if (coords) {
      map.flyTo([coords.lat, coords.lng], map.getZoom(), {
        animate: true,
        duration: 1,
      });
    }
  }, [coords, map]);

  return null;
}

export default function AyuntamientoModal({ show, handleClose, onSubmit, ayuntamiento }) {
  const esEdicion = ayuntamiento && ayuntamiento.idAyuntamiento !== undefined;

  const [formData, setFormData] = useState({
    municipio: "",
    coordenadasCentro: null,
    imagen: null,
  });

  useEffect(() => {
    if (esEdicion && ayuntamiento) {
      setFormData({
        municipio: ayuntamiento.municipio || "",
        coordenadasCentro: ayuntamiento.coordenadasCentro
          ? {
              lat: ayuntamiento.coordenadasCentro.coordinates[1],
              lng: ayuntamiento.coordenadasCentro.coordinates[0],
            }
          : null,
        imagen: null,
      });
    } else {
      setFormData({
        municipio: "",
        coordenadasCentro: null,
        imagen: null,
      });
    }
  }, [ayuntamiento, esEdicion, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = () => {
    if (!formData.municipio || !formData.coordenadasCentro) {
      alert("Por favor, completa los campos obligatorios y selecciona una ubicación en el mapa.");
      return;
    }

    // Crear FormData para envío con imagen y coordenadas 
    const datosAEnviar = {
      municipio: formData.municipio,
      coordenadasCentro: formData.coordenadasCentro, // { lat, lng }
      imagen: formData.imagen ? formData.imagen: null,
      idAyuntamiento: esEdicion ? ayuntamiento.idAyuntamiento : undefined,
    };
    onSubmit(datosAEnviar);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{esEdicion ? "Editar Ayuntamiento" : "Alta nuevo Ayuntamiento"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Municipio *</Form.Label>
            <Form.Control
              type="text"
              name="municipio"
              value={formData.municipio}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Logo del ayuntamiento</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  imagen: e.target.files[0],
                }))
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Selecciona un punto en el mapa *</Form.Label>
            <MapContainer
              center={
                formData.coordenadasCentro
                  ? [formData.coordenadasCentro.lat, formData.coordenadasCentro.lng]
                  : [42.846, -2.672]
              }
              zoom={13}
              style={{ height: "300px", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <FlyToLocation coords={formData.coordenadasCentro} />
              <LocationSelector
                position={formData.coordenadasCentro}
                setPosition={(coords) =>
                  setFormData((prev) => ({ ...prev, coordenadasCentro: coords }))
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
          {esEdicion ? "Guardar cambios" : "Crear ayuntamiento"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
