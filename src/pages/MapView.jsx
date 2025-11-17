import React, { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGeoPosition from "../hooks/useGeoPosition";
import { haversineDistance, bearingDegrees } from "../hooks/useDistance";
import pistas from "../data/pistas.json";
import BigArrow from "../components/BigArrow";

export default function MapView() {
  const { id } = useParams();
  const pistaId = Number(id) || 1;
  const pista = pistas.find((p) => p.id === pistaId);
  const { position } = useGeoPosition();
  const navigate = useNavigate();

  const calc = useMemo(() => {
    if (!position || !pista) return { distance: null, bearing: 0 };
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
    if (calc.distance !== null && calc.distance <= pista.radius) {
      // Entramos en radio: navegamos a AR para esta pista
      setTimeout(() => navigate(`/ar/${pistaId}`), 300); // pequeño delay para UX
    }
  }, [calc.distance, pista.radius, navigate, pistaId]);

  return (
    <div className="app-shell">
      <div className="card center">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div className="badge">
              Pista {pistaId} / {pistas.length}
            </div>
            <h1 className="h1" style={{ marginTop: 8 }}>
              {pista.title}
            </h1>
            <p className="lead">{pista.description}</p>
          </div>
        </div>

        <div className="compass" role="img" aria-label="brújula">
          <BigArrow angle={calc.bearing || 0} />
        </div>

        <div className="distance">
          {calc.distance === null
            ? "Buscando ubicación…"
            : `${Math.round(calc.distance)} m`}
        </div>
        <div style={{ marginTop: 12 }}>
          <button className="btn" onClick={() => navigate(`/pista/${pistaId}`)}>
            Ver pista ahora
          </button>
        </div>

        <p className="help">
          Sigue la flecha hasta que veas la pista. La app detectará cuando estés
          allí.
        </p>
      </div>
    </div>
  );
}
