import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const AyuntamientoContext = createContext(null);

export function useAyuntamiento() {
  return useContext(AyuntamientoContext);
}

export function AyuntamientoProvider({ children }) {
  const [ayuntamiento, setAyuntamiento] = useState(null);
  const [showLoginOnStart, setShowLoginOnStart] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const id = searchParams.get("idAyuntamiento");
    console.log("Valor de idAyuntamiento:", id);

    if (id) {
      axios.get(`http://localhost:5005/ayuntamientos/${id}`)
        .then(res => setAyuntamiento(res.data))
        .catch(err => console.error("Error cargando ayuntamiento:", err));
    } else {
      console.log("no se ha recibido id de ayuntamiento");
      setShowLoginOnStart(true); // activamos login del administrador
    }
  }, [searchParams]);

  return (
    <AyuntamientoContext.Provider value={{ ayuntamiento, showLoginOnStart, setShowLoginOnStart }}>
      {children}
    </AyuntamientoContext.Provider>
  );
}