import { useEffect, useState } from "react";
import { useLetras } from "../context/LetrasContext";
import "./FinalPuzzlePage.css";

export default function FinalPuzzlePage() {
  const { letras } = useLetras();
  const palabraFinal = "HUERTO";

  const [positions, setPositions] = useState([]);
  const [finalPositions, setFinalPositions] = useState([]);

  useEffect(() => {
    const startPos = letras.map(() => ({
      top: Math.random() * 70 + "%",
      left: Math.random() * 70 + "%",
    }));

    const endPos = palabraFinal.split("").map((_, i) => ({
      top: "50%",
      left: `${20 + i * 10}%`,
    }));

    setPositions(startPos);

    setTimeout(() => {
      setFinalPositions(endPos);
    }, 1000);
  }, []);

  return (
    <div className="final-container">
      <h1>¡Felicidades! Has encontrado todas las letras</h1>

      <div className="letters-stage">
        {letras.map((l, i) => (
          <span
            key={i}
            className="flying-letter"
            style={{
              top: finalPositions[i]?.top || positions[i]?.top,
              left: finalPositions[i]?.left || positions[i]?.left,
              transition: "all 2s ease",
            }}
          >
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}
