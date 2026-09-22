// GREEDY — research panel
import { RESEARCH } from "../data/research.js";
import { unlockedResearch, canResearch, doResearch } from "../systems/research.js";
import { formatMoney } from "../utils/format.js";
import { toast } from "./notifications.js";

const panel = document.getElementById("panel-research");

export function renderResearch(state, onChange) {
  if (!panel) return;
  panel.innerHTML = "";

  const unlocked = unlockedResearch(state);

  const summary = document.createElement("div");
  summary.className = "owned-summary";
  summary.innerHTML = `
    <div class="row"><span>Researched</span><span class="v">${unlocked.length} / ${RESEARCH.length}</span></div>
  `;
  panel.appendChild(summary);

  for (const r of RESEARCH) {
    const isDone = unlocked.includes(r.id);
    const can = canResearch(state, r.id);
    const reqMet = r.requires.every(req => unlocked.includes(req));
    const card = document.createElement("div");
    card.className = "biz-card";
    card.style.opacity = reqMet ? "1" : "0.4";
    card.innerHTML = `
      <div class="biz-info">
        <div class="biz-name">${isDone ? "✓ " : ""}${r.name}</div>
        <div class="biz-desc">${r.desc}</div>
        <div class="biz-stats">${reqMet ? "" : "🔒 Requires earlier research"}</div>
      </div>
      <div class="biz-actions">
        <button class="btn-buy" ${isDone || !can ? "disabled" : ""}>
          ${isDone ? "DONE" : formatMoney(r.cost)}
        </button>
      </div>
    `;
    panel.appendChild(card);
    if (!isDone) {
      card.querySelector("button").addEventListener("click", () => {
        const res = doResearch(state, r.id);
        if (res.success) { toast("Researched: " + r.name); onChange(); }
        else toast("Cannot research");
      });
    }
  }
}
