import { useState } from "react"; // 💡 Importar useState
import { useNavigate } from "react-router-dom";
import { useLetras } from "../context/LetrasContext";
import { usePistas } from "../context/PistasContext";
import GameVictory from "../components/GameVictory"; // 💡 IMPORTAR
import "./GameFind.css";

import bg from "../assets/find/bg.png";

export default function GameFind({ letra = "E" }) {
  const [showVictory, setShowVictory] = useState(false); // 💡 NUEVO ESTADO

  const { addLetra } = useLetras();
  const { nextPista } = usePistas();
  const nav = useNavigate();

  // 💡 FUNCIÓN PARA INICIAR LA VICTORIA
  function found() {
    // Cuando se encuentra el objeto, solo activamos la pantalla de victoria
    setTimeout(() => setShowVictory(true), 100);
  }

  // 💡 FUNCIÓN PARA CONTINUAR DESPUÉS DE LA PANTALLA DE VICTORIA
  function handleVictoryContinue() {
    addLetra(letra);
    nextPista();
    nav("/"); // Volver al mapa/siguiente pista
  }

  // 💡 RENDERIZADO CONDICIONAL
  if (showVictory) {
    return <GameVictory letra={letra} onContinue={handleVictoryContinue} />;
  }

  return (
    <div className="find-container">
      <h1>Encuentra el secreto</h1>
      <div className="find-area">
        <img src={bg} className="find-img" />
        {/* Hotspot invisible */}
        <button className="find-hotspot" onClick={found}></button>
      </div>
      <p>¡Toca el lugar correcto!</p>
    </div>
  );
}
