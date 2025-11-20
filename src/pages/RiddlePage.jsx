import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { NARRATIVAS } from "../data/pistas.js";
import "./RiddlePage.css";

import Narrador from "../components/Narrador";

export default function RiddlePage() {
  const { id } = useParams();
  const nav = useNavigate();
  const pista = NARRATIVAS.find((p) => p.id === Number(id)); // Estados

  const [showNarrador, setShowNarrador] = useState(false);
  const [activityComplete, setActivityComplete] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [error, setError] = useState(null);

  // Propiedad que determina el flujo de la pista
  const requiresCode = !!pista?.code; // --- LÓGICA DE COMPROBACIÓN DEL CÓDIGO ---

  const checkCode = () => {
    if (!pista || !pista.code) {
      setError("Error: Esta pista no está configurada con código.");
      return;
    }

    // Validación y comparación del código
    if (inputCode.toUpperCase() === pista.code.toUpperCase()) {
      setError(null);
      nav(`/juego/${pista.game}`);
    } else {
      // Mensaje de error ajustado al nuevo flujo del acertijo
      setError(
        "❌ Respuesta incorrecta. ¡Resuelvan bien el acertijo de la nota!"
      );
    }
  }; // --- LÓGICA DE NARRADOR Y REINICIO ---

  useEffect(() => {
    // Reinicia el estado al cambiar de pista
    setActivityComplete(false);
    setInputCode("");
    setError(null);

    const key = `narrador_pista_${id}`;
    const alreadyShown = localStorage.getItem(key);

    if (!alreadyShown) {
      setShowNarrador(true);
    }
  }, [id]);

  function closeNarrador() {
    localStorage.setItem(`narrador_pista_${id}`, "true");
    setShowNarrador(false);
  }
  // --- FIN LÓGICA DE NARRADOR ---

  // Manejo de pista no encontrada
  if (!pista) {
    return (
      <div className="center-container">
        <div className="center">
          <h2>¡Error!</h2>
          <p>Pista con ID {id} no encontrada. ¡El Tió se ha perdido!</p>
        </div>
      </div>
    );
  } // Si toca mostrar el narrador

  if (showNarrador) {
    return (
      <Narrador
        key={pista.narradorAudio}
        audioSrc={pista.narradorAudio}
        texto={pista.narradorTexto}
        onFinish={closeNarrador}
      />
    );
  } // Pantalla normal de la Pista (Acertijo o Actividad/Código)

  return (
    <div className="center-container">
           {" "}
      <div className="center">
             {" "}
        <h2>
          PRUEBA {id}: {pista.riddleTitle || "ACERTIJO"}
        </h2>
        {requiresCode ? (
          // --- ESCENARIO 1: PISTA CON CÓDIGO (EJ: GLOBO/ACTIVIDAD) ---
          <div className="w-full">
            {!activityComplete ? (
              // 1. Instrucción de la Actividad Física
              <>
                <p style={{ maxWidth: "350px", fontWeight: "bold" }}>
                  {pista.riddle}
                </p>
                <button
                  className="riddle-button activity-button"
                  onClick={() => setActivityComplete(true)}
                  // Estilo para el botón de completar actividad (verde)
                  style={{
                    backgroundColor: "#4CAF50",
                    boxShadow: "0px 4px 0px #388E3C",
                  }}
                >
                  ✅ ¡Prueba superada!
                </button>
              </>
            ) : (
              // 2. Entrada de Código (Respuesta al acertijo)
              <>
                <p
                  style={{
                    maxWidth: "350px",
                    fontSize: "1.4rem",
                    fontWeight: "bold",
                    color: "#007bff",
                  }}
                >
                  ¿Cuál es la respuesta al acertijo? ¡Es la clave!
                </p>
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="RESPUESTA CLAVE"
                  className="code-input"
                />
                {error && <p className="code-error">{error}</p>}
                <button
                  className="riddle-button code-button"
                  onClick={checkCode}
                  disabled={inputCode.length < 3}
                  style={{ marginTop: "20px" }}
                >
                  Desbloquear Juego 🔓
                </button>
              </>
            )}
          </div>
        ) : (
          // --- ESCENARIO 2: PISTA SIN CÓDIGO (Acertijo Clásico) ---
          <div className="w-full">
            <p style={{ maxWidth: "300px" }}>{pista.riddle}</p>
            <button
              className="riddle-button"
              onClick={() => nav(`/juego/${pista.game}`)}
            >
              Jugar y Desvelar Pista
            </button>
          </div>
        )}
           {" "}
      </div>
         {" "}
    </div>
  );
}
