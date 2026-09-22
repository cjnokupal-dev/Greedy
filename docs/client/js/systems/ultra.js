// GREEDY — ultra offer system
// Pops an ultra every 10 days. Player has 30s to buy it. Then it's gone.

import { ULTRAS, ULTRA_INTERVAL_DAYS, ULTRA_DURATION_MS, getUltraById } from "../data/ultra.js";

// ---------- READ ----------
export function purchasedUltras(state) {
  return state.ultras || (state.ultras = {});
}

export function activeOffer(state) {
  return state.ultraOffer || null;
}

// ---------- BONUS AGGREGATION ----------
export function ultraIncomeMult(state) {
  let m = 1;
  for (const id in purchasedUltras(state)) {
    const u = getUltraById(id);
    if (u?.effect?.globalMult) m *= u.effect.globalMult;
  }
  return m;
}

export function ultraGreedMult(state) {
  let m = 1;
  for (const id in purchasedUltras(state)) {
    const u = getUltraById(id);
    if (u?.effect?.greedMult) m *= u.effect.greedMult;
  }
  return m;
}

export function ultraTaxMult(state) {
  let m = 1;
  for (const id in purchasedUltras(state)) {
    const u = getUltraById(id);
    if (u?.effect?.taxMult) m *= u.effect.taxMult;
  }
  return m;
}

export function ultraTickMult(state) {
  let m = 1;
  for (const id in purchasedUltras(state)) {
    const u = getUltraById(id);
    if (u?.effect?.tickMult) m *= u.effect.tickMult;
  }
  return m;
}

export function ultraDailyHeat(state) {
  let h = 0;
  for (const id in purchasedUltras(state)) {
    const u = getUltraById(id);
    if (u?.effect?.dailyHeat) h += u.effect.dailyHeat;
  }
  return h;
}

// ---------- OFFER LIFECYCLE ----------
export function maybeSpawnOffer(state) {
  // only spawn every N days
  if (state.day % ULTRA_INTERVAL_DAYS !== 0) return null;

  // don't overwrite an active offer
  if (activeOffer(state) && activeOffer(state).expiresAt > Date.now()) return activeOffer(state);

  // don't re-spawn if last day was same
  if (state.ultraLastSpawnDay === state.day) return activeOffer(state);

  // pool: eligible by day, not already purchased
  const owned = purchasedUltras(state);
  const pool = ULTRAS.filter(u => state.day >= u.minDay && !owned[u.id]);
  if (pool.length === 0) return null;

  // pick weighted-random — simpler: pick first unowned cheap enough
  const pick = pool[Math.floor(Math.random() * pool.length)];

  state.ultraOffer = {
    id: pick.id,
    expiresAt: Date.now() + ULTRA_DURATION_MS,
    startedAt: Date.now()
  };
  state.ultraLastSpawnDay = state.day;

  return state.ultraOffer;
}

export function expireOffer(state) {
  if (!activeOffer(state)) return false;
  if (activeOffer(state).expiresAt > Date.now()) return false;
  state.ultraOffer = null;
  return true;
}

export function clearOffer(state) {
  state.ultraOffer = null;
}

// ---------- PURCHASE ----------
export function buyUltra(state, id) {
  const offer = activeOffer(state);
  if (!offer || offer.id !== id) return { success: false, reason: "no_offer" };
  if (offer.expiresAt < Date.now()) { clearOffer(state); return { success: false, reason: "expired" }; }

  const u = getUltraById(id);
  if (!u) return { success: false, reason: "unknown" };
  if (state.money < u.cost) return { success: false, reason: "insufficient_funds" };

  state.money -= u.cost;
  purchasedUltras(state)[id] = true;
  clearOffer(state);

  return { success: true, ultra: u, spent: u.cost };
}
