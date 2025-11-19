import { useEffect, useRef, useState } from "react";
import "./Narrador.css";
// ⚠️ Importamos las tres imágenes para el Tió
import tioIdleImg from "../assets/tio/tio_idle.png";
import tioBlinkingImg from "../assets/tio/tio_blinking.png";
import tioTalkingImg from "../assets/tio/tio_talking.png";

// Constantes para controlar la frecuencia del parpadeo automático (en milisegundos)
const BLINK_INTERVAL = 4000; // Parpadear cada 3 segundos en promedio (cuando está IDLE)
const IDLE_BLINK_DURATION = 200; // Duración del parpadeo (rápido)
// 💡 NUEVO: Frecuencia de alternancia para simular el habla (cada 150ms)
const TALK_ANIMATION_INTERVAL = 200;

export default function Narrador({
  audioSrc,
  texto = "",
  onFinish = () => {},
  autoContinue = false,
}) {
  const audioRef = useRef(null);
  const [needsUserAction, setNeedsUserAction] = useState(true);
  const [error, setError] = useState(null);

  // ESTADOS
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [resetCycle, setResetCycle] = useState(0);

  // 💡 ESTADO MODIFICADO: Ahora es un índice (0, 1, 2)
  const [talkFrameIndex, setTalkFrameIndex] = useState(0);

  // --- Lógica de la Animación Concurrente (Parpadeo Lento + Animación de Habla) ---
  useEffect(() => {
    let blinkTimer;
    let idleTimer;
    let talkTimer;

    if (isPlayingAudio) {
      // 1. ANIMACIÓN DE HABLA (Ciclo rápido entre las 3 imágenes)
      talkTimer = setInterval(() => {
        // 💡 Ciclar el índice: 0 -> 1 -> 2 -> 0 -> ...
        setTalkFrameIndex((prevIndex) => (prevIndex + 1) % 3);
      }, TALK_ANIMATION_INTERVAL);

      // Asegurarse de que el parpadeo normal está apagado
      setIsBlinking(false);
    } else {
      // 2. ANIMACIÓN DE REPOSO (Parpadeo Lento e Irregular)
      setTalkFrameIndex(0); // Asegurar que el índice de habla se restablece

      const startIdleBlinking = () => {
        idleTimer = setTimeout(() => {
          setIsBlinking(true);
          blinkTimer = setTimeout(() => {
            setIsBlinking(false);
            setResetCycle((prev) => prev + 1);
          }, IDLE_BLINK_DURATION);
        }, Math.random() * BLINK_INTERVAL + 1000);
      };

      startIdleBlinking();
    }

    // Cleanup: Limpiar los timers
    return () => {
      clearTimeout(blinkTimer);
      clearTimeout(idleTimer);
      clearInterval(talkTimer);
    };
  }, [isPlayingAudio, resetCycle]);

  // --- Lógica de Eventos del Audio (Controla isPlayingAudio) ---
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Dispara la animación cuando el audio realmente COMIENZA a sonar
    const handlePlaying = () => {
      setIsPlayingAudio(true);
      // Comenzamos el ciclo de habla en un frame (e.g., boca abierta)
      setTalkFrameIndex(1);
      setIsBlinking(false);
    };

    const resetPlayingState = () => {
      setIsPlayingAudio(false);
      setResetCycle((prev) => prev + 1);
      setTalkFrameIndex(0); // Restablecer índice al terminar
    };

    const endHandler = () => {
      resetPlayingState();
      if (autoContinue) onFinish();
    };

    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("ended", endHandler);
    audio.addEventListener("pause", resetPlayingState);
    audio.addEventListener("error", resetPlayingState);

    return () => {
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("ended", endHandler);
      audio.removeEventListener("pause", resetPlayingState);
      audio.removeEventListener("error", resetPlayingState);
    };
  }, [autoContinue, onFinish]);

  async function startAudio() {
    const audio = audioRef.current;
    if (!audio) return;

    setError(null);

    if (audio.readyState < 3) {
      console.log("Audio no cargado, reintentando...");
      setTimeout(() => startAudio(), 100);
      return;
    }

    try {
      await audio.play();
      setNeedsUserAction(false);
    } catch (err) {
      const errorMessage = `❌ Fallo al reproducir: ${err.name} - ${err.message}`;
      console.error(errorMessage, err);
      setError(errorMessage);
    }
  }

  function handleContinue() {
    if (!autoContinue) onFinish();
  }

  // --- Lógica para seleccionar la Imagen (MODIFICADA) ---
  const currentTioImage = (() => {
    if (isPlayingAudio) {
      // 💡 Asignar imagen basada en el índice de habla:
      switch (talkFrameIndex) {
        case 0:
          return tioIdleImg; // Imagen 1
        case 1:
          return tioTalkingImg; // Imagen 2 (Boca abierta)
        case 2:
          return tioBlinkingImg; // Imagen 3 (Boca cerrada/parpadeo)
        default:
          return tioIdleImg;
      }
    }
    // Estado por defecto (IDLE)
    return tioIdleImg;
  })();

  return (
    <div className="narrador-overlay">
      <div className="narrador-box">
        <img
          src={currentTioImage}
          // Usamos isPlayingAudio (o si quieres el movimiento, isPlayingAudio && (talkFrameIndex === 1)) para la clase CSS de animación de movimiento
          className={`tio-animado ${isPlayingAudio ? "is-talking" : ""} ${
            isBlinking ? "is-blinking" : ""
          } ${!isPlayingAudio && !isBlinking ? "is-idle" : ""}`}
          alt="Narrador"
        />

        {texto && <p className="narrador-texto">{texto}</p>}
        {error && <p className="narrador-error">{error}</p>}

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
