// ClueView.jsx
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import pistas from "../data/pistas.json";

// Si usas howler.js, podrías integrar audio en vez de <audio>
export default function ClueView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pistaId = Number(id);
  const pista = pistas.find((p) => p.id === pistaId);

  useEffect(() => {
    // reproducir audio si existe
    if (pista.audio) {
      const audio = new Audio(`/audio/${pista.audio}`);
      audio.play().catch(() => {
        /* ignore autoplay block */
      });
    }
  }, [pista]);

  if (!pista) return <div style={{ padding: 20 }}>Pista no encontrada</div>;

  const isLast = pistaId === pistas.length;

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h2 style={{ fontSize: 26 }}>{pista.title}</h2>
      <p style={{ marginTop: 12, fontSize: 18 }}>{pista.description}</p>

      <div style={{ marginTop: 24 }}>
        {pista.image && (
          <img
            src={`/markers/${pista.image}`}
            alt=""
            style={{ maxWidth: "60%", borderRadius: 12 }}
          />
        )}
      </div>

      <div style={{ marginTop: 28 }}>
        {!isLast ? (
          <button
            onClick={() => navigate(`/map/${pistaId + 1}`)}
            style={{
              padding: "12px 20px",
              borderRadius: 10,
              background: "#3b82f6",
              color: "white",
              border: "none",
            }}
          >
            Siguiente pista
          </button>
        ) : (
          <button
            onClick={() => navigate("/arfinal")}
            style={{
              padding: "12px 20px",
              borderRadius: 10,
              background: "#8b5cf6",
              color: "white",
              border: "none",
            }}
          >
            Ver al Tío Nadal en AR
          </button>
        )}
      </div>

      <div style={{ marginTop: 12 }}>
        <button
          onClick={() => navigate(`/map/${pistaId}`)}
          style={{
            marginTop: 8,
            background: "transparent",
            border: "none",
            color: "#6b7280",
          }}
        >
          Volver al mapa
        </button>
      </div>
    </div>
  );
}
