import arrowImg from "../assets/flecha.png";

export default function Arrow({ bearing, heading }) {
  if (heading == null) return <p>Orientando…</p>;

  const rotation = bearing - heading;

  return (
    <img
      src={arrowImg}
      alt="arrow"
      style={{
        width: "80px",
        height: "80px",
        transform: `rotate(${rotation}deg)`,
        transition: "transform 0.2s linear",
      }}
    />
  );
}
