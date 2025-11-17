import flechaImg from "../assets/flecha.png";

export default function Radar({ distancia, rotacion }) {
  return (
    <div style={{ textAlign: "center", marginTop: 30 }}>
      <img
        src={flechaImg}
        alt="Flecha"
        style={{
          width: 150,
          transform: `rotate(${rotacion}deg)`,
          transition: "0.2s",
        }}
      />
      <div
        style={{
          fontSize: "32px",
          color: "#2979ff",
          marginTop: 20,
          fontWeight: "bold",
        }}
      >
        {Math.round(distancia)} m
      </div>
    </div>
  );
}
