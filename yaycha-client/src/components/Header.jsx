import { useApp } from "../ThemeApp";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Add as AddIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Search as SearchIcon,
  ArrowBack as BackIcon,
  Notifications as NotiIcon,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchNotis } from "./libs/fetcher.js";

const Header = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { showForm, setShowForm, mode, setMode, setShowDrawer, auth } =
    useApp();
  const { isLoading, isError, data } = useQuery(["notis", auth], fetchNotis);

  function notiCount() {
    if (!auth) return false;
    if (isLoading || isError) return false;

    return data.filter((noti) => !noti.read).length;
  }

  return (
    <AppBar position="static">
      <Toolbar>
        {pathname === "/" ? (
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setShowDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <IconButton color="inherit" edge="start" onClick={() => navigate(-1)}>
            <BackIcon />
          </IconButton>
        )}
        <Typography sx={{ flexGrow: 1, ml: 2 }}>Yaycha</Typography>
        <Box>
          <IconButton color="inherit" onClick={() => setShowForm(!showForm)}>
            <AddIcon />
          </IconButton>
          <IconButton color="inherit" onClick={() => navigate("/search")}>
            <SearchIcon />
          </IconButton>
          {auth && (
            <IconButton color="inherit" onClick={() => navigate("/notis")}>
              <Badge color="error" badgeContent={notiCount()}>
                <NotiIcon />
              </Badge>
            </IconButton>
          )}
          {mode === "dark" ? (
            <IconButton color="inherit" edge="end">
              <LightModeIcon onClick={() => setMode("light")} />
            </IconButton>
          ) : (
            <IconButton color="inherit" edge="end">
              <DarkModeIcon onClick={() => setMode("dark")} />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
