import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { FaBars } from "react-icons/fa";

import logoAyuntamiento from "../assets/images/logoAyuntamiento.png"

export default function Header({ onLoginClick, onToggleSidebar }) {
  const { usuario } = useContext(UserContext);

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
        <p><button className="login-button">
          Desconectarse
        </button>
        &nbsp;<b>Hola, {usuario.nombre} {usuario.apellidos}!</b>
        </p>
      ) : (
        <p><button className="login-button" onClick={onLoginClick}>
          Identificarse
        </button></p>
      )}

      <div className="header-info">
        <img src={logoAyuntamiento} alt="Logo Ayuntamiento" className="logo" />
        <span className="title">Ayuntamiento de TuCiudad</span>
      </div>
    </header>
  );
}