import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLetras } from "../context/LetrasContext";
import { usePistas } from "../context/PistasContext";
import "./GamePuzzle.css";
import p1 from "../assets/puzzle/p1.png";
import p2 from "../assets/puzzle/p2.png";
import p3 from "../assets/puzzle/p3.png";
import p4 from "../assets/puzzle/p4.png";

const PUZZLE_IMAGES = { 0: p1, 1: p2, 2: p3, 3: p4 };

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function GamePuzzle({ letra = "T" }) {
  const nav = useNavigate();
  const { addLetra } = useLetras();
  const { nextPista } = usePistas();

  // order[index] = pieceId que está en esa casilla (ej: [2,0,3,1])
  const [order, setOrder] = useState([]);
  // para fallback en móvil (tap to swap)
  const [selectedSlot, setSelectedSlot] = useState(null);
  // un flag para bloquear mientras comprobamos victoria
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const initial = shuffle([0, 1, 2, 3]);
    setOrder(initial);
    console.log("Puzzle inicial:", initial);
  }, []);

  // Drag handlers (desktop)
  function handleDragStart(e, pieceId, fromIndex) {
    // Guardamos el pieceId y fromIndex en dataTransfer
    e.dataTransfer.setData("text/plain", String(pieceId));
    e.dataTransfer.setData("fromIndex", String(fromIndex));
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e) {
    e.preventDefault(); // necesario para permitir drop
    e.dataTransfer.dropEffect = "move";
  }

  function handleDrop(e, toIndex) {
    e.preventDefault();
    if (blocked) return;
    const text = e.dataTransfer.getData("text/plain");
    const fromIndexStr = e.dataTransfer.getData("fromIndex");
    if (!text || !fromIndexStr) {
      return;
    }
    const pieceId = Number(text);
    const fromIndex = Number(fromIndexStr);

    console.log(
      "drop piece",
      pieceId,
      "fromIndex",
      fromIndex,
      "toIndex",
      toIndex
    );

    // Intercambiar: poner pieceId en toIndex, y pieza que estaba en toIndex a fromIndex
    setOrder((prev) => {
      const next = prev.slice();
      const pieceAtTo = next[toIndex];
      next[toIndex] = pieceId;
      next[fromIndex] = pieceAtTo;
      return next;
    });
  }

  // Fallback móvil: tap para seleccionar y tap para intercambiar
  function handleSlotClick(index) {
    if (blocked) return;
    if (selectedSlot === null) {
      setSelectedSlot(index);
      return;
    }
    if (selectedSlot === index) {
      setSelectedSlot(null);
      return;
    }
    // swap selectedSlot <-> index
    setOrder((prev) => {
      const next = prev.slice();
      const a = next[selectedSlot];
      next[selectedSlot] = next[index];
      next[index] = a;
      return next;
    });
    setSelectedSlot(null);
  }

  // Comprobar victoria
  useEffect(() => {
    if (order.length === 4) {
      const isCorrect =
        order[0] === 0 && order[1] === 1 && order[2] === 2 && order[3] === 3;
      if (isCorrect) {
        setBlocked(true);
        setTimeout(() => {
          addLetra(letra);
          nextPista();
          nav("/");
        }, 900);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  return (
    <div className="puzzle-container">
      <h1>¡Monta el puzzle!</h1>
      <p>Toca o arrastra las piezas hasta que formen la imagen.</p>

      <div className="puzzle-grid" role="grid">
        {order.map((pieceId, index) => {
          const src = PUZZLE_IMAGES[pieceId];
          const isSelected = selectedSlot === index;
          return (
            <div
              key={index}
              className={`puzzle-slot ${isSelected ? "selected" : ""}`}
              onDrop={(e) => handleDrop(e, index)}
              onDragOver={handleDragOver}
              onClick={() => handleSlotClick(index)}
            >
              <img
                draggable={true}
                onDragStart={(e) => handleDragStart(e, pieceId, index)}
                src={src}
                alt={`pieza ${pieceId}`}
                className="puzzle-piece"
                // evitar que el img actúe como ghost en algunos browsers:
                onDragEnd={() => console.log("dragend")}
              />
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 18 }}>
        <button
          className="puzzle-reset"
          onClick={() => {
            setOrder(shuffle([0, 1, 2, 3]));
            setSelectedSlot(null);
            setBlocked(false);
          }}
        >
          🔁 Reiniciar puzzle
        </button>
      </div>
    </div>
  );
}
