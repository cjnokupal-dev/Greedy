// GREEDY — titles panel
import { TITLES, allEarnedTitles, currentTitle } from "../data/titles.js";

const panel = document.getElementById("panel-titles");

export function renderTitles(state, onChange) {
  if (!panel) return;
  panel.innerHTML = "";

  const earned = allEarnedTitles(state);
  const current = state.selectedTitle || currentTitle(state).id;

  const summary = document.createElement("div");
  summary.className = "owned-summary";
  summary.innerHTML = `
    <div class="row"><span>Titles earned</span><span class="v">${earned.length} / ${TITLES.length}</span></div>
    <div class="row"><span>Current title</span><span class="v" style="color:var(--accent);">${TITLES.find(t => t.id === current)?.name || "Nobody"}</span></div>
  `;
  panel.appendChild(summary);

  for (const t of TITLES) {
    const owned = t.check(state);
    const isCurrent = current === t.id;
    const card = document.createElement("div");
    card.className = "biz-card";
    card.style.opacity = owned ? "1" : "0.4";
    card.innerHTML = `
      <div class="biz-icon" style="${isCurrent ? "background:var(--accent);color:#000;" : owned ? "background:var(--bg-elevated);color:var(--accent);" : ""}">
        ${isCurrent ? "★" : owned ? "✓" : "🔒"}
      </div>
      <div class="biz-info">
        <div class="biz-name" style="${isCurrent ? "color:var(--accent);" : ""}">${t.name}</div>
      </div>
      <div class="biz-actions">
        <button class="btn-buy" ${!owned || isCurrent ? "disabled" : ""}>${isCurrent ? "ACTIVE" : owned ? "WEAR" : "LOCKED"}</button>
      </div>
    `;
    panel.appendChild(card);
    if (owned && !isCurrent) {
      card.querySelector("button").addEventListener("click", () => {
        state.selectedTitle = t.id;
        onChange();
      });
    }
  }
}
