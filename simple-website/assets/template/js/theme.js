/* theme.js — manual light/dark override layered over the system default.
   Initial theme is applied by the inline <head> script (pre-paint, no flash);
   this module handles the toggle button and persistence afterwards.

   Colours resolve via light-dark() in variables.css. Setting data-theme flips
   :root's color-scheme, which is all that's needed to switch every token. */

const STORAGE_KEY = "theme"; // "light" | "dark" | absent (= follow system)
const root = document.documentElement;
const media = window.matchMedia("(prefers-color-scheme: dark)");

function storedChoice() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

function effectiveTheme() {
  return storedChoice() ?? (media.matches ? "dark" : "light");
}

function syncButton(theme) {
  const btn = document.querySelector("[data-theme-toggle]");
  if (!btn) return;
  const isDark = theme === "dark";
  btn.setAttribute("aria-pressed", String(isDark));
  btn.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
  const icon = btn.querySelector("[data-theme-icon]");
  if (icon) icon.textContent = isDark ? "\u2600" : "\u263e"; // ☀ / ☾
}

function apply(theme) {
  root.setAttribute("data-theme", theme);
  try { localStorage.setItem(STORAGE_KEY, theme); } catch { /* private mode */ }
  syncButton(theme);
}

export function initTheme() {
  syncButton(effectiveTheme());

  document.querySelector("[data-theme-toggle]")?.addEventListener("click", () => {
    apply(effectiveTheme() === "dark" ? "light" : "dark");
  });

  // If no explicit choice, keep the button in sync with live OS changes.
  media.addEventListener("change", () => {
    if (!storedChoice()) syncButton(effectiveTheme());
  });
}
