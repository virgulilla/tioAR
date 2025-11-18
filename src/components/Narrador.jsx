import { useEffect, useRef, useState } from "react";
import "./Narrador.css";
import tioImg from "../assets/tio/tio.png";

export default function Narrador({
  audioSrc,
  texto = "",
  onFinish = () => {},
  autoContinue = false,
}) {
  const audioRef = useRef(null);
  const [audioReady, setAudioReady] = useState(false);
  const [needsUserAction, setNeedsUserAction] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Cuando el audio está realmente cargado
    const readyHandler = () => {
      setAudioReady(true);
    };

    audio.addEventListener("canplaythrough", readyHandler);

    // Auto continuar si corresponde
    audio.onended = () => {
      if (autoContinue) onFinish();
    };

    return () => {
      audio.removeEventListener("canplaythrough", readyHandler);
    };
  }, []);

  async function startAudio() {
    const audio = audioRef.current;
    if (!audio) return;

    // Si aún no está listo, esperamos
    if (!audioReady) {
      // Esperamos unos ms más para móviles lentos
      setTimeout(() => startAudio(), 200);
      return;
    }

    try {
      await audio.play();
      setNeedsUserAction(false);
    } catch (err) {
      // En iPhone a veces falla, reintentamos
      console.log("Reintentando play()", err);
      setTimeout(startAudio, 200);
    }
  }

  function handleContinue() {
    if (!autoContinue) onFinish();
  }

  return (
    <div className="narrador-overlay">
      <div className="narrador-box">
        <img src={tioImg} className="tio-animado" />

        {texto && <p className="narrador-texto">{texto}</p>}

        <audio ref={audioRef} src={audioSrc} preload="auto" />

        {needsUserAction && (
          <button className="narrador-btn" onClick={startAudio}>
            ▶️ Reproducir narración
          </button>
        )}

        {!needsUserAction && !autoContinue && (
          <button className="narrador-btn" onClick={handleContinue}>
            Continuar
          </button>
        )}
      </div>
    </div>
  );
}
