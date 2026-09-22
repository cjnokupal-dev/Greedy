// GREEDY — collectibles panel
import { COLLECTIBLES, RARITY_COLORS, RARITY_LABELS } from "../data/collectibles.js";
import { inventory, totalCollectibles, collectionMult } from "../systems/collectibles.js";

const panel = () => document.getElementById("panel-collect");

export function renderCollectibles(state) {
  const el = panel();
  if (!el) return;
  el.innerHTML = "";

  const inv = inventory(state);
  const total = totalCollectibles(state);

  const summary = document.createElement("div");
  summary.className = "owned-summary";
  summary.innerHTML = `
    <div class="row"><span>Collection</span><span class="v">${total} / ${COLLECTIBLES.length}</span></div>
    <div class="row"><span>Total bonus</span><span class="v money">×${collectionMult(state).toFixed(2)}</span></div>
    <div class="row"><span>Progress</span><span class="v">${((total / COLLECTIBLES.length) * 100).toFixed(0)}%</span></div>
  `;
  el.appendChild(summary);

  for (const c of COLLECTIBLES) {
    const count = inv[c.id] || 0;
    const color = RARITY_COLORS[c.rarity];
    const card = document.createElement("div");
    card.className = "biz-card";
    card.style.borderLeftColor = color;
    card.style.opacity = count > 0 ? "1" : "0.35";
    card.innerHTML = `
      <div class="biz-icon" style="background:${color}22;color:${color};border-color:${color};">${count > 0 ? "◆" : "🔒"}</div>
      <div class="biz-info">
        <div class="biz-name" style="color:${count > 0 ? color : "var(--text-dim)"};">${c.name}${count > 0 ? " ×" + count : ""}</div>
        <div class="biz-desc">${c.desc}</div>
        <div class="biz-stats" style="color:${color};">${RARITY_LABELS[c.rarity]}</div>
      </div>
    `;
    el.appendChild(card);
  }
}
