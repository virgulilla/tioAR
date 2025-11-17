import React from "react";
import { useNavigate } from "react-router-dom";

export default function Final() {
  const nav = useNavigate();
  return (
    <div className="app-shell">
      <div className="card center">
        <div style={{ textAlign: "center" }}>
          <h1 className="h1">¡Habéis encontrado al Tío Nadal! 🎉</h1>
          <p className="lead">
            Gracias por ayudar al Tío Nadal. ¡Sois los mejores exploradores!
          </p>
        </div>

        <div style={{ marginTop: 20 }}>
          <button className="btn" onClick={() => nav("/")}>
            Jugar de nuevo
          </button>
        </div>
      </div>
    </div>
  );
}
