// GREEDY — Ascension (final layer)
// Requires ultra prestige to be maxed. Unlocks permanent "Ascension Perks"
// that fundamentally change the game.

export function ascensionPoints(state) { return state.ascensionPoints || 0; }
export function ascensionCount(state) { return state.ascensionCount || 0; }

export function canAscend(state) {
  return (state.ultraCount || 0) >= 3 && state.money >= 1e21;
}

export function ascensionReward(state) {
  return Math.max(1, Math.floor((state.ultraCount || 0) / 3));
}

export function doAscend(state) {
  if (!canAscend(state)) return { success: false, reason: "not_eligible" };
  const reward = ascensionReward(state);
  state.ascensionPoints = (state.ascensionPoints || 0) + reward;
  state.ascensionCount = (state.ascensionCount || 0) + 1;

  // wipe EVERYTHING except ascension
  const ascPts = state.ascensionPoints;
  const ascCount = state.ascensionCount;
  const ach = state.achievements || {};
  const titles = state.selectedTitle;

  Object.keys(state).forEach(k => {
    if (["ascensionPoints","ascensionCount","achievements","selectedTitle","version","difficulty","seed","playerName"].includes(k)) return;
    delete state[k];
  });
  state.ascensionPoints = ascPts;
  state.ascensionCount = ascCount;
  state.money = 100;
  state.day = 1;
  state.owned = {};
  state.greed = 0;
  state.heat = 0;
  state.reputation = 50;
  state.health = 100;
  state.superPoints = 0;
  state.ultraPoints = 0;
  state.rebirthPoints = 0;
  state.achievements = ach;
  state.selectedTitle = titles;

  return { success: true, reward, total: state.ascensionPoints };
}

export function ascensionIncomeMult(state) {
  return 1 + ascensionPoints(state) * 100;
}

// Ascension perks — buy with ascension points
export const ASCENSION_PERKS = [
  { id: "ap_greed_immunity", name: "Perfect Serenity",    cost: 1,  desc: "Greed never rises above 50", effect: { greedCap: 50 } },
  { id: "ap_no_events",      name: "Timeline Control",    cost: 2,  desc: "Disable all hostile events", effect: { noHostile: true } },
  { id: "ap_auto_rebirth",   name: "Eternal Cycle",       cost: 3,  desc: "Auto-rebirth instantly when eligible", effect: { autoRebirth: true } },
  { id: "ap_god_mode",       name: "True God Mode",       cost: 5,  desc: "+1000% all income permanently", effect: { globalMult: 11 } },
  { id: "ap_infinite",       name: "Infinite Money",      cost: 10, desc: "+∞ scaling — money never caps", effect: { noMoneyCap: true } },
  { id: "ap_reality",        name: "Reality Edit",        cost: 25, desc: "Start every run with $1 decillion", effect: { startMoney: 1e33 } }
];

export function boughtAscensionPerks(state) { return state.ascensionPerks || (state.ascensionPerks = {}); }

export function buyAscensionPerk(state, id) {
  const perk = ASCENSION_PERKS.find(p => p.id === id);
  if (!perk) return { success: false, reason: "unknown" };
  const owned = boughtAscensionPerks(state);
  if (owned[id]) return { success: false, reason: "owned" };
  if (ascensionPoints(state) < perk.cost) return { success: false, reason: "points" };
  state.ascensionPoints -= perk.cost;
  owned[id] = true;
  return { success: true, perk };
}
