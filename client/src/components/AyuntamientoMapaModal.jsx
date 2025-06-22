import React from "react";
import { Modal, Button } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

function LocationSelector({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return position ? <Marker position={position} draggable
    eventHandlers={{
      dragend: (e) => {
        setPosition(e.target.getLatLng());
      },
    }}
  /> : null;
}

export default function MapaModal({ show, onHide, position, setPosition }) {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
      </Modal.Header>
      <Modal.Body style={{ height: "400px", padding: 0 }}>
        <MapContainer
          center={position ? [position.lat, position.lng] : [42.846, -2.672]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationSelector position={position} setPosition={setPosition} />
        </MapContainer>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
}
