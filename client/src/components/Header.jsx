import React, { useState, useContext } from "react";
import axios from "axios";
import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";

import { UserContext } from "../context/UserContext";
import { useAyuntamiento } from "../context/AyuntamientoContext";
import AyuntamientoModal from "./AyuntamientoModal";
import UsuarioModal from "./UsuarioModal";
import GestionAyuntamientosModal from "./GestionAyuntamientosModal";
import GestionUsuariosModal from "./GestionUsuariosModal";
import { API_REST_CONSTANTS } from "../config/api";

export default function Header({ onLoginClick, onToggleSidebar }) {
  const { usuario, logout } = useContext(UserContext);
  const { ayuntamiento } = useAyuntamiento();
  const [showAltaModal, setShowAltaModal] = useState(false);
  const [showUsuarioModal, setShowUsuarioModal] = useState(false);
  
  const [showGestionAyuntamientos, setShowGestionAyuntamientos] = useState(false);
  const [showGestionUsuarios, setShowGestionUsuarios] = useState(false);

  const navigate = useNavigate();

  const logoURL = ayuntamiento?.idImagen?.path
    ? `${API_REST_CONSTANTS.ENDPOINTS.IMAGEN(ayuntamiento.idImagen.path)}`
    : null;

  const handleAltaAyuntamiento = async (formData) => {
    try {
      const data = new FormData();
      data.append("municipio", formData.nombre);
      data.append("coordenadasCentro", JSON.stringify({
        type: "Point",
        coordinates: [formData.coordenadas.lng, formData.coordenadas.lat],
      }));
      data.append("tipo", "ayuntamientos"); // necesario si tu endpoint de imagen lo requiere

      if (formData.imagen) {
        data.append("imagen", formData.imagen);
      }

      const res = await axios.post((API_REST_CONSTANTS.ENDPOINTS.AYUNTAMIENTOS), data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Ayuntamiento creado:", res.data);
    } catch (error) {
      console.error("Error creando ayuntamiento:", error);
    }
  };

  return (
    <>
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
            <div>
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
                  <Dropdown.Item onClick={() => setShowGestionAyuntamientos(true)}>
                    Gestión de ayuntamientos
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setShowGestionUsuarios(true)}>
                    Gestión de usuarios
                  </Dropdown.Item>
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
            {logoURL && (
              <img
                src={logoURL}
                alt={`Logo Ayuntamiento de ${ayuntamiento.municipio}`}
                className="logo"
              />
            )}
            <span className="title">Ayuntamiento de {ayuntamiento.municipio}</span>
          </div>
        ) : (
          <div className="header-info">
            <span className="title">&nbsp;</span>
          </div>
        )}
      </header>

      <AyuntamientoModal
        show={showAltaModal}
        handleClose={() => setShowAltaModal(false)}
        onSubmit={handleAltaAyuntamiento}
      />

      <UsuarioModal
        show={showUsuarioModal}
        onHide={() => setShowUsuarioModal(false)}
        onUsuarioCreado={(nuevoUsuario) => {
          console.log("Usuario creado:", nuevoUsuario);
          setShowUsuarioModal(false);
        }}
      />

      <GestionAyuntamientosModal
        show={showGestionAyuntamientos}
        onHide={() => setShowGestionAyuntamientos(false)}
      />

      <GestionUsuariosModal
        show={showGestionUsuarios}
        onHide={() => setShowGestionUsuarios(false)}
      />

    </>

  );
}
