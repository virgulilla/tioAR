// ARFinal.jsx
import React from "react";

export default function ARFinal() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <div style={{ position: "absolute", zIndex: 20, left: 12, top: 12 }}>
        <button
          onClick={() => history.back()}
          style={{ padding: "8px 12px", borderRadius: 8 }}
        >
          Volver
        </button>
      </div>

      {/* A-Frame + AR.js escena en modo sin marcador (tracking por "best") */}
      <a-scene
        embedded
        arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: false;"
        renderer="logarithmicDepthBuffer: true;"
      >
        {/* si tienes un modelo GLB ligero en public/models/tio.glb */}
        <a-entity gps-entity-place></a-entity>

        <a-entity position="0 0 -1">
          <a-box
            depth="0.6"
            height="0.6"
            width="0.6"
            color="#ffd54f"
            position="0 0.3 0"
          ></a-box>
          <a-text
            value="¡Felicidades! 🎾"
            align="center"
            position="0 1 0"
            color="#ffffff"
          ></a-text>
        </a-entity>

        <a-entity camera></a-entity>
      </a-scene>
      <div
        style={{
          position: "absolute",
          bottom: 20,
          width: "100%",
          textAlign: "center",
          zIndex: 30,
        }}
      >
        <p
          style={{
            background: "rgba(0,0,0,0.5)",
            display: "inline-block",
            color: "white",
            padding: "6px 12px",
            borderRadius: 12,
          }}
        >
          Si tu móvil no soporta AR sin marcador, puedes usar la versión vídeo:
          mira la imagen del Tío Nadal.
        </p>
      </div>
    </div>
  );
}
