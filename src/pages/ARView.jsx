import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import pistas from "../data/pistas.json";

/**
 * AR primitives por pista (puedes sustituir por modelos GLB en public/models/)
 */
function ARContent({ kind }) {
  const modelMap = {
    star: "/models/star.glb",
    chest: "/models/chest.glb",
    bear: "/models/bear.glb",
    fountain: "/models/fountain.glb",
    balloon: "/models/balloon.glb",
    key: "/models/key.glb",
    rocket: "/models/rocket.glb",
    uncle: "/models/uncle.glb",
  };
  const src = modelMap[kind] || null;
  if (!src) {
    return (
      <a-entity position="0 0 -1">
        <a-box color="#06b6d4"></a-box>
      </a-entity>
    );
  }
  return (
    <a-entity
      gltf-model={`url(${src})`}
      position="0 0 -1"
      scale="0.8 0.8 0.8"
      animation="property: rotation; to: 0 360 0; loop: true; dur: 6000; easing: linear"
    ></a-entity>
  );
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
        renderer="antialias: true; alpha: true;"
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
