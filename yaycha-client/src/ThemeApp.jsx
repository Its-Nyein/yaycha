import { createContext, useContext, useState } from "react";
import App from "./App";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

export const AppContext = createContext();

export function useApp() {
  return useContext(AppContext);
}

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

const ThemeApp = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <AppContext.Provider value={{ showForm, setShowForm }}>
        <App />
        <CssBaseline />
      </AppContext.Provider>
    </ThemeProvider>
  );
};

export default ThemeApp;
