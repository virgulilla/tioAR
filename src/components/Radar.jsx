// components/Radar.jsx
import flecha from "../assets/flecha.png";

export default function Radar({ distance, bearing }) {
  const size = 260; // tamaño del radar, ajustable

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, #5eff5e 0%, #7dff7d 60%, #c3ffc3 100%)",
        border: "4px solid green",
        position: "relative",
        margin: "20px auto",
      }}
    >
      {/* Flecha PNG centrada y rotada */}
      <img
        src={flecha}
        alt="arrow"
        style={{
          width: "70px",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) rotate(${bearing}deg)`,
          transformOrigin: "center center",
          transition: "transform 0.2s linear",
        }}
      />

      {/* Distancia debajo */}
      <div
        style={{
          position: "absolute",
          bottom: "-40px",
          width: "100%",
          textAlign: "center",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        {distance ? `${Math.round(distance)} m` : "Calculando..."}
      </div>
    </div>
  );
}
