import React, {useState, useEffect} from "react";
import { MdMyLocation, MdLocationCity } from "react-icons/md";
import axios from "axios";
import {MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents} from "react-leaflet";
import L from "leaflet";
import {useAyuntamiento} from "../context/AyuntamientoContext";
import {useUser } from "../context/UserContext";
import IncidenciaModal from "./IncidenciaModal";
import { createSvgIcon } from '../utils/leafletIcons';

import { API_REST_CONSTANTS } from "../config/api";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Configuración del icono Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

//Iconos incidencias
const iconNegro = createSvgIcon('black');
const iconAzul = createSvgIcon('blue');
const iconVerde = createSvgIcon('green');
const iconRojo = createSvgIcon('red');
const iconGris = createSvgIcon('gray');


const userLocationIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

function Recenter({ center, zoom }) {
  const map = useMap();
    useEffect(() => {
      if (center) {
        map.setView(center, zoom ?? map.getZoom());
      }
    }, [center, zoom, map]);
  return null;
}

function AddMarkerOnClick({ onAdd }) {
  const { usuario } = useUser();
  useMapEvents({
    click(e) {
      if (usuario) {
        onAdd(e.latlng);
      }
    },
  });
  return null;
}

function obtenerIconoPorEstado(estado) {
  switch(estado) {
    case 0: return iconNegro;
    case 1: return iconRojo;
    case 2: return iconAzul;
    case 3: return iconVerde;
    default: return iconGris;
  }
}

export default function MapView({incidencias}) {
  const [newIncidencia, setNewIncidencia] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [direccion, setDireccion] = useState("");
  const [posUsuario, setPosUsuario] = useState(null);

  const [estadosIncidencia, setEstadosIncidencia] = useState([]);

  const { ayuntamiento } = useAyuntamiento();

  const centroAyto = ayuntamiento?.coordenadasCentro?.coordinates
    ? [ayuntamiento.coordenadasCentro.coordinates[1], ayuntamiento.coordenadasCentro.coordinates[0]]
    : null;

  const [center, setCenter] = useState(centroAyto ?? [40.4168, -3.7038]);
  const [mapZoom, setMapZoom] = useState(13);

  useEffect(() => {
    obtenerEstados();
  }, []);

  useEffect(() => {
    if (centroAyto) {
      if (
        center[0] !== centroAyto[0] || 
        center[1] !== centroAyto[1]
      ) {
        setCenter(centroAyto);
        setMapZoom(13);
      }
    }

    if (!centroAyto && !posUsuario) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const coords = [pos.coords.latitude, pos.coords.longitude];
            setPosUsuario(coords);
            setCenter(coords);
          },
          (err) => {
            console.warn("No se pudo obtener ubicación", err);
          }
        );
      }
    }
  }, [centroAyto, posUsuario]);

  const handleMiUbicacion = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setPosUsuario(coords);
          setCenter(coords);
          setMapZoom(16);
        },
        (err) => alert("No se pudo obtener la ubicación")
      );
    } else {
      alert("Geolocalización no soportada por el navegador");
    }
  };

  const centrarMapa = () => {
    setCenter(centroAyto);
  };

  const handleAddIncidencia = (latlng) => {
    setNewIncidencia(latlng);
    setShowModal(true);
    obtenerDireccion(latlng.lat, latlng.lng);
  };

  const obtenerDireccion = async (lat, lng) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      setDireccion(data.display_name || "Dirección no disponible");
    } catch (err) {
      console.error("Error obteniendo dirección:", err);
      setDireccion("No disponible");
    }
  };

  const obtenerEstados = async () => {
    try {
      const res = await axios.get(API_REST_CONSTANTS.ENDPOINTS.ESTADOS_INCIDENCIA);
      setEstadosIncidencia(res.data);
    } catch (error) {
      console.error("Error al obtener estados de incidencia:", error);
    }
  };

  const getNombreEstado = (idEstado) => {
    const estado = estadosIncidencia.find((t) => t.idEstado === idEstado);
    return estado ? estado.estadoIncidencia : "---";
  };

  const handleClose = () => {
    setShowModal(false);
    setNewIncidencia(null);
    setDireccion("");
  };

  return (
    <div className="map-view" style={{ position: "relative" }}>
      {centroAyto && (
        <button className="btn-filtrar"
          onClick={handleMiUbicacion}
          style={{
            position: "absolute",
            zIndex: 1000,
            top: 10,
            right: 10,
            padding: "8px 12px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          title="Mi ubicación"
        >
          <MdMyLocation size={20} color="white" />
        </button>
      )}

      {centroAyto && (
        <button className="btn-filtrar"
          onClick={centrarMapa}
          style={{
            position: "absolute",
            zIndex: 1000,
            top: 10,
            right: 60,
            padding: "8px 12px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          title="Centrar en Ayuntamiento"
        >
          <MdLocationCity size={20} color="white" />
        </button>
      )}

      <MapContainer center={center} zoom={mapZoom} className="map-container" style={{height: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <AddMarkerOnClick onAdd={handleAddIncidencia} />

        {incidencias.map((incidencia) => (

          <Marker icon={obtenerIconoPorEstado(incidencia.estado)}
            key={incidencia._id}
            position={[
              incidencia.coordenadas.coordinates[1],
              incidencia.coordenadas.coordinates[0],
            ]}
          >
          <Popup>
            <div style={{ minWidth: "200px" }}>
              <h6 style={{ marginBottom: "4px", fontWeight: "bold" }}>{incidencia.titulo}</h6>
              <p style={{ fontSize: "0.9em", margin: 0 }}>
                {incidencia.direccion}
                <br/>
                <b>Estado:</b> {getNombreEstado(incidencia.estado)}
              </p>

            {incidencia.imagenes && incidencia.imagenes.length > 0 && (
              <div
                style={{
                  display: "flex",
                  overflowX: "auto",
                  gap: "8px",
                  marginTop: "8px",
                }}
              >
                {incidencia.imagenes.map((imgUrl, idx) => (
                  <img
                    key={idx}
                    src={API_REST_CONSTANTS.ENDPOINTS.IMAGEN(imgUrl.url)}
                    alt={`Imagen ${idx + 1}`}
                    style={{
                      width: "80px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "6px",
                      flex: "0 0 auto",
                    }}
                  />
                ))}
              </div>
            )}
              </div>
            </Popup>
          </Marker>
        ))}

        {posUsuario && (
          <Marker position={posUsuario} icon={userLocationIcon} />
        )}
        {newIncidencia && (
          <Marker position={newIncidencia}>
            <Popup>Nueva incidencia</Popup>
          </Marker>
        )}

        <Recenter center={center} zoom={mapZoom} />
      </MapContainer>

      <IncidenciaModal
        show={showModal}
        onClose={handleClose}
        latlng={newIncidencia}
        direccion={direccion}
      />
    </div>
  );
}