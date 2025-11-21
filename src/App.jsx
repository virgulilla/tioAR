import { Routes, Route } from "react-router-dom";
import MapPage from "./pages/MapPage";
import RiddlePage from "./pages/RiddlePage";
import GameMemory from "./pages/GameMemory";
import GameBalloons from "./pages/GameBalloons";
import GameQuiz from "./pages/GameQuiz";
import GamePuzzle from "./pages/GamePuzzle";
import GameBlow from "./pages/GameBlow";
import GameFind from "./pages/GameFind";
import FinalPuzzlePage from "./pages/FinalPuzzlePage";
import FinalTioPage from "./pages/FinalTioPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MapPage />} />
      <Route path="/pista/:id" element={<RiddlePage />} />
      <Route path="/juego/memory" element={<GameMemory />} />
      <Route path="/juego/globos" element={<GameBalloons />} />
      <Route path="/juego/quiz" element={<GameQuiz />} />
      <Route path="/juego/puzzle" element={<GamePuzzle />} />
      <Route path="/juego/codigo" element={<GameFind />} />
      <Route path="/juego/soplar" element={<GameBlow />} />
      <Route path="/final" element={<FinalPuzzlePage />} />
      <Route path="/final-tio" element={<FinalTioPage />} />
    </Routes>
  );
}
