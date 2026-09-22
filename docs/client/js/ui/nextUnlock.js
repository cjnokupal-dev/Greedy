// GREEDY — small "next unlock" bar under HUD
import { findNextUnlock } from "../systems/nextUnlock.js";
import { formatMoney } from "../utils/format.js";

let bar = null;

export function installNextUnlockBar() {
  if (bar) return;
  bar = document.createElement("div");
  bar.id = "next-unlock-bar";
  bar.style.cssText = `
    padding: 6px 12px;
    background: linear-gradient(90deg, rgba(0,212,255,0.08), transparent);
    border-bottom: 1px solid var(--border);
    font-family: var(--font-display);
    font-size: 10px;
    color: var(--text-dim);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  `;

  // insert after #hud (or after chart)
  const chart = document.getElementById("wealth-chart");
  const hud = document.getElementById("hud");
  if (chart && chart.parentNode) chart.parentNode.insertBefore(bar, chart.nextSibling);
  else if (hud && hud.parentNode) hud.parentNode.insertBefore(bar, hud.nextSibling);
  else document.body.appendChild(bar);
}

export function renderNextUnlock(state) {
  if (!bar) installNextUnlockBar();
  if (!bar) return;

  const unlocks = findNextUnlock(state);
  if (unlocks.length === 0) {
    bar.innerHTML = '<span style="color:var(--money);">★ ALL UNLOCKED</span>';
    return;
  }

  const u = unlocks[0];
  let progress = "";
  if (u.unit === "$" && u.target > 0) {
    const pct = Math.min(100, (u.current / u.target) * 100);
    progress = ` <span style="color:var(--accent);">${pct.toFixed(1)}%</span>`;
  } else if (u.unit === "day") {
    const pct = Math.min(100, (u.current / u.target) * 100);
    progress = ` <span style="color:var(--accent);">${pct.toFixed(0)}%</span>`;
  }

  bar.innerHTML = `
    <span style="color:var(--text-mute);letter-spacing:1px;">NEXT</span>
    <span style="flex:1;overflow:hidden;text-overflow:ellipsis;color:#fff;">${u.name}</span>
    <span style="color:var(--accent);">${u.need}</span>
    ${progress}
  `;
}
