// GREEDY — heist minigame
// Every 5 days you can run a heist. Pick target, pick crew.
// Success → big payout. Failure → heat, health, money loss.

export const TARGETS = [
  { id: "corner",    name: "Corner Store",      reward: 5000,   successBase: 0.9, heat: 2 },
  { id: "bank_s",    name: "Small Bank",        reward: 100000, successBase: 0.7, heat: 8 },
  { id: "casino_h",  name: "Casino Heist",      reward: 5000000,successBase: 0.5, heat: 20 },
  { id: "federal",   name: "Federal Reserve",   reward: 5e8,    successBase: 0.3, heat: 50 },
  { id: "dimension", name: "Dimensional Vault", reward: 5e12,   successBase: 0.15,heat: 80 }
];

export const CREWS = [
  { id: "locals",  name: "Local Thugs",     cost: 0,       bonus: 0.00, risk: 0.0 },
  { id: "pros",    name: "Professionals",   cost: 100000,  bonus: 0.15, risk: -0.05 },
  { id: "elite",   name: "Elite Squad",     cost: 1e7,     bonus: 0.30, risk: -0.10 },
  { id: "legends", name: "Legends",         cost: 1e10,    bonus: 0.45, risk: -0.15 }
];

export function canHeist(state) {
  const last = state.lastHeistDay || -999;
  return state.day - last >= 5 && !state.heistInProgress;
}

export function runHeist(state, targetId, crewId) {
  if (!canHeist(state)) return { success: false, reason: "cooldown" };
  const target = TARGETS.find(t => t.id === targetId);
  const crew = CREWS.find(c => c.id === crewId);
  if (!target || !crew) return { success: false, reason: "invalid" };
  if (state.money < crew.cost) return { success: false, reason: "no_money" };

  state.money -= crew.cost;

  // success chance modified by crew, greed, heat
  let chance = target.successBase + crew.bonus;
  chance -= state.heat / 500;
  chance -= state.greed / 400;
  chance = Math.max(0.05, Math.min(0.95, chance));

  const roll = Math.random();
  const won = roll < chance;

  state.lastHeistDay = state.day;
  state.heistCount = (state.heistCount || 0) + 1;

  if (won) {
    const payout = target.reward * (0.8 + Math.random() * 0.6);
    state.money += payout;
    state.heat = Math.min(100, state.heat + target.heat * 0.5);
    state.heistSuccess = (state.heistSuccess || 0) + 1;
    return { success: true, won: true, payout, chance, target, crew };
  } else {
    const fine = Math.min(state.money * 0.3, target.reward * 0.5);
    state.money = Math.max(0, state.money - fine);
    state.heat = Math.min(100, state.heat + target.heat);
    state.health = Math.max(0, state.health - target.heat * 0.3);
    state.heistFail = (state.heistFail || 0) + 1;
    return { success: true, won: false, fine, chance, target, crew };
  }
}

export function daysUntilHeist(state) {
  const last = state.lastHeistDay || -999;
  const next = last + 5;
  return Math.max(0, next - state.day);
}
