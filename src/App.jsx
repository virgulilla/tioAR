import React, { useEffect, useState } from "react";

const CLUES = [
  {
    id: 1,
    title: "Pista 1",
    lat: 41.387,
    lon: 2.169,
    radius: 500000000, // en metros, ajusta según tu necesidad
    model: "/models/star.glb",
    audio: "/audio/p1.mp3",
  },
];

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function App() {
  const [geo, setGeo] = useState(null);
  const [heading, setHeading] = useState(0);
  const [activeClue, setActiveClue] = useState(null);
  const [mode, setMode] = useState("radar"); // radar | ar

  // Geolocalización + orientación
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        (pos) => {
          setGeo({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          });
        },
        console.error,
        { enableHighAccuracy: true }
      );
    }

    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", (e) => {
        if (e.alpha != null) {
          setHeading(e.alpha);
        }
      });
    }
  }, []);

  // Activar pista automáticamente
  useEffect(() => {
    if (!geo) return;
    const c = CLUES[0];
    const dist = haversine(geo.lat, geo.lon, c.lat, c.lon);

    if (dist < c.radius) {
      setActiveClue(c);
      setMode("ar");
    }
  }, [geo]);

  function getBearing(lat1, lon1, lat2, lon2) {
    const toRad = (x) => (x * Math.PI) / 180;
    const toDeg = (x) => (x * 180) / Math.PI;
    const dLon = toRad(lon2 - lon1);
    const y = Math.sin(dLon) * Math.cos(toRad(lat2));
    const x =
      Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
      Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
    return (toDeg(Math.atan2(y, x)) + 360) % 360;
  }

  function arrowRotation() {
    if (!geo) return 0;
    const c = CLUES[0];
    const bearing = getBearing(geo.lat, geo.lon, c.lat, c.lon);
    return bearing - heading;
  }

  // --- PANTALLA AR ---
  if (mode === "ar" && activeClue) {
    return (
      <div style={{ position: "fixed", inset: 0 }}>
        <a-scene
          embedded
          vr-mode-ui="enabled: false"
          renderer="logarithmicDepthBuffer: true;"
          arjs="sourceType: webcam; trackingMethod: gps; debugUIEnabled: false;"
          style={{ width: "100vw", height: "100vh" }}
        >
          <a-entity camera gps-camera rotation-reader></a-entity>

          {/* LUCES */}
          <a-light type="ambient" color="#ffffff" intensity="0.6"></a-light>
          <a-light
            type="directional"
            color="#ffffff"
            intensity="0.8"
            position="0 10 5"
          ></a-light>

          {/* Modelo GPS */}
          <a-entity
            gps-entity-place={`latitude: ${activeClue.lat}; longitude: ${activeClue.lon}`}
            scale="3 3 3"
            rotation="0 180 0"
          >
            <a-gltf-model
              src={activeClue.model}
              animation-mixer
              position="0 0 0"
            ></a-gltf-model>
          </a-entity>
        </a-scene>

        <button
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            padding: "10px 15px",
            borderRadius: 8,
            background: "#fff",
          }}
          onClick={() => setMode("radar")}
        >
          Volver
        </button>
      </div>
    );
  }

  // --- PANTALLA RADAR ---
  const dist = geo
    ? Math.round(haversine(geo.lat, geo.lon, CLUES[0].lat, CLUES[0].lon))
    : "---";

  return (
    <div style={{ padding: 20, textAlign: "center", fontFamily: "sans-serif" }}>
      <h2>Radar del Tió</h2>
      <div style={{ fontSize: 20 }}>Distancia: {dist} m</div>

      <div
        style={{
          margin: "30px auto",
          width: 230,
          height: 230,
          borderRadius: "50%",
          border: "8px solid #0aa",
          background: "#e9ffff",
          position: "relative",
          boxShadow: "0 0 20px rgba(0,150,150,0.4)",
        }}
      >
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "40px solid transparent",
            borderRight: "40px solid transparent",
            borderBottom: "80px solid #ff4444",
            filter: "drop-shadow(0 0 6px #ff8888)",
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -100%) rotate(${arrowRotation()}deg)`,
          }}
        ></div>
      </div>

      <div style={{ marginTop: 20, fontSize: 16 }}>
        Sigue la flecha para encontrar la pista.
      </div>
    </div>
  );
}
