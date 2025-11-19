import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLetras } from "../context/LetrasContext";
import { usePistas } from "../context/PistasContext";
import "./GameMemory.css";
import GameVictory from "../components/GameVictory";

import matchSound from "../assets/sounds/match.mp3";

const EMOJIS = ["🍎", "🐻", "🌞", "🍓"];

export default function GameMemory({ letra = "R" }) {
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);
  const [finished, setFinished] = useState(false);
  const [showVictory, setShowVictory] = useState(false);

  const nav = useNavigate();
  const { addLetra } = useLetras();
  const { nextPista } = usePistas();

  // Refs para audio
  const matchRef = useRef(null);

  // 🔊 Permitir audio después del primer toque (iOS/Android)
  const [canPlay, setCanPlay] = useState(false);

  useEffect(() => {
    const unlock = () => setCanPlay(true);
    window.addEventListener("click", unlock, { once: true });
    window.addEventListener("touchstart", unlock, { once: true });
    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("touchstart", unlock);
    };
  }, []);

  useEffect(() => {
    const duplicated = [...EMOJIS, ...EMOJIS].map((emoji, index) => ({
      id: index,
      emoji,
    }));
    setCards(duplicated.sort(() => Math.random() - 0.5));
  }, []);

  function playSound(ref) {
    if (!canPlay || !ref.current) return;
    const audio = ref.current;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }

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

        // 🔊 sonido de pareja encontrada
        playSound(matchRef);
      }

      setTimeout(() => setSelected([]), 700);
    }
  }

  // Cuando termina el juego
  useEffect(() => {
    if (cards.length > 0 && matched.length === cards.length) {
      setFinished(true);

      setTimeout(() => {
        setShowVictory(true); // <-- Mostrar la pantalla de victoria
      }, 800);
    }
  }, [matched, cards.length]);

  function handleVictoryContinue() {
    addLetra(letra);
    nextPista();
    nav("/");
  }

  if (showVictory) {
    return <GameVictory letra={letra} onContinue={handleVictoryContinue} />;
  }

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

      {/* Audios */}
      <audio ref={matchRef} src={matchSound} preload="auto" />
    </div>
  );
}
