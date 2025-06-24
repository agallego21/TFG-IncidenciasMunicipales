import React, { useState } from "react";
import { FaMapMarkerAlt, FaCamera } from "react-icons/fa";
import { Card, Button } from "react-bootstrap";

export default function IncidenciaCard({ incidencia, getNombreEstado, getNombreTipo, onVerImagenes }) {
  const [expandida, setExpandida] = useState(false);

  return (
    <Card className="mb-2 shadow-sm custom-card" style={{ fontSize: "0.875rem" }}>
      <Card.Body className="py-2 px-3">
        <div
          className="d-flex justify-content-between align-items-center"
          onClick={() => setExpandida(!expandida)}
          style={{ cursor: "pointer" }}
        >
          <div>
            <Card.Title as="h6" className="mb-1 fw-semibold">
              {incidencia.titulo}
            </Card.Title>
            <Card.Subtitle className="text-muted" style={{ fontSize: "0.75rem" }}>
              Estado: {getNombreEstado(incidencia.estado)}
            </Card.Subtitle>
          </div>
          <div className="fs-5 text-muted">{expandida ? "−" : "+"}</div>
        </div>

        {expandida && (
          <div className="mt-2">
            <Card.Text className="mb-1" style={{ lineHeight: "1.2" }}>
              {incidencia.descripcion}
            </Card.Text>
            <Card.Text className="mb-1">
              <strong>Tipo:</strong> {getNombreTipo(incidencia.tipoIncidencia)}
            </Card.Text>
            <Card.Text className="text-muted d-flex align-items-center mb-2" style={{ fontSize: "0.75rem" }}>
              <FaMapMarkerAlt className="me-1" /> {incidencia.direccion}
            </Card.Text>
            {incidencia.imagenes.length > 0 && (
              <Button
                className="btn btn-link p-0 me-2 btn-primary-icon"
                title="Ver imágenes"
                size="sm" onClick={() => onVerImagenes(incidencia.imagenes)}>
                <FaCamera size={18} />
              </Button>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
