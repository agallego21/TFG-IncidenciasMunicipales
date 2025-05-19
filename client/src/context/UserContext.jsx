import React, { createContext, useState } from "react";

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  const login = (userData) => {
    setUsuario(userData);
  };

  const logout = () => {
    setUsuario(null);
  };

  return (
    <UserContext.Provider value={{ usuario, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}