// Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const nav = useNavigate();
  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h1 style={{ fontSize: 28 }}>Búsqueda del Tío de Nadal</h1>
      <p>
        Una gincana GPS para niños — ¡sigue la flecha y encuentra las pistas!
      </p>
      <div style={{ marginTop: 18 }}>
        <button
          onClick={() => nav("/map/1")}
          style={{
            padding: "12px 18px",
            background: "#0ea5e9",
            color: "white",
            borderRadius: 10,
          }}
        >
          Empezar
        </button>
      </div>
    </div>
  );
}
