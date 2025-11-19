import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLetras } from "../context/LetrasContext";
import { usePistas } from "../context/PistasContext";
import GameVictory from "../components/GameVictory";
import * as Tone from "tone";
import "./GameFind.css"; // 🎨 Restaurada la importación del CSS

import bg from "../assets/find/bg.png"; // 🖼️ Restaurada la importación de tu imagen local

// Configuración de audio (Tone.js)
const foundSynth = new Tone.MembraneSynth({
  pitchDecay: 0.05,
  octaves: 2,
  envelope: {
    attack: 0.001,
    decay: 0.3,
    sustain: 0.0,
    release: 0.1,
  },
}).toDestination();

const playFound = () => {
  Tone.start();
  foundSynth.triggerAttackRelease("G4", "8n");
};

// 🎁 ELEMENTOS NAVIDEÑOS A ENCONTRAR (Hotspots con posiciones)
const CHRISTMAS_ITEMS = [
  {
    id: 1,
    icon: "🎁",
    style: { left: "30%", top: "75%", zIndex: 2 },
    found: false,
  },
  {
    id: 2,
    icon: "🔔",
    style: { left: "78%", top: "50%", zIndex: 1 },
    found: false,
  },
  {
    id: 3,
    icon: "🎄",
    style: { left: "15%", top: "20%", zIndex: 3 },
    found: false,
  },
];

export default function GameFind({ letra = "E" }) {
  const [foundItems, setFoundItems] = useState(
    CHRISTMAS_ITEMS.map((item) => ({ ...item, found: false, animating: false }))
  );
  const [showVictory, setShowVictory] = useState(false);
  const [isClickBlocked, setIsClickBlocked] = useState(false);
  const navigate = useNavigate();

  const { addLetra } = useLetras();
  const { nextPista } = usePistas();

  useEffect(() => {
    Tone.start();
  }, []);

  // Comprobar si todos los ítems han sido encontrados
  useEffect(() => {
    if (foundItems.every((item) => item.found) && foundItems.length > 0) {
      setTimeout(() => {
        setShowVictory(true);
      }, 1000);
    }
  }, [foundItems]);

  function handleItemClick(id) {
    if (isClickBlocked) return;

    const itemToFind = foundItems.find((item) => item.id === id);
    if (itemToFind.found || itemToFind.animating) {
      return;
    }

    playFound();

    setIsClickBlocked(true);

    setFoundItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id && !item.found) {
          return { ...item, animating: true };
        }
        return item;
      })
    );

    setTimeout(() => {
      setFoundItems((prevItems) =>
        prevItems.map((item) => {
          if (item.id === id && item.animating) {
            return { ...item, found: true, animating: false };
          }
          return item;
        })
      );
      setIsClickBlocked(false);
    }, 800);
  }

  function handleVictoryContinue() {
    addLetra(letra);
    nextPista();
    navigate("/");
  }

  if (showVictory) {
    return <GameVictory letra={letra} onContinue={handleVictoryContinue} />;
  }

  return (
    <div className="find-container">
      <h1>¡Encuentra los objetos navideños!</h1>
      <p>Toca los 3 secretos escondidos.</p>
      <div className="find-area">
        {/* 🖼️ Usando la importación de bg.png */}
        <img
          src={bg}
          className="find-bg-img"
          alt="Fondo de búsqueda navideño"
        />
        {foundItems.map(
          (item) =>
            (!item.found || item.animating) && (
              <button
                key={item.id}
                className={`find-item ${item.animating ? "animate-found" : ""}`}
                style={item.style}
                onClick={() => handleItemClick(item.id)}
                disabled={isClickBlocked}
              >
                {item.icon}
              </button>
            )
        )}
      </div>
    </div>
  );
}
