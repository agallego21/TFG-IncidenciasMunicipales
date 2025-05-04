import React from "react";
import "./Header.css";
import logoAyuntamiento from "../assets/images/logoAyuntamiento.png"

export default function Header() {
  return (
    <header className="header">
      <button className="login-button">Identificarse</button>
      <div className="header-info">
        <img src={logoAyuntamiento} alt="Logo Ayuntamiento" className="logo" />
        <span className="title">Ayuntamiento de TuCiudad</span>
      </div>
    </header>
  );
}