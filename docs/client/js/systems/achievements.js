// GREEDY — achievements
import { ACHIEVEMENTS } from "../data/achievements.js";

export function unlockedAchievements(state) {
  return state.achievements || (state.achievements = {});
}

export function checkAchievements(state) {
  const unlocked = unlockedAchievements(state);
  const freshly = [];
  for (const a of ACHIEVEMENTS) {
    if (unlocked[a.id]) continue;
    try {
      if (a.check(state)) {
        unlocked[a.id] = Date.now();
        freshly.push(a);
      }
    } catch (e) { /* skip bad check */ }
  }
  return freshly;
}

export function achievementProgress(state) {
  const unlocked = unlockedAchievements(state);
  return {
    total: ACHIEVEMENTS.length,
    unlocked: Object.keys(unlocked).length
  };
}
