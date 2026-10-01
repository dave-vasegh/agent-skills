/* navigation.js — accessible responsive navigation.
   Works only as an enhancement: without JS the menu list stays visible
   (see index.html). With JS it collapses behind a real button on narrow
   screens, exposing state via aria-expanded and closing on Escape. */

export function initNavigation() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const list = document.querySelector("[data-nav-list]");
  if (!toggle || !list) return;

  // Enhance: start collapsed on narrow screens now that JS is present.
  const mq = window.matchMedia("(max-width: 48rem)");

  function setOpen(open) {
    toggle.setAttribute("aria-expanded", String(open));
    list.toggleAttribute("hidden", !open);
    if (open) {
      list.querySelector("a")?.focus();
    }
  }

  function applyCollapsed() {
    if (mq.matches) {
      list.toggleAttribute("hidden", toggle.getAttribute("aria-expanded") !== "true");
    } else {
      list.removeAttribute("hidden"); // always visible on wide screens
      toggle.setAttribute("aria-expanded", "false");
    }
  }

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });

  mq.addEventListener("change", applyCollapsed);
  applyCollapsed();
}
