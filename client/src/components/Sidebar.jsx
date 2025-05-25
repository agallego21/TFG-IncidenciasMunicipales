import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";

export default function Sidebar({ visible, onClose }) {
  const [incidencias, setIncidencias] = useState([]);

  useEffect(() => {
    const obtenerIncidencias = async () => {
      try {
        const respuesta = await axios.get("http://localhost:5005/incidencias");
        setIncidencias(respuesta.data);
      } catch (error) {
        console.error("Error al obtener incidencias:", error);
      }
    };

    obtenerIncidencias();
  }, []);

  const estadoComoTexto = (estado) => {
    switch (estado) {
      case 0:
        return "Pendiente";
      case 1:
        return "En proceso";
      case 2:
        return "Resuelto";
      default:
        return "Desconocido";
    }
  };

  return (
 <aside
      className={`sidebar p-3 position-fixed start-0 h-100 overflow-auto shadow ${
        visible ? "d-block top-0" : "d-none"
      } d-md-block`}
      style={{ width: "320px", zIndex: 1050 }}
    >
      {/* Botón para cerrar en móvil */}
      <div className="d-flex justify-content-between align-items-center d-md-none mb-3">
        <h4 className="m-0">Incidencias</h4>
        <Button variant="light" onClick={onClose}>
          <FaTimes />
        </Button>
      </div>

      <h2 className="mb-4">Incidencias registradas</h2>
      {incidencias.map((incidencia) => (
        <Card key={incidencia._id} className="mb-3 shadow-sm">
          <Card.Body>
            <Card.Title>{incidencia.titulo}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              Estado: {estadoComoTexto(incidencia.estado)}
            </Card.Subtitle>
            <Card.Text>{incidencia.descripcion}</Card.Text>
            {incidencia.direccion && (
              <Card.Text className="text-muted small">
                📍 {incidencia.direccion}
              </Card.Text>
            )}
          </Card.Body>
        </Card>
      ))}
    </aside>
  );
}