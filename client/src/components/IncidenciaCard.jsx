import React, { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Card, Button } from "react-bootstrap";

export default function IncidenciaCard({ incidencia, getNombreEstado, getNombreTipo, onVerImagenes }) {
  const [expandida, setExpandida] = useState(false);

  return (
    <Card className="mb-3 shadow-sm custom-card">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center" onClick={() => setExpandida(!expandida)} style={{ cursor: "pointer" }}>
          <div>
            <Card.Title>{incidencia.titulo}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              Estado: {getNombreEstado(incidencia.estado)}
            </Card.Subtitle>
          </div>
          <div className="fs-4">{expandida ? "−" : "+"}</div>
        </div>

        {expandida && (
          <>
            <Card.Text>{incidencia.descripcion}</Card.Text>
            <Card.Text><strong>Tipo:</strong> {getNombreTipo(incidencia.tipoIncidencia)}</Card.Text>
            <Card.Text className="text-muted small"><FaMapMarkerAlt className="me-1" /> {incidencia.direccion}</Card.Text>
            {incidencia.imagenes.length > 0 && (
              <Button variant="outline-secondary" size="sm" onClick={() => onVerImagenes(incidencia.imagenes)}>
                📷
              </Button>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
}