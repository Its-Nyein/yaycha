import { Box, AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import {
  Menu as MenuIcon,
  Add as AddIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useContext } from "react";
import { AppContext } from "../ThemeApp";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const { showForm, setShowForm, mode, setMode, setShowDrawer } =
    useContext(AppContext);
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={() => setShowDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
        <Typography sx={{ flexGrow: 1, ml: 2 }}>Yaycha</Typography>
        <Box>
          <IconButton color="inherit" onClick={() => setShowForm(!showForm)}>
            <AddIcon />
          </IconButton>
          <IconButton color="inherit" onClick={() => navigate("/search")}>
            <SearchIcon />
          </IconButton>
          {mode === "dark" ? (
            <IconButton
              color="inherit"
              edge="end"
              onClick={() => setMode("light")}
            >
              <LightModeIcon />
            </IconButton>
          ) : (
            <IconButton
              color="inherit"
              edge="end"
              onClick={() => setMode("dark")}
            >
              <DarkModeIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
