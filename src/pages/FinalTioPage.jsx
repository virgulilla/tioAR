import { useRef } from "react";
import Snowfall from "react-snowfall";
import finalAudio from "../assets/sounds/final.mp3";
import songAudio from "../assets/sounds/song.m4a";
import TioAnimadoSimple from "../components/TioAnimadoSimple";
import "./FinalTioPage.css";

export default function FinalTioPage() {
  const secretButtonAudio = useRef(null);

  const playSecretAudio = () => {
    if (secretButtonAudio.current) {
      secretButtonAudio.current.play().catch(() => {});
    }
  };

  return (
    <div className="tio-final-page fade-in">
      <Snowfall />

      {/* Campana SIEMPRE visible encima del contenido */}
      <button className="secret-sound-button" onClick={playSecretAudio}>
        🔔
      </button>

      <audio ref={secretButtonAudio} src={songAudio} preload="auto" />

      <div className="final-content fade-up">
        <h1 className="final-title">🎄 ¡Os estaba esperando! 🎄</h1>

        <p className="final-text">Habéis descubierto la palabra secreta…</p>

        <h2 className="final-word">✨ HUERTO ✨</h2>

        <TioAnimadoSimple audioSrc={finalAudio} />
      </div>
    </div>
  );
}
