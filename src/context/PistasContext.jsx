import { createContext, useContext, useState } from "react";
import { NARRATIVAS } from "../data/pistas.js";

const PistasContext = createContext();

export function PistasProvider({ children }) {
  const [index, setIndex] = useState(0);

  function nextPista() {
    if (index < NARRATIVAS.length - 1) setIndex(index + 1);
  }

  return (
    <PistasContext.Provider value={{ index, nextPista, pistas: NARRATIVAS }}>
      {children}
    </PistasContext.Provider>
  );
}

export function usePistas() {
  return useContext(PistasContext);
}
