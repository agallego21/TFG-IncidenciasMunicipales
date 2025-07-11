import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MapView from "./components/MapView";
import LoginModal from "./components/LoginModal";
import { useAyuntamiento } from "./context/AyuntamientoContext";
import axios from "axios";

import 'bootstrap/dist/css/bootstrap.min.css';
import "leaflet/dist/leaflet.css";
import "./App.css";

export default function App() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { ayuntamiento, showLoginOnStart, setShowLoginOnStart } = useAyuntamiento();
  const [showLogin, setShowLogin] = useState(false);
  
  //estado para incidencias
  const [incidencias, setIncidencias] = useState([]);
  const [incidenciasFiltradas, setIncidenciasFiltradas] = useState([]);

  const obtenerIncidencias = async () => {
    if (!ayuntamiento) return;
    try {
      const res = await axios.get(`http://localhost:5005/incidencias/ayuntamiento/${ayuntamiento.idAyuntamiento}`);
      setIncidencias(res.data);
    } catch (error) {
      console.error("Error al obtener incidencias:", error);
    }
  };

  useEffect(() => {
    setIncidenciasFiltradas(incidencias);
  }, [incidencias]);

  useEffect(() => {
    if (showLoginOnStart) {
      setShowLogin(true);
    }
  }, [showLoginOnStart]);

  //carga de incidencias cuando cambia ayuntamiento
  useEffect(() => {
    obtenerIncidencias();
  }, [ayuntamiento]);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleLogin = (credentials) => {
    console.log("Usuario identificado:", credentials);
    setShowLogin(false);
    setShowLoginOnStart(false);
  };

  const handleLogout = () => {
    setUsuario(null);
    setShowLogin(false);
    setShowLoginOnStart(false);
  };

  if (!ayuntamiento && !showLoginOnStart) {
    return <div className="loading">Cargando configuración del ayuntamiento...</div>;
  }

  return (
    <div className="app-container">
      <Header onToggleSidebar={toggleSidebar} onLoginClick={() => setShowLogin(true)} />
      <div className="main-content">
        <Sidebar visible={sidebarVisible} 
          onClose={() => setSidebarVisible(false)} 
          incidencias={incidencias}
          incidenciasFiltradas={incidenciasFiltradas}
          setIncidenciasFiltradas={setIncidenciasFiltradas}
          recargarIncidencias={obtenerIncidencias}
        />
        <MapView incidencias={incidenciasFiltradas} />
      </div>
      <LoginModal
        show={showLogin}
        handleClose={() => setShowLogin(false)}
        handleLogin={handleLogin}
        ayuntamiento={ayuntamiento}
      />
    </div>
  );
}