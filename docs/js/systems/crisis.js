// GREEDY — crisis events that scale with your net worth
// The richer you are, the bigger the disasters. Keeps endgame tense.
import { BALANCE } from "../data/balance.js";
import * as Greed from "./greed.js";

export function crisisChance(state) {
  // scales with greed AND money tier
  const greedPart = state.greed / 100;
  const moneyPart = Math.min(1, Math.log10(Math.max(1, state.money)) / 18);
  return greedPart * 0.4 + moneyPart * 0.15;
}

export function rollCrisis(state) {
  if (Math.random() > crisisChance(state)) return null;

  const tier = Math.floor(Math.log10(Math.max(1000, state.money)));
  const pool = CRISES.filter(c => tier >= c.minTier && tier <= c.maxTier);
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function applyCrisis(state, crisis) {
  const before = {
    money: state.money,
    greed: state.greed,
    heat: state.heat,
    health: state.health,
    reputation: state.reputation
  };

  const mult = crisis.moneyMult || 1;
  const flat = crisis.moneyFlat || 0;
  state.money = state.money * mult + flat;

  if (crisis.greedDelta) state.greed = Math.max(0, Math.min(BALANCE.greed.max, state.greed + crisis.greedDelta));
  if (crisis.heatDelta) state.heat = Math.max(0, Math.min(BALANCE.heat.max, state.heat + crisis.heatDelta));
  if (crisis.healthDelta) state.health = Math.max(0, Math.min(BALANCE.health.max, state.health + crisis.healthDelta));
  if (crisis.reputationDelta) state.reputation = Math.max(0, Math.min(BALANCE.reputation.max, state.reputation + crisis.reputationDelta));

  return {
    id: crisis.id,
    name: crisis.name,
    desc: crisis.desc,
    deltas: {
      money: state.money - before.money,
      greed: state.greed - before.greed,
      heat: state.heat - before.heat,
      health: state.health - before.health,
      reputation: state.reputation - before.reputation
    }
  };
}

const CRISES = [
  // TIER 3-4 (thousands to millions)
  { id: "c1", name: "IRS Investigation", desc: "They found something.", minTier: 3, maxTier: 6, moneyMult: 0.85, heatDelta: 15, reputationDelta: -5 },
  { id: "c2", name: "Employee Strike", desc: "Nobody's working today.", minTier: 3, maxTier: 7, moneyMult: 0.9, reputationDelta: -3 },
  { id: "c3", name: "Market Downturn", desc: "Everything drops 10%.", minTier: 4, maxTier: 8, moneyMult: 0.9 },

  // TIER 5-7 (millions to billions)
  { id: "c4", name: "Hostile Takeover Bid", desc: "Someone wants your empire.", minTier: 5, maxTier: 9, moneyMult: 0.8, reputationDelta: -8 },
  { id: "c5", name: "Data Breach", desc: "Everything leaked.", minTier: 5, maxTier: 9, moneyMult: 0.85, reputationDelta: -12, heatDelta: 10 },
  { id: "c6", name: "Regulatory Raid", desc: "Federal agents on site.", minTier: 6, maxTier: 10, moneyMult: 0.75, heatDelta: 20, reputationDelta: -10 },
  { id: "c7", name: "Class Action Lawsuit", desc: "5000 plaintiffs.", minTier: 6, maxTier: 10, moneyMult: 0.7, healthDelta: -5 },

  // TIER 8-10 (billions to trillions)
  { id: "c8", name: "Global Recession", desc: "Markets crater.", minTier: 7, maxTier: 11, moneyMult: 0.65, greedDelta: -5 },
  { id: "c9", name: "Political Scandal", desc: "Your name is in the papers.", minTier: 7, maxTier: 11, moneyMult: 0.8, reputationDelta: -20, heatDelta: 15 },
  { id: "c10", name: "Hostile Nation", desc: "A country froze your assets.", minTier: 8, maxTier: 12, moneyMult: 0.6, heatDelta: 25 },

  // TIER 11+ (trillions+)
  { id: "c11", name: "AI Uprising", desc: "Your AIs went rogue.", minTier: 10, maxTier: 15, moneyMult: 0.5, greedDelta: -10, healthDelta: -10 },
  { id: "c12", name: "Reality Glitch", desc: "Something broke in the simulation.", minTier: 11, maxTier: 20, moneyMult: 0.4, greedDelta: 15 },
  { id: "c13", name: "Cosmic Audit", desc: "Higher powers want their cut.", minTier: 12, maxTier: 25, moneyMult: 0.3, heatDelta: 30, healthDelta: -20 },
  { id: "c14", name: "Dimensional Collapse", desc: "A reality you owned just ended.", minTier: 13, maxTier: 30, moneyMult: 0.25 },
  { id: "c15", name: "The Void Notices", desc: "Something beyond is watching.", minTier: 14, maxTier: 99, moneyMult: 0.2, healthDelta: -30, reputationDelta: -25 }
];

export function getAllCrises() { return CRISES; }
