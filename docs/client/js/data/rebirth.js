// GREEDY — rebirth progression
export const REBIRTH = {
  tiers: (() => {
    const arr = [];
    let base = 100000;
    for (let i = 1; i <= 50; i++) {
      arr.push({
        level: i,
        netWorth: base,
        points: Math.ceil(i * 1.5) + Math.floor(i / 5),
        bonus: i >= 10 ? "×" + (1 + i * 0.1).toFixed(1) + " permanent income" : null
      });
      base = Math.floor(base * 2.2);
    }
    return arr;
  })(),

  bonusPerPoint: 0.10,
  startMoneyPerPoint: 100,
  greedReductionPerPoint: 0.025,
  taxReductionPerPoint: 0.005,
  heatReductionPerPoint: 0.01,
  maxPoints: 9999,

  unlocks: [
    { id: "auto_buy",        name: "Auto-Buy",           desc: "Auto-buys cheapest business every 5s",    rebirths: 1  },
    { id: "offline_cash",    name: "Offline Cash",       desc: "Earn 25% income while away",              rebirths: 2  },
    { id: "greed_immunity",  name: "Greed Dampening",    desc: "Greed decays 2× faster",                  rebirths: 3  },
    { id: "stock_luck",      name: "Market Insight",     desc: "+20% stock return",                       rebirths: 4  },
    { id: "double_all",      name: "Empire",             desc: "+100% all income permanently",            rebirths: 5  },
    { id: "start_bonus",     name: "Head Start",         desc: "Start every run with ×10 money",          rebirths: 7  },
    { id: "event_shield",    name: "Lucky Star",         desc: "-30% chance of hostile events",           rebirths: 9  },
    { id: "tax_shield",      name: "Tax Haven",          desc: "-50% tax rate permanently",               rebirths: 11 },
    { id: "quick_start",     name: "Quick Start",        desc: "Begin at day 10 with 5 free businesses",  rebirths: 13 },
    { id: "super_income",    name: "Super Income",       desc: "×2 all income permanently",               rebirths: 15 },
    { id: "greed_master",    name: "Greed Master",       desc: "+100% income at max greed",               rebirths: 18 },
    { id: "heat_immune",     name: "Untouchable",        desc: "-75% heat gain permanently",              rebirths: 21 },
    { id: "prestige_plus",   name: "Prestige+",          desc: "+50% rebirth point gain",                 rebirths: 24 },
    { id: "auto_prestige",   name: "Auto-Rebirth",       desc: "Auto-rebirth when eligible",              rebirths: 27 },
    { id: "god_income",      name: "God Income",         desc: "×5 all income permanently",               rebirths: 30 },
    { id: "ultra_always",    name: "Ultra Always",       desc: "Ultra offers every 5 days",               rebirths: 33 },
    { id: "time_lord",       name: "Time Lord",          desc: "2× tick speed permanently",               rebirths: 36 },
    { id: "infinite_empire", name: "Infinite Empire",    desc: "×10 all income permanently",              rebirths: 40 },
    { id: "reality_warper",  name: "Reality Warper",     desc: "All events become positive",              rebirths: 45 },
    { id: "god_mode",        name: "GOD MODE",           desc: "×100 all income, immune to events",       rebirths: 50 }
  ],

  shop: [
    { id: "s_permanent_income",  name: "+1% Permanent Income",    cost: 1,    repeatable: true,  effect: { incomePct: 0.01 } },
    { id: "s_start_money",       name: "+$100 Start Money",       cost: 2,    repeatable: true,  effect: { startMoney: 100 } },
    { id: "s_greed_reduce",      name: "-1% Greed Gain",          cost: 3,    repeatable: true,  effect: { greedPct: 0.01 } },
    { id: "s_tax_reduce",        name: "-2% Tax Rate",            cost: 5,    repeatable: true,  effect: { taxPct: 0.02 } },
    { id: "s_heat_reduce",       name: "-3% Heat Gain",           cost: 5,    repeatable: true,  effect: { heatPct: 0.03 } },
    { id: "s_event_luck",        name: "+5% Positive Events",     cost: 8,    repeatable: true,  effect: { eventPct: 0.05 } },
    { id: "s_offline_bonus",     name: "+10% Offline Earnings",   cost: 10,   repeatable: true,  effect: { offlinePct: 0.10 } },
    { id: "s_auto_save",         name: "+1 Autosave Slot",        cost: 15,   repeatable: true,  effect: { saveSlot: 1 } },
    { id: "s_skip_day",          name: "Instant Day Skip",        cost: 20,   repeatable: false, effect: { unlock: "daySkip" } },
    { id: "s_golden_touch",      name: "Golden Touch",            cost: 50,   repeatable: false, effect: { globalMult: 2.0 } },
    { id: "s_shadow_legacy",     name: "Shadow Legacy",           cost: 100,  repeatable: false, effect: { globalMult: 5.0, immune: true } },
    { id: "s_mega_income",       name: "+5% Permanent Income",    cost: 10,   repeatable: true,  effect: { incomePct: 0.05 } },
    { id: "s_start_10k",         name: "+$10,000 Start Money",    cost: 15,   repeatable: true,  effect: { startMoney: 10000 } },
    { id: "s_greed_master",      name: "-5% Greed Gain",          cost: 20,   repeatable: true,  effect: { greedPct: 0.05 } },
    { id: "s_tax_master",        name: "-10% Tax Rate",           cost: 25,   repeatable: true,  effect: { taxPct: 0.10 } },
    { id: "s_heat_master",       name: "-15% Heat Gain",          cost: 25,   repeatable: true,  effect: { heatPct: 0.15 } },
    { id: "s_event_fortune",     name: "+10% Positive Events",    cost: 30,   repeatable: true,  effect: { eventPct: 0.10 } },
    { id: "s_offline_master",    name: "+25% Offline Earnings",   cost: 40,   repeatable: true,  effect: { offlinePct: 0.25 } },
    { id: "s_ultra_time",        name: "+10s Ultra Window",       cost: 50,   repeatable: true,  effect: { ultraSeconds: 10 } },
    { id: "s_tick_speed",        name: "+10% Tick Speed",         cost: 75,   repeatable: true,  effect: { tickPct: 0.10 } },
    { id: "s_auto_buy",          name: "Auto-Buy Every 10s",      cost: 100,  repeatable: false, effect: { unlock: "autoBuy" } },
    { id: "s_prestige_boost",    name: "+100% Rebirth Points",    cost: 200,  repeatable: false, effect: { prestigeMult: 2.0 } },
    { id: "s_golden_touch_2",    name: "Golden Touch II",         cost: 250,  repeatable: false, effect: { globalMult: 3.0 } },
    { id: "s_shadow_legacy_2",   name: "Shadow Legacy II",        cost: 500,  repeatable: false, effect: { globalMult: 8.0, immune: true } },
    { id: "s_god_sliver",        name: "God Sliver",              cost: 1000, repeatable: false, effect: { globalMult: 25.0, incomePct: 0.25 } },
    { id: "s_infinite_wealth",   name: "Infinite Wealth",         cost: 2000, repeatable: false, effect: { globalMult: 100.0, immune: true } },
    { id: "s_time_freeze",       name: "Time Freeze",             cost: 300,  repeatable: false, effect: { unlock: "timeFreeze" } },
    { id: "s_luck_engine",       name: "Luck Engine",             cost: 400,  repeatable: false, effect: { eventPct: 0.5 } },
    { id: "s_perfect_start",     name: "Perfect Start",           cost: 600,  repeatable: false, effect: { startMoney: 1000000, unlock: "perfectStart" } },
    { id: "s_founder_hat",       name: "Founder Hat",             cost: 1,    repeatable: false, effect: { cosmetic: true } }
  ]
};

export function getRebirthTier(level) {
  return REBIRTH.tiers[Math.min(level - 1, REBIRTH.tiers.length - 1)];
}
export function getShopItem(id) { return REBIRTH.shop.find(s => s.id === id); }
export function getPerk(id) { return REBIRTH.unlocks.find(u => u.id === id); }
