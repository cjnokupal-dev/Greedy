// GREEDY — collectible inventory + bonuses
import { COLLECTIBLES, rollCollectible } from "../data/collectibles.js";

export function inventory(state) { return state.collectibles || (state.collectibles = {}); }

export function collectionMult(state) {
  const inv = inventory(state);
  let m = 1;
  let incomePct = 0;
  for (const id in inv) {
    const c = COLLECTIBLES.find(x => x.id === id);
    if (!c) continue;
    if (c.bonus.globalMult) m *= Math.pow(c.bonus.globalMult, Math.min(inv[id], 5));
    if (c.bonus.incomePct) incomePct += c.bonus.incomePct * Math.min(inv[id], 10);
  }
  return m * (1 + incomePct);
}

export function collectionGreedMult(state) {
  const inv = inventory(state);
  let m = 1;
  for (const id in inv) {
    const c = COLLECTIBLES.find(x => x.id === id);
    if (c?.bonus?.greedPct) m *= 1 + c.bonus.greedPct * Math.min(inv[id], 10);
  }
  return Math.max(0.1, m);
}

export function collectionHeatMult(state) {
  const inv = inventory(state);
  let m = 1;
  for (const id in inv) {
    const c = COLLECTIBLES.find(x => x.id === id);
    if (c?.bonus?.heatPct) m *= 1 + c.bonus.heatPct * Math.min(inv[id], 10);
  }
  return Math.max(0.1, m);
}

export function tryDrop(state) {
  const tier = Math.floor(Math.log10(Math.max(1, state.money)));
  const drop = rollCollectible(tier);
  if (!drop) return null;
  const inv = inventory(state);
  inv[drop.id] = (inv[drop.id] || 0) + 1;
  return drop;
}

export function totalCollectibles(state) {
  return Object.keys(inventory(state)).length;
}

export function totalCollectibleCount(state) {
  return Object.values(inventory(state)).reduce((a, b) => a + b, 0);
}
