// GREEDY — tap-to-earn clicker layer with combos & crits
import { BALANCE } from "../data/balance.js";

let combo = 0;
let comboTimer = null;
let lastTapAt = 0;

const COMBO_WINDOW_MS = 1500;

export function tap(state, x = 0, y = 0) {
  const now = Date.now();

  if (now - lastTapAt > COMBO_WINDOW_MS) combo = 0;
  combo++;
  lastTapAt = now;

  const perTick = Math.max(1, state.money * 0.001) * 0.01;
  const tapBase = Math.max(5, perTick * 10);
  const comboMultiplier = Math.min(10, 1 + combo * 0.05);
  const isCrit = Math.random() < 0.05;
  const critMult = isCrit ? 10 : 1;

  const earned = tapBase * comboMultiplier * critMult;
  state.money += earned;
  state.stats.totalEarned = (state.stats.totalEarned || 0) + earned;
  state.tapCount = (state.tapCount || 0) + 1;
  state.tapEarned = (state.tapEarned || 0) + earned;

  if (earned > (state.stats.biggestTap || 0)) {
    state.stats.biggestTap = earned;
  }

  if (comboTimer) clearTimeout(comboTimer);
  comboTimer = setTimeout(() => { combo = 0; }, COMBO_WINDOW_MS);

  return { earned, isCrit, combo, comboMult: comboMultiplier, x, y };
}

export function getCombo() {
  if (Date.now() - lastTapAt > COMBO_WINDOW_MS) return 0;
  return combo;
}

export function comboMult() {
  return Math.min(10, 1 + getCombo() * 0.05);
}
