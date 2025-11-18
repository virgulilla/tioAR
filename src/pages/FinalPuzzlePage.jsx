import { useEffect, useState } from "react";
import { useLetras } from "../context/LetrasContext";
import "./FinalPuzzlePage.css";

export default function FinalPuzzlePage() {
  const { letras } = useLetras();
  const palabraFinal = "HUERTO".split("");

  const [positions, setPositions] = useState([]);
  const [finalPositions, setFinalPositions] = useState([]);

  useEffect(() => {
    // 1️⃣ Crear posiciones iniciales aleatorias para HUERTO
    const startPos = palabraFinal.map(() => ({
      top: Math.random() * 70 + "%",
      left: Math.random() * 70 + "%",
    }));

    // 2️⃣ Posiciones finales ordenadas
    const endPos = palabraFinal.map((_, i) => ({
      top: "50%",
      left: `${20 + i * 10}%`,
    }));

    setPositions(startPos);

    setTimeout(() => {
      setFinalPositions(endPos);
    }, 500);
  }, []);

  return (
    <div className="final-container">
      <h1>¡Felicidades! Has encontrado todas las letras</h1>

      <div className="letters-stage">
        {palabraFinal.map((letter, i) => (
          <span
            key={i}
            className="flying-letter"
            style={{
              top: finalPositions[i]?.top || positions[i]?.top,
              left: finalPositions[i]?.left || positions[i]?.left,
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
