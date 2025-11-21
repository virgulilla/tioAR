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
    navigator.mediaDevices
      .getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false, // si el móvil lo permite, genial
        },
      })
      .then((stream) => {
        const ctx = new AudioContext();
        const mic = ctx.createMediaStreamSource(stream);

        // FILTRO DE ALTAS FRECUENCIAS (solo deja pasar soplido real)
        const highpass = ctx.createBiquadFilter();
        highpass.type = "highpass";
        highpass.frequency.value = 4000; // las "esses" del soplido están aquí

        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;

        mic.connect(highpass);
        highpass.connect(analyser);

        const data = new Uint8Array(analyser.frequencyBinCount);

        let smoothed = 0;
        const IMPULSE_THRESHOLD = 60; // pico de soplido
        const RISE_SPEED = 0.02; // velocidad de llenado
        const DECAY = 0.92; // evita falsos positivos

        function loop() {
          analyser.getByteFrequencyData(data);

          // energía SOLO en frecuencias super altas = soplido
          const highEnergy =
            data.slice(50, 120).reduce((a, b) => a + b, 0) / 70;

          // suavizado (para eliminar ruido constante del micro)
          smoothed = smoothed * DECAY + highEnergy * (1 - DECAY);

          // solo cuenta SI EL PICO SUPERA EL SUAVIZADO → soplido real
          if (highEnergy - smoothed > IMPULSE_THRESHOLD) {
            setPower((p) => Math.min(100, p + highEnergy * RISE_SPEED));
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
