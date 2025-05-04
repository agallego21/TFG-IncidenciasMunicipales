import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "./MapView.css";

// Configuración de iconos
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const center = [42.8467, -2.6716];

function AddMarkerOnClick({ onAdd }) {
  useMapEvents({
    click(e) {
      onAdd(e.latlng);
    }
  });
  return null;
}

export default function MapView() {
  const [newIncidencia, setNewIncidencia] = useState(null);

  const handleAddIncidencia = (latlng) => {
    setNewIncidencia(latlng);
  };

  return (
    <div className="map-view">
      <MapContainer center={center} zoom={13} className="map-container">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <AddMarkerOnClick onAdd={handleAddIncidencia} />
        <Marker position={center}>
          <Popup>Ejemplo de ubicación de incidencia en Vitoria-Gasteiz.</Popup>
        </Marker>
        {newIncidencia && (
          <Marker position={newIncidencia}>
            <Popup>
              <strong>Nueva incidencia</strong><br />
              Coordenadas: <br />
              {newIncidencia.lat.toFixed(5)}, {newIncidencia.lng.toFixed(5)}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
