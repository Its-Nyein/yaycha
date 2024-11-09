import { createContext, useContext, useMemo, useState } from "react";
import {
  Container,
  CssBaseline,
  Snackbar,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { deepPurple, grey } from "@mui/material/colors";
import AppDrawer from "./components/AppDrawer";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";

export const AppContext = createContext();

export function useApp() {
  return useContext(AppContext);
}

const Template = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [globalMsg, setGlobalMsg] = useState(null);
  const [auth, setAuth] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("dark");

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode,
        primary: deepPurple,
        banner: mode === "dark" ? grey[800] : grey[200],
        text: {
          fade: grey[20],
        },
      },
    });
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      <AppContext.Provider
        value={{
          showForm,
          setShowForm,
          mode,
          setMode,
          showDrawer,
          setShowDrawer,
          globalMsg,
          setGlobalMsg,
          auth,
          setAuth,
        }}
      >
        <Home />
        <AppDrawer />
        <Container maxWidth="sm" sx={{ mt: 4 }}>
          <Outlet />
        </Container>
        <Snackbar
          anchorOrigin={{
            horizontal: "center",
            vertical: "bottom",
          }}
          open={Boolean(globalMsg)}
          autoHideDuration={5000}
          onClose={() => setGlobalMsg(null)}
          message={globalMsg}
        />
        <CssBaseline />
      </AppContext.Provider>
    </ThemeProvider>
  );
};

export default Template;
