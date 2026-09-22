// GREEDY — ultra shop (full store interface)
import { ULTRAS, getUltraById, ULTRA_DURATION_MS } from "../data/ultra.js";
import { activeOffer, buyUltra, purchasedUltras, clearOffer } from "../systems/ultra.js";
import { formatMoney } from "../utils/format.js";
import { toast } from "./notifications.js";

let popupEl = null;
let popupTimer = null;
let panelEl = null;

// ============================================
// POPUP — appears when an ultra offer spawns
// ============================================
function ensurePopup() {
  if (popupEl) return popupEl;
  popupEl = document.createElement("div");
  popupEl.id = "ultra-popup";
  popupEl.style.cssText = `
    position: fixed; left: 50%; top: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, #1a1a2e, #2a1a3e);
    border: 2px solid #ffd700;
    border-radius: 14px;
    padding: 22px;
    width: 320px;
    max-width: 90vw;
    z-index: 500;
    box-shadow: 0 0 40px rgba(255,215,0,0.5);
    display: none;
    animation: fadeIn 0.3s ease-out;
  `;
  document.body.appendChild(popupEl);
  return popupEl;
}

export function renderUltra(state, onChange) {
  const box = ensurePopup();
  const offer = activeOffer(state);

  if (!offer) {
    box.style.display = "none";
    if (popupTimer) { clearInterval(popupTimer); popupTimer = null; }
    return;
  }

  const u = getUltraById(offer.id);
  if (!u) { box.style.display = "none"; return; }

  const msLeft = offer.expiresAt - Date.now();
  if (msLeft <= 0) { box.style.display = "none"; return; }

  const pct = (msLeft / ULTRA_DURATION_MS) * 100;
  const canAfford = state.money >= u.cost;
  const secs = Math.ceil(msLeft / 1000);

  box.style.display = "block";
  box.innerHTML = `
    <div style="font-size:10px;color:#ffd700;letter-spacing:3px;margin-bottom:6px;">★ ULTRA OFFER ★</div>
    <div style="font-size:22px;font-weight:800;color:#fff;margin-bottom:8px;">${u.name}</div>
    <div style="font-size:13px;color:#c8c8d8;margin-bottom:14px;">${u.desc}</div>
    <div style="font-size:18px;font-weight:700;color:${canAfford ? "#ffd700" : "#ef4444"};margin-bottom:12px;">
      ${formatMoney(u.cost)}
    </div>
    <div style="height:6px;background:#0a0a14;border-radius:3px;overflow:hidden;margin-bottom:12px;">
      <div id="ultra-bar" style="height:100%;width:${pct}%;background:#ffd700;transition:width 0.15s linear;"></div>
    </div>
    <div id="ultra-countdown" style="font-size:11px;color:#8888a0;text-align:center;margin-bottom:12px;">${secs}s remaining</div>
    <button id="ultra-buy" style="width:100%;padding:12px;background:#ffd700;color:#000;font-weight:800;border-radius:8px;letter-spacing:1px;${canAfford ? "" : "opacity:0.4;"}">
      ${canAfford ? "BUY NOW" : "NOT ENOUGH MONEY"}
    </button>
    <button id="ultra-skip" style="width:100%;padding:8px;background:transparent;color:#666;font-size:12px;margin-top:6px;">skip</button>
  `;

  box.querySelector("#ultra-buy").addEventListener("click", () => {
    const r = buyUltra(state, u.id);
    if (!r.success) { toast("Cannot buy: " + r.reason); return; }
    toast("★ Purchased: " + u.name);
    box.style.display = "none";
    onChange();
  });

  box.querySelector("#ultra-skip").addEventListener("click", () => {
    clearOffer(state);
    box.style.display = "none";
  });

  if (popupTimer) clearInterval(popupTimer);
  popupTimer = setInterval(() => {
    const left = offer.expiresAt - Date.now();
    if (left <= 0) {
      clearInterval(popupTimer); popupTimer = null;
      box.style.display = "none";
      import("../systems/ultra.js").then(m => m.expireOffer(state));
      return;
    }
    const bar = box.querySelector("#ultra-bar");
    const cd = box.querySelector("#ultra-countdown");
    const p = (left / ULTRA_DURATION_MS) * 100;
    if (bar) bar.style.width = p + "%";
    if (cd) cd.textContent = Math.ceil(left / 1000) + "s remaining";
  }, 200);
}

// ============================================
// PANEL — full store (all ultras, owned + locked)
// ============================================
export function renderUltraShop(state, onChange) {
  if (!panelEl) panelEl = document.getElementById("panel-ultra");
  if (!panelEl) return;

  panelEl.innerHTML = "";
  const owned = purchasedUltras(state);
  const ownedCount = Object.keys(owned).length;

  // summary
  const summary = document.createElement("div");
  summary.className = "owned-summary";
  summary.innerHTML = `
    <div class="row"><span>Ultras owned</span><span class="v" style="color:var(--accent);">${ownedCount} / ${ULTRAS.length}</span></div>
    <div class="row"><span>Progress</span><span class="v">${((ownedCount / ULTRAS.length) * 100).toFixed(0)}%</span></div>
  `;
  panelEl.appendChild(summary);

  // offer banner
  const offer = activeOffer(state);
  if (offer) {
    const u = getUltraById(offer.id);
    const banner = document.createElement("div");
    banner.className = "biz-card";
    banner.style.borderColor = "var(--accent)";
    banner.style.background = "linear-gradient(135deg, #2a1a3e, #1a1a2e)";
    banner.innerHTML = `
      <div class="biz-info">
        <div class="biz-name" style="color:var(--accent);">★ ACTIVE OFFER: ${u.name}</div>
        <div class="biz-desc">${u.desc}</div>
        <div class="biz-stats">Expires in ${Math.ceil((offer.expiresAt - Date.now()) / 1000)}s</div>
      </div>
      <div class="biz-actions">
        <button class="btn-buy">BUY ${formatMoney(u.cost)}</button>
      </div>
    `;
    panelEl.appendChild(banner);
    banner.querySelector("button").addEventListener("click", () => {
      const r = buyUltra(state, u.id);
      if (!r.success) toast("Cannot buy: " + r.reason);
      else toast("★ Purchased: " + u.name);
      onChange();
    });
  }

  // shop grid
  const title = document.createElement("div");
  title.style.cssText = "font-size:11px;color:var(--text-dim);letter-spacing:2px;margin:16px 0 8px;";
  title.textContent = "ULTRA CATALOG";
  panelEl.appendChild(title);

  for (const u of ULTRAS) {
    const isOwned = !!owned[u.id];
    const canBuyNow = state.money >= u.cost;
    const locked = state.day < u.minDay;
    const card = document.createElement("div");
    card.className = "biz-card";
    card.style.opacity = isOwned ? "1" : locked ? "0.35" : "0.85";
    card.style.borderColor = isOwned ? "var(--money)" : locked ? "var(--border)" : "var(--accent)";
    card.innerHTML = `
      <div class="biz-icon" style="${isOwned ? "background:var(--money);color:#000;" : "background:linear-gradient(135deg, #ffd700, #ff8c00);color:#000;"}">
        ${isOwned ? "✓" : locked ? "🔒" : "★"}
      </div>
      <div class="biz-info">
        <div class="biz-name" style="${isOwned ? "color:var(--money);" : ""}">${u.name}</div>
        <div class="biz-desc">${u.desc}</div>
        <div class="biz-stats">
          ${isOwned ? "Owned" : locked ? "Unlocks day " + u.minDay : "Available in Ultra Offers"}
        </div>
      </div>
      <div class="biz-actions">
        <div style="font-size:12px;color:${canBuyNow ? "var(--money)" : "var(--text-dim)"};font-weight:700;text-align:right;">
          ${formatMoney(u.cost)}
        </div>
      </div>
    `;
    panelEl.appendChild(card);
  }

  // note about how to obtain
  const note = document.createElement("div");
  note.style.cssText = "font-size:11px;color:var(--text-dim);text-align:center;padding:16px;font-style:italic;";
  note.textContent = "Ultras appear as timed offers every 10 days. Miss them and wait for the next cycle.";
  panelEl.appendChild(note);
}
