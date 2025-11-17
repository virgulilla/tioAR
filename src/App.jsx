// App.jsx
import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import MapView from "./pages/MapView";
import ClueView from "./pages/ClueView";
import ARFinal from "./pages/ARFinal";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map/:id" element={<MapView />} />
        <Route path="/pista/:id" element={<ClueView />} />
        <Route path="/arfinal" element={<ARFinal />} />
      </Routes>
    </BrowserRouter>
  );
}
