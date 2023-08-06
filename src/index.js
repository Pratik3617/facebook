import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { DarkModeContextProvider } from "./Context/DarkModeContext";
import { AuthContextProvider } from "./Context/AuthContext";
import { ChatContextProvider } from "./Context/ChatContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthContextProvider>
    <ChatContextProvider>
    <DarkModeContextProvider>
      <App />
    </DarkModeContextProvider>
    </ChatContextProvider>
  </AuthContextProvider>
);
