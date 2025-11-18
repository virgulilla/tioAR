import { useParams, useNavigate } from "react-router-dom";
import pistas from "../data/pistas.json";

export default function RiddlePage() {
  const { id } = useParams();
  const nav = useNavigate();
  const pista = pistas.find((p) => p.id === Number(id));

  return (
    <div className="center">
      <h2>Acertijo</h2>
      <p style={{ maxWidth: "300px" }}>{pista.riddle}</p>

      <button onClick={() => nav(`/juego/${pista.game}`)}>Jugar</button>
    </div>
  );
}
