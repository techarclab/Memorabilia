import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { applyPriceOverrides } from "./data/catalog";
import { fetchOverrides } from "./lib/pricing";
import "./index.css";
import "./styles/jpp.css";
import "./styles/react.css";

/**
 * Correct the bundled prices before the first paint.
 *
 * The catalogue ships inside the bundle, so it renders instantly, but the
 * prices in it are placeholders the client can change from the admin
 * panel. Fetching that map before mounting means a buyer never sees an
 * old price flip to a new one a moment later — which on a page about
 * money is worse than waiting.
 *
 * It is one small document, and it is not allowed to hold the site up:
 * after 1.5 seconds, or on any error, or with no Firebase project at all,
 * the app mounts with the bundled prices.
 */
async function withPrices<T>(work: () => T): Promise<T> {
  try {
    const timeout = new Promise<Record<string, number>>((res) =>
      setTimeout(() => res({}), 1500));
    const mrp = await Promise.race([fetchOverrides(), timeout]);
    const n = applyPriceOverrides(mrp);
    if (n && import.meta.env.DEV) console.info(`[Memorabilia] ${n} price overrides applied`);
  } catch {
    /* bundled prices are a fine fallback — never block the site on this */
  }
  return work();
}

withPrices(() =>
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  ),
);
