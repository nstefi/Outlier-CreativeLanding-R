import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { AnimatePresence } from "framer-motion";

// Redirect to splash screen on initial app load
if (window.location.pathname === "/") {
  window.location.href = "/welcome";
}

createRoot(document.getElementById("root")!).render(
  <AnimatePresence mode="wait">
    <App />
  </AnimatePresence>
);
