import React, { createContext, useState, useContext } from "react";

export const UserContext = createContext(null);

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  const login = (userData) => {
    setUsuario(userData);
  };

  const logout = () => {
    setUsuario(null);
  };

  return (
    <UserContext.Provider value={{ usuario, login, logout, setUsuario }}>
      {children}
    </UserContext.Provider>
  );
}