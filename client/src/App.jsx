import React from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MapView from "./components/MapView";
import "leaflet/dist/leaflet.css";
import "./App.css";

export default function App() {
  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <Sidebar />
        <MapView />
      </div>
    </div>
  );
}