import { createContext, useState } from "react";
import App from "./App";

export const AppContent = createContext();

const ThemeApp = () => {
  const [mode, setMode] = useState("dark");
  return (
    <AppContent.Provider value={{ mode, setMode }}>
      <App />
    </AppContent.Provider>
  );
};

export default ThemeApp;
