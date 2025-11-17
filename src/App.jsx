// Versión definitiva con radar que se oculta al activar la pista y vuelve al resolver el acertijo

import React, { useEffect, useState } from "react";

const PISTAS = [
  {
    id: 1,
    lat: 41.6710656,
    lon: 2.3724032,
    radius: 20,
    letter: "H",
    acertijo:
      "Soy amarillo y me gusta el sol. Salgo en el campo y a veces en la ensalada. ¿Qué soy?",
    respuesta: "huevo",
  },
  {
    id: 2,
    lat: 41.6710657,
    lon: 2.3724033,
    radius: 20,
    letter: "U",
    acertijo: "Une la imagen con su sombra correcta. (Escribe la letra U)",
    respuesta: "u",
  },
  {
    id: 3,
    lat: 41.389,
    lon: 2.171,
    radius: 50,
    letter: "E",
    acertijo: "Tengo 3 manzanas y me dan 2 más. ¿Cuántas tengo?",
    respuesta: "5",
  },
  {
    id: 4,
    lat: 41.39,
    lon: 2.172,
    radius: 50,
    letter: "R",
    acertijo:
      "Guía al conejito por el laberinto a la zanahoria. (Responde con R)",
    respuesta: "r",
  },
  {
    id: 5,
    lat: 41.391,
    lon: 2.173,
    radius: 50,
    letter: "T",
    acertijo:
      "Encuentra la palabra oculta en la sopa de letras. (Responde con T)",
    respuesta: "t",
  },
  {
    id: 6,
    lat: 41.392,
    lon: 2.174,
    radius: 50,
    letter: "O",
    acertijo: "Juego de memoria con frutas. (Responde con O)",
    respuesta: "o",
  },
];

function distanceMeters(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function angleToTarget(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const toDeg = (rad) => (rad * 180) / Math.PI;
  const dLon = toRad(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
  let brng = toDeg(Math.atan2(y, x));
  brng = (brng + 360) % 360;
  return brng;
}

export default function App() {
  const [position, setPosition] = useState(null);
  const [activePista, setActivePista] = useState(null);
  const [letters, setLetters] = useState([]);
  const [input, setInput] = useState("");
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    if (!("geolocation" in navigator))
      return alert("Geolocalización no disponible");
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const posObj = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setPosition(posObj);
        const nextPista = PISTAS.find((p) => !letters.includes(p.letter));
        if (nextPista)
          setDistance(
            distanceMeters(posObj.lat, posObj.lon, nextPista.lat, nextPista.lon)
          );
      },
      (err) => console.error(err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [letters]);

  useEffect(() => {
    if (!position) return;
    if (letters.length >= PISTAS.length) return;
    const next = PISTAS.find((p) => !letters.includes(p.letter));
    if (!next) return;
    if (
      distanceMeters(position.lat, position.lon, next.lat, next.lon) <=
      next.radius
    )
      setActivePista(next);
  }, [position, letters]);

  const checkRespuesta = () => {
    if (!activePista) return;
    if (input.trim().toLowerCase() === activePista.respuesta.toLowerCase()) {
      setLetters([...letters, activePista.letter]);
      setInput("");
      setActivePista(null);
      setDistance(null);
    } else alert("Intenta de nuevo!");
  };

  const nextPista = PISTAS.find((p) => !letters.includes(p.letter));
  const angle =
    position && nextPista
      ? angleToTarget(position.lat, position.lon, nextPista.lat, nextPista.lon)
      : 0;

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "auto",
        padding: 12,
        fontFamily: "Arial",
        background: "#fff7f0",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ color: "#ff5a5f" }}>Radar del Tió - HUERTO</h1>

      {/* Radar solo si no hay pista activa */}
      {position && letters.length < PISTAS.length && !activePista && (
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <div>
            {distance !== null
              ? `Faltan ${distance} metros para la siguiente pista`
              : "Esperando ubicación..."}
          </div>
          <div>
            Pistas encontradas: {letters.length} / {PISTAS.length}
          </div>
          <svg
            width={300}
            height={300}
            style={{
              background: "#e0f7ff",
              borderRadius: "50%",
              border: "4px solid #ccc",
              marginTop: 12,
            }}
          >
            <circle cx={150} cy={150} r={140} fill="#cfefff" />
            <circle cx={150} cy={150} r={10} fill="#ff5a5f" />
            <line
              x1={150}
              y1={150}
              x2={150 + 120 * Math.sin((angle * Math.PI) / 180)}
              y2={150 - 120 * Math.cos((angle * Math.PI) / 180)}
              stroke="orange"
              strokeWidth={8}
              strokeLinecap="round"
            />
          </svg>
          <div style={{ marginTop: 8, fontWeight: 700 }}>
            Sigue la flecha hacia la siguiente pista!
          </div>
        </div>
      )}

      {/* Acertijo: solo cuando se activa la pista */}
      {activePista && (
        <div
          style={{
            marginTop: 20,
            padding: 12,
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
          }}
        >
          <div>
            <strong>Acertijo:</strong> {activePista.acertijo}
          </div>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu respuesta"
            style={{
              marginTop: 8,
              padding: 8,
              width: "100%",
              borderRadius: 8,
              border: "1px solid #ccc",
            }}
          />
          <button onClick={checkRespuesta}>Comprobar</button>
        </div>
      )}

      {/* Letras acumuladas */}
      {letters.length > 0 && (
        <div
          style={{
            marginTop: 12,
            fontSize: 32,
            fontWeight: 700,
            color: "#ff5a5f",
            textAlign: "center",
          }}
        >
          Letras encontradas: {letters.join(" ")}
        </div>
      )}

      {/* Pantalla final */}
      {letters.length === PISTAS.length && (
        <div
          style={{
            marginTop: 12,
            padding: 12,
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          <h2>¡Felicidades! 🎄</h2>
          <div>Has encontrado todas las letras: {letters.join("")}</div>
          <div>
            La palabra es <strong>HUERTO</strong> y allí está escondido el Tió!
          </div>
        </div>
      )}
    </div>
  );
}
