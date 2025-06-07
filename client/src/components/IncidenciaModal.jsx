import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { useAyuntamiento } from "../context/AyuntamientoContext";

export default function IncidenciaModal({ show, onClose, latlng }) {
  const { usuario } = useUser();
  const { ayuntamiento } = useAyuntamiento();

  const [direccion, setDireccion] = useState("");

  const [tiposIncidencia, setTiposIncidencia] = useState([]);
  
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    tipoIncidencia: "",
    imagen: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (latlng) {
      obtenerDireccion(latlng.lat, latlng.lng);
    }
  }, [latlng]);

  useEffect(() => {
    if (show && tiposIncidencia.length === 0) {
      const fetchTipos = async () => {
        try {
          const res = await axios.get('http://localhost:5005/tiposIncidencia');
          setTiposIncidencia(res.data);
        } catch (error) {
          console.error('Error cargando tipos de incidencia:', error);
        }
      };

      fetchTipos();
    }
  }, [show, tiposIncidencia.length]);

const obtenerDireccion = async (lat, lng) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
    );
    const data = await res.json();
    const address = data.address;

    const via = address.road || "";
    const numero = address.house_number || "";
    const cp = address.postcode || "";
    const ciudad = address.city || address.town || address.village || "";
    const municipio = address.municipality || "";
    const provincia = address.state || "";
    const pais = address.country || "";

    const direccionFormateada = `${via}${numero ? ", " + numero : ""}, ${cp} - ${ciudad || municipio}, ${provincia}, ${pais}`;
    setDireccion(direccionFormateada);
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
    if (!latlng || !usuario || !ayuntamiento) return;

    setLoading(true);

    try {
      const data = new FormData();
      data.append("idUsuario", usuario.idUsuario);
      data.append("idAyuntamiento", ayuntamiento.idAyuntamiento);
      data.append("titulo", formData.titulo);
      data.append("descripcion", formData.descripcion);
      data.append("tipoIncidencia", formData.tipoIncidencia);
      data.append("direccion", direccion);

      data.append("coordenadas", JSON.stringify({
        type: "Point",
        coordinates: [latlng.lng, latlng.lat]
      }));

      data.append("tipo", "incidencias");

      if (formData.imagen) {
        data.append("imagen", formData.imagen);
      }

      const res = await axios.post("http://localhost:5005/incidencias", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Incidencia guardada:", res.data);
      handleClose();
    } catch (error) {
      console.error("Error guardando incidencia:", error);
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setFormData({ titulo: "", descripcion: "", tipoIncidencia: "", imagen: null });
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
              disabled={loading}
            />
          </Form.Group>

          <Form.Group controlId="formTipo" className="mt-3">
            <Form.Label>Tipo de incidencia</Form.Label>
              <Form.Select
                name="tipoIncidencia"
                value={formData.tipoIncidencia}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Selecciona una opción</option>
                {tiposIncidencia.map((tipo) => (
                  <option key={tipo.idTipo} value={tipo.idTipo}>
                    {tipo.tipoIncidencia}
                  </option>
                ))}
              </Form.Select>
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

          {/* Campos ocultos para lat y lng */}
          <input type="hidden" name="lat" value={latlng?.lat || ""} />
          <input type="hidden" name="lng" value={latlng?.lng || ""} />
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
