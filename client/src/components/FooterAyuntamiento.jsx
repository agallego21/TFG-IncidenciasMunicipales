import React from "react";

export default function FooterAyuntamiento({ ayuntamiento }) {
  if (!ayuntamiento) return null;

  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        borderTop: "1px solid #dee2e6",
        color: "#212529",
        fontSize: "0.875rem",
        padding: "1rem",
        flexShrink: 0,
      }}
    >
      <p className="mb-1">
        {ayuntamiento.direccionPostal}
      </p>
      <p className="mb-1">
        <a href={`mailto:${ayuntamiento.correoElectronico}`}>{ayuntamiento.correoElectronico}</a>
      </p>
      <p className="mb-1">
        {ayuntamiento.telefono}
      </p>
      <p className="mb-0">
        {ayuntamiento.fax}
      </p>
    </div>
  );
}
