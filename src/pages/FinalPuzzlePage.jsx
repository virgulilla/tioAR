import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";
import * as Tone from "tone";
import "./FinalPuzzlePage.css";

const PALABRA_FINAL = "HUERTO";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

// 🔔✨ Sonido navideño con campanillas
function playChristmasWin() {
  const synth = new Tone.Synth({
    oscillator: { type: "sine" },
    envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.3 },
  }).toDestination();

  const reverb = new Tone.Reverb({ decay: 2, wet: 0.5 }).toDestination();
  synth.connect(reverb);

  // Pequeña melodía mágica
  synth.triggerAttackRelease("G5", "8n"); // Campanilla 1
  setTimeout(() => synth.triggerAttackRelease("B5", "8n"), 180); // Campanilla 2
  setTimeout(() => synth.triggerAttackRelease("D6", "8n"), 360); // Campanilla 3
}

export default function FinalPuzzlePage() {
  const navigate = useNavigate();

  const initialLetters = ["R", "U", "T", "E", "H", "O"];

  const [puzzleState, setPuzzleState] = useState(
    initialLetters.map((letter, i) => ({
      id: `item-${i}`,
      content: letter,
    }))
  );

  const [isSolved, setIsSolved] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const currentWord = puzzleState.map((l) => l.content).join("");

    if (currentWord === PALABRA_FINAL && !isSolved) {
      setIsSolved(true);

      // 🔔 Sonido navideño
      playChristmasWin();

      // 🌫️ Fade out suave
      setTimeout(() => {
        setFadeOut(true);
      }, 300);

      // ⏭️ Pasar a la pantalla final
      setTimeout(() => {
        navigate("/final-tio");
      }, 1300);
    }
  }, [puzzleState, isSolved, navigate]);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = reorder(
      puzzleState,
      result.source.index,
      result.destination.index
    );

    setPuzzleState(items);
  };

  return (
    <div className={`final-container ${fadeOut ? "fade-out" : ""}`}>
      <h1>¡Último Pasito!</h1>
      <p className="puzzle-instruction">
        Ordenad las letras para descubrir la palabra secreta…
      </p>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="letras" direction="horizontal">
          {(provided) => (
            <div
              className="letters-stage interactive-stage"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {puzzleState.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <span
                      className={`puzzle-letter ${
                        isSolved ? "solved-letter" : ""
                      }`}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {item.content}
                    </span>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {isSolved && <p className="success-message">¡Lo habéis conseguido!</p>}
    </div>
  );
}
