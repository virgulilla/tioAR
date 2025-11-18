import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLetras } from "../context/LetrasContext";
import { usePistas } from "../context/PistasContext";
import "./GameBlow.css";

export default function GameBlow({ letra = "O" }) {
  const [power, setPower] = useState(0);
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

      function loop() {
        analyser.getByteTimeDomainData(data);
        let vol = data.reduce((a, b) => a + Math.abs(b - 128), 0);
        setPower((p) => Math.min(100, p + vol / 500));
        requestAnimationFrame(loop);
      }
      loop();
    });
  }, []);

  useEffect(() => {
    if (power >= 100) {
      addLetra(letra);
      nextPista();
      setTimeout(() => nav("/final"), 800);
    }
  }, [power]);

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
