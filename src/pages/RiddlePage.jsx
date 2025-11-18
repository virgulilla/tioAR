import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import pistas from "../data/pistas.json";
import "./RiddlePage.css";

import Narrador from "../components/Narrador";

export default function RiddlePage() {
  const { id } = useParams();
  const nav = useNavigate();
  const pista = pistas.find((p) => p.id === Number(id));

  const [showNarrador, setShowNarrador] = useState(false);

  // Mostrar narrador solo la primera vez que se entra en esa pista
  useEffect(() => {
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

  // Si toca mostrar el narrador
  if (showNarrador) {
    return (
      <Narrador
        key={pista.narradorAudio}
        audioSrc={pista.narradorAudio}
        texto={pista.narradorTexto}
        autoContinue={false}
        onFinish={closeNarrador}
      />
    );
  }

  // Pantalla normal del acertijo
  return (
    <div className="center">
      <h2>Acertijo</h2>

      <p style={{ maxWidth: "300px" }}>{pista.riddle}</p>

      <button onClick={() => nav(`/juego/${pista.game}`)}>Jugar</button>
    </div>
  );
}
