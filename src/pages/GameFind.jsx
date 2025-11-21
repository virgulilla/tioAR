import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLetras } from "../context/LetrasContext";
import { usePistas } from "../context/PistasContext";
import GameVictory from "../components/GameVictory";
import tioImg from "../assets/find/tio_ball.png";
import "./GameFind.css";

export default function GameFind({ letra = "R" }) {
  const navigate = useNavigate();
  const { addLetra } = useLetras();
  const { nextPista } = usePistas();

  const areaRef = useRef(null);

  const [pos, setPos] = useState({ x: 20, y: 20 });
  const [vel, setVel] = useState({ x: 0, y: 0 });
  const [won, setWon] = useState(false);

  // Sensibilidad ajustable
  const SENSIBILITY = 0.25; // baja para que sea más controlable

  useEffect(() => {
    function handleOrientation(e) {
      let lr = e.gamma || 0; // izquierda/derecha
      let fb = e.beta || 0; // adelante/atrás

      setVel({
        x: lr * SENSIBILITY,
        y: fb * SENSIBILITY,
      });
    }

    window.addEventListener("deviceorientation", handleOrientation, true);

    return () =>
      window.removeEventListener("deviceorientation", handleOrientation);
  }, []);

  // Movimiento continuo del Tió
  useEffect(() => {
    function loop() {
      setPos((p) => {
        const area = areaRef.current;
        if (!area) return p;

        const maxX = area.clientWidth - 50;
        const maxY = area.clientHeight - 50;

        const newX = p.x + vel.x;
        const newY = p.y + vel.y;

        // Evitar que traspase bordes
        const safeX = Math.max(0, Math.min(newX, maxX));
        const safeY = Math.max(0, Math.min(newY, maxY));

        return { x: safeX, y: safeY };
      });

      requestAnimationFrame(loop);
    }

    loop();
  }, [vel]);

  // Detección de objetivo
  useEffect(() => {
    const goalX = 210;
    const goalY = 210;

    const dx = pos.x - goalX;
    const dy = pos.y - goalY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 35 && !won) {
      setWon(true);
    }
  }, [pos, won]);

  function handleVictoryContinue() {
    addLetra(letra);
    nextPista();
    navigate("/final");
  }

  if (won) {
    return <GameVictory letra={letra} onContinue={handleVictoryContinue} />;
  }

  return (
    <div className="tilt-container">
      <h1 className="tilt-title">Equilibra el Tió</h1>
      <p className="tilt-subtitle">
        Inclina el móvil para llevarlo hasta la estrella ✨
      </p>

      <div className="tilt-area" ref={areaRef}>
        <div className="goal">✨</div>

        <img
          src={tioImg}
          alt="Tió"
          className="ball"
          style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
        />
      </div>
    </div>
  );
}
