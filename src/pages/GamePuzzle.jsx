import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLetras } from "../context/LetrasContext";
import { usePistas } from "../context/PistasContext";
import GameVictory from "../components/GameVictory"; // 💡 IMPORTAR
import "./GamePuzzle.css";

// --- IMPORTACIONES DE IMAGEN AJUSTADAS para 8 piezas (0 a 7) ---
// NOTA: Asegúrate de que las imágenes p1a.png a p4b.png existan en la ruta.
import p0 from "../assets/puzzle/0_0.png"; // Fila 0, Columna 0
import p1 from "../assets/puzzle/0_1.png"; // Fila 0, Columna 1
import p2 from "../assets/puzzle/0_2.png"; // Fila 0, Columna 2
import p3 from "../assets/puzzle/0_3.png"; // Fila 0, Columna 3
import p4 from "../assets/puzzle/1_0.png"; // Fila 1, Columna 0
import p5 from "../assets/puzzle/1_1.png"; // Fila 1, Columna 1
import p6 from "../assets/puzzle/1_2.png"; // Fila 1, Columna 2
import p7 from "../assets/puzzle/1_3.png"; // Fila 1, Columna 3

// Mapeo de 8 piezas
const PUZZLE_IMAGES = {
  0: p0,
  1: p1,
  2: p2,
  3: p3,
  4: p4,
  5: p5,
  6: p6,
  7: p7,
};

// Número total de piezas
const NUM_PIECES = 8;

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

  const [order, setOrder] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [blocked, setBlocked] = useState(false);
  const [showVictory, setShowVictory] = useState(false);

  useEffect(() => {
    // Inicializar con un array de 8 piezas desordenadas: [0, 1, ..., 7]
    const initial = shuffle(Array.from({ length: NUM_PIECES }, (_, i) => i));
    setOrder(initial);
    console.log("Puzzle inicial:", initial);
  }, []); // Drag handlers (desktop)

  function handleDragStart(e, pieceId, fromIndex) {
    e.dataTransfer.setData("text/plain", String(pieceId));
    e.dataTransfer.setData("fromIndex", String(fromIndex));
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e) {
    e.preventDefault();
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

    setOrder((prev) => {
      const next = prev.slice();
      const pieceAtTo = next[toIndex];
      next[toIndex] = pieceId;
      next[fromIndex] = pieceAtTo;
      return next;
    });
  } // Fallback móvil: tap para seleccionar y tap para intercambiar

  function handleSlotClick(index) {
    if (blocked) return;
    if (selectedSlot === null) {
      setSelectedSlot(index);
      return;
    }
    if (selectedSlot === index) {
      setSelectedSlot(null);
      return;
    } // swap selectedSlot <-> index
    setOrder((prev) => {
      const next = prev.slice();
      const a = next[selectedSlot];
      next[selectedSlot] = next[index];
      next[index] = a;
      return next;
    });
    setSelectedSlot(null);
  } // Comprobar victoria

  useEffect(() => {
    if (order.length === NUM_PIECES) {
      // Comprobar si order es igual a [0, 1, 2, 3, 4, 5, 6, 7]
      const isCorrect = order.every((pieceId, index) => pieceId === index);

      if (isCorrect) {
        setBlocked(true);
        setTimeout(() => {
          setShowVictory(true);
        }, 900); // 900ms para que se asiente la imagen
      }
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]); // FUNCIÓN DE CONTINUACIÓN

  function handleVictoryContinue() {
    addLetra(letra);
    nextPista();
    nav("/"); // Volver al mapa/siguiente pista
  } // RENDERIZADO CONDICIONAL

  if (showVictory) {
    return <GameVictory letra={letra} onContinue={handleVictoryContinue} />;
  }

  return (
    <div className="puzzle-container">
            <h1>¡Monta el puzzle!</h1>     {" "}
      <p>Toca o arrastra las piezas hasta que formen la imagen.</p>     {" "}
      <div className="puzzle-grid" role="grid">
               {" "}
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
                           {" "}
              <img
                draggable={true}
                onDragStart={(e) => handleDragStart(e, pieceId, index)}
                src={src}
                alt={`pieza ${pieceId}`}
                className="puzzle-piece"
                onDragEnd={() => console.log("dragend")}
              />
                         {" "}
            </div>
          );
        })}
             {" "}
      </div>
           {" "}
      <div style={{ marginTop: 18 }}>
               {" "}
        <button
          className="puzzle-reset"
          onClick={() => {
            setOrder(shuffle(Array.from({ length: NUM_PIECES }, (_, i) => i)));
            setSelectedSlot(null);
            setBlocked(false);
          }}
        >
                    🔁 Reiniciar puzzle        {" "}
        </button>
             {" "}
      </div>
         {" "}
    </div>
  );
}
