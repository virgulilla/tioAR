import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLetras } from "../context/LetrasContext";
import { usePistas } from "../context/PistasContext";
import "./GameBalloons.css";

export default function GameBalloons({ letra = "U" }) {
  const [balloons, setBalloons] = useState([]);
  const [popped, setPopped] = useState([]);
  const [finished, setFinished] = useState(false);

  const { addLetra } = useLetras();
  const { nextPista } = usePistas();
  const nav = useNavigate();

  // Crear globos iniciales
  useEffect(() => {
    const arr = [];
    for (let i = 0; i < 8; i++) {
      arr.push({
        id: i,
        left: Math.random() * 70 + 10, // posición horizontal
        delay: Math.random() * 3, // retardo animación
        speed: Math.random() * 4 + 3, // velocidad diferente por globo
      });
    }
    setBalloons(arr);
  }, []);

  function popBalloon(id) {
    if (popped.includes(id)) return;
    setPopped([...popped, id]);
  }

  // Cuando explotan todos → entregar letra
  useEffect(() => {
    if (balloons.length && popped.length === balloons.length) {
      setFinished(true);

      setTimeout(() => {
        addLetra(letra); // entrega letra U
        nextPista();
        nav("/"); // volver al radar
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
    </div>
  );
}
