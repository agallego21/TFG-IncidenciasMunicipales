import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MapaModal from "./AyuntamientoMapaModal";
import { FaMapMarkerAlt } from "react-icons/fa";
import { API_REST_CONSTANTS } from "../config/api";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function AyuntamientoModal({ show, handleClose, onSubmit, ayuntamiento }) {
  const esEdicion = ayuntamiento && ayuntamiento.idAyuntamiento !== undefined;
  const [mapaVisible, setMapaVisible] = useState(false);

  const [formData, setFormData] = useState({
    municipio: "",
    direccionPostal: "",
    correoElectronico: "",
    telefono: "",
    fax: "",
    coordenadasCentro: null,
    imagen: null,
  });
  const [errorEmail, setErrorEmail] = useState("");

  useEffect(() => {
    const cargarUbicacionUsuario = () => {

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData({
            municipio: ayuntamiento?.municipio || "",
            direccionPostal: ayuntamiento?.direccionPostal || "",
            correoElectronico: ayuntamiento?.correoElectronico || "",
            telefono: ayuntamiento?.telefono || "",
            fax: ayuntamiento?.fax || "",
            coordenadasCentro: {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            },
            imagen: null,
          });
          setErrorEmail("");
        },
        (error) => {
          console.warn("No se pudo obtener la ubicación del usuario", error);
          // Fallback: centro de España
          setFormData({
            municipio: ayuntamiento?.municipio || "",
            direccionPostal: ayuntamiento?.direccionPostal || "",
            correoElectronico: ayuntamiento?.correoElectronico || "",
            telefono: ayuntamiento?.telefono || "",
            fax: ayuntamiento?.fax || "",
            coordenadasCentro: {
              lat: 40.4168,
              lng: -3.7038,
            },
            imagen: null,
          });
          setErrorEmail("");
        }
      );
    };

    if (esEdicion && ayuntamiento) {
      if (
        ayuntamiento.coordenadasCentro &&
        Array.isArray(ayuntamiento.coordenadasCentro.coordinates) &&
        ayuntamiento.coordenadasCentro.coordinates.length === 2
      ) {
        // Edición con coordenadas válidas
        setFormData({
          municipio: ayuntamiento.municipio || "",
          direccionPostal: ayuntamiento?.direccionPostal || "",
          correoElectronico: ayuntamiento?.correoElectronico || "",
          telefono: ayuntamiento?.telefono || "",
          fax: ayuntamiento?.fax || "",
          coordenadasCentro: {
            lat: ayuntamiento.coordenadasCentro.coordinates[1],
            lng: ayuntamiento.coordenadasCentro.coordinates[0],
          },
          imagen: null,
        });
      } else {
        // Edición sin coordenadas → intentar ubicación del usuario
        cargarUbicacionUsuario();
      }
    } else {
      // Alta nueva → ubicación del usuario
      cargarUbicacionUsuario();
    }
  }, [ayuntamiento, esEdicion, show]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "correoElectronico") {
      setErrorEmail("");
      if (value.includes("@")) comprobarEmail(value);
    }
  };

  const handleGuardar = () => {
    if (!formData.municipio || !formData.coordenadasCentro) {
      alert("Por favor, completa los campos obligatorios y selecciona una ubicación en el mapa.");
      return;
    }

    // Crear FormData para envío con imagen y coordenadas 
    const datosAEnviar = {
      municipio: formData.municipio,
      direccionPostal: formData.direccionPostal,
      correoElectronico: formData.correoElectronico,
      telefono: formData.telefono,
      fax: formData.fax,
      coordenadasCentro: formData.coordenadasCentro,
      imagen: formData.imagen ? formData.imagen : null,
      idAyuntamiento: esEdicion ? ayuntamiento.idAyuntamiento : undefined,
    };
    onSubmit(datosAEnviar);
    handleClose();
  };

  return (
     <>
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{esEdicion ? "Editar Ayuntamiento" : "Alta nuevo Ayuntamiento"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-2">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Municipio *</Form.Label>
                <Form.Control
                  type="text"
                  name="municipio"
                  value={formData.municipio}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Correo electrónico</Form.Label>
                <Form.Control
                  type="email"
                  name="correoElectronico"
                  value={formData.correoElectronico}
                  onChange={handleChange}
                  isInvalid={!!errorEmail}
                />
                <Form.Control.Feedback type="invalid">{errorEmail}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-2">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              type="text"
              name="direccionPostal"
              value={formData.direccionPostal}
              onChange={handleChange}
            />
          </Form.Group>

          <Row className="mb-2">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="telefono"
                placeholder="Teléfono"
                value={formData.telefono}
                onChange={handleChange}
              />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Fax</Form.Label>
                <Form.Control
                  type="text"
                  name="fax"
                  placeholder="fax"
                  value={formData.fax}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Logo del ayuntamiento</Form.Label>
            <div className="d-flex align-items-center gap-3">
              {esEdicion && ayuntamiento?.idImagen?.path && (
                <img
                  src={API_REST_CONSTANTS.ENDPOINTS.IMAGEN(ayuntamiento.idImagen.path)}
                  alt="Logo actual"
                  style={{
                    maxHeight: "50px",
                    maxWidth: "100px",
                    objectFit: "contain",
                    border: "1px solid #ccc",
                    padding: "2px",
                    borderRadius: "4px",
                  }}
                />
              )}
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
            </div>
          </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Coordenadas Centro *</Form.Label>
              <div className="d-flex align-items-center gap-2">
                <Form.Control
                  type="text"
                  readOnly
                  value={
                    formData.coordenadasCentro
                      ? `${formData.coordenadasCentro.lat.toFixed(5)}, ${formData.coordenadasCentro.lng.toFixed(5)}`
                      : ""
                  }
                />
                <Button variant="outline-primary" onClick={() => setMapaVisible(true)}>
                  <FaMapMarkerAlt />
                </Button>
              </div>
              <small className="text-muted">Haz clic en el icono para seleccionar la ubicación en el mapa.</small>
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

    <MapaModal
        show={mapaVisible}
        onHide={() => setMapaVisible(false)}
        position={formData.coordenadasCentro}
        setPosition={(pos) => setFormData(prev => ({ ...prev, coordenadasCentro: pos }))}
      />
     </> 
  );
}
