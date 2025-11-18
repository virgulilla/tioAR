import { useNavigate } from "react-router-dom";
import { useLetras } from "../context/LetrasContext";
import { usePistas } from "../context/PistasContext";
import "./GameFind.css";

import bg from "../assets/find/bg.png";

export default function GameFind({ letra = "T" }) {
  const { addLetra } = useLetras();
  const { nextPista } = usePistas();
  const nav = useNavigate();

  function found() {
    addLetra(letra);
    nextPista();
    nav("/");
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
