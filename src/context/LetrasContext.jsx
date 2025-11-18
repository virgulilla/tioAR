import { createContext, useContext, useState } from "react";

const LetrasContext = createContext();

export function LetrasProvider({ children }) {
  const [letras, setLetras] = useState([]);

  function addLetra(l) {
    setLetras(
      (prev) => (prev.includes(l) ? prev : [...prev, l]) // evita duplicados
    );
  }

  return (
    <LetrasContext.Provider value={{ letras, addLetra }}>
      {children}
    </LetrasContext.Provider>
  );
}

export function useLetras() {
  return useContext(LetrasContext);
}
