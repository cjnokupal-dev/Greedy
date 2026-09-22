// GREEDY — sell action
// Wraps economy.sell, applies small greed relief, logs.
// Reads: economy.js, greed.js, businesses.js
// Mutates: state.money, state.owned, state.greed, state.stats, state.log

import { BALANCE } from "../data/balance.js";
import { getBusinessById } from "../data/businesses.js";
import * as Economy from "../systems/economy.js";
import * as Greed from "../systems/greed.js";

/**
 * Sell N units of a business.
 * Returns { success, gained, unitsSold, greedDelta, reason? }
 */
export function sell(state, businessId, n = 1) {
  const biz = getBusinessById(businessId);
  if (!biz) {
    return { success: false, reason: "unknown_business" };
  }

  if (!Number.isInteger(n) || n <= 0) {
    return { success: false, reason: "invalid_quantity" };
  }

  const result = Economy.sell(state, businessId, n);
  if (!result.success) {
    return result;
  }

  const greedRelief = Greed.subtractGreed(state, result.unitsSold * 0.5);

  state.stats.totalSales += result.unitsSold;

  pushLog(state, {
    day: state.day,
    kind: "sale",
    text: `Sold ${result.unitsSold}× ${biz.name} for $${fmt(result.gained)}`
  });

  return {
    success: true,
    gained: result.gained,
    unitsSold: result.unitsSold,
    greedDelta: -greedRelief,
    greedAfter: state.greed
  };
}

/**
 * Sell ALL units of a business.
 */
export function sellAll(state, businessId) {
  const owned = state.owned[businessId] || 0;
  if (owned <= 0) return { success: false, reason: "not_owned" };
  return sell(state, businessId, owned);
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
