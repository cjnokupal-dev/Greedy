// GREEDY — shop panel

import { BUSINESSES, getUnlockedBusinesses } from "../data/businesses.js";
import * as Economy from "../systems/economy.js";
import { formatMoney } from "../utils/format.js";

const panel = document.getElementById("panel-shop");

export function renderShop(state, onBuy) {
  const unlocked = getUnlockedBusinesses(state);
  panel.innerHTML = "";

  if (unlocked.length === 0) {
    panel.innerHTML = '<p style="color:var(--text-dim);text-align:center;padding:40px 0;">Nothing to buy yet.</p>';
    return;
  }

  for (const biz of unlocked) {
    const owned = state.owned[biz.id] || 0;
    const cost = Economy.nextCost(biz.id, owned);
    const canAfford = state.money >= cost;

    const card = document.createElement("div");
    card.className = "biz-card";
    card.innerHTML = `
      <div class="biz-info">
        <div class="biz-name">${biz.name}</div>
        <div class="biz-desc">${biz.desc}</div>
        <div class="biz-stats">
          $${biz.baseIncome}/day ·
          <span class="greed">+${biz.greedPerUnit} greed</span>
          ${biz.heatPerUnit > 0 ? ` · <span class="heat">+${biz.heatPerUnit} heat</span>` : ""}
        </div>
      </div>
      <div class="biz-owned">${owned}</div>
      <div class="biz-actions">
        <button class="btn-buy" ${canAfford ? "" : "disabled"}>
          BUY ${formatMoney(cost)}
        </button>
      </div>
    `;

    card.querySelector(".btn-buy").addEventListener("click", () => onBuy(biz.id, 1));
    panel.appendChild(card);
  }
}
