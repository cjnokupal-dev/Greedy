// GREEDY — state factory + shape validation

import { BALANCE } from "../data/balance.js";

export function createNewState(opts = {}) {
  const difficulty = opts.difficulty || "normal";

  return {
    version: 1,
    createdAt: Date.now(),
    difficulty,
    seed: opts.seed ?? Math.floor(Math.random() * 1e9),
    playerName: opts.playerName || "Anonymous",

    day: 1,
    gameOver: false,

    money: BALANCE.economy.startMoney,
    owned: {},

    greed: BALANCE.greed.start,
    reputation: BALANCE.reputation.start,
    heat: BALANCE.heat.start,
    health: BALANCE.health.start,

    prestigePoints: 0,
    prestigeCount: 0,
    rebirthPoints: 0,
    rebirthCount: 0,
    rebirthPerks: {},
    rebirthSpentPoints: 0,
    rebirthShop: {},
    tapEarned: 0,
    tapCount: 0,
    currencyLifetime: {},
    currencyPurchases: {},
    currencyFloor: {},
    ascensionPerks: {},
    ascensionCount: 0,
    ascensionPoints: 0,
    ultraCount: 0,
    ultraPoints: 0,
    superCount: 0,
    superPoints: 0,
    gambling: null,
    currentCity: "hometown",
    selectedTitle: null,
    questsRefreshedDay: 0,
    questBaseline: {},
    dailyQuests: [],
    ultras: {},
    ultraOffer: null,
    ultraLastSpawnDay: 0,
    achievements: {},
    rivals: [],
    completedContracts: {},
    activeContracts: [],
    researchUnlocked: [],

    activeEvents: [],
    pendingEvents: [],
    eventCooldowns: {},
    loans: [],

    log: [],

    stats: {
      daysPlayed: 0,
      totalEarned: 0,
      totalSpent: 0,
      totalPurchases: 0,
      totalSales: 0,
      peakMoney: BALANCE.economy.startMoney,
      peakNetWorth: 0,
      peakGreed: 0,
      hostileEventsSurvived: 0,
      daysInDanger: 0
    }
  };
}

export function ensureShape(state) {
  const fresh = createNewState();
  for (const key of Object.keys(fresh)) {
    if (state[key] === undefined) state[key] = fresh[key];
  }
  state.owned = state.owned || {};
  state.stats = { ...fresh.stats, ...(state.stats || {}) };
  state.log = state.log || [];
  state.loans = state.loans || [];
  state.activeEvents = state.activeEvents || [];
  state.pendingEvents = state.pendingEvents || [];
  state.eventCooldowns = state.eventCooldowns || {};
  state.researchUnlocked = state.researchUnlocked || [];
  return state;
}

export function isGameOver(state) { return state.gameOver === true; }
export function getDay(state) { return state.day; }
export function getMoney(state) { return state.money; }

export function snapshot(state) {
  return {
    day: state.day,
    money: state.money,
    greed: state.greed,
    reputation: state.reputation,
    heat: state.heat,
    health: state.health,
    gameOver: state.gameOver,
    businessCount: Object.keys(state.owned).length,
    totalUnits: Object.values(state.owned).reduce((a, b) => a + b, 0)
  };
}

export function resetState(state, { keepPrestige = true } = {}) {
  const keepPoints = keepPrestige ? state.prestigePoints : 0;
  const keepCount = keepPrestige ? state.prestigeCount : 0;
  const fresh = createNewState({
    difficulty: state.difficulty,
    playerName: state.playerName
  });
  Object.keys(state).forEach(k => delete state[k]);
  Object.assign(state, fresh);
  state.prestigePoints = keepPoints;
  state.prestigeCount = keepCount;
  return state;
}
