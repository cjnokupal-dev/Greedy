// GREEDY — rebirth panel (tiers, perks, shop)
import { REBIRTH } from "../data/rebirth.js";
import { netWorth } from "../systems/economy.js";
import * as Rebirth from "../systems/rebirth.js";
import { formatMoney } from "../utils/format.js";
import { toast } from "./notifications.js";

const panel = document.getElementById("panel-rebirth");

let activeTab = "info";

export function renderRebirth(state, onRebirth) {
  if (!panel) return;
  panel.innerHTML = "";

  const nw = netWorth(state);
  const info = Rebirth.nextRebirth(state, nw);
  const pts = Rebirth.rebirthPoints(state);
  const avail = Rebirth.availablePoints(state);
  const count = Rebirth.rebirthCount(state);
  const perks = Rebirth.unlockedPerks(state);

  // header
  const header = document.createElement("div");
  header.className = "owned-summary";
  header.innerHTML = `
    <div class="row"><span>Rebirth level</span><span class="v">${count} / 50</span></div>
    <div class="row"><span>Rebirth points</span><span class="v">${pts} total · ${avail} available</span></div>
    <div class="row"><span>Net worth</span><span class="v money">${formatMoney(nw)}</span></div>
    <div class="row"><span>Income multiplier</span><span class="v money">${Rebirth.rebirthIncomeMult(state).toFixed(2)}×</span></div>
    <div class="row"><span>Start money next run</span><span class="v">${formatMoney(Rebirth.rebirthStartMoney(state))}</span></div>
  `;
  panel.appendChild(header);

  // inner tabs
  const tabs = document.createElement("div");
  tabs.style.cssText = "display:flex;gap:4px;margin:12px 0;";
  tabs.innerHTML = `
    <button data-rtab="info" class="${activeTab === "info" ? "active" : ""}" style="flex:1;padding:10px;background:var(--bg-panel);border:1px solid var(--border);border-radius:6px;${activeTab === "info" ? "background:var(--accent);color:#000;font-weight:800;" : "color:var(--text-dim);"}">REBIRTH</button>
    <button data-rtab="shop" class="${activeTab === "shop" ? "active" : ""}" style="flex:1;padding:10px;background:var(--bg-panel);border:1px solid var(--border);border-radius:6px;${activeTab === "shop" ? "background:var(--accent);color:#000;font-weight:800;" : "color:var(--text-dim);"}">SHOP</button>
    <button data-rtab="perks" class="${activeTab === "perks" ? "active" : ""}" style="flex:1;padding:10px;background:var(--bg-panel);border:1px solid var(--border);border-radius:6px;${activeTab === "perks" ? "background:var(--accent);color:#000;font-weight:800;" : "color:var(--text-dim);"}">PERKS</button>
  `;
  tabs.querySelectorAll("[data-rtab]").forEach(btn => {
    btn.addEventListener("click", () => {
      activeTab = btn.dataset.rtab;
      renderRebirth(state, onRebirth);
    });
  });
  panel.appendChild(tabs);

  // content
  if (activeTab === "info") renderInfoTab(panel, state, info, onRebirth);
  else if (activeTab === "shop") renderShopTab(panel, state, onRebirth);
  else if (activeTab === "perks") renderPerksTab(panel, state, perks);
}

function renderInfoTab(panel, state, info, onRebirth) {
  const card = document.createElement("div");
  card.className = "biz-card";
  card.style.borderColor = info.canRebirth ? "var(--accent)" : "var(--border)";
  card.innerHTML = `
    <div class="biz-info">
      <div class="biz-name">★ Rebirth ${info.level}</div>
      <div class="biz-desc">
        Requires net worth ${formatMoney(info.required)}<br>
        Reward: <b style="color:var(--accent)">+${info.reward} points</b><br>
        ${info.bonus ? "Bonus: " + info.bonus + "<br>" : ""}
        Progress: ${(info.progress * 100).toFixed(1)}%
      </div>
    </div>
    <div class="biz-actions">
      <button class="btn-buy" id="rebirth-btn" ${info.canRebirth ? "" : "disabled"}>
        ${info.canRebirth ? "REBIRTH NOW" : "LOCKED"}
      </button>
    </div>
  `;
  panel.appendChild(card);

  card.querySelector("#rebirth-btn")?.addEventListener("click", () => {
    if (!confirm("Rebirth now?\n\nYou lose: money, businesses, upgrades, employees, stocks, ultras.\nYou keep: rebirth points, perks, shop purchases, achievements.")) return;
    onRebirth();
  });

  // progress preview
  const next5 = document.createElement("div");
  next5.style.cssText = "margin-top:16px;font-size:11px;color:var(--text-dim);letter-spacing:1px;";
  next5.textContent = "NEXT REBIRTH TIERS";
  panel.appendChild(next5);

  const current = state.rebirthCount || 0;
  for (let i = current; i < Math.min(current + 5, 50); i++) {
    const tier = REBIRTH.tiers[i];
    if (!tier) break;
    const row = document.createElement("div");
    row.className = "biz-card";
    row.style.opacity = i === current ? "1" : "0.6";
    row.innerHTML = `
      <div class="biz-info">
        <div class="biz-name">Tier ${tier.level} — ${formatMoney(tier.netWorth)} NW</div>
        <div class="biz-stats">+${tier.points} points ${tier.bonus ? "· " + tier.bonus : ""}</div>
      </div>
    `;
    panel.appendChild(row);
  }
}

function renderShopTab(panel, state, onChange) {
  const shop = Rebirth.shopPurchases(state);
  const avail = Rebirth.availablePoints(state);

  const summary = document.createElement("div");
  summary.className = "owned-summary";
  summary.innerHTML = `
    <div class="row"><span>Available points</span><span class="v" style="color:var(--accent);font-size:18px;">${avail}</span></div>
    <div class="row"><span>Tip</span><span class="v" style="font-size:11px;">Spend points on permanent upgrades</span></div>
  `;
  panel.appendChild(summary);

  for (const item of REBIRTH.shop) {
    const owned = shop[item.id] || 0;
    const canBuy = item.repeatable || owned === 0;
    const canAfford = avail >= item.cost;
    const card = document.createElement("div");
    card.className = "biz-card";
    card.style.opacity = canBuy && canAfford ? "1" : "0.5";
    card.innerHTML = `
      <div class="biz-info">
        <div class="biz-name">${item.name} ${owned > 0 ? `<span style="color:var(--money);font-size:11px;">(${owned}×)</span>` : ""}</div>
        <div class="biz-desc">${item.repeatable ? "Repeatable" : "One-time unlock"}</div>
      </div>
      <div class="biz-actions">
        <button class="btn-buy" ${!canBuy || !canAfford ? "disabled" : ""}>
          ${item.cost} PT${item.cost > 1 ? "S" : ""}
        </button>
      </div>
    `;
    panel.appendChild(card);
    if (canBuy) {
      card.querySelector("button").addEventListener("click", () => {
        const r = Rebirth.buyShopItem(state, item.id);
        if (r.success) toast("Purchased: " + item.name);
        else toast("Cannot buy: " + r.reason);
        onChange();
      });
    }
  }
}

function renderPerksTab(panel, state, perks) {
  const count = state.rebirthCount || 0;
  const unlocked = Object.keys(perks).length;

  const summary = document.createElement("div");
  summary.className = "owned-summary";
  summary.innerHTML = `
    <div class="row"><span>Perks unlocked</span><span class="v">${unlocked} / ${REBIRTH.unlocks.length}</span></div>
    <div class="row"><span>Rebirth count</span><span class="v">${count}</span></div>
  `;
  panel.appendChild(summary);

  for (const p of REBIRTH.unlocks) {
    const has = !!perks[p.id];
    const card = document.createElement("div");
    card.className = "biz-card";
    card.style.opacity = has ? "1" : "0.4";
    card.innerHTML = `
      <div class="biz-icon" style="${has ? "background:var(--accent);color:#000;" : ""}">
        ${has ? "✓" : "🔒"}
      </div>
      <div class="biz-info">
        <div class="biz-name" style="${has ? "color:var(--accent);" : ""}">${p.name}</div>
        <div class="biz-desc">${p.desc}</div>
        <div class="biz-stats">Requires rebirth ${p.rebirths}</div>
      </div>
    `;
    panel.appendChild(card);
  }
}
