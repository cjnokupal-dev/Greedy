// GREEDY — collapsible bottom nav
// Tap the floating button or swipe down on the nav to collapse/expand.

let nav = null;
let toggle = null;
let collapsed = false;
let startY = 0;
let startTime = 0;

export function installNavToggle() {
  nav = document.getElementById("tabs");
  if (!nav) return;

  // create floating toggle button
  toggle = document.createElement("button");
  toggle.id = "nav-toggle";
  toggle.textContent = "≡";
  toggle.setAttribute("aria-label", "Show navigation");
  document.body.appendChild(toggle);

  // click toggle
  toggle.onclick = () => setCollapsed(false);

  // tap the handle area (top 24px of nav) to collapse
  nav.addEventListener("click", (e) => {
    // only if tapping the small handle region at the top
    const rect = nav.getBoundingClientRect();
    const tapY = e.clientY - rect.top;
    if (tapY < 24 && !collapsed) {
      // check it's not hitting a tab button
      if (e.target.closest(".tab")) return;
      e.preventDefault();
      setCollapsed(true);
    }
  }, true);

  // swipe gesture — swipe down on nav collapses, swipe up expands
  nav.addEventListener("touchstart", (e) => {
    startY = e.touches[0].clientY;
    startTime = Date.now();
  }, { passive: true });

  nav.addEventListener("touchend", (e) => {
    const endY = e.changedTouches[0].clientY;
    const dy = endY - startY;
    const dt = Date.now() - startTime;
    if (dt < 400 && Math.abs(dy) > 30) {
      if (dy > 30) setCollapsed(true);   // swipe down
      else if (dy < -30) setCollapsed(false); // swipe up
    }
  }, { passive: true });

  // restore state on load
  try {
    const saved = localStorage.getItem("greedy_nav_collapsed");
    if (saved === "true") setCollapsed(true);
  } catch (e) {}
}

export function setCollapsed(v) {
  if (!nav) return;
  collapsed = v;
  nav.classList.toggle("collapsed", v);
  toggle.classList.toggle("show", v);
  const app = document.getElementById("app");
  if (app) app.classList.toggle("nav-collapsed", v);
  try { localStorage.setItem("greedy_nav_collapsed", String(v)); } catch (e) {}
  console.log("[nav] collapsed:", v);
}

export function toggleNav() {
  setCollapsed(!collapsed);
}

export function isNavCollapsed() {
  return collapsed;
}
