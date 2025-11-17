import { useEffect, useState } from "react";
import useGeolocalizacion, {
  distancia,
  rumbo,
} from "./hooks/useGeolocalizacion";
import { PISTAS } from "./data/pistas";
import Radar from "./components/Radar";
import JuegoContainer from "./components/JuegoContainer";

export default function App() {
  const coords = useGeolocalizacion();
  const [pistaIndex, setPistaIndex] = useState(0);
  const [modoJuego, setModoJuego] = useState(false);
  const pista = PISTAS[pistaIndex];

  useEffect(() => {
    if (!coords || modoJuego) return;

    const d = distancia(coords.lat, coords.lon, pista.lat, pista.lon);

    if (d < pista.radio) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setModoJuego(true);
      new Audio(pista.audio).play().catch(() => {});
    }
  }, [coords, modoJuego, pista]);

  if (!coords) return <div>Activando GPS…</div>;

  if (modoJuego) {
    return (
      <div style={{ padding: 20 }}>
        <h1>{pista.mensaje}</h1>

        <JuegoContainer tipo={pista.juego} />

        <button
          style={{
            marginTop: 30,
            padding: "15px 30px",
            fontSize: 24,
            borderRadius: 20,
          }}
          onClick={() => {
            setModoJuego(false);
            if (pistaIndex < PISTAS.length - 1) {
              setPistaIndex(pistaIndex + 1);
            } else {
              alert("🎉 ¡Has encontrado todas las pistas!");
            }
          }}
        >
          Siguiente pista
        </button>
      </div>
    );
  }

  const d = distancia(coords.lat, coords.lon, pista.lat, pista.lon);
  const ang = rumbo(coords.lat, coords.lon, pista.lat, pista.lon);

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>{pista.nombre}</h1>
      <Radar distancia={d} rotacion={ang} />
    </div>
  );
}
