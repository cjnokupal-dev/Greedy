// GREEDY — entry point
import { createNewState, snapshot } from "./core/state.js";
import { loadGame, deleteSave } from "./core/save.js";
import { installLifecycleHooks, markDirty, forceSave, maybeAutosave } from "./core/autosave.js";
import { startLoop, stopLoop, isRunning, pendingEvents, pendingWarnings } from "./core/loop.js";
import { buy } from "./actions/buy.js";
import { sell } from "./actions/sell.js";
import { buyUpgrade } from "./systems/upgrades.js";
import * as Rebirth from "./systems/rebirth.js";
import { netWorth } from "./systems/economy.js";
import { renderHUD } from "./ui/hud.js";
import { renderShop } from "./ui/shop.js";
import { renderLog } from "./ui/log.js";
import { renderUpgrades } from "./ui/upgrades.js";
import { renderEmployees } from "./ui/employees.js";
import { renderStocks } from "./ui/stocks.js";
import { renderLoans } from "./ui/loans.js";
import { renderContracts } from "./ui/contracts.js";
import { renderResearch } from "./ui/research.js";
import { renderRebirth } from "./ui/rebirth.js";
import { renderAchievements } from "./ui/achievements.js";
import { renderWardrobe } from "./ui/wardrobe.js";
import { renderTitles } from "./ui/titles.js";
import { installSettings, refreshSettings } from "./ui/settings.js";
import { autoLogin } from "./core/autoLogin.js";
import { renderMap } from "./ui/map.js";
import { renderGambling } from "./ui/gambling.js";
import { checkOfflineEarnings, claimOfflineEarnings, installOfflineHooks } from "./systems/offline.js";
import { renderUltra, renderUltraShop } from "./ui/ultra.js";
import { renderScene, react } from "./ui/scene.js";
import { toast, showEventModal } from "./ui/notifications.js";
import { formatMoney } from "./utils/format.js";
import { achievementPopup, flash } from "./utils/juice.js";
import { renderDevPanel } from "./ui/devPanel.js";
import { renderSuperPrestige } from "./ui/superPrestige.js";
import { showGameOver, isGameOverShowing } from "./ui/gameOver.js";
import { renderStory, checkStoryPopup } from "./ui/story.js";
import { renderCollectibles } from "./ui/collectibles.js";
import { renderHeist } from "./ui/heist.js";
import { initChart, pushPoint, renderChart } from "./ui/chart.js";
import * as Sound from "./systems/sound.js";
import { renderVault } from "./ui/currencies.js";
import { installNavToggle } from "./ui/navToggle.js";
import { installTapZone } from "./ui/tapZone.js";
import { installNextUnlockBar, renderNextUnlock } from "./ui/nextUnlock.js";

const state = loadGame() || createNewState();

const panels = {
  shop: document.getElementById("panel-shop"),
  upgrades: document.getElementById("panel-upgrades"),
  employees: document.getElementById("panel-employees"),
  stocks: document.getElementById("panel-stocks"),
  loans: document.getElementById("panel-loans"),
  contracts: document.getElementById("panel-contracts"),
  research: document.getElementById("panel-research"),
  rebirth: document.getElementById("panel-rebirth"),
  achievements: document.getElementById("panel-achievements"),
  wardrobe: document.getElementById("panel-wardrobe"),
  titles: document.getElementById("panel-titles"),
  map: document.getElementById("panel-map"),
  gambling: document.getElementById("panel-gambling"),
  ultra: document.getElementById("panel-ultra"),
  settings: document.getElementById("panel-settings"),
  dev: document.getElementById("panel-dev"),
  super: document.getElementById("panel-super"),
  vault: document.getElementById("panel-vault"),
  heist: document.getElementById("panel-heist"),
  story: document.getElementById("panel-story"),
  collect: document.getElementById("panel-collect"),
  owned: document.getElementById("panel-owned"),
  log: document.getElementById("panel-log")
};
const advBtn = document.getElementById("btn-advance");

function onTick(report) {
  try { renderHUD(state); } catch (e) {}
  try { renderScene(state); } catch (e) {}
  try { renderUltra(state, refresh); } catch (e) {}
}

function onDay(s) {
  while (pendingEvents.length) {
    const ev = pendingEvents.shift();
    try { showEventModal({ name: ev.name, desc: ev.desc, deltas: ev.deltas }); } catch (e) {}
  }
  while (pendingWarnings.length) {
    try { toast(pendingWarnings.shift(), 2500); } catch (e) {}
  }
  try { refresh(); } catch (e) { console.error("refresh error", e); }
  try { checkStoryPopup(state, refresh); } catch (e) {}
  markDirty();
  try { maybeAutosave(s); } catch (e) {}
  if (s.gameOver) {
    stopLoop();
    advBtn.textContent = "💀 GAME OVER";
    advBtn.disabled = true;
  }
}

function updateButton() {
  if (state.gameOver) {
    advBtn.textContent = "💀 GAME OVER";
    advBtn.disabled = true;
    return;
  }
  advBtn.textContent = isRunning() ? "⏸ PAUSE" : "▶ RESUME";
}

advBtn.addEventListener("click", () => {
  if (state.gameOver) return;
  if (isRunning()) stopLoop();
  else startLoop(state, onTick, onDay);
  updateButton();
});

import { IS_LOCALHOST } from "./core/mode.js";

document.querySelectorAll(".tab").forEach(tab => {
  if (tab.dataset.tab === "dev" && !IS_LOCALHOST) { tab.style.display = "none"; }
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
    tab.classList.add("active");
    const p = panels[tab.dataset.tab];
    if (p) p.classList.add("active");
    try { refresh(); } catch (e) { console.error("tab refresh error", e); }
  });
});

function handleBuy(id, n) {
  const r = buy(state, id, n);
  if (!r.success) toast("Can't buy: " + (r.reason || "unknown"));
  else { toast("Bought " + r.unitsBought + " for " + formatMoney(r.spent)); try { Sound.bigPurchase(); } catch (e) {} try { react("buy"); } catch (e) {} }
  markDirty();
  refresh();
}

function handleSell(id, n) {
  const r = sell(state, id, n);
  if (!r.success) toast("Can't sell: " + (r.reason || "unknown"));
  else { toast("Sold " + r.unitsSold + " for " + formatMoney(r.gained)); try { react("sell"); } catch (e) {} }
  markDirty();
  refresh();
}

function handleBuyUpgrade(id) {
  const r = buyUpgrade(state, id);
  if (!r.success) toast("Can't buy upgrade: " + (r.reason || "unknown"));
  else toast("Upgrade purchased!");
  markDirty();
  refresh();
}

function handleRebirth() {
  const r = Rebirth.doRebirth(state, netWorth(state));
  if (!r.success) { toast("Cannot rebirth: " + r.reason); return; }
  toast("★ Rebirth! +" + r.reward + " points");
  for (const p of r.newPerks) toast("Unlocked: " + p.name, 3000);
  markDirty();
  forceSave(state);
  refresh();
}

function refresh() {
  try { renderHUD(state); } catch (e) { console.error("hud", e); }
  try { renderShop(state, handleBuy); } catch (e) { console.error("shop", e); }
  try { renderUpgrades(state, handleBuyUpgrade); } catch (e) { console.error("upgrades", e); }
  try { renderEmployees(state, refresh); } catch (e) { console.error("employees", e); }
  try { renderStocks(state, refresh); } catch (e) { console.error("stocks", e); }
  try { renderLoans(state, refresh); } catch (e) { console.error("loans", e); }
  try { renderContracts(state, refresh); } catch (e) { console.error("contracts", e); }
  try { renderResearch(state, refresh); } catch (e) { console.error("research", e); }
  try { renderRebirth(state, handleRebirth); } catch (e) { console.error("rebirth", e); }
  try { renderAchievements(state); } catch (e) { console.error("achievements", e); }
  try { renderWardrobe(state, refresh); } catch (e) { console.error("wardrobe", e); }
  try { renderTitles(state, refresh); } catch (e) { console.error("titles", e); }
  try { renderMap(state, refresh); } catch (e) { console.error("map", e); }
  try { renderGambling(state, refresh); } catch (e) { console.error("gambling", e); }
  try { renderUltraShop(state, refresh); } catch (e) { console.error("ultraShop", e); }
  try { refreshSettings(); } catch (e) { console.error("settings", e); }
  try { renderDevPanel(() => state, refresh); } catch (e) { console.error("devPanel", e); }
  try { renderSuperPrestige(state, refresh); } catch (e) { console.error("superPrestige", e); }
  try { renderVault(state, refresh); } catch (e) { console.error("vault", e); }
  try { renderHeist(state, refresh); } catch (e) { console.error("heist", e); }
  try { renderStory(state, refresh); } catch (e) { console.error("story", e); }
  try { renderCollectibles(state); } catch (e) { console.error("collect", e); }
  try { renderLog(state); } catch (e) { console.error("log", e); }
  try {
    if (panels.owned) {
      panels.owned.innerHTML = renderOwned(state);
      bindOwnedButtons();
    }
  } catch (e) { console.error("owned", e); }
}

function renderOwned(s) {
  const ids = Object.keys(s.owned);
  if (!ids.length) return '<p style="color:var(--text-dim);text-align:center;padding:40px 0;">You own nothing. Yet.</p>';
  let html = "";
  for (const id of ids) {
    html += '<div class="biz-card"><div class="biz-info"><div class="biz-name">' + id + '</div><div class="biz-stats">x' + s.owned[id] + ' owned</div></div><div class="biz-actions"><button class="btn-sell" data-sell-id="' + id + '" data-n="1">SELL 1</button></div></div>';
  }
  return html;
}

function bindOwnedButtons() {
  panels.owned.querySelectorAll("[data-sell-id]").forEach(btn => {
    btn.addEventListener("click", () => handleSell(btn.dataset.sellId, parseInt(btn.dataset.n)));
  });
}

window.__greedyAch = (a) => {
  try { achievementPopup(a); flash("rgba(255,184,77,0.3)"); } catch (e) {}
};

window.__state = () => state;
window.__freshState = createNewState;
window.GREEDY = {
  state,
  save: () => forceSave(state),
  reset: () => { deleteSave(); location.reload(); },
  snapshot: () => snapshot(state),
  pause: () => { stopLoop(); updateButton(); },
  play: () => { startLoop(state, onTick, onDay); updateButton(); }
};

try { installLifecycleHooks(() => state); } catch (e) { console.error("lifecycle", e); }

// offline earnings
try {
  const offline = checkOfflineEarnings(state);
  if (offline && offline.earnings > 1) {
    if (confirm("Welcome back!\n\nYou were away for " + offline.hoursAway.toFixed(1) + " hours.\nYou earned $" + offline.earnings.toFixed(0) + " offline.\n\nClaim now?")) {
      claimOfflineEarnings(state, offline.earnings);
    }
  }
} catch (e) { console.warn("offline", e); }
try { installOfflineHooks(); } catch (e) {}
forceSave(state);

try { installSettings(() => state, () => location.reload()); } catch (e) { console.error("installSettings", e); }

// dev auto-login (localhost only — no-op in production)
autoLogin().then(r => {
  if (r.ok) console.log("[main] cloud session ready");
}).catch(() => {});

// guard against stuck gameOver state
if (state.gameOver && state.money >= -5000) {
  console.log("[main] clearing stuck gameOver");
  state.gameOver = false;
  state.money = Math.max(100, state.money);
}

try { installNavToggle(); } catch (e) { console.error("navToggle", e); }
try { installTapZone(state, () => { renderHUD(state); }); } catch (e) { console.error("tapZone", e); }
try { installNextUnlockBar(); } catch (e) { console.error("nextUnlock", e); }
try { initChart(); } catch (e) {}
try { Sound.setEnabled(true); } catch (e) {}

refresh();
updateButton();
startLoop(state, onTick, onDay);
updateButton();
console.log("[main] booted", snapshot(state));
