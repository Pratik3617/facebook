import { createContext, useReducer } from "react";
import DarkModeReducer from "./DarkModeReduce";

const INTITAL_STATE = {
  darkMode: false,
};

export const DarkModeContext = createContext(INTITAL_STATE);

export const DarkModeContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(DarkModeReducer, INTITAL_STATE);
  return (
    <DarkModeContext.Provider value={{ darkMode: state.darkMode, dispatch }}>
      {children}
    </DarkModeContext.Provider>
  );
};
