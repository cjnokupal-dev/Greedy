// GREEDY — advance one day (end turn)

import { BALANCE } from "../data/balance.js";
import { BUSINESSES } from "../data/businesses.js";
import * as Economy from "../systems/economy.js";
import * as Greed from "../systems/greed.js";
import * as Events from "../systems/events.js";

export function advanceDay(state) {
  ensureStateShape(state);

  const report = {
    day: 0,
    income: 0,
    operatingCost: 0,
    netIncome: 0,
    greedGained: 0,
    greedLost: 0,
    greedAfter: 0,
    dangerLevel: "safe",
    reputationDelta: 0,
    heatDelta: 0,
    healthDelta: 0,
    events: [],
    warnings: [],
    bankruptcy: false
  };

  // 0. EVENTS
  Events.expireActiveEvents(state);
  const todayEvents = Events.rollEvents(state);
  const incomeDebuff = Events.activeIncomeMultiplier(state);
  for (const ev of todayEvents) {
    const summary = Events.applyEvent(state, ev);
    report.events.push(summary);
    state.eventCooldowns[ev.id] = state.day + (BALANCE.events.hostileCooldownDays || 3);
  }

  // 1. INCOME
  const gross = Economy.grossDailyIncome(state.owned);
  const opCost = Economy.dailyOperatingCost(state.owned);
  const greedMult = Greed.incomeMultiplier(state);
  const netIncome = (gross - opCost) * greedMult * incomeDebuff;
  state.money += netIncome;
  state.stats.totalEarned = (state.stats.totalEarned || 0) + Math.max(0, netIncome);
  state.stats.daysPlayed = (state.stats.daysPlayed || 0) + 1;
  report.income = gross;
  report.operatingCost = opCost;
  report.netIncome = netIncome;

  // 2. GREED GAIN
  const fromIncome = Greed.gainFromIncome(state, Math.max(0, netIncome));
  const fromOwned = Greed.gainFromOwned(state, BUSINESSES);
  report.greedGained = fromIncome + fromOwned;

  // 3. GREED DECAY
  const decayed = Greed.decay(state);
  report.greedLost = decayed;
  report.greedAfter = state.greed;
  report.dangerLevel = Greed.dangerLevel(state);

  // 4. REPUTATION
  const repDelta = computeReputationDelta(state);
  state.reputation = clamp(state.reputation + repDelta, 0, BALANCE.reputation.max);
  report.reputationDelta = repDelta;

  // 5. HEAT
  const heatDelta = computeHeatDelta(state);
  state.heat = clamp(state.heat + heatDelta, 0, BALANCE.heat.max);
  report.heatDelta = heatDelta;

  // 6. HEALTH
  const healthDelta = computeHealthDelta(state);
  state.health = clamp(state.health + healthDelta, 0, BALANCE.health.max);
  report.healthDelta = healthDelta;

  // 7. WARNINGS
  if (Greed.isCritical(state)) report.warnings.push("Greed is critical. Disaster is close.");
  if (state.health <= BALANCE.health.exhaustionThreshold) report.warnings.push("You're exhausted. Rest, or pay the price.");
  if (state.heat >= BALANCE.heat.auditThreshold) report.warnings.push("Authorities are watching. Audit risk rising.");

  // 8. DAY
  state.day += 1;
  report.day = state.day;

  // 9. BANKRUPTCY
  if (state.money < BALANCE.economy.bankruptcyThreshold) {
    report.bankruptcy = true;
    state.gameOver = true;
  }

  // 10. LOG
  pushLog(state, {
    day: report.day,
    text: `Day ${report.day}: +$${fmt(netIncome)} · greed ${state.greed.toFixed(1)}`,
    kind: netIncome >= 0 ? "info" : "warning"
  });

  return report;
}

function computeReputationDelta(state) {
  let delta = 0;
  delta -= state.greed * BALANCE.reputation.drainPerGreedPoint * 0.1;
  if (state.greed < BALANCE.greed.dangerThreshold) delta += BALANCE.reputation.gainPerCleanDay;
  for (const id in state.owned) {
    const biz = BUSINESSES.find(b => b.id === id);
    if (!biz) continue;
    delta += biz.repPerUnit * state.owned[id];
  }
  return delta;
}

function computeHeatDelta(state) {
  let delta = 0;
  if (state.greed >= BALANCE.greed.highRiskThreshold) delta += BALANCE.heat.gainPerDayHighGreed;
  for (const id in state.owned) {
    const biz = BUSINESSES.find(b => b.id === id);
    if (!biz) continue;
    delta += biz.heatPerUnit * state.owned[id] * 0.1;
  }
  delta -= BALANCE.heat.decayPerDay;
  return delta;
}

function computeHealthDelta(state) {
  let delta = 0;
  if (state.greed > 50) delta -= (state.greed - 50) * BALANCE.health.drainPerGreedAbove50 * 0.1;
  if (state.greed < BALANCE.greed.dangerThreshold) delta += BALANCE.health.regenPerCalmDay;
  return delta;
}

function ensureStateShape(state) {
  state.owned = state.owned || {};
  state.stats = state.stats || {};
  state.log = state.log || [];
  state.activeEvents = state.activeEvents || [];
  state.eventCooldowns = state.eventCooldowns || {};
  if (typeof state.greed !== "number") state.greed = BALANCE.greed.start;
  if (typeof state.reputation !== "number") state.reputation = BALANCE.reputation.start;
  if (typeof state.heat !== "number") state.heat = BALANCE.heat.start;
  if (typeof state.health !== "number") state.health = BALANCE.health.start;
  if (typeof state.day !== "number") state.day = 1;
  if (typeof state.money !== "number") state.money = BALANCE.economy.startMoney;
}

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

function pushLog(state, entry) {
  state.log.push({ ...entry, time: Date.now() });
  const max = BALANCE?.limits?.logEntries ?? 200;
  if (state.log.length > max) state.log.splice(0, state.log.length - max);
}

import { formatMoney } from "../utils/format.js";
function fmt(n) { return formatMoney(n).replace("$", ""); }
