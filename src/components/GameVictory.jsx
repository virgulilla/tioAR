import { useEffect, useRef } from "react";
import "./GameVictory.css"; // Crear este archivo CSS

import victorySound from "../assets/sounds/victory.mp3"; // <-- ¡DEBES CREAR ESTE ARCHIVO DE AUDIO!

export default function GameVictory({ letra, onContinue }) {
  const audioRef = useRef(null);

  // Reproducir audio y manejar la navegación
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      // Intentar reproducir automáticamente
      audio.play().catch(() => {
        // Fallback si la reproducción automática falla (ej. en móviles)
        console.warn("No se pudo reproducir audio automáticamente.");
      });
    }

    // Navegar después de 3 segundos (para ver la animación/escuchar el audio)
    const timer = setTimeout(() => {
      onContinue();
    }, 7000); // 3 segundos para el efecto

    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <div className="victory-overlay">
      {" "}
      {/* Este div será el contenedor de la nieve */}
      <div className="victory-content">
        <h1>¡Has ganado!</h1>
        <p className="victory-message">
          ¡Felicidades! Has completado el desafío.
        </p>
        <div className="winning-letter-box">
          <span className="winning-letter-reveal">{letra}</span>
        </div>
        <audio ref={audioRef} src={victorySound} preload="auto" />
      </div>
    </div>
  );
}
