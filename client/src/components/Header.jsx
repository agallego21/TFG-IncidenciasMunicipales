import React, { useContext } from "react";
import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";

import { UserContext } from "../context/UserContext";
import { useAyuntamiento } from "../context/AyuntamientoContext";

export default function Header({ onLoginClick, onToggleSidebar }) {
  const { usuario, logout } = useContext(UserContext);
  const { ayuntamiento } = useAyuntamiento();

  const navigate = useNavigate();

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
         <div className="d-flex align-items-center gap-3">
          <div className="mb-2">
            <button className="btn-filtrar" onClick={logout}>
              Desconectarse
            </button>
            &nbsp;<b>Hola, {usuario.nombre} {usuario.apellidos}!</b>
          </div>

      {usuario.tipoUsuario === 0 && (
          <Dropdown>
            <Dropdown.Toggle className="dropdown-admin" size="sm">
              Opciones de administrador
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => navigate("/admin/ayuntamientos/nuevo")}>
                Alta nuevo ayuntamiento
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate("/admin/ayuntamientos/modificar")}>
                Modificar ayuntamiento
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate("/admin/usuarios/nuevo")}>
                Alta nuevo usuario
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate("/admin/usuarios/modificar")}>
                Modificar datos usuario
              </Dropdown.Item>
              {/* Otras opciones futuras: */}
              {/* <Dropdown.Item onClick={() => navigate("/admin/usuarios")}>Gestionar usuarios</Dropdown.Item> */}
            </Dropdown.Menu>
          </Dropdown>
          )}
        </div>
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
