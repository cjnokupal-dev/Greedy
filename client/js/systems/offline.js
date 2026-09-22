// GREEDY — offline earnings
import { BALANCE } from "../data/balance.js";
import { BUSINESSES } from "../data/businesses.js";
import * as Rebirth from "./rebirth.js";

const OFFLINE_KEY = "offline_last_seen";

export function recordLastSeen() {
  try { localStorage.setItem(OFFLINE_KEY, Date.now().toString()); } catch (e) {}
}

export function checkOfflineEarnings(state) {
  let last = 0;
  try { last = parseInt(localStorage.getItem(OFFLINE_KEY) || "0", 10); } catch (e) { return null; }
  if (!last) return null;

  const now = Date.now();
  const elapsedMs = now - last;
  const elapsedHours = elapsedMs / 3600000;

  // only worth it if away more than 30 seconds
  if (elapsedHours < 0.0083) return null;

  // cap offline at 24 hours
  const cappedHours = Math.min(elapsedHours, 24);
  const secondsPerDay = 60; // 60 ticks = 1 day (from loop.js)
  const secondsOffline = cappedHours * 3600;
  const daysOffline = secondsOffline / secondsPerDay;

  // base daily income
  let gross = 0;
  for (const id in state.owned) {
    const biz = BUSINESSES.find(b => b.id === id);
    if (biz) gross += biz.baseIncome * state.owned[id];
  }
  const opCost = gross * BALANCE.economy.operatingCostRate;
  const netDaily = (gross - opCost) * Rebirth.rebirthIncomeMult(state);

  // offline earns 25% (or more with perks)
  let rate = 0.25;
  if (Rebirth.hasPerk(state, "offline_cash")) rate = 0.50;
  const shop = state.rebirthShop || {};
  if (shop.s_offline_bonus) rate += shop.s_offline_bonus * 0.10;

  const earnings = netDaily * daysOffline * rate;

  if (earnings < 1) return null;

  return {
    earnings,
    hoursAway: cappedHours,
    capped: elapsedHours > 24,
    rate
  };
}

export function claimOfflineEarnings(state, amount) {
  state.money += amount;
  state.stats.totalEarned = (state.stats.totalEarned || 0) + amount;
  recordLastSeen();
}

export function installOfflineHooks() {
  // save last seen on page hide
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") recordLastSeen();
  });
  window.addEventListener("beforeunload", recordLastSeen);
}
