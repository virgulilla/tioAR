import arrowImg from "../assets/flecha.png";

export default function Radar({ distance, bearing, heading }) {
  // Si el heading aún no está disponible:
  const rotation = heading == null ? 0 : bearing - heading;

  return (
    <div
      style={{
        position: "relative",
        width: "260px",
        height: "260px",
        borderRadius: "50%",
        background:
          "radial-gradient(circle, #b0ffb0 0%, #79e279 60%, #4caf50 100%)",
        border: "6px solid #2d7a2f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "20px auto",
      }}
    >
      {/* Flecha dentro del radar */}
      <img
        src={arrowImg}
        alt="flecha"
        style={{
          width: "90px",
          height: "90px",
          position: "absolute",
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          top: "50%",
          left: "50%",
          transition: "transform 0.15s linear",
          userSelect: "none",
          pointerEvents: "none",
        }}
      />

      {/* Distancia en metros */}
      <div
        style={{
          position: "absolute",
          bottom: "-40px",
          width: "100%",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "20px",
        }}
      >
        {distance.toFixed(0)} m
      </div>
    </div>
  );
}
