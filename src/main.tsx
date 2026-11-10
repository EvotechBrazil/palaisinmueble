import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "./styles/global.css";
import { App } from "./App";

const root = document.getElementById("root");
if (!root) throw new Error("A página não encontrou o elemento raiz.");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
