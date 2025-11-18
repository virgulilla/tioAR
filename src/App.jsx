import { Routes, Route } from "react-router-dom";
import MapPage from "./pages/MapPage";
import RiddlePage from "./pages/RiddlePage";
import GameMemory from "./pages/GameMemory";
import GameBalloons from "./pages/GameBalloons";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MapPage />} />
      <Route path="/pista/:id" element={<RiddlePage />} />
      <Route path="/juego/memory" element={<GameMemory />} />
      <Route path="/juego/globos" element={<GameBalloons />} />
    </Routes>
  );
}
