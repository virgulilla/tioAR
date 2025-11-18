import flecha from "../assets/flecha.png";

export default function Arrow({ bearing }) {
  return (
    <img
      src={flecha}
      style={{
        width: "140px",
        transform: `rotate(${bearing}deg)`,
      }}
    />
  );
}
