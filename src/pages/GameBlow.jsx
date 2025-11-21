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

      // 1️⃣ Filtro paso alto para eliminar voces graves
      const highpass = ctx.createBiquadFilter();
      highpass.type = "highpass";
      highpass.frequency.value = 1200; // soplido = frecuencias altas

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;

      mic.connect(highpass);
      highpass.connect(analyser);

      const data = new Uint8Array(analyser.frequencyBinCount);

      const BOOST = 1.8; // Multiplicador de sensibilidad
      const THRESHOLD = 12; // Umbral más bajo

      function loop() {
        analyser.getByteFrequencyData(data);

        // 🔥 medir energía EN FRECUENCIAS ALTAS (soplidos)
        const highFreqEnergy =
          data
            .slice(30) // Ignorar bajas frecuencias (voz)
            .reduce((a, b) => a + b, 0) / 10;

        const vol = highFreqEnergy * BOOST;

        if (vol > THRESHOLD) {
          setPower((p) => Math.min(100, p + vol / 25));
        }

        requestAnimationFrame(loop);
      }

      loop();
    });
  }, []);

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
