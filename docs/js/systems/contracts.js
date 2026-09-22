// GREEDY — contracts system
import { CONTRACTS } from "../data/contracts.js";

export function activeContracts(state) { return state.activeContracts || (state.activeContracts = []); }
export function completedContracts(state) { return state.completedContracts || (state.completedContracts = {}); }

export function availableContracts(state) {
  const done = completedContracts(state);
  const active = activeContracts(state);
  return CONTRACTS.filter(c =>
    !done[c.id] &&
    !active.find(a => a.id === c.id) &&
    state.day >= (c.minDay ?? 1)
  );
}

export function acceptContract(state, id) {
  const c = CONTRACTS.find(x => x.id === id);
  if (!c) return { success: false, reason: "unknown" };
  if (activeContracts(state).find(a => a.id === id)) return { success: false, reason: "already_active" };
  if (completedContracts(state)[id]) return { success: false, reason: "already_done" };
  activeContracts(state).push({
    id: c.id,
    startedDay: state.day,
    expiresDay: state.day + c.duration
  });
  return { success: true, contract: c };
}

export function checkContracts(state) {
  const completed = [];
  const remaining = [];
  for (const a of activeContracts(state)) {
    const c = CONTRACTS.find(x => x.id === a.id);
    if (!c) continue;
    if (state.day > a.expiresDay) continue; // expired
    try {
      if (c.check(state)) {
        state.money += c.reward;
        completedContracts(state)[c.id] = state.day;
        completed.push(c);
      } else {
        remaining.push(a);
      }
    } catch (e) { remaining.push(a); }
  }
  state.activeContracts = remaining;
  return completed;
}
