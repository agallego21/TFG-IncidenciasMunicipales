import React from "react";

const incidencias = [
  { id: 1, titulo: "Bache en la calle Mayor", descripcion: "Existe un bache en medio de la calzada de la c/ Mayor", estado: "Pendiente" },
  { id: 2, titulo: "Farola rota en el parque", descripcion: "La farola de la entrada sur al parque está rota", estado: "En proceso" },
  { id: 3, titulo: "Contenedor desbordado", descripcion: "El contenedor de recogida de basura se encuentra a tope y la basura está por toda la calle", estado: "Resuelto" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Incidencias registradas</h2>
      <ul className="incidencia-list">
        {incidencias.map((incidencia) => (
          <li key={incidencia.id} className="incidencia-item">
            <h3 className="incidencia-titulo">{incidencia.titulo}</h3>
            <p className="incidencia-estado">{incidencia.descripcion}</p>
            <p className="incidencia-estado">Estado: {incidencia.estado}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}