import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLetras } from "../context/LetrasContext";
import { usePistas } from "../context/PistasContext";
import GameVictory from "../components/GameVictory"; // 💡 IMPORTAR
import "./GameQuiz.css";

const questions = [
  {
    q: "¿De qué color es el sol?",
    a: ["Azul", "Amarillo", "Verde"],
    correct: 1,
  },
  {
    q: "¿Cuántas patas tiene un perro?",
    a: ["4", "2", "8"],
    correct: 0,
  },
  {
    q: "¿Dónde vive un pez?",
    a: ["En el agua", "En el árbol", "En una cama"],
    correct: 0,
  },
];

export default function GameQuiz({ letra = "O" }) {
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showVictory, setShowVictory] = useState(false); // 💡 NUEVO ESTADO

  const { addLetra } = useLetras();
  const { nextPista } = usePistas();
  const nav = useNavigate();

  // 💡 FUNCIÓN DE CONTINUACIÓN
  function handleVictoryContinue() {
    addLetra(letra);
    nextPista();
    nav("/"); // Navegar al mapa/siguiente pista
  }

  function answer(i) {
    // Si la respuesta es correcta
    if (i === questions[step].correct) {
      // Si es la última pregunta
      if (step === questions.length - 1) {
        setFinished(true); // 💡 CAMBIAR: En lugar de navegar, mostramos la victoria

        setTimeout(() => {
          setShowVictory(true);
        }, 800);
      } else {
        // Si no es la última, avanzar a la siguiente pregunta
        setStep(step + 1);
      }
    } // Nota: Si la respuesta es incorrecta, la lógica actual no hace nada,
    // lo cual generalmente está bien en un juego simple.
  }

  // 💡 RENDERIZADO CONDICIONAL DE LA PANTALLA DE VICTORIA
  if (showVictory) {
    return <GameVictory letra={letra} onContinue={handleVictoryContinue} />;
  }

  return (
    <div className="quiz-container">
      <h1>Quiz mágico</h1> <h2>{questions[step].q}</h2>
      <div className="quiz-options">
        {questions[step].a.map((ans, i) => (
          <button key={i} className="quiz-btn" onClick={() => answer(i)}>
            {ans}
          </button>
        ))}
      </div>
    </div>
  );
}
