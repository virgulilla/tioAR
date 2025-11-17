import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import pistas from "../data/pistas.json";

export default function ClueView() {
  const { id } = useParams();
  const pistaId = Number(id);
  const pista = pistas.find((p) => p.id === pistaId);
  const nav = useNavigate();

  useEffect(() => {
    // audio breve si existe
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
        <div className="card center">Pista no encontrada</div>
      </div>
    );

  const isLast = pistaId === pistas.length;

  return (
    <div className="app-shell">
      <div className="card center">
        <div className="pista-card">
          <h2 className="pista-title">{pista.title}</h2>
          <p className="pista-desc">{pista.description}</p>
        </div>

        <div style={{ marginTop: 18 }}>
          {!isLast ? (
            <button className="btn" onClick={() => nav(`/map/${pistaId + 1}`)}>
              Siguiente pista
            </button>
          ) : (
            <button className="btn" onClick={() => nav(`/ar/${pistaId}`)}>
              Ver sorpresa final
            </button>
          )}
        </div>

        <div style={{ marginTop: 12 }}>
          <button className="btn-ghost" onClick={() => nav(`/map/${pistaId}`)}>
            Volver al mapa
          </button>
        </div>
      </div>
    </div>
  );
}
