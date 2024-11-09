import { createContext, useContext, useMemo, useState } from "react";
import App from "./App";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

export const AppContext = createContext();

export function useApp() {
  return useContext(AppContext);
}

const ThemeApp = () => {
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("dark");

  const theme = useMemo(() => {
    return createTheme({
      palette: { mode },
    });
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      <AppContext.Provider value={{ showForm, setShowForm, mode, setMode }}>
        <App />
        <CssBaseline />
      </AppContext.Provider>
    </ThemeProvider>
  );
};

export default ThemeApp;
