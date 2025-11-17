import React, { useEffect, useState } from "react";

const PISTAS = [
  {
    id: 1,
    lat: 41.387,
    lon: 2.169,
    radius: 50,
    letter: "H",
    acertijo:
      "Soy amarillo y me gusta el sol. Salgo en el campo y a veces en la ensalada. ¿Qué soy?",
    respuesta: "huevo",
  },
  {
    id: 2,
    lat: 41.388,
    lon: 2.17,
    radius: 50,
    letter: "U",
    acertijo:
      "Une la imagen con su sombra correcta. Es un mini juego de unir. (Escribe la letra correcta: U)",
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

export default function App() {
  const [position, setPosition] = useState(null);
  const [activePista, setActivePista] = useState(null);
  const [letters, setLetters] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!("geolocation" in navigator)) return alert("Geo no disponible");
    const watchId = navigator.geolocation.watchPosition((pos) => {
      setPosition({ lat: pos.coords.latitude, lon: pos.coords.longitude });
    });
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    if (!position) return;
    if (letters.length >= PISTAS.length) return;
    const next = PISTAS.find((p) => !letters.includes(p.letter));
    if (!next) return;
    const d = distanceMeters(position.lat, position.lon, next.lat, next.lon);
    if (d <= next.radius) setActivePista(next);
  }, [position, letters]);

  const checkRespuesta = () => {
    if (!activePista) return;
    if (input.trim().toLowerCase() === activePista.respuesta.toLowerCase()) {
      setLetters([...letters, activePista.letter]);
      setInput("");
      setActivePista(null);
    } else alert("Intenta de nuevo!");
  };

  return (
    <div className="app">
      <h1>Radar del Tió - HUERTO</h1>
      {letters.length < PISTAS.length && (
        <div className="radar">
          <div>
            Posición:{" "}
            {position
              ? `${position.lat.toFixed(5)}, ${position.lon.toFixed(5)}`
              : "Esperando geo..."}
          </div>
          <div>
            Pistas encontradas: {letters.length} / {PISTAS.length}
          </div>
          {activePista && (
            <div style={{ marginTop: 8 }}>¡Estás cerca de una pista! 🎉</div>
          )}
        </div>
      )}

      {activePista && (
        <div className="acertijo">
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

      {letters.length === PISTAS.length && (
        <div className="acertijo">
          <h2>¡Felicidades! 🎄</h2>
          <div>Has encontrado todas las letras: {letters.join("")}</div>
          <div>
            La palabra es <strong>HUERTO</strong> y allí está escondido el Tió!
          </div>
        </div>
      )}

      {letters.length > 0 && (
        <div className="letter">Letras encontradas: {letters.join(" ")}</div>
      )}
    </div>
  );
}
