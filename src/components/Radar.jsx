import { useEffect, useRef, useState } from "react";
import arrowImg from "../assets/flecha.png";
import beepSound from "../assets/sounds/beep.mp3"; // Mantener por si se usa
import * as Tone from "tone"; // Importar Tone.js
import "./Radar.css";

// Definición de las constantes
const MAX_DISTANCE = 1000; // Distancia máxima para efectos visuales/auditivos (1 km)
const QUALITATIVE_DISTANCE_THRESHOLD = 200; // Por debajo de X metros, muestra numérico
const MIN_BEEP_INTERVAL = 500; // Intervalo mínimo de sonido (muy cerca, 0m).
const MAX_BEEP_INTERVAL = 8000; // Intervalo máximo de sonido (lejos).

// Configuración de audio (Tone.js) para feedback de error
const wrongDirectionSynth = new Tone.NoiseSynth({
  noise: { type: "white" },
  envelope: { attack: 0.005, decay: 0.1, sustain: 0, release: 0.1 },
}).toDestination();

const playWrongDirection = () => {
  Tone.start(); // Asegurarse de que el contexto de audio esté activo
  wrongDirectionSynth.triggerAttackRelease("8n");
};

export default function Radar({
  distance,
  bearing,
  heading,
  interval = MAX_BEEP_INTERVAL,
}) {
  const beepRef = useRef(null); // Ref para el sonido original
  const [canPlay, setCanPlay] = useState(false);
  const lastDistanceRef = useRef(distance); // Para detectar si se aleja
  const [isMovingAway, setIsMovingAway] = useState(false);

  // 1. Proximidad: 0 (lejos) a 1 (cerca). Se usa para CSS y Audio.
  const proximity = 1 - Math.min(1, distance / MAX_DISTANCE);

  // 2. Desbloqueo de Audio (Móvil/iOS)
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

  // 3. ⏱️ Reproducir beep con ritmo dinámico según la distancia
  //    Y detectar si se aleja para feedback de error
  useEffect(() => {
    if (!canPlay) return;

    // Comprobar si se está alejando
    const currentDistance = distance;
    const previousDistance = lastDistanceRef.current;

    if (currentDistance > previousDistance + 1) {
      // Pequeño umbral para evitar falsos positivos
      setIsMovingAway(true);
      playWrongDirection(); // Sonido de error
    } else {
      setIsMovingAway(false);
    }
    lastDistanceRef.current = currentDistance; // Actualizar la última distancia

    // Lógica del beep normal (más rápido cuanto más cerca)
    if (!beepRef.current) return;

    const normalizedDistance = Math.min(1, distance / MAX_DISTANCE);
    const dynamicInterval =
      MIN_BEEP_INTERVAL + (interval - MIN_BEEP_INTERVAL) * normalizedDistance;
    const finalInterval = Math.max(MIN_BEEP_INTERVAL, dynamicInterval);

    // Limpiar el intervalo anterior antes de crear uno nuevo
    let intervalId;
    if (!isMovingAway) {
      // Solo beep normal si no se está alejando
      intervalId = setInterval(() => {
        const audio = beepRef.current;
        if (audio) {
          audio.currentTime = 0;
          audio.play().catch(() => {});
        }
      }, finalInterval);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [canPlay, distance, interval, isMovingAway]);

  // Cálculo de la rotación
  const rotation = heading == null ? 0 : heading - bearing;

  // Mensaje de distancia para niños
  const displayDistance = () => {
    if (distance < QUALITATIVE_DISTANCE_THRESHOLD) {
      return `${distance.toFixed(0)} m`; // Muestra números exactos cerca
    } else if (distance <= MAX_DISTANCE) {
      return "¡Cerca!"; // Mensaje cualitativo
    } else {
      return "¡Lejos!"; // Mensaje cualitativo
    }
  };

  return (
    <div
      className="radar-wrapper"
      style={{ "--is-moving-away": isMovingAway ? 1 : 0 }}
    >
      <div className="radar-container" style={{ "--proximity": proximity }}>
        <div className="radar-halo"></div>

        <img
          src={arrowImg}
          alt="flecha"
          className={`radar-arrow ${isMovingAway ? "flicker-red" : ""}`}
          style={{
            transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          }}
        />

        {/* Sonido */}
        <audio ref={beepRef} src={beepSound} preload="auto" />
      </div>

      {/* 💡 Distancia destacada con texto cualitativo/numérico */}
      <div className="radar-distance">{displayDistance()}</div>
    </div>
  );
}
