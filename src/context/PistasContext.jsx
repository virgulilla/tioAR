import { createContext, useContext, useState } from "react";
import pistas from "../data/pistas.json";

const PistasContext = createContext();

export function PistasProvider({ children }) {
  const [index, setIndex] = useState(0);

  function nextPista() {
    if (index < pistas.length - 1) setIndex(index + 1);
  }

  return (
    <PistasContext.Provider value={{ index, nextPista, pistas }}>
      {children}
    </PistasContext.Provider>
  );
}

export function usePistas() {
  return useContext(PistasContext);
}
