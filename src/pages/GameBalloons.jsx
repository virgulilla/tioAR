import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLetras } from "../context/LetrasContext";
import { usePistas } from "../context/PistasContext";
import "./GameBalloons.css";

import popSound from "../assets/sounds/pop.mp3";

export default function GameBalloons({ letra = "H" }) {
  const [balloons, setBalloons] = useState([]);
  const [popped, setPopped] = useState([]);
  const [finished, setFinished] = useState(false);

  const { addLetra } = useLetras();
  const { nextPista } = usePistas();
  const nav = useNavigate();

  // Refs de audio
  const popRef = useRef(null);

  // 🔓 Permitir audio después del primer toque
  const [canPlay, setCanPlay] = useState(false);

  useEffect(() => {
    const unlock = () => setCanPlay(true);
    window.addEventListener("click", unlock, { once: true });
    window.addEventListener("touchstart", unlock, { once: true });

    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("touchstart", unlock);
    };
  }, []);

  function playSound(ref) {
    if (!canPlay || !ref.current) return;
    const audio = ref.current;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }

  // Crear globos iniciales
  useEffect(() => {
    const arr = [];
    for (let i = 0; i < 8; i++) {
      arr.push({
        id: i,
        left: Math.random() * 70 + 10,
        delay: Math.random() * 3,
        speed: Math.random() * 4 + 3,
      });
    }
    setBalloons(arr);
  }, []);

  function popBalloon(id) {
    if (popped.includes(id)) return;

    // Marcar globo como reventado
    setPopped([...popped, id]);

    // 🔊 Sonido de pop
    playSound(popRef);
  }

  // Cuando explotan todos → entregar letra
  useEffect(() => {
    if (balloons.length && popped.length === balloons.length) {
      setFinished(true);

      setTimeout(() => {
        addLetra(letra);
        nextPista();
        nav("/");
      }, 1200);
    }
  }, [popped]);

  return (
    <div className="balloons-container">
      <h1>¡Explota los globos!</h1>
      <p>Toca todos los globos para ganar la siguiente letra.</p>

      <div className="balloons-area">
        {balloons.map((b) => (
          <div
            key={b.id}
            className={`balloon ${popped.includes(b.id) ? "popped" : ""}`}
            style={{
              left: `${b.left}%`,
              animationDelay: `${b.delay}s`,
              animationDuration: `${b.speed}s`,
            }}
            onClick={() => popBalloon(b.id)}
          >
            🎈
          </div>
        ))}
      </div>

      {finished && (
        <div className="balloons-finished">
          ¡Muy bien! Has ganado la letra <strong>{letra}</strong> 🎉
        </div>
      )}

      {/* Audios */}
      <audio ref={popRef} src={popSound} preload="auto" />
    </div>
  );
}
