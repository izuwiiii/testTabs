import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { HashRouter as Router } from "react-router";

createRoot(document.getElementById("root")!).render(
  <Router>
    <StrictMode>
      <App />
    </StrictMode>
  </Router>
);
