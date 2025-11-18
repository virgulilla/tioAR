import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLetras } from "../context/LetrasContext";
import { usePistas } from "../context/PistasContext";
import "./GameMemory.css";

const EMOJIS = ["🍎", "🐻", "🌞", "🍓"];

export default function GameMemory({ letra = "R" }) {
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);
  const [finished, setFinished] = useState(false);

  const nav = useNavigate();
  const { addLetra } = useLetras();
  const { nextPista } = usePistas();

  useEffect(() => {
    // Duplicar y mezclar cartas
    const duplicated = [...EMOJIS, ...EMOJIS].map((emoji, index) => ({
      id: index,
      emoji,
    }));
    setCards(duplicated.sort(() => Math.random() - 0.5));
  }, []);

  function handleSelect(card) {
    if (
      selected.length === 2 ||
      selected.includes(card.id) ||
      matched.includes(card.id)
    )
      return;

    const newSelected = [...selected, card.id];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      const c1 = cards.find((c) => c.id === first);
      const c2 = cards.find((c) => c.id === second);

      if (c1.emoji === c2.emoji) {
        setMatched([...matched, first, second]);
      }

      setTimeout(() => setSelected([]), 700);
    }
  }

  // Cuando termina el juego
  useEffect(() => {
    if (cards.length > 0 && matched.length === cards.length) {
      setFinished(true);

      setTimeout(() => {
        addLetra(letra); // añade la letra globalmente
        nextPista();
        nav("/"); // vuelve al radar automáticamente
      }, 1000);
    }
  }, [matched]);

  return (
    <div className="memory-container">
      <h1>Memory mágico</h1>
      <p>¡Encuentra las parejas para ir a la siguiente pista!</p>

      <div className="memory-grid">
        {cards.map((card) => {
          const isVisible =
            selected.includes(card.id) || matched.includes(card.id);

          return (
            <div
              key={card.id}
              className={`memory-card ${isVisible ? "visible" : ""}`}
              onClick={() => handleSelect(card)}
            >
              {isVisible ? card.emoji : "❓"}
            </div>
          );
        })}
      </div>

      {finished && (
        <div className="memory-finished">
          ¡Muy bien! Has ganado la letra <strong>{letra}</strong> 🎉
        </div>
      )}
    </div>
  );
}
