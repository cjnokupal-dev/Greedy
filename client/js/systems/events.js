// GREEDY — event trigger + resolution
// Reads: events.js, balance.js, greed.js
// Mutates: state.money, state.greed, state.reputation, state.heat,
//          state.health, state.activeEvents, state.eventCooldowns, state.stats

import { BALANCE } from "../data/balance.js";
import { EVENTS, getEventById } from "../data/events.js";
import * as Greed from "./greed.js";

// ==========================================
// TRIGGER
// ==========================================

/**
 * Roll for events today. Returns array of fired events.
 * Called by advanceDay BEFORE income is applied.
 */
export function rollEvents(state) {
  const fired = [];

  // base chance
  let chance = BALANCE.events.baseChancePerDay;

  // greed bonus above threshold
  if (state.greed > BALANCE.greed.dangerThreshold) {
    const excess = state.greed - BALANCE.greed.dangerThreshold;
    chance += excess * BALANCE.events.greedBonusChance;
  }

  // roll for count
  const rolls = Math.random() < chance ? 1 : 0;
  if (rolls === 0) return fired;

  // pick eligible events
  const eligible = EVENTS.filter(e => isEligible(state, e));
  if (eligible.length === 0) return fired;

  // weighted pick
  const picked = weightedPick(eligible);
  if (!picked) return fired;

  fired.push(picked);

  // bonus roll for a second event if very greedy
  if (state.greed >= BALANCE.greed.highRiskThreshold) {
    if (Math.random() < chance * 0.5) {
      const more = EVENTS.filter(e => isEligible(state, e) && e.id !== picked.id);
      if (more.length > 0) {
        const second = weightedPick(more);
        if (second) fired.push(second);
      }
    }
  }

  // cap
  return fired.slice(0, BALANCE.events.maxPerDay);
}

// ==========================================
// APPLY
// ==========================================

/**
 * Apply a fired event's effects to state.
 * Returns a summary object for the UI.
 */
export function applyEvent(state, event) {
  const eff = event.effects || {};
  const before = {
    money: state.money,
    greed: state.greed,
    reputation: state.reputation,
    heat: state.heat,
    health: state.health
  };

  // money multipliers
  if (eff.moneyMult != null) {
    // applied as a one-shot penalty/bonus on a fraction of daily income
    // (or negative — we clamp later)
    const bite = Math.max(0, state.money) * (1 - eff.moneyMult);
    state.money -= bite;
  }

  if (eff.moneyFlat != null) {
    state.money += eff.moneyFlat;
  }

  if (eff.greedDelta != null) {
    if (eff.greedDelta > 0) Greed.addGreed(state, eff.greedDelta);
    else Greed.subtractGreed(state, -eff.greedDelta);
  }

  if (eff.reputationDelta != null) {
    state.reputation = clamp(state.reputation + eff.reputationDelta, 0, BALANCE.reputation.max);
  }

  if (eff.heatDelta != null) {
    state.heat = clamp(state.heat + eff.heatDelta, 0, BALANCE.heat.max);
  }

  if (eff.healthDelta != null) {
    state.health = clamp(state.health + eff.healthDelta, 0, BALANCE.health.max);
  }

  // record active effect for tomorrow (debuffs etc.)
  if (eff.incomeDebuffNextDay != null) {
    state.activeEvents.push({
      id: event.id + "_debuff",
      mult: eff.incomeDebuffNextDay,
      expiresDay: state.day + 1
    });
  }

  // stats
  if (event.kind === "hostile") {
    state.stats.hostileEventsSurvived = (state.stats.hostileEventsSurvived || 0) + 1;
  }

  // log
  pushLog(state, {
    day: state.day,
    kind: "event-" + event.kind,
    text: `${event.name}: ${event.desc}`
  });

  return {
    id: event.id,
    name: event.name,
    kind: event.kind,
    desc: event.desc,
    deltas: {
      money: state.money - before.money,
      greed: state.greed - before.greed,
      reputation: state.reputation - before.reputation,
      heat: state.heat - before.heat,
      health: state.health - before.health
    }
  };
}

/**
 * Compute combined income multiplier from active debuffs.
 * Called by advanceDay before income is applied.
 */
export function activeIncomeMultiplier(state) {
  if (!state.activeEvents || state.activeEvents.length === 0) return 1;
  let mult = 1;
  for (const a of state.activeEvents) {
    if (a.mult != null) mult *= a.mult;
  }
  return mult;
}

/**
 * Expire active events whose day has passed.
 */
export function expireActiveEvents(state) {
  if (!state.activeEvents) return;
  state.activeEvents = state.activeEvents.filter(a => a.expiresDay > state.day);
}

// ==========================================
// HELPERS
// ==========================================

function isEligible(state, event) {
  if (event.minDay != null && state.day < event.minDay) return false;
  if (event.minGreed != null && state.greed < event.minGreed) return false;
  if (event.maxGreed != null && state.greed > event.maxGreed) return false;

  // cooldown
  const cooldownUntil = state.eventCooldowns?.[event.id];
  if (cooldownUntil != null && state.day < cooldownUntil) return false;

  return true;
}

function weightedPick(list) {
  const total = list.reduce((sum, e) => sum + (e.weight || 1), 0);
  if (total <= 0) return null;
  let r = Math.random() * total;
  for (const e of list) {
    r -= (e.weight || 1);
    if (r <= 0) return e;
  }
  return list[list.length - 1];
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function pushLog(state, entry) {
  state.log.push({ ...entry, time: Date.now() });
  const max = BALANCE?.limits?.logEntries ?? 200;
  if (state.log.length > max) state.log.splice(0, state.log.length - max);
}
