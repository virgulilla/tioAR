import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";
import { LetrasProvider } from "./context/LetrasContext";
import { PistasProvider } from "./context/PistasContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PistasProvider>
      <LetrasProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LetrasProvider>
    </PistasProvider>
  </React.StrictMode>
);
