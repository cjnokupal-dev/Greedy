// GREEDY — daily quests
import { QUEST_POOL, pickDailyQuests } from "../data/quests.js";

export function currentQuests(state) {
  return state.dailyQuests || (state.dailyQuests = []);
}

export function questBaseline(state) {
  return state.questBaseline || (state.questBaseline = {});
}

export function refreshQuestsIfNeeded(state) {
  const quests = currentQuests(state);
  const lastRefresh = state.questsRefreshedDay || 0;

  if (quests.length > 0 && state.day - lastRefresh < 5) return;

  // pick 3 new quests
  const picked = pickDailyQuests(state.day + (state.seed || 1), 3);
  const baseline = {
    ownedTotal: Object.values(state.owned).reduce((a, b) => a + b, 0),
    earned: state.stats.totalEarned || 0,
    upgrades: Object.keys(state.upgrades || {}).length,
    sales: state.stats.totalSales || 0,
    employees: Object.keys(state.employees || {}).length,
    stocks: Object.keys(state.stocks || {}).length,
    loans: (state.loans || []).length
  };

  state.dailyQuests = picked.map(q => ({ ...q, done: false }));
  state.questBaseline = baseline;
  state.questsRefreshedDay = state.day;
}

export function checkQuests(state) {
  const quests = currentQuests(state);
  const baseline = questBaseline(state);
  const completed = [];

  for (const q of quests) {
    if (q.done) continue;
    try {
      if (q.check(state, baseline)) {
        q.done = true;
        state.money += q.reward;
        completed.push(q);
      }
    } catch (e) {}
  }
  return completed;
}
