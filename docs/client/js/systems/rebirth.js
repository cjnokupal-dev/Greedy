// GREEDY — rebirth logic
import { REBIRTH, getRebirthTier } from "../data/rebirth.js";
import { createNewState } from "../core/state.js";
import { BALANCE } from "../data/balance.js";
import * as Currencies from "./currencies.js";

// ---------- READ ----------
export function rebirthPoints(state) { return state.rebirthPoints || 0; }
export function spentPoints(state) { return state.rebirthSpentPoints || 0; }
export function availablePoints(state) { return Math.max(0, rebirthPoints(state) - spentPoints(state)); }
export function rebirthCount(state) { return state.rebirthCount || 0; }
export function unlockedPerks(state) { return state.rebirthPerks || (state.rebirthPerks = {}); }
export function shopPurchases(state) { return state.rebirthShop || (state.rebirthShop = {}); }
export function hasPerk(state, id) { return !!unlockedPerks(state)[id]; }

// next tier
export function nextRebirth(state, currentNetWorth) {
  const done = rebirthCount(state);
  const tier = getRebirthTier(done + 1);
  const progress = Math.min(1, currentNetWorth / tier.netWorth);
  const prestigeBonus = hasPerk(state, "prestige_plus") ? 1.5 : 1;
  return {
    level: done + 1,
    required: tier.netWorth,
    reward: Math.floor(tier.points * prestigeBonus),
    bonus: tier.bonus,
    canRebirth: currentNetWorth >= tier.netWorth,
    progress
  };
}

// ---------- BONUSES ----------
export function rebirthIncomeMult(state) {
  let mult = 1 + rebirthPoints(state) * REBIRTH.bonusPerPoint;
  if (hasPerk(state, "double_all")) mult *= 2;
  if (hasPerk(state, "super_income")) mult *= 2;
  if (hasPerk(state, "god_income")) mult *= 5;
  if (hasPerk(state, "infinite_empire")) mult *= 10;
  if (hasPerk(state, "god_mode")) mult *= 100;

  // shop: % income per point
  const shop = shopPurchases(state);
  if (shop.s_permanent_income) mult *= 1 + shop.s_permanent_income * 0.01;
  // shop: golden touch
  if (shop.s_golden_touch) mult *= 2;
  if (shop.s_shadow_legacy) mult *= 5;

  return mult;
}

export function rebirthStartMoney(state) {
  let base = BALANCE.economy.startMoney + rebirthPoints(state) * REBIRTH.startMoneyPerPoint;
  const shop = shopPurchases(state);
  if (shop.s_start_money) base += shop.s_start_money * 100;
  if (hasPerk(state, "start_bonus")) base *= 10;
  return base;
}

export function rebirthGreedMult(state) {
  let mult = 1 - rebirthPoints(state) * REBIRTH.greedReductionPerPoint;
  if (hasPerk(state, "greed_immunity")) mult *= 0.5;
  const shop = shopPurchases(state);
  if (shop.s_greed_reduce) mult *= 1 - shop.s_greed_reduce * 0.01;
  return Math.max(0.05, mult);
}

export function rebirthTaxMult(state) {
  let mult = 1 - rebirthPoints(state) * REBIRTH.taxReductionPerPoint;
  if (hasPerk(state, "tax_shield")) mult *= 0.5;
  const shop = shopPurchases(state);
  if (shop.s_tax_reduce) mult *= 1 - shop.s_tax_reduce * 0.02;
  return Math.max(0.05, mult);
}

export function rebirthHeatMult(state) {
  let mult = 1 - rebirthPoints(state) * REBIRTH.heatReductionPerPoint;
  if (hasPerk(state, "heat_immune")) mult *= 0.25;
  const shop = shopPurchases(state);
  if (shop.s_heat_reduce) mult *= 1 - shop.s_heat_reduce * 0.03;
  return Math.max(0.05, mult);
}

export function rebirthEventLuck(state) {
  const shop = shopPurchases(state);
  return shop.s_event_luck ? shop.s_event_luck * 0.05 : 0;
}

export function rebirthTickMult(state) {
  return hasPerk(state, "time_lord") ? 2 : 1;
}

// ---------- REBIRTH ----------
export function canRebirth(state, netWorth) {
  return nextRebirth(state, netWorth).canRebirth;
}

export function doRebirth(state, currentNetWorth) {
  const info = nextRebirth(state, currentNetWorth);
  if (!info.canRebirth) return { success: false, reason: "not_eligible" };

  const keepPoints = rebirthPoints(state) + info.reward;
  const keepSpent = spentPoints(state);
  const keepCount = rebirthCount(state) + 1;
  const keepPerks = { ...unlockedPerks(state) };
  const keepShop = { ...shopPurchases(state) };

  // unlock new perks
  const newPerks = [];
  for (const u of REBIRTH.unlocks) {
    if (!keepPerks[u.id] && keepCount >= u.rebirths) {
      keepPerks[u.id] = true;
      newPerks.push(u);
    }
  }

  // reset currencies (doRebirth preserves rebirth data, wipes money)
  Currencies.resetForRebirth(state);

  // wipe state
  const fresh = createNewState({ difficulty: state.difficulty, playerName: state.playerName });
  Object.keys(state).forEach(k => delete state[k]);
  Object.assign(state, fresh);

  // restore
  state.rebirthPoints = Math.min(REBIRTH.maxPoints, keepPoints);
  state.rebirthSpentPoints = keepSpent;
  state.rebirthCount = keepCount;
  state.rebirthPerks = keepPerks;
  state.rebirthShop = keepShop;
  state.money = rebirthStartMoney(state);

  // quick start perk
  if (hasPerk(state, "quick_start")) {
    state.day = 10;
    state.owned = { lemonade: 5, newspaper: 5, hotdog: 5, car_wash: 5, corner_shop: 5 };
  }

  // log
  state.log.push({
    day: 1,
    kind: "positive",
    text: `★ REBIRTH ${keepCount}! +${info.reward} points (total ${state.rebirthPoints})`,
    time: Date.now()
  });

  return {
    success: true,
    reward: info.reward,
    totalPoints: state.rebirthPoints,
    rebirthCount: keepCount,
    newPerks
  };
}

// ---------- SHOP ----------
export function canBuyShop(state, id) {
  const item = REBIRTH.shop.find(s => s.id === id);
  if (!item) return { can: false, reason: "unknown" };
  const owned = shopPurchases(state)[id] || 0;
  if (!item.repeatable && owned > 0) return { can: false, reason: "owned" };
  if (availablePoints(state) < item.cost) return { can: false, reason: "points" };
  return { can: true, item };
}

export function buyShopItem(state, id) {
  const check = canBuyShop(state, id);
  if (!check.can) return { success: false, reason: check.reason };
  const item = check.item;
  state.rebirthSpentPoints = spentPoints(state) + item.cost;
  state.rebirthShop = shopPurchases(state);
  state.rebirthShop[id] = (state.rebirthShop[id] || 0) + 1;
  return { success: true, item };
}
