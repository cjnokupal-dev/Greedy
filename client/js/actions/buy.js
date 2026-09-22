// GREEDY — buy action
// Wraps economy.buy, applies greed, relief, and logs.
// Reads: economy.js, greed.js, businesses.js
// Mutates: state.money, state.owned, state.greed, state.stats, state.log

import { BALANCE } from "../data/balance.js";
import { getBusinessById } from "../data/businesses.js";
import * as Economy from "../systems/economy.js";
import * as Greed from "../systems/greed.js";

/**
 * Buy N units of a business.
 * Returns { success, spent, unitsBought, greedDelta, reason? }
 */
export function buy(state, businessId, n = 1) {
  const biz = getBusinessById(businessId);
  if (!biz) {
    return { success: false, reason: "unknown_business" };
  }

  if (!Number.isInteger(n) || n <= 0) {
    return { success: false, reason: "invalid_quantity" };
  }

  if (!isUnlocked(state, biz)) {
    return { success: false, reason: "locked" };
  }

  const result = Economy.buy(state, businessId, n);
  if (!result.success) {
    return result;
  }

  const greedGained = Greed.gainFromPurchase(state, result.unitsBought);
  const greedRelief = Greed.reliefFromSpend(state, result.spent);
  const greedDelta = greedGained - greedRelief;

  state.stats.totalSpent += result.spent;
  state.stats.totalPurchases += result.unitsBought;

  pushLog(state, {
    day: state.day,
    kind: "purchase",
    text: `Bought ${result.unitsBought}× ${biz.name} for $${fmt(result.spent)}`
  });

  return {
    success: true,
    spent: result.spent,
    unitsBought: result.unitsBought,
    greedDelta,
    greedAfter: state.greed
  };
}

/**
 * Buy the maximum affordable units.
 */
export function buyMax(state, businessId) {
  const owned = state.owned[businessId] || 0;
  const n = Economy.maxAffordable(businessId, owned, state.money);
  if (n <= 0) return { success: false, reason: "cannot_afford" };
  return buy(state, businessId, n);
}

function isUnlocked(state, biz) {
  const u = biz.unlockAt || {};
  if (u.money != null && state.money < u.money) return false;
  if (u.day   != null && state.day   < u.day)   return false;
  return true;
}

function pushLog(state, entry) {
  state.log.push({ ...entry, time: Date.now() });
  const max = BALANCE?.limits?.logEntries ?? 200;
  if (state.log.length > max) {
    state.log.splice(0, state.log.length - max);
  }
}

function fmt(n) {
  if (!isFinite(n)) return "0";
  const abs = Math.abs(n);
  if (abs >= 1e9) return (n / 1e9).toFixed(2) + "B";
  if (abs >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (abs >= 1e3) return (n / 1e3).toFixed(2) + "K";
  return n.toFixed(2);
}
