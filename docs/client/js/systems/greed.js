// GREEDY — the core mechanic
// Tracks the greed meter, applies income bonuses and danger thresholds.
// Reads: balance.js
// Mutates: state.greed

import { BALANCE } from "../data/balance.js";

// ==========================================
// STATE HELPERS
// ==========================================

export function initGreed(state) {
  if (typeof state.greed !== "number") {
    state.greed = BALANCE.greed.start;
  }
  return state.greed;
}

export function getGreed(state) {
  return state.greed ?? 0;
}

export function getGreedRatio(state) {
  return getGreed(state) / BALANCE.greed.max;
}

// ==========================================
// INCOME BONUS
// ==========================================
// Greed pays. Higher meter = bigger multiplier on all income.
// Linear from 1.0 at greed=0 to (1 + maxIncomeBonus) at greed=max.

export function incomeMultiplier(state) {
  const ratio = getGreedRatio(state);
  return 1 + ratio * BALANCE.greed.maxIncomeBonus;
}

// ==========================================
// DANGER THRESHOLDS
// ==========================================

export function isDangerous(state) {
  return getGreed(state) >= BALANCE.greed.dangerThreshold;
}

export function isHighRisk(state) {
  return getGreed(state) >= BALANCE.greed.highRiskThreshold;
}

export function isCritical(state) {
  return getGreed(state) >= BALANCE.greed.criticalThreshold;
}

/**
 * Returns "safe" | "danger" | "high" | "critical" | "overloaded"
 */
export function dangerLevel(state) {
  const g = getGreed(state);
  const { dangerThreshold, highRiskThreshold, criticalThreshold, max } = BALANCE.greed;
  if (g >= max)              return "overloaded";
  if (g >= criticalThreshold) return "critical";
  if (g >= highRiskThreshold) return "high";
  if (g >= dangerThreshold)   return "danger";
  return "safe";
}

// ==========================================
// GAIN / DECAY
// ==========================================

/**
 * Add greed from earning income.
 * Called once per day after applyDailyIncome.
 */
export function gainFromIncome(state, incomeEarned) {
  if (incomeEarned <= 0) return 0;
  const gained = incomeEarned * BALANCE.greed.gainPerIncome;
  return addGreed(state, gained);
}

/**
 * Add greed from a purchase.
 * Called by actions/buy.js after a successful buy.
 */
export function gainFromPurchase(state, unitsBought = 1) {
  const gained = unitsBought * BALANCE.greed.gainPerPurchase;
  return addGreed(state, gained);
}

/**
 * Add greed from owned businesses (their per-unit greed).
 * Called once per day. This is the passive drain toward danger.
 */
export function gainFromOwned(state, businesses) {
  let gained = 0;
  for (const id in state.owned) {
    const biz = businesses.find(b => b.id === id);
    if (!biz) continue;
    gained += biz.greedPerUnit * state.owned[id];
  }
  return addGreed(state, gained);
}

/**
 * Relief — spending big reduces greed.
 * Called after large purchases or acts of charity.
 */
export function reliefFromSpend(state, amountSpent) {
  if (amountSpent < 1000) return 0;
  const relief = (amountSpent / 1000) * BALANCE.greed.reliefPerBigSpend;
  return subtractGreed(state, relief);
}

/**
 * Natural daily decay.
 */
export function decay(state) {
  return subtractGreed(state, BALANCE.greed.decayPerDay);
}

// ==========================================
// CORE MUTATORS
// ==========================================

export function addGreed(state, amount) {
  if (amount <= 0) return 0;
  const before = getGreed(state);
  state.greed = Math.min(BALANCE.greed.max, before + amount);
  return state.greed - before;
}

export function subtractGreed(state, amount) {
  if (amount <= 0) return 0;
  const before = getGreed(state);
  state.greed = Math.max(0, before - amount);
  return before - state.greed;
}

export function setGreed(state, value) {
  state.greed = Math.max(0, Math.min(BALANCE.greed.max, value));
  return state.greed;
}

export function resetGreed(state) {
  state.greed = BALANCE.greed.start;
  return state.greed;
}

// ==========================================
// SUMMARY (for UI)
// ==========================================

export function summarize(state) {
  const g = getGreed(state);
  return {
    greed: g,
    ratio: getGreedRatio(state),
    level: dangerLevel(state),
    incomeMultiplier: incomeMultiplier(state),
    nextThreshold: nextThreshold(g),
    distanceToNext: nextThreshold(g) - g
  };
}

function nextThreshold(g) {
  const { dangerThreshold, highRiskThreshold, criticalThreshold, max } = BALANCE.greed;
  if (g < dangerThreshold) return dangerThreshold;
  if (g < highRiskThreshold) return highRiskThreshold;
  if (g < criticalThreshold) return criticalThreshold;
  return max;
}
