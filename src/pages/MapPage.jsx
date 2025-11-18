import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import useGeo from "../hooks/useGeo";
import useHeading from "../hooks/useHeading";
import Radar from "../components/Radar";

import Narrador from "../components/Narrador";

import { useLetras } from "../context/LetrasContext";
import { usePistas } from "../context/PistasContext";

import introAudio from "/sounds/intro.mp3";

export default function MapPage() {
  const nav = useNavigate();
  const coords = useGeo();
  const heading = useHeading();

  const { letras } = useLetras();
  const { index, pistas } = usePistas();

  const [showNarrador, setShowNarrador] = useState(false);

  // ⏳ Comprobar en localStorage si ya se mostró el narrador
  useEffect(() => {
    const alreadyShown = localStorage.getItem("introNarradorShown");
    if (!alreadyShown) {
      setShowNarrador(true);
    }
  }, []);

  const next = pistas[index];

  if (!coords) return <div className="center">Activando GPS…</div>;

  function distance(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const x = ((lon2 - lon1) * Math.PI) / 180;
    const y = ((lat2 - lat1) * Math.PI) / 180;
    const a =
      Math.sin(y / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(x / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function getBearing(lat1, lon1, lat2, lon2) {
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    return (Math.atan2(y, x) * 180) / Math.PI;
  }

  const dist = distance(coords.lat, coords.lng, next.lat, next.lng);
  const bearing = getBearing(coords.lat, coords.lng, next.lat, next.lng);

  if (dist < 10) {
    nav(`/pista/${next.id}`);
  }

  // 🧙‍♂️ Mostrar el narrador SOLO si no se ha visto nunca
  if (showNarrador) {
    return (
      <Narrador
        key={introAudio}
        audioSrc={introAudio}
        texto="La búsqueda del Tió de Nadal comienza aqui. Sigue el radar para encontrar las pistas y conseguir todas las letras del Tió. ¡Mucha suerte!"
        autoContinue={false}
        onFinish={() => {
          localStorage.setItem("introNarradorShown", "true"); // ← GUARDAR
          setShowNarrador(false); // ← OCULTAR
        }}
      />
    );
  }

  return (
    <div className="center">
      <h2>Siguiente destino:</h2>
      <h3>{next.name}</h3>

      <Radar distance={dist} bearing={bearing} heading={heading} />

      <button
        onClick={() => nav(`/pista/${next.id}`)}
        style={{
          marginTop: "20px",
          padding: "15px 30px",
          fontSize: "18px",
          borderRadius: "12px",
          background: "#ffd54f",
          border: "3px solid #ffb300",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        TEST: He llegado
      </button>

      <div className="inventario-container">
        <h4>Letras conseguidas:</h4>

        {letras.length === 0 ? (
          <p>— Ninguna todavía —</p>
        ) : (
          <div className="letras-box">
            {letras.map((l) => (
              <span key={l} className="letra-item">
                {l}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
