// GREEDY — world map panel
import { CITIES, unlockedCities, currentCity, travelTo } from "../data/cities.js";
import { formatMoney } from "../utils/format.js";
import { toast } from "./notifications.js";

const panel = document.getElementById("panel-map");

export function renderMap(state, onChange) {
  if (!panel) return;
  panel.innerHTML = "";

  const current = currentCity(state);

  // summary
  const summary = document.createElement("div");
  summary.className = "owned-summary";
  summary.innerHTML = `
    <div class="row"><span>Current city</span><span class="v" style="color:var(--accent);">${current.name}</span></div>
    <div class="row"><span>Income multiplier</span><span class="v money">×${current.incomeMult.toFixed(1)}</span></div>
    <div class="row"><span>Cost multiplier</span><span class="v">×${current.costMult.toFixed(1)}</span></div>
    <div class="row"><span>Event intensity</span><span class="v">×${current.eventMult.toFixed(1)}</span></div>
  `;
  panel.appendChild(summary);

  // city cards
  for (const city of CITIES) {
    const isUnlocked = city.unlock(state);
    const isCurrent = state.currentCity === city.id || (!state.currentCity && city.id === "hometown");
    const card = document.createElement("div");
    card.className = "biz-card";
    card.style.opacity = isUnlocked ? "1" : "0.35";
    card.style.borderColor = isCurrent ? "var(--accent)" : "var(--border)";
    card.innerHTML = `
      <div class="biz-info">
        <div class="biz-name" style="${isCurrent ? "color:var(--accent);" : ""}">
          ${city.name} ${isCurrent ? "★" : isUnlocked ? "✓" : "🔒"}
        </div>
        <div class="biz-desc">${city.desc}</div>
        <div class="biz-stats">
          Income ×${city.incomeMult.toFixed(1)} · Cost ×${city.costMult.toFixed(1)} · Events ×${city.eventMult.toFixed(1)}
        </div>
      </div>
      <div class="biz-actions">
        <button class="btn-buy" ${!isUnlocked || isCurrent ? "disabled" : ""}>
          ${isCurrent ? "HERE" : isUnlocked ? "TRAVEL" : "LOCKED"}
        </button>
      </div>
    `;
    panel.appendChild(card);
    if (isUnlocked && !isCurrent) {
      card.querySelector("button").addEventListener("click", () => {
        const r = travelTo(state, city.id);
        if (r.success) toast("Arrived in " + city.name);
        else toast("Cannot travel: " + r.reason);
        onChange();
      });
    }
  }
}
