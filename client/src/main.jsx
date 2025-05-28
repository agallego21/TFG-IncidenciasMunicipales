import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { AyuntamientoProvider } from "./context/AyuntamientoContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <AyuntamientoProvider>
          <App />
        </AyuntamientoProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);