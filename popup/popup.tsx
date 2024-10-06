import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "../components/App";

const rootEl = document.getElementById("root");

if (rootEl === null) {
  throw new Error("Root element not found.");
}

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
