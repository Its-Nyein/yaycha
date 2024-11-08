import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ThemeApp from "./ThemeApp.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeApp />
  </StrictMode>
);
