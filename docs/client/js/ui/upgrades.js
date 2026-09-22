// GREEDY — upgrades panel
import { UPGRADES } from "../data/upgrades.js";
import { formatMoney } from "../utils/format.js";

const panel = document.getElementById("panel-upgrades");

export function renderUpgrades(state, onBuy) {
  const owned = state.upgrades || {};
  panel.innerHTML = "";

  const visible = UPGRADES.filter(u => {
    const day = u.unlockAt?.day ?? 1;
    return state.day >= day;
  });

  if (visible.length === 0) {
    panel.innerHTML = '<p style="color:var(--text-dim);text-align:center;padding:40px 0;">No upgrades available yet. Play more days.</p>';
    return;
  }

  for (const u of visible) {
    const isOwned = !!owned[u.id];
    const canAfford = state.money >= u.cost;

    const card = document.createElement("div");
    card.className = "biz-card";
    card.innerHTML = `
      <div class="biz-info">
        <div class="biz-name">
          ${u.name} ${isOwned ? '<span style="color:var(--money);font-size:11px;">✓ OWNED</span>' : ""}
        </div>
        <div class="biz-desc">${u.desc}</div>
        <div class="biz-stats">Unlocks day ${u.unlockAt?.day ?? 1}</div>
      </div>
      <div class="biz-actions">
        <button class="btn-buy" ${isOwned || !canAfford ? "disabled" : ""}>
          ${isOwned ? "OWNED" : "BUY " + formatMoney(u.cost)}
        </button>
      </div>
    `;

    if (!isOwned) {
      card.querySelector(".btn-buy").addEventListener("click", () => onBuy(u.id));
    }
    panel.appendChild(card);
  }
}
