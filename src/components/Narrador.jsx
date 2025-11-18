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
  const [needsUserAction, setNeedsUserAction] = useState(true);
  // 🔥 Siempre empieza necesitando acción del usuario

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Si autoContinue está activado, cuando termine avanza
    audio.onended = () => {
      if (autoContinue) onFinish();
    };
  }, []);

  function startAudio() {
    const audio = audioRef.current;
    if (!audio) return;

    audio.play().then(() => {
      setNeedsUserAction(false);
    });
  }

  function handleContinue() {
    if (!autoContinue) onFinish();
  }

  return (
    <div className="narrador-overlay">
      <div className="narrador-box">
        <img src={tioImg} className="tio-animado" />

        {texto && <p className="narrador-texto">{texto}</p>}

        <audio ref={audioRef} src={audioSrc} />

        {/* 🔥 SIEMPRE se muestra este botón antes de reproducir */}
        {needsUserAction && (
          <button className="narrador-btn" onClick={startAudio}>
            ▶️ Reproducir narración
          </button>
        )}

        {/* Botón continuar si no es autoContinue */}
        {!needsUserAction && !autoContinue && (
          <button className="narrador-btn" onClick={handleContinue}>
            Continuar
          </button>
        )}
      </div>
    </div>
  );
}
