// GREEDY — Super Prestige (2nd layer) + Ultra Prestige (3rd layer)
// Rebirth resets money. Super resets rebirth. Ultra resets super.
// Each layer gives a NEW currency that stacks permanently.

export function superPoints(state) { return state.superPoints || 0; }
export function ultraPoints(state) { return state.ultraPoints || 0; }
export function superCount(state) { return state.superCount || 0; }
export function ultraCount(state) { return state.ultraCount || 0; }

// ---------- SUPER PRESTIGE ----------
export function canSuperPrestige(state) {
  // need at least rebirth 10 and $1 quadrillion
  return (state.rebirthCount || 0) >= 10 && state.money >= 1e15;
}

export function superReward(state) {
  // points scale with rebirth count and money
  const r = state.rebirthCount || 0;
  const m = Math.log10(Math.max(1, state.money)) - 12;
  return Math.max(1, Math.floor(r / 5 + m));
}

export function doSuperPrestige(state) {
  if (!canSuperPrestige(state)) return { success: false, reason: "not_eligible" };

  const reward = superReward(state);
  state.superPoints = (state.superPoints || 0) + reward;
  state.superCount = (state.superCount || 0) + 1;

  // reset rebirth layer
  state.rebirthPoints = 0;
  state.rebirthSpentPoints = 0;
  state.rebirthCount = 0;
  state.rebirthPerks = {};
  state.rebirthShop = {};
  state.money = 100;
  state.day = 1;
  state.owned = {};
  state.greed = 0;
  state.upgrades = {};
  state.ultras = {};
  state.employees = {};
  state.stocks = {};

  return { success: true, reward, total: state.superPoints };
}

// ---------- ULTRA PRESTIGE ----------
export function canUltraPrestige(state) {
  return (state.superCount || 0) >= 5 && state.money >= 1e18;
}

export function ultraReward(state) {
  return Math.max(1, Math.floor((state.superCount || 0) / 2));
}

export function doUltraPrestige(state) {
  if (!canUltraPrestige(state)) return { success: false, reason: "not_eligible" };

  const reward = ultraReward(state);
  state.ultraPoints = (state.ultraPoints || 0) + reward;
  state.ultraCount = (state.ultraCount || 0) + 1;

  // reset everything below ultra
  state.superPoints = 0;
  state.superCount = 0;
  state.rebirthPoints = 0;
  state.rebirthSpentPoints = 0;
  state.rebirthCount = 0;
  state.rebirthPerks = {};
  state.rebirthShop = {};
  state.money = 100;
  state.day = 1;
  state.owned = {};
  state.greed = 0;
  state.upgrades = {};
  state.ultras = {};
  state.employees = {};
  state.stocks = {};

  return { success: true, reward, total: state.ultraPoints };
}

// ---------- BONUSES ----------
export function superIncomeMult(state) {
  return 1 + superPoints(state) * 0.5; // +50% per super point
}

export function superStartMoney(state) {
  return 100 * Math.pow(10, Math.min(6, superPoints(state))); // up to $100M start
}

export function ultraIncomeMult(state) {
  return 1 + ultraPoints(state) * 10; // +1000% per ultra point
}

export function ultraGreedMult(state) {
  return Math.max(0.1, 1 - ultraPoints(state) * 0.05);
}
