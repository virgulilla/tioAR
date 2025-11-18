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
  const [needsUserAction, setNeedsUserAction] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Intentar reproducir (puede fallar)
    audio.play().catch(() => {
      // Si falla → necesita interacción del usuario
      setNeedsUserAction(true);
    });

    if (autoContinue) {
      audio.onended = () => onFinish();
    }
  }, []);

  function startAudio() {
    const audio = audioRef.current;
    if (!audio) return;

    audio.play();
    setNeedsUserAction(false);
  }

  return (
    <div className="narrador-overlay">
      <div className="narrador-box">
        <img src={tioImg} className="tio-animado" />

        {texto && <p className="narrador-texto">{texto}</p>}

        <audio ref={audioRef} src={audioSrc} />

        {needsUserAction && (
          <button className="narrador-btn" onClick={startAudio}>
            ▶️ Reproducir narración
          </button>
        )}

        {!needsUserAction && !autoContinue && (
          <button className="narrador-btn" onClick={onFinish}>
            Continuar
          </button>
        )}
      </div>
    </div>
  );
}
