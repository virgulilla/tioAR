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
  const [needsUserAction, setNeedsUserAction] = useState(true); // Se reinicia cada vez que el componente se monta
  const [error, setError] = useState(null);

  // No necesitamos 'audioReady' si usamos 'canplaythrough' directamente
  // o si confiamos en que 'preload="auto"' funcionará.

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Auto continuar si corresponde
    const endHandler = () => {
      if (autoContinue) onFinish();
    };

    audio.addEventListener("ended", endHandler);

    // **Importante:** Cada vez que el componente se monta,
    // su estado 'needsUserAction' es true, lo que muestra el botón.

    return () => {
      audio.removeEventListener("ended", endHandler);
    };
    // No dependemos de audioSrc aquí porque si cambia,
    // el componente se desmonta y se monta con la 'key'
  }, []);

  async function startAudio() {
    const audio = audioRef.current;
    if (!audio) return;

    setError(null);

    if (!audioRef.current.readyState >= 3) {
      // readyState >= 3 significa loading o cargado
      console.log("Audio no cargado, reintentando...");
      setTimeout(() => startAudio(), 100);
      return;
    }

    try {
      // Intentamos reproducir
      await audio.play();
      setNeedsUserAction(false);
    } catch (err) {
      const errorMessage = `❌ Fallo al reproducir: ${err.name} - ${err.message}`;
      console.error(errorMessage, err);

      // Muestra el error en la interfaz
      setError(errorMessage);
    }
  }

  function handleContinue() {
    if (!autoContinue) onFinish();
  }

  return (
    <div className="narrador-overlay">
      <div className="narrador-box">
        {/* Usar una key para la imagen puede ayudar si la imagen también cambia */}
        <img src={tioImg} className="tio-animado" alt="Narrador" />

        {texto && <p className="narrador-texto">{texto}</p>}
        {error && <p className="narrador-error">{error}</p>}

        {/* El audio necesita ser cargado con la nueva src cada vez */}
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
