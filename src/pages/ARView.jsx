import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import pistas from "../data/pistas.json";

/**
 * AR primitives por pista (puedes sustituir por modelos GLB en public/models/)
 */
function ARContent({ kind }) {
  switch (kind) {
    case "star":
      return (
        <a-entity position="0 0 -1">
          <a-octahedron
            radius="0.35"
            color="#f59e0b"
            segments="0"
            rotation="0 45 0"
          ></a-octahedron>
        </a-entity>
      );
    case "chest":
      return (
        <a-entity position="0 0 -1">
          <a-box
            color="#b7791f"
            depth="0.5"
            height="0.35"
            width="0.7"
            position="0 0.2 0"
          ></a-box>
        </a-entity>
      );
    case "bear":
      return (
        <a-entity position="0 0 -1">
          <a-sphere radius="0.35" color="#fca5a5" position="0 0.2 0"></a-sphere>
        </a-entity>
      );
    case "fountain":
      return (
        <a-entity position="0 0 -1">
          <a-cylinder radius="0.5" height="0.2" color="#60a5fa"></a-cylinder>
          <a-torus radius="0.25" position="0 0.6 0" color="#fff"></a-torus>
        </a-entity>
      );
    case "balloon":
      return (
        <a-entity position="0 0 -1">
          <a-sphere radius="0.4" color="#fb7185" position="0 0.6 0"></a-sphere>
        </a-entity>
      );
    case "key":
      return (
        <a-entity position="0 0 -1">
          <a-cylinder
            radius="0.08"
            height="0.6"
            color="#fde047"
            rotation="0 0 45"
          ></a-cylinder>
        </a-entity>
      );
    case "rocket":
      return (
        <a-entity position="0 0 -1">
          <a-cone radius-bottom="0.2" height="0.6" color="#7c3aed"></a-cone>
        </a-entity>
      );
    case "uncle":
      // final: un personaje simple (caja+cabeza)
      return (
        <a-entity position="0 0 -1">
          <a-box
            depth="0.5"
            height="0.6"
            width="0.4"
            color="#fde68a"
            position="0 0.3 0"
          ></a-box>
          <a-sphere radius="0.22" color="#fef3c7" position="0 0.9 0"></a-sphere>
          <a-text
            value="¡Hola campeones!"
            align="center"
            position="0 1.4 0"
            color="#0f172a"
          ></a-text>
        </a-entity>
      );
    default:
      return (
        <a-entity position="0 0 -1">
          <a-box color="#06b6d4" depth="0.4" height="0.4" width="0.4"></a-box>
        </a-entity>
      );
  }
}

export default function ARView() {
  const { id } = useParams();
  const pistaId = Number(id);
  const pista = pistas.find((p) => p.id === pistaId);
  const nav = useNavigate();

  useEffect(() => {
    // reproducir audio si hay
    try {
      const au = new Audio(`/audio/pista${pistaId}.mp3`);
      au.play().catch(() => {});
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      /* empty */
    }
  }, [pistaId]);

  if (!pista)
    return (
      <div className="app-shell">
        <div className="card">Pista no encontrada</div>
      </div>
    );

  return (
    <div className="ar-screen">
      <div className="ar-topbar">
        <button className="btn-ghost" onClick={() => nav(-1)}>
          Volver
        </button>
      </div>

      {/* A-Frame escena (embedded) */}
      <a-scene
        embedded
        arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: false;"
        renderer="antialias: true;"
      >
        {/* luz y cámara */}
        <a-entity light="type: ambient; intensity: 0.9"></a-entity>
        <a-entity
          light="type: directional; intensity: 0.6"
          position="1 1 0"
        ></a-entity>

        {/* Contenido AR por pista */}
        <ARContent kind={pista.ar} />

        <a-entity camera></a-entity>
      </a-scene>

      {/* UI overlay para continuar */}
      <div
        style={{
          position: "absolute",
          bottom: 28,
          width: "100%",
          textAlign: "center",
          zIndex: 40,
        }}
      >
        {pistaId < pistas.length ? (
          <button className="btn" onClick={() => nav(`/map/${pistaId + 1}`)}>
            Siguiente pista
          </button>
        ) : (
          <button className="btn" onClick={() => nav("/final")}>
            Ver final
          </button>
        )}
      </div>
    </div>
  );
}
