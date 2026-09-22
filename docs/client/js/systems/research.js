// GREEDY — research
import { RESEARCH } from "../data/research.js";

export function unlockedResearch(state) { return state.researchUnlocked || (state.researchUnlocked = []); }

export function researchIncomeMult(state) {
  let m = 1;
  for (const id of unlockedResearch(state)) {
    const r = RESEARCH.find(x => x.id === id);
    if (r?.effect?.globalMult) m *= r.effect.globalMult;
  }
  return m;
}

export function canResearch(state, id) {
  const r = RESEARCH.find(x => x.id === id);
  if (!r) return false;
  if (unlockedResearch(state).includes(id)) return false;
  for (const req of r.requires) if (!unlockedResearch(state).includes(req)) return false;
  return state.money >= r.cost;
}

export function doResearch(state, id) {
  if (!canResearch(state, id)) return { success: false, reason: "cannot" };
  const r = RESEARCH.find(x => x.id === id);
  state.money -= r.cost;
  unlockedResearch(state).push(id);
  return { success: true, research: r };
}
