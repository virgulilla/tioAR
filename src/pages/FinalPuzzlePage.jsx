import { useEffect, useState, useRef } from "react";
import { useLetras } from "../context/LetrasContext";
import "./FinalPuzzlePage.css";
import finalAudio from "../assets/sounds/final.mp3";

export default function FinalPuzzlePage() {
  const { letras } = useLetras();
  const palabraFinal = "HUERTO".split("");

  const [positions, setPositions] = useState([]);
  const [finalPositions, setFinalPositions] = useState([]);
  const [animar, setAnimar] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    // Posiciones aleatorias iniciales
    const startPos = palabraFinal.map(() => ({
      top: Math.random() * 70 + "%",
      left: Math.random() * 70 + "%",
    }));

    // Posiciones finales alineadas
    const endPos = palabraFinal.map((_, i) => ({
      top: "50%",
      left: `${20 + i * 10}%`,
    }));

    setPositions(startPos);
    setFinalPositions(endPos);
  }, []);

  function reproducirFinal() {
    if (audioRef.current) audioRef.current.play();
    setAnimar(true);
  }

  return (
    <div className="final-container">
      <h1>¡Felicidades! Has encontrado todas las letras</h1>

      {/* 🎧 Botón para reproducir y activar animación */}
      <button className="final-audio-btn" onClick={reproducirFinal}>
        ▶ Escuchar mensaje final del Tió
      </button>

      <audio ref={audioRef} src={finalAudio} />

      <div className="letters-stage">
        {palabraFinal.map((letter, i) => (
          <span
            key={i}
            className="flying-letter"
            style={{
              top: animar ? finalPositions[i]?.top : positions[i]?.top,
              left: animar ? finalPositions[i]?.left : positions[i]?.left,
              transition: "all 2s ease",
            }}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
}
