import React from "react";
import "./Sidebar.css";

const incidencias = [
  { id: 1, titulo: "Bache en la calle Mayor", estado: "Pendiente" },
  { id: 2, titulo: "Farola rota en el parque", estado: "En proceso" },
  { id: 3, titulo: "Contenedor desbordado", estado: "Resuelto" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Incidencias registradas</h2>
      <ul className="incidencia-list">
        {incidencias.map((incidencia) => (
          <li key={incidencia.id} className="incidencia-item">
            <h3 className="incidencia-titulo">{incidencia.titulo}</h3>
            <p className="incidencia-estado">Estado: {incidencia.estado}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}