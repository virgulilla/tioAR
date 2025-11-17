import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const nav = useNavigate();
  return (
    <div className="app-shell">
      <div className="card center">
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 52 }}>🎾🌟</div>
          <h1 className="h1">La Aventura del Jardín Encantado</h1>
          <p className="lead">
            El Tío Nadal ha escondido su sorpresa. ¿Listos para ayudarle?
          </p>
        </div>

        <div style={{ marginTop: 20 }}>
          <button className="btn" onClick={() => nav("/map/1")}>
            Empezar la aventura
          </button>
        </div>

        <div style={{ marginTop: 16 }}>
          <p className="help">
            Consejo: permite la ubicación y mantened el móvil en alto para mejor
            experiencia.
          </p>
        </div>
      </div>
    </div>
  );
}
