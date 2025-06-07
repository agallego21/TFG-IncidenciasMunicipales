import React, { useContext } from "react";
import { FaBars } from "react-icons/fa";

import { UserContext } from "../context/UserContext";
import { useAyuntamiento } from "../context/AyuntamientoContext";

export default function Header({ onLoginClick, onToggleSidebar }) {
  const { usuario, logout } = useContext(UserContext);
  const { ayuntamiento } = useAyuntamiento();

  const logoURL = ayuntamiento
    ? `/assets/logos/${ayuntamiento.idAyuntamiento}.jpg`
    : null;

  return (
    <header className="header d-flex justify-content-between align-items-center p-2 text-white">
      <button
        className="btn btn-primary d-md-none"
        onClick={onToggleSidebar}
        aria-label="Abrir menú lateral"
      >
        <FaBars size={20} />
      </button>

      {usuario ? (
        <p>
          <button className="btn-filtrar" onClick={logout}>
            Desconectarse
          </button>
          &nbsp;<b>Hola, {usuario.nombre} {usuario.apellidos}!</b>
        </p>
      ) : (
        <p>
          <button className="btn-filtrar" onClick={onLoginClick}>
            Identificarse
          </button>
        </p>
      )}

      {ayuntamiento ? (
        <div className="header-info">
          <img
            src={logoURL}
            alt={`Logo Ayuntamiento de ${ayuntamiento.municipio}`}
            className="logo"
          />
          <span className="title">Ayuntamiento de {ayuntamiento.municipio}</span>
        </div>
      ) : (
        <div className="header-info">
          <span className="title">&nbsp;</span>
        </div>
      )}
    </header>
  );
}
