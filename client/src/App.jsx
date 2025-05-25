import React, { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MapView from "./components/MapView";
import LoginModal from "./components/LoginModal";
import { useAyuntamiento } from "./context/AyuntamientoContext";

import 'bootstrap/dist/css/bootstrap.min.css';
import "leaflet/dist/leaflet.css";
import "./App.css";

export default function App() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { ayuntamiento } = useAyuntamiento();
  
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleLogin = (credentials) => {
    console.log("Usuario identificado:", credentials);
    /** TODO  axios.post(...)*/
    setShowLogin(false);
  };

  // Mostrar carga si aún no se ha cargado la configuración del ayuntamiento
  if (!ayuntamiento) {
    return <div className="loading">Cargando configuración del ayuntamiento...</div>;
  }

  return (
    <div className="app-container">
      <Header onToggleSidebar={toggleSidebar} onLoginClick={() => setShowLogin(true)} />
      <div className="main-content">
         <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
        <MapView />
      </div>
      <LoginModal
        show={showLogin}
        handleClose={() => setShowLogin(false)}
        handleLogin={handleLogin}
      />
    </div>
  );
}