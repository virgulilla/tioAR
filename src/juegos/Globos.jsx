// src/juegos/Globos.jsx
import React, { useEffect, useRef, useState } from "react";

/**
 * Globos - toca para reventar globos
 * - Fácil para niños: grandes, colores vivos
 * - Objetivo: reventar N globos para completar la pista
 */

const COLORS = ["#ff6b6b", "#ffcd4b", "#7bd389", "#7bd3ff", "#d7a5ff"];
const TARGET = 6;
const SPAWN_INTERVAL = 900; // ms

function random(min, max) {
  return Math.random() * (max - min) + min;
}

export default function Globos({ onComplete }) {
  const [balloons, setBalloons] = useState([]);
  const [score, setScore] = useState(0);
  const spawnRef = useRef(null);

  function spawnBalloon() {
    setBalloons((b) => {
      const id = Date.now() + Math.random();
      const left = random(6, 86); // percent
      const size = random(64, 120); // px
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      return [...b, { id, left, size, color }];
    });
  }

  useEffect(() => {
    spawnRef.current = setInterval(spawnBalloon, SPAWN_INTERVAL);
    return () => clearInterval(spawnRef.current);
  }, []);

  function popBalloon(id) {
    // pop sound
    const audio = new Audio("/audio/pop.mp3");
    audio.play().catch(() => {});

    setBalloons((b) => b.filter((x) => x.id !== id));
    setScore((s) => {
      const ns = s + 1;
      if (ns >= TARGET) {
        clearInterval(spawnRef.current);
        setTimeout(() => {
          // win callback
          if (typeof onComplete === "function") onComplete();
        }, 400);
      }
      return ns;
    });
  }

  return (
    <div style={styles.container}>
      <h2 style={{ fontSize: 26 }}>🎈 Reventar Globos</h2>
      <p style={{ fontSize: 18 }}>
        Pulsa los globos para reventarlos. Objetivo: {TARGET}
      </p>

      <div style={styles.playArea} aria-live="polite">
        {balloons.map((b) => (
          <button
            key={b.id}
            onClick={() => popBalloon(b.id)}
            aria-label="Reventar globo"
            style={{
              ...styles.balloon,
              left: `${b.left}%`,
              width: b.size,
              height: b.size,
              background: b.color,
              borderRadius: "50%",
              animationDuration: `${random(3500, 6000)}ms`,
            }}
          />
        ))}

        {/* fixed UI */}
        <div style={styles.hud}>
          <div style={styles.score}>
            Puntos: <b>{score}</b>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <button
          className="btn"
          style={styles.bigBtn}
          onClick={() => {
            // reiniciar
            setBalloons([]);
            setScore(0);
            spawnRef.current = setInterval(spawnBalloon, SPAWN_INTERVAL);
          }}
        >
          🔁 Reiniciar
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: 12,
    fontFamily: "Baloo 2, 'Comic Sans MS', system-ui, sans-serif",
    textAlign: "center",
  },
  playArea: {
    width: "100%",
    height: 360,
    borderRadius: 14,
    background: "linear-gradient(180deg,#e9f7ff,#c8eefd)",
    overflow: "hidden",
    position: "relative",
    marginTop: 12,
  },
  balloon: {
    position: "absolute",
    bottom: -140,
    transform: "translateX(-50%)",
    boxShadow: "0 8px 18px rgba(0,0,0,0.15)",
    border: "4px solid rgba(255,255,255,0.6)",
    cursor: "pointer",
    animationName: "floatUp",
    animationTimingFunction: "linear",
  },
  hud: {
    position: "absolute",
    left: 10,
    top: 10,
    background: "rgba(255,255,255,0.8)",
    padding: "6px 10px",
    borderRadius: 10,
  },
  score: { fontSize: 18, color: "#333" },
  bigBtn: {
    padding: "12px 24px",
    fontSize: 20,
    borderRadius: 12,
    background: "#ffcd4b",
    border: "none",
  },
};
