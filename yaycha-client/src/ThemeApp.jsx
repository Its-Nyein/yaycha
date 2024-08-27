import { useState, createContext, useMemo } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import App from "./App";

export const AppContext = createContext();

export default function ThemedApp() {
  const [mode, setMode] = useState("dark");

  const theme = useMemo(() => {
    return createTheme({
      palette: { mode },
    });
  }, [mode]);

  const [showForm, setShowForm] = useState(false);
  return (
    <ThemeProvider theme={theme}>
      <AppContext.Provider value={{ showForm, setShowForm, mode, setMode }}>
        <App />
        <CssBaseline />
      </AppContext.Provider>
    </ThemeProvider>
  );
}
