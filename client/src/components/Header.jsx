import React, { useState, useEffect, useContext } from "react";
import { Dropdown, Modal, Carousel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaCog, FaUser } from "react-icons/fa";

import { UserContext } from "../context/UserContext";
import { useAyuntamiento } from "../context/AyuntamientoContext";
import UsuarioModal from "./UsuarioModal";
import GestionAyuntamientosModal from "./GestionAyuntamientosModal";
import AyuntamientoModal from "./AyuntamientoModal";
import GestionUsuariosModal from "./GestionUsuariosModal";
import GestionIncidenciasModal from "./GestionIncidenciasModal";
import MiPerfilModal from "./MiPerfilModal";
import { API_REST_CONSTANTS } from "../config/api";
import axios from 'axios';

export default function Header({ onLoginClick, onToggleSidebar }) {
  const { usuario, logout } = useContext(UserContext);
  const { ayuntamiento, setAyuntamiento } = useAyuntamiento();
  const [showUsuarioModal, setShowUsuarioModal] = useState(false);

  const [showMiPerfil, setShowMiPerfil] = useState(false);
  
  const [showGestionAyuntamientos, setShowGestionAyuntamientos] = useState(false);
  const [showMiAyuntamiento, setShowMiAyuntamiento] = useState(false);
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

  const handleGuardarAyuntamiento = async (datos) => {
    try {
      const data = new FormData();
      data.append("municipio", datos.municipio);
      data.append("direccionPostal", datos.direccionPostal);
      data.append("correoElectronico", datos.correoElectronico);
      data.append("telefono", datos.telefono);
      data.append("fax", datos.fax);

      data.append(
        "coordenadasCentro",
        JSON.stringify({
          type: "Point",
          coordinates: [datos.coordenadasCentro.lng, datos.coordenadasCentro.lat],
        })
      );
      data.append("tipo", "ayuntamientos");
      if (datos.imagen) {
        data.append("imagen", datos.imagen);
      }



      if (datos.idAyuntamiento) {
        await axios.put(
          `${API_REST_CONSTANTS.ENDPOINTS.AYUNTAMIENTOS}/${datos.idAyuntamiento}`,
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      setShowMiAyuntamiento(false);

      axios.get(`${API_REST_CONSTANTS.ENDPOINTS.AYUNTAMIENTOS}/${datos.idAyuntamiento}`)
        .then(res => setAyuntamiento(res.data))
        .catch(err => console.error("Error cargando ayuntamiento:", err));

      } catch (error) {
      console.error("Error guardando ayuntamiento:", error);
      alert("Error al guardar el ayuntamiento");
    }
  };

  useEffect(() => {
    if (showGestionIncidencias && ayuntamiento) {
      cargarDatos();
    }
  }, [showGestionIncidencias, ayuntamiento]);

return (
  <>
    <header
      className="header d-flex justify-content-between align-items-center px-3 py-2"
      role="navigation"
    >
      {/* IZQUIERDA: Logo + Info del ayuntamiento */}
      <div className="d-flex align-items-center gap-3">
        {logoURL && (
          <img
            src={logoURL}
            alt={`Logo Ayuntamiento de ${ayuntamiento?.municipio}`}
            className="logo-ayto"
            style={{ maxHeight: "50px", width: "auto", objectFit: "contain" }}
          />
        )}
        <div>
          <div className="fw-bold fs-5">
            Ayuntamiento de {ayuntamiento?.municipio || "..." }
          </div>
          <small className="d-block">{ayuntamiento?.direccionPostal || "Dirección no disponible"}</small>
          <small className="d-block">Email: {ayuntamiento?.correoElectronico || "---"}</small>
          <small className="d-block">Tel: {ayuntamiento?.telefono || "---"} | Fax: {ayuntamiento?.fax || "---"}</small>
        </div>
      </div>

      {/* DERECHA: Usuario + Menús */}
      <div className="d-flex align-items-center gap-3">
        {usuario ? (
          <>
            {(usuario.tipoUsuario !== 3) && (
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="outline-light"
                  size="sm"
                  aria-haspopup="true"
                >
                  <FaCog className="me-1" />
                  Administración
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {usuario.tipoUsuario === 0 && (
                    <Dropdown.Item onClick={() => setShowGestionAyuntamientos(true)}>
                      Gestión de ayuntamientos
                    </Dropdown.Item>
                  )}
                  {usuario.tipoUsuario === 1 && (
                    <Dropdown.Item onClick={() => setShowMiAyuntamiento(true)}>
                      Ver/editar mi ayuntamiento
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

            <Dropdown align="end">
              <Dropdown.Toggle
                variant="outline-light"
                size="sm"
                aria-haspopup="true"
              >
                <FaUser className="me-1" />
                {usuario.nombre} {usuario.apellidos}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setShowMiPerfil(true)}>
                  Mi perfil
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={logout}>
                  Cerrar sesión
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </>
        ) : (
          <button
            className="btn btn-outline-light btn-sm"
            onClick={onLoginClick}
            aria-label="Iniciar sesión"
          >
            Identificarse
          </button>
        )}
      </div>
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

      <AyuntamientoModal
        show={showMiAyuntamiento}
        handleClose={() => setShowMiAyuntamiento(false)}
        onSubmit={handleGuardarAyuntamiento}
        ayuntamiento={ayuntamiento}
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

      {usuario && (
        <MiPerfilModal
          show={showMiPerfil}
          onHide={() => setShowMiPerfil(false)}
        />
      )}

    </>

  );
}
