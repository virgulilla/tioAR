import Puzzle from "../juegos/Puzzle";
import Memory from "../juegos/Memory";
import Globos from "../juegos/Globos";

export default function JuegoContainer({ tipo }) {
  if (tipo === "puzzle") return <Puzzle />;
  if (tipo === "memory") return <Memory />;
  if (tipo === "globos") return <Globos />;

  return <div>No hay juego definido</div>;
}
