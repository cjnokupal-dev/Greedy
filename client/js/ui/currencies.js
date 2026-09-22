// GREEDY — Vault panel (12 currencies, sub-tabs)
import { CURRENCIES, CURRENCY_SHOP, getCurrencyById, currentAmount, lifetimeMax } from "../data/currencies.js";
import * as Cur from "../systems/currencies.js";
import { formatMoney } from "../utils/format.js";
import { toast } from "./notifications.js";

const panel = () => document.getElementById("panel-vault");
let activeCurrency = "gem";

export function renderVault(state, onChange) {
  const el = panel();
  if (!el) return;
  el.innerHTML = "";

  // currency tab strip
  const strip = document.createElement("div");
  strip.style.cssText = "display:flex;gap:4px;overflow-x:auto;padding-bottom:8px;margin-bottom:12px;-webkit-overflow-scrolling:touch;scrollbar-width:none;";
  strip.innerHTML = '<style>#vault-strip::-webkit-scrollbar{display:none}</style>';
  strip.id = "vault-strip";
  for (const c of CURRENCIES) {
    const cur = currentAmount(state, c);
    const life = lifetimeMax(state, c.id);
    const active = activeCurrency === c.id;
    const btn = document.createElement("button");
    btn.style.cssText = `
      flex:0 0 auto;
      min-width:64px;
      padding:8px 10px;
      background:${active ? c.color + "22" : "transparent"};
      border:1px solid ${active ? c.color : "var(--border)"};
      border-radius:6px;
      color:${active ? c.color : "var(--text-dim)"};
      font-family:var(--font-display);
      font-size:9px;
      letter-spacing:1px;
      font-weight:700;
      display:flex;
      flex-direction:column;
      align-items:center;
      gap:3px;
      opacity:${cur > 0 || life > 0 ? "1" : "0.5"};
    `;
    btn.innerHTML = `<span style="font-size:18px;">${c.icon}</span><span>${cur}</span>`;
    btn.onclick = () => { activeCurrency = c.id; renderVault(state, onChange); };
    strip.appendChild(btn);
  }
  el.appendChild(strip);

  const c = getCurrencyById(activeCurrency);
  if (!c) return;

  const cur = currentAmount(state, c);
  const life = lifetimeMax(state, c.id);
  const avail = Cur.availableAmount(state, c.id);
  const floor = (state.currencyFloor || {})[c.id] || 0;

  // summary card
  const summary = document.createElement("div");
  summary.className = "owned-summary";
  summary.style.borderLeftColor = c.color;
  summary.innerHTML = `
    <div class="row"><span>${c.icon} ${c.name}</span><span class="v" style="color:${c.color};font-size:18px;">${cur}</span></div>
    <div class="row"><span>Available to spend</span><span class="v" style="color:${c.color};">${avail}</span></div>
    <div class="row"><span>Lifetime max</span><span class="v">${life}</span></div>
    <div class="row"><span>Threshold</span><span class="v money">${formatMoney(c.threshold)}</span></div>
    <div class="row" style="font-size:11px;color:var(--text-mute);font-style:italic;padding-top:8px;">
      <span>${c.desc}</span>
    </div>
  `;
  el.appendChild(summary);

  // shop list
  const items = CURRENCY_SHOP[c.id] || [];
  if (items.length === 0) {
    el.innerHTML += '<p style="text-align:center;padding:40px 0;color:var(--text-dim);">No items yet.</p>';
    return;
  }

  for (const item of items) {
    const owned = Cur.purchases(state)[item.id] || 0;
    const canBuyItem = Cur.canBuy(state, c.id, item.id);
    const locked = !canBuyItem.can && canBuyItem.reason === "not_enough";
    const alreadyOwned = !item.repeatable && owned > 0;

    const card = document.createElement("div");
    card.className = "biz-card";
    card.style.borderLeftColor = alreadyOwned ? "var(--money)" : c.color;
    card.style.opacity = alreadyOwned ? "1" : locked ? "0.55" : "1";
    card.innerHTML = `
      <div class="biz-icon" style="background:${c.color}22;color:${c.color};border-color:${c.color};">${alreadyOwned ? "✓" : c.icon}</div>
      <div class="biz-info">
        <div class="biz-name" style="${alreadyOwned ? "color:var(--money);" : ""}">${item.name}${owned > 0 ? " ×" + owned : ""}</div>
        <div class="biz-desc">${item.desc}</div>
        <div class="biz-stats" style="color:${c.color};">Cost: ${item.cost} ${c.icon}${item.repeatable ? " · repeatable" : ""}</div>
      </div>
      <div class="biz-actions">
        <button class="btn-buy" ${alreadyOwned || locked ? "disabled" : ""}>
          ${alreadyOwned ? "OWNED" : "BUY"}
        </button>
      </div>
    `;
    if (!alreadyOwned && !locked) {
      card.querySelector("button").onclick = () => {
        const r = Cur.buy(state, c.id, item.id);
        if (r.success) toast("Bought: " + item.name);
        else toast("Cannot buy: " + r.reason);
        onChange();
      };
    }
    el.appendChild(card);
  }
}
