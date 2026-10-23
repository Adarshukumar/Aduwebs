import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

/* Self-hosted type — no Google Fonts request, no FOUT, works offline. */
import "@fontsource-variable/dm-sans";
import "@fontsource-variable/pixelify-sans";
import "@fontsource/instrument-serif/latin-400.css";
import "@fontsource/instrument-serif/latin-400-italic.css";
import "@fontsource/allura/latin-400.css";
import "@fontsource-variable/jetbrains-mono";
import "./index.css";

import App from "./App.tsx";
import { initSmoothScroll } from "./lib/scroll";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

initSmoothScroll();
