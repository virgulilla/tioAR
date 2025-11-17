import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MapView from "./pages/MapView";
import ClueView from "./pages/ClueView";
import ARView from "./pages/ARView";
import Final from "./pages/Final";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map/:id" element={<MapView />} />
        <Route path="/pista/:id" element={<ClueView />} />
        <Route path="/ar/:id" element={<ARView />} />
        <Route path="/final" element={<Final />} />
      </Routes>
    </BrowserRouter>
  );
}
