import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLetras } from "../context/LetrasContext";
import { usePistas } from "../context/PistasContext";
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

  const { addLetra } = useLetras();
  const { nextPista } = usePistas();
  const nav = useNavigate();

  function answer(i) {
    if (i === questions[step].correct) {
      if (step === questions.length - 1) {
        setFinished(true);

        setTimeout(() => {
          addLetra(letra);
          nextPista();
          nav("/");
        }, 1200);
      } else {
        setStep(step + 1);
      }
    }
  }

  return (
    <div className="quiz-container">
      <h1>Quiz mágico</h1>

      <h2>{questions[step].q}</h2>

      <div className="quiz-options">
        {questions[step].a.map((ans, i) => (
          <button key={i} className="quiz-btn" onClick={() => answer(i)}>
            {ans}
          </button>
        ))}
      </div>

      {finished && <div className="quiz-win">¡Muy bien! Letra {letra}</div>}
    </div>
  );
}
