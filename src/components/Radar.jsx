import { useEffect, useRef, useState, useCallback } from "react";
import * as Tone from "tone";
import "./Radar.css"; // 🎨 Importación del CSS restaurada

// ⚠️ Se reincorporan las importaciones de recursos. Asume que existen en tu proyecto.
import arrowImg from "../assets/flecha.png";
import beepSound from "../assets/sounds/beep.mp3";

// Definición de las constantes
const MAX_DISTANCE = 1000;
const ARRIVAL_THRESHOLD = 5; // Distancia en metros para considerar llegada
const QUALITATIVE_DISTANCE_THRESHOLD = 200;
const MIN_BEEP_INTERVAL = 500;
const MAX_BEEP_INTERVAL = 8000;

// Configuración de audio (Tone.js) para feedback de error
const wrongDirectionSynth = new Tone.NoiseSynth({
  noise: { type: "white" },
  envelope: { attack: 0.005, decay: 0.1, sustain: 0, release: 0.1 },
}).toDestination();

const playWrongDirection = () => {
  Tone.start();
  wrongDirectionSynth.triggerAttackRelease("8n");
};

export default function Radar({
  distance,
  bearing,
  heading,
  interval = MAX_BEEP_INTERVAL,
  nav,
  next,
}) {
  const beepRef = useRef(null); // Usado para el beepSound importado
  const [canPlay, setCanPlay] = useState(false);
  const lastDistanceRef = useRef(distance);
  const [isMovingAway, setIsMovingAway] = useState(false);
  const intervalRef = useRef(null);

  // 1. Proximidad: 0 (lejos) a 1 (cerca). Se usa para CSS.
  const proximity = 1 - Math.min(1, distance / MAX_DISTANCE);

  // 2. Desbloqueo de Audio
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

  // Función para manejar el loop de beep dinámico
  const startDynamicBeep = useCallback(
    (currentDistance, isAway) => {
      if (!canPlay || isAway || !beepRef.current) return;

      // Calcula el intervalo dinámico basado en la proximidad
      const normalizedDistance = Math.min(1, currentDistance / MAX_DISTANCE);
      const dynamicInterval =
        MIN_BEEP_INTERVAL + (interval - MIN_BEEP_INTERVAL) * normalizedDistance;
      const finalInterval = Math.max(MIN_BEEP_INTERVAL, dynamicInterval);

      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        const audio = beepRef.current;
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }, finalInterval);
    },
    [canPlay, interval]
  );

  // 3. ⏱️ Lógica principal: Detección de alejamiento, beep dinámico y manejo de llegada
  useEffect(() => {
    // 5. Lógica de Llegada
    if (distance <= ARRIVAL_THRESHOLD && nav && next?.id) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      nav(`/pista/${next.id}`);
      return;
    }

    // 4. Lógica de Feedback de Alejamiento
    const currentDistance = distance;
    const previousDistance = lastDistanceRef.current;

    const currentlyMovingAway = currentDistance > previousDistance + 1;
    setIsMovingAway(currentlyMovingAway);

    if (currentlyMovingAway) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      playWrongDirection();
    } else {
      startDynamicBeep(currentDistance, currentlyMovingAway);
    }

    lastDistanceRef.current = currentDistance;

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [distance, nav, next, startDynamicBeep]);

  // Cálculo de la rotación
  const rotation = heading == null ? 0 : bearing - heading;

  // Mensaje de distancia para niños (cualitativo/numérico)
  const displayDistance = () => {
    if (distance < ARRIVAL_THRESHOLD) {
      return "¡Llegaste!";
    } else if (distance < QUALITATIVE_DISTANCE_THRESHOLD) {
      return `${distance.toFixed(0)} m`;
    } else if (distance <= MAX_DISTANCE) {
      return "¡Cerca!";
    } else {
      return "¡Lejos!";
    }
  };

  return (
    <div className="radar-wrapper">
      <div className="radar-container" style={{ "--proximity": proximity }}>
        <div className="radar-halo"></div>

        {/* Flecha restaurada a la importación original */}
        <img
          src={arrowImg}
          alt="flecha"
          className={`radar-arrow ${isMovingAway ? "flicker-red" : ""}`}
          style={{
            transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          }}
        />

        {/* Sonido restaurado a la importación original */}
        <audio ref={beepRef} src={beepSound} preload="auto" />
      </div>

      {/* Distancia destacada con parpadeo si se aleja */}
      <div className={`radar-distance ${isMovingAway ? "is-away" : ""}`}>
        {displayDistance()}
      </div>
    </div>
  );
}
