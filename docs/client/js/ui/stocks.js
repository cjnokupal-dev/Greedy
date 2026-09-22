// GREEDY — stocks panel
import { STOCKS } from "../data/stocks.js";
import { stockPrices, stockHoldings, buyStock, sellStock, initStockPrices } from "../systems/upgrades.js";
import { formatMoney } from "../utils/format.js";

const panel = document.getElementById("panel-stocks");

export function renderStocks(state, onChange) {
  if (!panel) return;
  initStockPrices(state);
  panel.innerHTML = "";
  const prices = stockPrices(state);
  const held = stockHoldings(state);

  const visible = STOCKS.filter(s => state.day >= (s.unlockAt?.day ?? 1));
  if (visible.length === 0) {
    panel.innerHTML = '<p style="color:var(--text-dim);text-align:center;padding:40px 0;">Market unlocks at day 8.</p>';
    return;
  }

  for (const s of visible) {
    const price = prices[s.id] || s.basePrice;
    const shares = held[s.id] || 0;
    const value = shares * price;
    const card = document.createElement("div");
    card.className = "biz-card";
    card.innerHTML = `
      <div class="biz-info">
        <div class="biz-name">${s.name}</div>
        <div class="biz-stats">
          ${formatMoney(price)}/share · vol ${(s.volatility * 100).toFixed(0)}%
          ${shares > 0 ? ` · you hold ${shares} (${formatMoney(value)})` : ""}
        </div>
      </div>
      <div class="biz-actions">
        <button class="btn-buy" data-buy="${s.id}" data-n="1">BUY 1</button>
        <button class="btn-buy" data-buy="${s.id}" data-n="10">BUY 10</button>
        ${shares > 0 ? `<button class="btn-sell" data-sell="${s.id}">SELL ALL</button>` : ""}
      </div>
    `;
    panel.appendChild(card);
  }

  panel.querySelectorAll("[data-buy]").forEach(btn => {
    btn.addEventListener("click", () => {
      buyStock(state, btn.dataset.buy, parseInt(btn.dataset.n, 10));
      onChange();
    });
  });
  panel.querySelectorAll("[data-sell]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.sell;
      sellStock(state, id, stockHoldings(state)[id] || 0);
      onChange();
    });
  });
}
