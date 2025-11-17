// MapView.jsx
import React, { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGeoPosition from "../hooks/useGeoPosition";
import { haversineDistance, bearingDegrees } from "../hooks/useDistance";
import pistas from "../data/pistas.json";

export default function MapView() {
  const { id } = useParams(); // id de la pista actual
  const pistaId = Number(id) || 1;
  const pista = pistas.find((p) => p.id === pistaId);
  const { position, error } = useGeoPosition();
  const navigate = useNavigate();

  // calcula distancia y rumbo si tenemos posición
  const calc = useMemo(() => {
    if (!position || !pista) return { distance: null, bearing: null };
    const distance = haversineDistance(
      position.latitude,
      position.longitude,
      pista.lat,
      pista.lon
    );
    const bearing = bearingDegrees(
      position.latitude,
      position.longitude,
      pista.lat,
      pista.lon
    );
    return { distance, bearing };
  }, [position, pista]);

  useEffect(() => {
    if (!calc.distance && calc.distance !== 0) return;
    // si estamos dentro del radio, vamos a la vista de pista
    if (calc.distance <= pista.radius) {
      // navegamos a la vista de pista encontrada
      navigate(`/pista/${pistaId}`);
    }
  }, [calc.distance, pista.radius, navigate, pistaId]);

  // Si no hay posición todavía
  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Error de geolocalización</h2>
        <p>{error.message}</p>
        <p>Revisa permisos y que el dispositivo tenga GPS o conexión.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h2 style={{ fontSize: 24, marginBottom: 10 }}>{pista.title}</h2>
      <p style={{ marginBottom: 8 }}>{pista.description}</p>

      <div style={{ marginTop: 16 }}>
        <div
          style={{
            width: 160,
            height: 160,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 12,
            background: "#f3f4f6",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          {/* Flecha rotada por el bearing */}
          <div
            style={{
              transform: `rotate(${calc.bearing || 0}deg)`,
              transition: "transform 300ms",
            }}
          >
            {/* Flecha simple (triángulo CSS) */}
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: "18px solid transparent",
                borderRight: "18px solid transparent",
                borderBottom: "36px solid #ef4444",
                margin: "0 auto",
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <p style={{ fontSize: 18 }}>
          {calc.distance === null
            ? "Obteniendo ubicación…"
            : `${Math.round(calc.distance)} m`}{" "}
          <span style={{ color: "#6b7280" }}>de la pista</span>
        </p>
        <p style={{ color: "#6b7280", fontSize: 14 }}>
          Radio de activación: {pista.radius} m
        </p>
      </div>

      <div style={{ marginTop: 22 }}>
        <button
          onClick={() => navigate(`/pista/${pistaId}`)}
          style={{
            padding: "10px 18px",
            borderRadius: 10,
            background: "#10b981",
            color: "white",
            border: "none",
          }}
        >
          Forzar ver pista
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        <p style={{ fontSize: 12, color: "#9ca3af" }}>
          Consejo: camina hacia donde apunta la flecha hasta que suene la pista.
        </p>
      </div>
    </div>
  );
}
