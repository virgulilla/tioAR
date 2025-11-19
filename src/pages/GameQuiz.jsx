import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLetras } from "../context/LetrasContext.jsx"; // Extensión añadida
import { usePistas } from "../context/PistasContext.jsx"; // Extensión añadida
import GameVictory from "../components/GameVictory.jsx"; // Extensión añadida
import * as Tone from "tone";
import "./GameQuiz.css";

// -------------------------------------------------------------------
// PREGUNTAS ACTUALIZADAS: Tema Navidad y Tió de Nadal (5-8 años)
// -------------------------------------------------------------------
const questions = [
  {
    q: "¿Qué se le debe poner al Tió debajo de la manta para que cague regalos?",
    a: ["Piedras", "Comida", "Juguetes"],
    correct: 1, // Comida
  },
  {
    q: "¿Qué tira de un trineo mágico para repartir regalos en Nochebuena?",
    a: ["Caballos", "Perros", "Renos"],
    correct: 2, // Renos
  },
  {
    q: "¿Qué objeto usamos para 'golpear' al Tió mientras cantamos?",
    a: ["Un martillo", "Un palo", "Una cuchara"],
    correct: 1, // Un palo
  },
  {
    q: "¿De qué color principal es la nariz de Rodolfo, el reno más famoso?",
    a: ["Azul", "Verde", "Roja"],
    correct: 2, // Roja
  },
  {
    q: "¿Qué parte del Tió de Nadal se cubre con una manta para que no tenga frío?",
    a: ["La cabeza", "El tronco", "El cuerpo entero"],
    correct: 2, // El cuerpo entero
  },
  {
    q: "¿En qué mes celebramos la Navidad?",
    a: ["Octubre", "Diciembre", "Enero"],
    correct: 1, // Diciembre
  },
];

// Configuración de audio (Tone.js)
const correctSynth = new Tone.MembraneSynth().toDestination();
const wrongSynth = new Tone.NoiseSynth({
  noise: { type: "white" },
  envelope: { attack: 0.005, decay: 0.1, sustain: 0, release: 0.1 },
}).toDestination();

const playCorrect = () => correctSynth.triggerAttackRelease("C5", "8n");
const playWrong = () => wrongSynth.triggerAttackRelease("8n");

export default function GameQuiz({ letra = "O" }) {
  const [step, setStep] = useState(0);
  const [feedback, setFeedback] = useState(null); // 'correct', 'incorrect', o null
  const [showVictory, setShowVictory] = useState(false);
  const [isClickBlocked, setIsClickBlocked] = useState(false); // Bloqueo de clics

  const { addLetra } = useLetras();
  const { nextPista } = usePistas();
  const nav = useNavigate();

  // Inicializar el contexto de audio de Tone.js en el primer render
  useEffect(() => {
    Tone.start();
  }, []); // 💡 FUNCIÓN DE CONTINUACIÓN

  function handleVictoryContinue() {
    addLetra(letra);
    nextPista();
    nav("/"); // Navegar al mapa/siguiente pista
  }

  function answer(i) {
    if (isClickBlocked) return; // Ignorar clic si está bloqueado

    setIsClickBlocked(true); // Bloquear clics inmediatamente
    const isCorrect = i === questions[step].correct;

    if (isCorrect) {
      playCorrect();
      setFeedback("correct"); // Si es la última pregunta

      if (step === questions.length - 1) {
        // Mostrar victoria después del feedback de acierto
        setTimeout(() => {
          setFeedback(null); // Limpiar feedback antes de la victoria
          setShowVictory(true);
        }, 1200);
      } else {
        // Avanzar a la siguiente pregunta después del feedback
        setTimeout(() => {
          setFeedback(null);
          setStep(step + 1);
          setIsClickBlocked(false); // Desbloquear clics
        }, 1200);
      }
    } else {
      playWrong();
      setFeedback("incorrect");

      // El usuario se queda en la misma pregunta, pero damos feedback
      setTimeout(() => {
        setFeedback(null);
        setIsClickBlocked(false); // Desbloquear clics para reintentar
      }, 1200);
    }
  } // 💡 RENDERIZADO CONDICIONAL DE LA PANTALLA DE VICTORIA

  if (showVictory) {
    return <GameVictory letra={letra} onContinue={handleVictoryContinue} />;
  }

  // Clase base del contenedor + clase de feedback
  const containerClass = `quiz-container ${
    feedback ? feedback + "-answer" : ""
  }`;

  return (
    <div className={containerClass}>
      <h1>Quiz mágico del Tió</h1>
      <p className="quiz-progress">
        Pregunta {step + 1} de {questions.length}
      </p>
      <h2>{questions[step].q}</h2>
      <div className="quiz-options">
        {questions[step].a.map((ans, i) => (
          <button
            key={i}
            className="quiz-btn"
            onClick={() => answer(i)}
            disabled={isClickBlocked} // Deshabilitar mientras hay feedback
          >
            {ans}
          </button>
        ))}
      </div>
      {/* Mostrar feedback visual */}
      {feedback === "correct" && (
        <div className="feedback-message correct">
          🎉 ¡Correcto! ¡Siguiente!
        </div>
      )}
      {feedback === "incorrect" && (
        <div className="feedback-message incorrect">
          ❌ ¡Oh no! Inténtalo de nuevo.
        </div>
      )}
    </div>
  );
}
