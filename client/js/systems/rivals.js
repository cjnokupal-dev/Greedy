// GREEDY — rival system
import { RIVALS } from "../data/rivals.js";

export function activeRivals(state) { return state.rivals || (state.rivals = []); }

export function spawnRival(state, netWorth) {
  const existing = activeRivals(state);
  // spawn one when netWorth crosses thresholds
  const tiers = [1e5, 1e7, 1e9, 1e11, 1e13];
  for (let i = 0; i < tiers.length; i++) {
    if (netWorth >= tiers[i] && !existing.find(r => r.tier === i)) {
      const rival = RIVALS[i];
      if (rival) {
        existing.push({ id: rival.id, tier: i, aggression: rival.aggression, patience: rival.patience, spawnedDay: state.day });
        return rival;
      }
    }
  }
  return null;
}

export function rivalPressure(state) {
  // every active rival drains income a bit
  return Math.max(0.5, 1 - activeRivals(state).length * 0.03);
}
