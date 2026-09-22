// GREEDY — buy action
import { BALANCE } from "../data/balance.js";
import { getBusinessById } from "../data/businesses.js";
import * as Economy from "../systems/economy.js";
import * as Greed from "../systems/greed.js";

export function buy(state, businessId, n = 1) {
  const biz = getBusinessById(businessId);
  if (!biz) return { success: false, reason: "unknown_business" };

  n = Math.floor(Number(n));
  if (!Number.isFinite(n) || n <= 0) {
    return { success: false, reason: "invalid_quantity" };
  }

  if (!isUnlocked(state, biz)) {
    return { success: false, reason: "locked" };
  }

  const result = Economy.buy(state, businessId, n);
  if (!result.success) return result;

  const greedGained = Greed.gainFromPurchase(state, result.unitsBought);
  const greedRelief = Greed.reliefFromSpend(state, result.spent);
  const greedDelta = greedGained - greedRelief;

  state.stats.totalSpent += result.spent;
  state.stats.totalPurchases += result.unitsBought;

  pushLog(state, {
    day: state.day,
    kind: "purchase",
    text: "Bought " + result.unitsBought + "x " + biz.name + " for $" + fmt(result.spent)
  });

  return {
    success: true,
    spent: result.spent,
    unitsBought: result.unitsBought,
    greedDelta,
    greedAfter: state.greed
  };
}

export function buyMax(state, businessId) {
  const biz = getBusinessById(businessId);
  if (!biz) return { success: false, reason: "unknown_business" };

  const owned = state.owned[businessId] || 0;
  const available = state.money;

  const growth = 1 + BALANCE.economy.costGrowthPerUnit;
  const firstUnitCost = biz.baseCost * Math.pow(growth, owned);

  let n;
  if (firstUnitCost >= available) {
    n = 0;
  } else {
    const ratio = (available * (growth - 1)) / firstUnitCost + 1;
    n = Math.floor(Math.log(ratio) / Math.log(growth));
    if (n < 1) n = 1;
    if (n > 10000000) n = 10000000;
  }

  if (n <= 0) return { success: false, reason: "cannot_afford" };

  // verify exact cost — trim down if slightly over
  let cost = Economy.bulkCost(businessId, owned, n);
  while (cost > available && n > 0) {
    n--;
    cost = Economy.bulkCost(businessId, owned, n);
  }
  if (n <= 0) return { success: false, reason: "cannot_afford" };

  return buy(state, businessId, n);
}

function isUnlocked(state, biz) {
  const u = biz.unlockAt || {};
  if (u.money != null && state.money < u.money) return false;
  if (u.day != null && state.day < u.day) return false;
  return true;
}

function pushLog(state, entry) {
  state.log = state.log || [];
  state.log.push({ ...entry, time: Date.now() });
  const max = BALANCE?.limits?.logEntries ?? 200;
  if (state.log.length > max) state.log.splice(0, state.log.length - max);
}

function fmt(n) {
  if (!isFinite(n)) return "0";
  const abs = Math.abs(n);
  if (abs >= 1e9) return (n / 1e9).toFixed(2) + "B";
  if (abs >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (abs >= 1e3) return (n / 1e3).toFixed(2) + "K";
  return n.toFixed(2);
}
