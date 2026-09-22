// GREEDY — shop panel with dynamic MAX button
import { BUSINESSES, getUnlockedBusinesses } from "../data/businesses.js";
import * as Economy from "../systems/economy.js";
import { formatMoney } from "../utils/format.js";

const panel = document.getElementById("panel-shop");

export function renderShop(state, onBuy) {
  if (!panel) return;
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

    // compute how many we can buy
    const maxN = Economy.maxAffordable(biz.id, owned, state.money);
    const bulkTotal = maxN > 0 ? Economy.bulkCost(biz.id, owned, maxN) : 0;

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
      <div class="biz-owned">${formatBig(owned)}</div>
      <div class="biz-actions">
        <button class="btn-buy" ${canAfford ? "" : "disabled"}>
          BUY ${formatMoney(cost)}
        </button>
        <button class="btn-buy-max" ${maxN > 0 ? "" : "disabled"}>
          ${maxN > 0 ? "MAX ×" + formatBig(maxN) : "MAX"}
        </button>
        ${maxN > 0 ? `<div style="font-size:9px;color:var(--text-dim);text-align:right;margin-top:2px;font-family:var(--font-display);">${formatMoney(bulkTotal)}</div>` : ""}
      </div>
    `;

    card.querySelector(".btn-buy").addEventListener("click", () => onBuy(biz.id, 1));
    const maxBtn = card.querySelector(".btn-buy-max");
    if (maxN > 0) {
      maxBtn.addEventListener("click", () => onBuy(biz.id, "max"));
    }
    panel.appendChild(card);
  }
}

function formatBig(n) {
  if (!isFinite(n)) return "∞";
  if (n >= 1e15) return (n / 1e15).toFixed(1) + "Qa";
  if (n >= 1e12) return (n / 1e12).toFixed(1) + "T";
  if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return Math.floor(n).toString();
}
