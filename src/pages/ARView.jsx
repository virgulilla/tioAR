import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import pistas from "../data/pistas.json";

function ARContent({ kind }) {
  const modelMap = {
    star: "/models/star.glb",
    chest: "models/chest.glb",
    bear: "models/bear.glb",
    fountain: "models/fountain.glb",
    balloon: "models/balloon.glb",
    key: "models/key.glb",
    rocket: "models/rocket.glb",
    uncle: "models/uncle.glb",
  };

  const src = modelMap[kind];

  if (!src) return <a-box color="red"></a-box>;
  return (
    <a-entity
      gltf-model={src}
      scale="0.4 0.4 0.4"
      position="0 0 0"
      animation="property: rotation; to: 0 360 0; loop: true; dur: 4000; easing: linear"
    ></a-entity>
  );
}

export default function ARView() {
  const { id } = useParams();
  const pistaId = Number(id);
  const pista = pistas.find((p) => p.id === pistaId);
  const nav = useNavigate();

  useEffect(() => {
    try {
      const au = new Audio(`/audio/pista${pistaId}.mp3`);
      au.play().catch(() => {});
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      /* */
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

      <a-scene
        embedded
        vr-mode-ui="enabled: false"
        renderer="logarithmicDepthBuffer: true; antialias: true;"
        arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: false;"
      >
        <a-marker preset="hiro">
          <a-entity
            gltf-model="models/star.glb"
            position="0 0 0"
            scale="0.5 0.5 0.5"
          ></a-entity>
        </a-marker>

        <a-entity camera></a-entity>
      </a-scene>

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
