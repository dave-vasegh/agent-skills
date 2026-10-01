/* main.js — entry point. Module scripts are deferred by default, so the DOM
   is ready. Coordinates the focused modules; no global state. */

import { initTheme } from "./theme.js";
import { initNavigation } from "./navigation.js";

initTheme();
initNavigation();

// Harden any external links that opt into a new tab.
document.querySelectorAll('a[target="_blank"]').forEach((a) => {
  const rel = new Set((a.getAttribute("rel") || "").split(/\s+/).filter(Boolean));
  rel.add("noopener");
  rel.add("noreferrer");
  a.setAttribute("rel", [...rel].join(" "));
});

// Auto-fill the current year wherever marked.
document.querySelectorAll("[data-current-year]").forEach((el) => {
  el.textContent = String(new Date().getFullYear());
});
