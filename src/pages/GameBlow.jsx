import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLetras } from "../context/LetrasContext";
import { usePistas } from "../context/PistasContext";
import GameVictory from "../components/GameVictory"; // 💡 IMPORTAR
import "./GameBlow.css";

export default function GameBlow({ letra = "U" }) {
  const [power, setPower] = useState(0);
  const [showVictory, setShowVictory] = useState(false); // 💡 NUEVO ESTADO

  const { addLetra } = useLetras();
  const { nextPista } = usePistas();
  const nav = useNavigate();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const ctx = new AudioContext();
      const mic = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      mic.connect(analyser);

      const data = new Uint8Array(analyser.fftSize);
      const SENSITIVITY_FACTOR = 4000;
      const NOISE_THRESHOLD = 8;

      function loop() {
        analyser.getByteTimeDomainData(data);
        let vol = data.reduce((a, b) => a + Math.abs(b - 128), 0);
        const adjustedVol = vol / SENSITIVITY_FACTOR;
        if (adjustedVol > NOISE_THRESHOLD) {
          setPower((p) => Math.min(100, p + adjustedVol));
        }
        requestAnimationFrame(loop);
      }
      loop();
    });
  }, []); // 💡 MODIFICACIÓN del useEffect de finalización

  useEffect(() => {
    if (power >= 100) {
      // En lugar de navegar, mostramos la victoria
      setTimeout(() => setShowVictory(true), 800);
    }
  }, [power]);

  // 💡 FUNCIÓN DE CONTINUACIÓN (Maneja la acción de Victoria)
  function handleVictoryContinue() {
    addLetra(letra);
    nextPista();
    // ⚠️ Navegar a /final ya que este es el último juego
    nav("/final");
  }

  // 💡 RENDERIZADO CONDICIONAL
  if (showVictory) {
    return <GameVictory letra={letra} onContinue={handleVictoryContinue} />;
  }

  return (
    <div className="blow-container">
      <h1>¡Sopla fuerte!</h1>
      <p>Llena la barra para liberar el regalo</p>
      <div className="blow-bar">
        <div className="blow-fill" style={{ width: `${power}%` }}></div>
      </div>
    </div>
  );
}
