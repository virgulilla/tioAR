import { useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./FinalPuzzlePage.css";
import finalAudio from "../assets/sounds/final.mp3";
// import Narrador from "./Narrador"; // Para la etapa final

// --- CONSTANTES Y ESTADOS ---
const STAGE_PUZZLE = 0;
const PALABRA_FINAL = "HUERTO";

// Función auxiliar para reordenar la lista (requerida por dnd)
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export default function FinalPuzzlePage() {
  const palabraFinal = PALABRA_FINAL;
  const initialLetters = ["R", "U", "T", "E", "H", "O"]; // Desordenadas

  const [currentStage, setCurrentStage] = useState(STAGE_PUZZLE);
  const [error, setError] = useState(null);

  const [puzzleState, setPuzzleState] = useState(
    initialLetters.map((letter, i) => ({
      id: `item-${i}`, // El ID DEBE ser una string única
      content: letter,
    }))
  );

  const audioRef = useRef(null);

  // --- Lógica de Drag and Drop (ÚNICA FUNCIÓN) ---
  const onDragEnd = (result) => {
    // 1. Si se soltó fuera del Droppable o la posición es la misma, no hacer nada
    if (!result.destination) {
      return;
    }

    const items = reorder(
      puzzleState,
      result.source.index,
      result.destination.index
    );

    setPuzzleState(items);
    setError(null);
  };

  // --- Lógica de Comprobación y Audio ---
  const checkPuzzle = () => {
    const currentWord = puzzleState.map((item) => item.content).join("");

    if (currentWord === palabraFinal) {
      reproducirFinal();
    } else {
      setError("❌ ¡Ese no es el orden correcto! Inténtalo de nuevo.");
    }
  };

  function reproducirFinal() {
    const audio = audioRef.current;
    if (!audio) return;

    // Deshabilitar el botón Comprobar durante la reproducción
    // ...

    audio
      .play()
      .then(() => {
        audio.onended = () => {
          // setCurrentStage(STAGE_NARRATOR); // Cambiar al Narrador
        };
      })
      .catch((err) => {
        console.error("Fallo al reproducir audio:", err);
        setError("Error al iniciar el audio. ¿Permiso?");
      });
  }

  // if (currentStage === STAGE_NARRATOR) {
  //     // return <Narrador audioSrc={finalAudio} texto="¡Me has encontrado! Corre ven a buscarme." autoContinue={true} />;
  // }

  return (
    <div className="final-container">
      <h1>¡Felicidades! Has encontrado todas las letras</h1>
      <p className="puzzle-instruction">
        Ordena las letras para formar la palabra final.
      </p>

      <button className="final-audio-btn" onClick={checkPuzzle}>
        Comprobar Palabra
      </button>

      {error && <p className="puzzle-error">{error}</p>}

      <audio ref={audioRef} src={finalAudio} preload="auto" />

      {/* 💡 DragDropContext envuelve toda la lógica D&D */}
      <DragDropContext onDragEnd={onDragEnd}>
        {/* 💡 Droppable define la zona donde se pueden soltar los Draggable */}
        <Droppable droppableId="letras-puzle" direction="horizontal">
          {(provided, snapshot) => (
            <div
              className="letters-stage interactive-stage"
              {...provided.droppableProps}
              ref={provided.innerRef}
              // Opcional: Estilo para indicar que está siendo arrastrado
              style={{
                backgroundColor: snapshot.isDraggingOver
                  ? "rgba(255, 250, 220, 0.5)"
                  : "transparent",
              }}
            >
              {puzzleState.map((item, index) => (
                // 💡 Draggable hace que cada letra sea arrastrable
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <span
                      className="puzzle-letter"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        // Opcional: Ajustar el estilo mientras se arrastra
                        backgroundColor: snapshot.isDragging
                          ? "#ffeeaa"
                          : "#ffffff",
                        boxShadow: snapshot.isDragging
                          ? "0 8px 15px rgba(0, 0, 0, 0.2)"
                          : "0 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      {item.content}
                    </span>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}{" "}
              {/* Importante para el espacio de arrastre */}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
