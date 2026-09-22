// GREEDY — currency earning, spending, bonuses
import { CURRENCIES, CURRENCY_SHOP, getCurrencyById, currentAmount, lifetimeMax, updateLifetime } from "../data/currencies.js";

// ---------- EARNING ----------
// Currency amounts are LIVE — tied to current money.
// If you spend, the amount drops. If you grow, it grows.

export function amounts(state) {
  const out = {};
  for (const c of CURRENCIES) {
    out[c.id] = {
      current: currentAmount(state, c),
      lifetime: lifetimeMax(state, c.id),
      threshold: c.threshold
    };
  }
  return out;
}

export function currencyAmount(state, id) {
  const c = getCurrencyById(id);
  if (!c) return 0;
  return currentAmount(state, c);
}

// ---------- SPENDING ----------
// Spending a currency *permanently* raises the "floor" money you must hold.
// Track via state.currencyFloor[currencyId] — its value goes up by the cost
// whenever you buy something. So current_amount = floor(money / threshold) - floor.

export function currencyFloor(state) {
  return state.currencyFloor || (state.currencyFloor = {});
}

export function availableAmount(state, id) {
  const c = getCurrencyById(id);
  if (!c) return 0;
  const total = currentAmount(state, c);
  const spent = currencyFloor(state)[id] || 0;
  return Math.max(0, total - spent);
}

export function purchases(state) {
  return state.currencyPurchases || (state.currencyPurchases = {});
}

export function canBuy(state, id, itemId) {
  const item = CURRENCY_SHOP[id]?.find(i => i.id === itemId);
  if (!item) return { can: false, reason: "unknown" };
  const owned = purchases(state)[itemId] || 0;
  if (!item.repeatable && owned > 0) return { can: false, reason: "owned" };
  if (availableAmount(state, id) < item.cost) return { can: false, reason: "not_enough" };
  return { can: true, item };
}

export function buy(state, id, itemId) {
  const check = canBuy(state, id, itemId);
  if (!check.can) return { success: false, reason: check.reason };
  const item = check.item;
  const floor = currencyFloor(state);
  floor[id] = (floor[id] || 0) + item.cost;
  purchases(state)[itemId] = (purchases(state)[itemId] || 0) + 1;
  return { success: true, item };
}

// ---------- BONUS AGGREGATION ----------
export function totalBonus(state) {
  const owned = purchases(state);
  const result = {
    globalMult: 1,
    tickPct: 0,
    tickMult: 1,
    eventPct: 0,
    hostilePct: 0,
    greedPct: 0,
    heatPct: 0,
    taxPct: 0,
    offlinePct: 0,
    startMoney: 0,
    dailyRep: 0,
    heistRewardPct: 0,
    heistSuccessPct: 0,
    stockPct: 0,
    lossReduction: 0,
    costMult: 1,
    superBonus: 0,
    unlocks: {},
    greedCap: null,
    noHostile: false,
    autoRebirth: false,
    noMoneyCap: false,
    keepUltras: false,
    allCities: false
  };

  for (const curId in CURRENCY_SHOP) {
    for (const item of CURRENCY_SHOP[curId]) {
      const count = owned[item.id] || 0;
      if (count === 0) continue;
      const e = item.effect || {};
      const repeat = item.repeatable ? count : 1;

      if (e.globalMult) result.globalMult *= Math.pow(e.globalMult, repeat);
      if (e.tickPct) result.tickPct += e.tickPct * repeat;
      if (e.tickMult) result.tickMult *= Math.pow(e.tickMult, repeat);
      if (e.eventPct) result.eventPct += e.eventPct * repeat;
      if (e.hostilePct) result.hostilePct += e.hostilePct * repeat;
      if (e.greedPct) result.greedPct += e.greedPct * repeat;
      if (e.heatPct) result.heatPct += e.heatPct * repeat;
      if (e.taxPct) result.taxPct += e.taxPct * repeat;
      if (e.offlinePct) result.offlinePct += e.offlinePct * repeat;
      if (e.startMoney) result.startMoney += e.startMoney * repeat;
      if (e.dailyRep) result.dailyRep += e.dailyRep * repeat;
      if (e.heistRewardPct) result.heistRewardPct += e.heistRewardPct * repeat;
      if (e.heistSuccessPct) result.heistSuccessPct += e.heistSuccessPct * repeat;
      if (e.stockPct) result.stockPct += e.stockPct * repeat;
      if (e.lossReduction) result.lossReduction += e.lossReduction * repeat;
      if (e.costMult) result.costMult *= Math.pow(e.costMult, repeat);
      if (e.superBonus) result.superBonus += e.superBonus * repeat;
      if (e.unlock) result.unlocks[e.unlock] = true;
      if (e.greedCap != null) result.greedCap = e.greedCap;
      if (e.noHostile) result.noHostile = true;
      if (e.autoRebirth) result.autoRebirth = true;
      if (e.noMoneyCap) result.noMoneyCap = true;
      if (e.keepUltras) result.keepUltras = true;
      if (e.allCities) result.allCities = true;
    }
  }

  return result;
}

// ---------- RESET ON REBIRTH ----------
export function resetForRebirth(state) {
  state.currencyFloor = {};
  state.currencyPurchases = {};
  // lifetime max stays (it's a milestone tracker, not currency held)
}

// ---------- TICK ----------
export function tickCurrencies(state) {
  updateLifetime(state);
}
