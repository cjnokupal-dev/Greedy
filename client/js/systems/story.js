// GREEDY — story progression
import { CHAPTERS, PATHS } from "../data/story.js";

export function readChapters(state) { return state.storyRead || (state.storyRead = {}); }

export function nextChapter(state) {
  const read = readChapters(state);
  for (const ch of CHAPTERS) {
    if (read[ch.id]) continue;
    if (state.day < ch.unlockDay) continue;
    if (state.money < ch.unlockMoney) continue;
    return ch;
  }
  return null;
}

export function applyChoice(state, chapter, choiceId) {
  const choice = chapter.choices.find(c => c.id === choiceId);
  if (!choice) return null;

  const read = readChapters(state);
  read[chapter.id] = choiceId;

  const e = choice.effect || {};
  if (e.money) state.money = Math.max(0, state.money + e.money);
  if (e.rep) state.reputation = Math.max(0, Math.min(100, state.reputation + e.rep));
  if (e.heat) state.heat = Math.max(0, Math.min(100, state.heat + e.heat));
  if (e.greed) state.greed = Math.max(0, Math.min(100, state.greed + e.greed));
  if (e.income) {
    state.storyIncomeMult = (state.storyIncomeMult || 1) * e.income;
  }
  if (choice.path) {
    state.path = choice.path;
    state.pathProgress = state.pathProgress || { honest: 0, clever: 0, ruthless: 0 };
    state.pathProgress[choice.path] = (state.pathProgress[choice.path] || 0) + 1;
  }
  return choice;
}

export function storyIncomeMult(state) {
  return state.storyIncomeMult || 1;
}

export function dominantPath(state) {
  const pp = state.pathProgress;
  if (!pp) return null;
  let best = null, bestN = 0;
  for (const p in pp) if (pp[p] > bestN) { best = p; bestN = pp[p]; }
  return best;
}

export function pathInfo(state) {
  const p = dominantPath(state);
  return p ? PATHS[p] : null;
}
