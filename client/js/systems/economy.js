// GREEDY — economy system
// Computes costs, income, and applies transactions.
// Reads: balance.js, businesses.js
// Mutates: state.money, state.owned, state.stats

import { BALANCE } from "../data/balance.js";
import { BUSINESSES, getBusinessById } from "../data/businesses.js";

// ==========================================
// COST / INCOME MATH (pure)
// ==========================================

/**
 * Cost of the NEXT unit of a business.
 * Each owned unit raises the price by costGrowthPerUnit.
 */
export function nextCost(businessId, ownedCount) {
  const b = getBusinessById(businessId);
  if (!b) return Infinity;
  const growth = 1 + BALANCE.economy.costGrowthPerUnit;
  return Math.floor(b.baseCost * Math.pow(growth, ownedCount));
}

/**
 * Total cost to buy N units starting from current owned count.
 */
export function bulkCost(businessId, ownedCount, n) {
  let total = 0;
  for (let i = 0; i < n; i++) {
    total += nextCost(businessId, ownedCount + i);
  }
  return total;
}

/**
 * How many units can be afforded with a given money amount.
 */
export function maxAffordable(businessId, ownedCount, money) {
  let count = 0;
  let spent = 0;
  while (true) {
    const c = nextCost(businessId, ownedCount + count);
    if (spent + c > money) break;
    spent += c;
    count++;
    if (count > 10000) break; // safety
  }
  return count;
}

/**
 * Income from a single business given owned count.
 */
export function incomeFrom(businessId, ownedCount) {
  const b = getBusinessById(businessId);
  if (!b || ownedCount <= 0) return 0;
  return b.baseIncome * ownedCount;
}

/**
 * Total daily income across all owned businesses,
 * before greed bonus, after operating cost.
 */
export function grossDailyIncome(owned) {
  let total = 0;
  for (const id in owned) {
    total += incomeFrom(id, owned[id]);
  }
  return total;
}

/**
 * Operating cost — a fraction of gross income.
 */
export function dailyOperatingCost(owned) {
  return grossDailyIncome(owned) * BALANCE.economy.operatingCostRate;
}

/**
 * Net daily income after operating cost, before greed/tax.
 */
export function netDailyIncome(owned) {
  return grossDailyIncome(owned) - dailyOperatingCost(owned);
}

// ==========================================
// TRANSACTIONS (mutate state)
// ==========================================

/**
 * Attempt to buy N units of a business.
 * Returns { success, spent, unitsBought }.
 */
export function buy(state, businessId, n = 1) {
  const owned = state.owned[businessId] || 0;
  const cost = bulkCost(businessId, owned, n);

  if (cost > state.money) {
    return { success: false, spent: 0, unitsBought: 0, reason: "insufficient_funds" };
  }

  state.money -= cost;
  state.owned[businessId] = owned + n;

  state.stats = state.stats || {};
  state.stats.totalSpent = (state.stats.totalSpent || 0) + cost;
  state.stats.totalPurchases = (state.stats.totalPurchases || 0) + n;

  return { success: true, spent: cost, unitsBought: n };
}

/**
 * Sell N units of a business. Refunds a fraction of their cost.
 * Sells from the most recent (most expensive) units first.
 */
export function sell(state, businessId, n = 1) {
  const owned = state.owned[businessId] || 0;
  if (owned < n) {
    return { success: false, gained: 0, unitsSold: 0, reason: "not_owned" };
  }

  let refund = 0;
  for (let i = 0; i < n; i++) {
    refund += nextCost(businessId, owned - 1 - i);
  }
  refund *= BALANCE.economy.sellRefundRate;

  state.owned[businessId] = owned - n;
  if (state.owned[businessId] === 0) delete state.owned[businessId];

  state.money += refund;

  state.stats = state.stats || {};
  state.stats.totalEarned = (state.stats.totalEarned || 0) + refund;
  state.stats.totalSales = (state.stats.totalSales || 0) + n;

  return { success: true, gained: refund, unitsSold: n };
}

/**
 * Apply daily income to state.money.
 * Called by advanceDay. Does NOT touch greed — that's greed.js's job.
 */
export function applyDailyIncome(state, multiplier = 1) {
  const net = netDailyIncome(state.owned) * multiplier;
  state.money += net;

  state.stats = state.stats || {};
  state.stats.totalEarned = (state.stats.totalEarned || 0) + Math.max(0, net);

  return net;
}

// ==========================================
// NET WORTH
// ==========================================

/**
 * Net worth = cash + sell-value of everything owned.
 */
export function netWorth(state) {
  let worth = state.money;
  for (const id in state.owned) {
    const owned = state.owned[id];
    let value = 0;
    for (let i = 0; i < owned; i++) {
      value += nextCost(id, i);
    }
    worth += value * BALANCE.economy.sellRefundRate;
  }
  return worth;
}

// ==========================================
// SUMMARY (for UI)
// ==========================================

/**
 * Everything the HUD needs, in one object.
 */
export function summarize(state) {
  const gross = grossDailyIncome(state.owned);
  const opCost = dailyOperatingCost(state.owned);
  const net = gross - opCost;

  return {
    money: state.money,
    grossDailyIncome: gross,
    operatingCost: opCost,
    netDailyIncome: net,
    netWorth: netWorth(state),
    businessCount: Object.keys(state.owned).length,
    totalUnits: Object.values(state.owned).reduce((a, b) => a + b, 0)
  };
}
