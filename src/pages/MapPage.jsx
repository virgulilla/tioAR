import { useNavigate } from "react-router-dom";
import pistas from "../data/pistas.json";
import useGeo from "../hooks/useGeo";
import useHeading from "../hooks/useHeading";
import Radar from "../components/Radar";

export default function MapPage() {
  const nav = useNavigate();
  const coords = useGeo();
  const heading = useHeading();

  const next = pistas[0];

  function distance(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const x = ((lon2 - lon1) * Math.PI) / 180;
    const y = ((lat2 - lat1) * Math.PI) / 180;
    const a =
      Math.sin(y / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(x / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function getBearing(lat1, lon1, lat2, lon2) {
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    return (Math.atan2(y, x) * 180) / Math.PI;
  }

  if (!coords) return <div className="center">Activando GPS…</div>;

  const dist = distance(coords.lat, coords.lng, next.lat, next.lng);
  const bearing = getBearing(coords.lat, coords.lng, next.lat, next.lng);

  // Auto-abrir acertijo al llegar a zona
  if (dist < 10) {
    nav(`/pista/${next.id}`);
  }

  return (
    <div className="center">
      <h2>Siguiente destino:</h2>
      <h3>{next.name}</h3>

      <Radar distance={dist} bearing={bearing} heading={heading} />
    </div>
  );
}
