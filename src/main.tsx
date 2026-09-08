import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/jpp.css";
import "./styles/react.css";

/* The catalogue ships inside the bundle and there are no prices to
   correct, so there is nothing to fetch before the first paint. The site
   mounts immediately. */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
