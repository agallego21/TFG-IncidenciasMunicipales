import React, { useState, useEffect, useContext } from "react";
import { Dropdown, Modal, Carousel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";

import { UserContext } from "../context/UserContext";
import { useAyuntamiento } from "../context/AyuntamientoContext";
import UsuarioModal from "./UsuarioModal";
import GestionAyuntamientosModal from "./GestionAyuntamientosModal";
import GestionUsuariosModal from "./GestionUsuariosModal";
import GestionIncidenciasModal from "./GestionIncidenciasModal";
import { API_REST_CONSTANTS } from "../config/api";
import axios from 'axios';

export default function Header({ onLoginClick, onToggleSidebar }) {
  const { usuario, logout } = useContext(UserContext);
  const { ayuntamiento } = useAyuntamiento();
  const [showUsuarioModal, setShowUsuarioModal] = useState(false);
  
  const [showGestionAyuntamientos, setShowGestionAyuntamientos] = useState(false);
  const [showGestionUsuarios, setShowGestionUsuarios] = useState(false);
  const [showGestionIncidencias, setShowGestionIncidencias] = useState(false);

  const [incidencias, setIncidencias] = useState([]);
  const [estadosIncidencia, setEstadosIncidencia] = useState([]);
  const [tiposIncidencia, setTiposIncidencia] = useState([]);

  const [imagenesSeleccionadas, setImagenesSeleccionadas] = useState([]);
  const [showVisor, setShowVisor] = useState(false);

  const handleVerImagenes = (imagenes) => {
    setImagenesSeleccionadas(imagenes);
    setShowVisor(true);
  };

  const navigate = useNavigate();

  const logoURL = ayuntamiento?.idImagen?.path
    ? `${API_REST_CONSTANTS.ENDPOINTS.IMAGEN(ayuntamiento.idImagen.path)}`
    : null;

  const cargarDatos = async () => {
    try {
      const resInc = await axios.get(`${API_REST_CONSTANTS.ENDPOINTS.INCIDENCIAS_AYTO}/${ayuntamiento.idAyuntamiento}`);
      setIncidencias(resInc.data);

      const resEstados = await axios.get(API_REST_CONSTANTS.ENDPOINTS.ESTADOS_INCIDENCIA);
      setEstadosIncidencia(resEstados.data);

      const resTipos = await axios.get(API_REST_CONSTANTS.ENDPOINTS.TIPOS_INCIDENCIA);
      setTiposIncidencia(resTipos.data);
    } catch (err) {
      console.error("Error cargando datos de incidencias:", err);
    }
  };

  useEffect(() => {
    if (showGestionIncidencias && ayuntamiento) {
      cargarDatos();
    }
  }, [showGestionIncidencias, ayuntamiento]);

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

            {(usuario.tipoUsuario !== 3) && (
              <Dropdown>
                <Dropdown.Toggle className="dropdown-admin" size="sm">
                  Opciones de administrador
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {usuario.tipoUsuario === 0 && (
                  <Dropdown.Item onClick={() => setShowGestionAyuntamientos(true)}>
                    Gestión de ayuntamientos
                  </Dropdown.Item>
                  )}
                  <Dropdown.Item onClick={() => setShowGestionUsuarios(true)}>
                    Gestión de usuarios
                  </Dropdown.Item>
                  {(usuario.tipoUsuario === 1 || usuario.tipoUsuario === 2) && (
                  <Dropdown.Item onClick={() => setShowGestionIncidencias(true)}>
                    Gestión de incidencias
                  </Dropdown.Item>
                  )}
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
          <div
            className="header-info d-flex gap-3"
            style={{ alignItems: "stretch" }}
          >
            {logoURL && (
              <img
                src={logoURL}
                alt={`Logo Ayuntamiento de ${ayuntamiento.municipio}`}
                className="logo"
                style={{
                  height: "100%", 
                  width: "auto",
                  objectFit: "contain",
                }}
              />
            )}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <span className="title d-block fs-5 fw-bold">
                Ayuntamiento de {ayuntamiento.municipio}
              </span>
              <small className="d-block text-light mt-1">
                {ayuntamiento.direccionPostal || "Dirección no disponible"}
              </small>
              <small className="d-block text-light">
                Email: {ayuntamiento.correoElectronico || "---"}
              </small>
              <small className="d-block text-light">
                Tel: {ayuntamiento.telefono || "---"} | Fax: {ayuntamiento.fax || "---"}
              </small>
            </div>
          </div>
        ) : (
          <div className="header-info">
            <span className="title">&nbsp;</span>
          </div>
        )}
      </header>

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

      <GestionIncidenciasModal
        show={showGestionIncidencias}
        onHide={() => setShowGestionIncidencias(false)}
          incidencias={incidencias}
          estadosIncidencia={estadosIncidencia}
          tiposIncidencia={tiposIncidencia}
          onVerImagenes={handleVerImagenes}
          onRecargarIncidencias={cargarDatos}
      />

      <Modal show={showVisor} onHide={() => setShowVisor(false)} size="lg" centered>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body className="d-flex flex-wrap justify-content-center gap-3">
            {imagenesSeleccionadas.length === 1 ? (
              <img
                src={API_REST_CONSTANTS.ENDPOINTS.IMAGEN(imagenesSeleccionadas[0].url)}
                alt="Imagen incidencia"
                className="img-fluid"
              />
            ) : (
              <Carousel>
                {imagenesSeleccionadas.map((img) => (
                  <Carousel.Item key={img.id}>
                    <img
                      className="d-block w-100"
                      src={API_REST_CONSTANTS.ENDPOINTS.IMAGEN(img.url)}
                      alt={`Imagen incidencia ${img.id}`}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            )}
        </Modal.Body>
      </Modal>  

    </>

  );
}
