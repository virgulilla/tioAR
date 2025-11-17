// src/juegos/Memory.jsx
import React, { useEffect, useState } from "react";

/**
 * Memory - juego de parejas para niños (5-8 años)
 * - Usa iconos simples (emoji) por defecto.
 * - Puedes sustituir `ICONS` por rutas a imágenes si prefieres.
 */

const ICONS = ["⭐", "🎈", "🍪", "🧸", "🚀", "🌟", "🐻", "🎁"]; // 8 pares -> 16 cartas

function shuffle(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Memory() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]); // indices currently flipped
  const [matched, setMatched] = useState([]); // indices matched
  const [moves, setMoves] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [showWin, setShowWin] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    reset();
  }, []);

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      // win
      setShowWin(true);
      // play win sound if you add /public/audio/win.mp3
      const audio = new Audio("/audio/win.mp3");
      audio.play().catch(() => {});
    }
  }, [matched, cards]);

  function reset() {
    const doubled = ICONS.concat(ICONS);
    const shuffled = shuffle(doubled).map((icon, idx) => ({
      id: idx,
      icon,
    }));
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setDisabled(false);
    setShowWin(false);
  }

  function onFlip(index) {
    if (disabled) return;
    if (flipped.includes(index) || matched.includes(index)) return;

    // flip sound
    const flipAudio = new Audio("/audio/flip.mp3");
    flipAudio.play().catch(() => {});

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      setMoves(moves + 1);
      const [a, b] = newFlipped;
      if (cards[a].icon === cards[b].icon) {
        setMatched((m) => [...m, a, b]);
        setFlipped([]);
        setDisabled(false);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 800);
      }
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🧠 Memory de Parejas</h2>
      <p style={styles.subtitle}>
        Encuentra todas las parejas. Movimientos: <b>{moves}</b>
      </p>

      <div style={styles.grid}>
        {cards.map((c, i) => {
          const isFlipped = flipped.includes(i) || matched.includes(i);
          return (
            <button
              key={c.id}
              onClick={() => onFlip(i)}
              aria-label={isFlipped ? `Carta ${c.icon}` : "Carta boca abajo"}
              style={{
                ...styles.card,
                transform: isFlipped ? "rotateY(0deg)" : "rotateY(180deg)",
                background: matched.includes(i) ? "#c8f7c5" : "#fff",
                cursor: matched.includes(i) ? "default" : "pointer",
              }}
              disabled={matched.includes(i)}
            >
              <div style={{ ...styles.cardInner, opacity: isFlipped ? 1 : 0 }}>
                <span style={styles.icon}>{c.icon}</span>
              </div>
              <div style={{ ...styles.cardBack, opacity: isFlipped ? 0 : 1 }}>
                <span style={{ fontSize: 36 }}>❓</span>
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 18 }}>
        <button className="btn" style={styles.bigBtn} onClick={reset}>
          🔁 Reiniciar
        </button>
      </div>

      {showWin && (
        <div style={styles.winOverlay}>
          <div style={styles.winBox}>
            <h3>🎉 ¡Lo conseguiste!</h3>
            <p>Has completado el Memory.</p>
            <img
              alt="Premio"
              src="/mnt/data/A_flat,_digital_2D_graphic_features_a_large,_bold,.png"
              style={{ width: 160, margin: 8, borderRadius: 12 }}
            />
            <button className="btn" style={styles.bigBtn} onClick={reset}>
              Jugar otra vez
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: 12,
    textAlign: "center",
    fontFamily: "Baloo 2, 'Comic Sans MS', system-ui, sans-serif",
  },
  title: { fontSize: 28, margin: 6 },
  subtitle: { fontSize: 18, marginTop: 0 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 84px)",
    gridGap: 12,
    justifyContent: "center",
    marginTop: 14,
  },
  card: {
    width: 84,
    height: 84,
    borderRadius: 12,
    border: "4px solid #ffd86b",
    padding: 0,
    perspective: 600,
    position: "relative",
    background: "#fff",
  },
  cardInner: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backfaceVisibility: "hidden",
    fontSize: 36,
  },
  cardBack: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backfaceVisibility: "hidden",
    transform: "rotateY(180deg)",
    fontSize: 36,
  },
  icon: { fontSize: 44 },
  bigBtn: {
    padding: "12px 28px",
    fontSize: 20,
    borderRadius: 16,
    background: "#ffcd4b",
    border: "none",
  },
  winOverlay: {
    position: "fixed",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(0,0,0,0.4)",
    zIndex: 9999,
  },
  winBox: {
    background: "#fff",
    padding: 20,
    borderRadius: 16,
    textAlign: "center",
    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
  },
};
