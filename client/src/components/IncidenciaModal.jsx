import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

export default function IncidenciaModal({ show, onClose, latlng, ayuntamientoId }) {
  const [direccion, setDireccion] = useState("");
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    imagen: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (latlng) {
      obtenerDireccion(latlng.lat, latlng.lng);
    }
  }, [latlng]);

  const obtenerDireccion = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      setDireccion(data.display_name || "Dirección no disponible");
    } catch (error) {
      console.error("Error obteniendo dirección:", error);
      setDireccion("No disponible");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imagen") {
      setFormData((prev) => ({ ...prev, imagen: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!latlng) return;

    setLoading(true);

    try {
      // Crear un objeto FormData para enviar la imagen junto al resto de datos
      const data = new FormData();
      data.append("titulo", formData.titulo);
      data.append("descripcion", formData.descripcion);
      data.append("lat", latlng.lat);
      data.append("lng", latlng.lng);
      data.append("direccion", direccion);
      data.append("ayuntamientoId", ayuntamientoId);
      if (formData.imagen) {
        data.append("imagen", formData.imagen);
      }

      const res = await axios.post("http://localhost:5005/incidencias", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Incidencia guardada:", res.data);
      onClose();
      setFormData({ titulo: "", descripcion: "", imagen: null });
      setDireccion("");
    } catch (error) {
      console.error("Error guardando incidencia:", error);
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setFormData({ titulo: "", descripcion: "", imagen: null });
    setDireccion("");
    setLoading(false);
  };

  return (
    <Modal show={show} onHide={handleClose}>
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
              disabled={loading}
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
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Ubicación</Form.Label>
            <Form.Control
              type="text"
              value={
                latlng
                  ? `${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`
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
            <Form.Control
              type="file"
              name="imagen"
              onChange={handleChange}
              disabled={loading}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Guardando..." : "Registrar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}