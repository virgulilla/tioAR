import { useEffect, useRef, useState } from "react";
import arrowImg from "../assets/flecha.png";
import beepSound from "../assets/sounds/beep.mp3";
import "./Radar.css";

export default function Radar({ distance, bearing, heading, interval = 8000 }) {
  const beepRef = useRef(null);
  const [canPlay, setCanPlay] = useState(false);

  // Detectar si el usuario ya ha interactuado en algún punto de la app
  useEffect(() => {
    const handler = () => {
      setCanPlay(true);
      window.removeEventListener("click", handler);
      window.removeEventListener("touchstart", handler);
    };

    window.addEventListener("click", handler);
    window.addEventListener("touchstart", handler);

    return () => {
      window.removeEventListener("click", handler);
      window.removeEventListener("touchstart", handler);
    };
  }, []);

  // ⏱️ Reproducir beep cada X ms
  useEffect(() => {
    if (!canPlay) return; // No reproducir hasta que el usuario toque algo
    if (!beepRef.current) return;

    const intervalId = setInterval(() => {
      const audio = beepRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    }, interval);

    return () => clearInterval(intervalId);
  }, [canPlay, interval]);

  const rotation = heading == null ? 0 : bearing - heading;

  return (
    <div className="radar-container">
      <div className="radar-halo"></div>

      <img
        src={arrowImg}
        alt="flecha"
        style={{
          width: "90px",
          height: "90px",
          position: "absolute",
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          top: "50%",
          left: "50%",
          transition: "transform 0.15s linear",
          userSelect: "none",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "-40px",
          width: "100%",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "24px",
        }}
      >
        {distance.toFixed(0)} m
      </div>

      {/* Sonido */}
      <audio ref={beepRef} src={beepSound} preload="auto" />
    </div>
  );
}
