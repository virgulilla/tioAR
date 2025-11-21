import { useEffect, useRef } from "react";
import Snowfall from "react-snowfall";
import finalAudio from "../assets/sounds/final.mp3";
import TioAnimadoSimple from "../components/TioAnimadoSimple";
import "./FinalTioPage.css";

export default function FinalTioPage() {
  return (
    <div className="tio-final-page fade-in">
      <Snowfall />

      <div className="final-content fade-up">
        <h1 className="final-title">🎄 ¡Os estaba esperando! 🎄</h1>

        <p className="final-text">Habéis descubierto la palabra secreta…</p>

        <h2 className="final-word">✨ HUERTO ✨</h2>

        {/* Sustituimos el texto por el Tió animado */}
        <TioAnimadoSimple audioSrc={finalAudio} />
      </div>
    </div>
  );
}
