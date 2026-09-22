// GREEDY — tiered currencies (one per money tier)
// Earned as floor(money / threshold). Reset on rebirth.

export const CURRENCIES = [
  { id: "gem",        name: "Gem",          icon: "💎", tier: 6,  threshold: 1e6,  color: "#00d4ff", desc: "Sparkling. Cheap to earn. Cheap to spend." },
  { id: "oil",        name: "Oil Barrel",   icon: "🛢️", tier: 9,  threshold: 1e9,  color: "#8a5a2a", desc: "Black gold. Lubricates the machine." },
  { id: "crypto",     name: "Crypto",       icon: "₿",  tier: 12, threshold: 1e12, color: "#ffd700", desc: "Digital, volatile, unstoppable." },
  { id: "gold",       name: "Gold Bar",     icon: "🥇", tier: 15, threshold: 1e15, color: "#ffb84d", desc: "Real weight. Real power." },
  { id: "platinum",   name: "Platinum",     icon: "⬜", tier: 18, threshold: 1e18, color: "#e8e8f0", desc: "Rarer than gold. Cooler too." },
  { id: "diamond",    name: "Diamond",      icon: "💠", tier: 21, threshold: 1e21, color: "#00ffff", desc: "Hard. Sharp. Permanent." },
  { id: "antimatter", name: "Antimatter",   icon: "⚛️", tier: 24, threshold: 1e24, color: "#ff0080", desc: "Dangerous. Rewarding." },
  { id: "void",       name: "Void Shard",   icon: "🕳️", tier: 27, threshold: 1e27, color: "#2a0a4a", desc: "Nothingness, concentrated." },
  { id: "time",       name: "Time Crystal", icon: "⏳", tier: 30, threshold: 1e30, color: "#8a4aff", desc: "Bends seconds into years." },
  { id: "nebula",     name: "Nebula Core",  icon: "🌌", tier: 33, threshold: 1e33, color: "#5a2a8a", desc: "A star's beating heart." },
  { id: "quantum",    name: "Quantum Foam", icon: "⚡", tier: 36, threshold: 1e36, color: "#00ff9d", desc: "Reality's raw material." },
  { id: "infinity",   name: "Infinity",     icon: "∞",  tier: 39, threshold: 1e39, color: "#ffffff", desc: "The end. Or the start." }
];

export const CURRENCY_SHOP = {
  gem: [
    { id: "gem_1", name: "Small Boost",     cost: 10,   repeatable: true,  desc: "+5% all income",            effect: { globalMult: 1.05 } },
    { id: "gem_2", name: "Business Edge",   cost: 50,   repeatable: true,  desc: "+10% all income",           effect: { globalMult: 1.10 } },
    { id: "gem_3", name: "Lucky Charm",     cost: 200,  repeatable: false, desc: "+20% positive events",      effect: { eventPct: 0.20 } },
    { id: "gem_4", name: "Cash Back",       cost: 500,  repeatable: false, desc: "+$1M start money",          effect: { startMoney: 1e6 } },
    { id: "gem_5", name: "Fast Hands",      cost: 1500, repeatable: false, desc: "+10% tick speed",           effect: { tickPct: 0.10 } },
    { id: "gem_6", name: "Golden Voice",    cost: 5000, repeatable: false, desc: "+3 reputation/day",         effect: { dailyRep: 3 } }
  ],
  oil: [
    { id: "oil_1", name: "Lubricant",       cost: 10,   repeatable: true,  desc: "-10% heat gain",             effect: { heatPct: -0.10 } },
    { id: "oil_2", name: "Slick Deals",     cost: 50,   repeatable: true,  desc: "-5% greed gain",            effect: { greedPct: -0.05 } },
    { id: "oil_3", name: "Lawyer Retainer", cost: 200,  repeatable: false, desc: "-50% lawsuit chance",       effect: { eventDebuff: { lawsuit: 0.5 } } },
    { id: "oil_4", name: "Insurance Plan",  cost: 500,  repeatable: false, desc: "-50% robbery chance",       effect: { eventDebuff: { robbery: 0.5 } } },
    { id: "oil_5", name: "Bribed Official", cost: 1500, repeatable: false, desc: "-20% tax rate",             effect: { taxPct: -0.20 } },
    { id: "oil_6", name: "Clean Slate",     cost: 5000, repeatable: false, desc: "Heat decays 3× faster",      effect: { heatDecayMult: 3 } }
  ],
  crypto: [
    { id: "cry_1", name: "HODL",            cost: 25,   repeatable: true,  desc: "+8% all income",            effect: { globalMult: 1.08 } },
    { id: "cry_2", name: "Whale Status",    cost: 100,  repeatable: true,  desc: "+15% all income",           effect: { globalMult: 1.15 } },
    { id: "cry_3", name: "Auto-Buy",        cost: 500,  repeatable: false, desc: "Buy cheapest business every 5s", effect: { unlock: "autoBuy" } },
    { id: "cry_4", name: "Auto-Collect",    cost: 1500, repeatable: false, desc: "Income collected automatically", effect: { unlock: "autoCollect" } },
    { id: "cry_5", name: "Mining Rig",      cost: 5000, repeatable: false, desc: "+25% all income",           effect: { globalMult: 1.25 } },
    { id: "cry_6", name: "Staking Rewards", cost: 20000,repeatable: false, desc: "+50% offline earnings",     effect: { offlinePct: 0.50 } }
  ],
  gold: [
    { id: "gld_1", name: "Solid Gold",      cost: 50,   repeatable: true,  desc: "+12% all income",           effect: { globalMult: 1.12 } },
    { id: "gld_2", name: "Gold Reserve",    cost: 250,  repeatable: true,  desc: "+20% all income",           effect: { globalMult: 1.20 } },
    { id: "gld_3", name: "Day Skip",        cost: 1000, repeatable: false, desc: "Skip ahead 1 day instantly", effect: { unlock: "daySkip" } },
    { id: "gld_4", name: "Event Shield",    cost: 3000, repeatable: false, desc: "-40% hostile events",       effect: { hostilePct: -0.40 } },
    { id: "gld_5", name: "Golden Aura",     cost: 10000,repeatable: false, desc: "+100% all income",          effect: { globalMult: 2.0 } },
    { id: "gld_6", name: "Midas Touch",     cost: 50000,repeatable: false, desc: "Businesses cost 30% less",   effect: { costMult: 0.7 } }
  ],
  platinum: [
    { id: "plt_1", name: "Platinum Boost",  cost: 75,   repeatable: true,  desc: "+18% all income",           effect: { globalMult: 1.18 } },
    { id: "plt_2", name: "Heavy Metal",     cost: 400,  repeatable: true,  desc: "+30% all income",           effect: { globalMult: 1.30 } },
    { id: "plt_3", name: "Asset Shield",    cost: 2000, repeatable: false, desc: "-50% money loss from events", effect: { lossReduction: 0.5 } },
    { id: "plt_4", name: "Day Master",      cost: 8000, repeatable: false, desc: "+1 day skip per 5 days",    effect: { autoDaySkip: 5 } },
    { id: "plt_5", name: "Empire Tax",      cost: 25000,repeatable: false, desc: "-40% tax rate",             effect: { taxPct: -0.40 } },
    { id: "plt_6", name: "Platinum King",   cost: 100000,repeatable: false,desc: "+200% all income",          effect: { globalMult: 3.0 } }
  ],
  diamond: [
    { id: "dia_1", name: "Crystal Clear",   cost: 100,  repeatable: true,  desc: "+25% all income",           effect: { globalMult: 1.25 } },
    { id: "dia_2", name: "Diamond Drill",   cost: 500,  repeatable: true,  desc: "+40% all income",           effect: { globalMult: 1.40 } },
    { id: "dia_3", name: "Gem Heist",       cost: 2500, repeatable: false, desc: "Heists give +50% reward",    effect: { heistRewardPct: 0.50 } },
    { id: "dia_4", name: "Fortune Blessing",cost: 10000,repeatable: false, desc: "+30% positive events",      effect: { eventPct: 0.30 } },
    { id: "dia_5", name: "Market Edge",     cost: 50000,repeatable: false, desc: "+50% stock returns",        effect: { stockPct: 0.50 } },
    { id: "dia_6", name: "Diamond Crown",   cost: 250000,repeatable: false,desc: "+300% all income",          effect: { globalMult: 4.0 } }
  ],
  antimatter: [
    { id: "ant_1", name: "Stabilizer",      cost: 150,  repeatable: true,  desc: "+30% all income",           effect: { globalMult: 1.30 } },
    { id: "ant_2", name: "Containment",     cost: 750,  repeatable: true,  desc: "+50% all income",           effect: { globalMult: 1.50 } },
    { id: "ant_3", name: "Event Void",      cost: 5000, repeatable: false, desc: "-70% hostile events",       effect: { hostilePct: -0.70 } },
    { id: "ant_4", name: "Anti-Greed",      cost: 20000,repeatable: false, desc: "-50% greed gain",           effect: { greedPct: -0.50 } },
    { id: "ant_5", name: "Time Warp",       cost: 100000,repeatable: false,desc: "+50% tick speed",           effect: { tickPct: 0.50 } },
    { id: "ant_6", name: "Antimatter Core", cost: 500000,repeatable: false,desc: "+500% all income",          effect: { globalMult: 6.0 } }
  ],
  void: [
    { id: "void_1", name: "Emptiness",      cost: 200,  repeatable: true,  desc: "+40% all income",           effect: { globalMult: 1.40 } },
    { id: "void_2", name: "Null Space",     cost: 1000, repeatable: true,  desc: "+60% all income",           effect: { globalMult: 1.60 } },
    { id: "void_3", name: "Greed Immunity", cost: 10000,repeatable: false, desc: "Greed never rises above 50", effect: { greedCap: 50 } },
    { id: "void_4", name: "Event Erasure",  cost: 50000,repeatable: false, desc: "Disable all hostile events", effect: { noHostile: true } },
    { id: "void_5", name: "Rebirth Loop",   cost: 250000,repeatable: false,desc: "Auto-rebirth when eligible", effect: { autoRebirth: true } },
    { id: "void_6", name: "Void Mastery",   cost: 1000000,repeatable: false,desc: "+1000% all income",        effect: { globalMult: 11.0 } }
  ],
  time: [
    { id: "time_1", name: "Second Hand",    cost: 300,  repeatable: true,  desc: "+50% all income",           effect: { globalMult: 1.50 } },
    { id: "time_2", name: "Minute Hour",    cost: 1500, repeatable: true,  desc: "+80% all income",           effect: { globalMult: 1.80 } },
    { id: "time_3", name: "Hour Glass",     cost: 15000,repeatable: false, desc: "2× tick speed",              effect: { tickMult: 2.0 } },
    { id: "time_4", name: "Chrono Skip",    cost: 75000,repeatable: false, desc: "+5 days skip on rebirth",    effect: { rebirthDaySkip: 5 } },
    { id: "time_5", name: "Time Freeze",    cost: 400000,repeatable: false,desc: "Pause game mid-run",         effect: { unlock: "timeFreeze" } },
    { id: "time_6", name: "Time Lord",      cost: 2000000,repeatable: false,desc: "+2000% all income",        effect: { globalMult: 21.0 } }
  ],
  nebula: [
    { id: "neb_1", name: "Star Dust",       cost: 500,  repeatable: true,  desc: "+60% all income",           effect: { globalMult: 1.60 } },
    { id: "neb_2", name: "Nova Burst",      cost: 2500, repeatable: true,  desc: "+100% all income",          effect: { globalMult: 2.00 } },
    { id: "neb_3", name: "Cosmic Eye",      cost: 25000,repeatable: false, desc: "See all future events 3 days ahead", effect: { unlock: "eventPreview" } },
    { id: "neb_4", name: "Galaxy Map",      cost: 125000,repeatable: false,desc: "All cities always unlocked", effect: { allCities: true } },
    { id: "neb_5", name: "Star Forge",      cost: 750000,repeatable: false,desc: "+50% all income (additive)", effect: { globalMult: 1.50 } },
    { id: "neb_6", name: "Nebula Lord",     cost: 5000000,repeatable: false,desc: "+5000% all income",       effect: { globalMult: 51.0 } }
  ],
  quantum: [
    { id: "qua_1", name: "Superposition",   cost: 800,  repeatable: true,  desc: "+80% all income",           effect: { globalMult: 1.80 } },
    { id: "qua_2", name: "Entanglement",    cost: 4000, repeatable: true,  desc: "+150% all income",          effect: { globalMult: 2.50 } },
    { id: "qua_3", name: "Quantum Leap",    cost: 40000,repeatable: false, desc: "Rebirth does not reset ultras", effect: { keepUltras: true } },
    { id: "qua_4", name: "Observer Effect", cost: 200000,repeatable: false,desc: "Events always favorable", effect: { noHostile: true, eventPct: 0.5 } },
    { id: "qua_5", name: "Probability Warp",cost: 1000000,repeatable: false,desc: "+100% heist success",     effect: { heistSuccessPct: 1.0 } },
    { id: "qua_6", name: "Quantum God",     cost: 10000000,repeatable: false,desc: "+10000% all income",     effect: { globalMult: 101.0 } }
  ],
  infinity: [
    { id: "inf_1", name: "Boundless",       cost: 1000, repeatable: true,  desc: "+100% all income",          effect: { globalMult: 2.00 } },
    { id: "inf_2", name: "Endless",         cost: 5000, repeatable: true,  desc: "+200% all income",          effect: { globalMult: 3.00 } },
    { id: "inf_3", name: "Eternal Cycle",   cost: 50000,repeatable: false, desc: "+5 super points on rebirth",effect: { superBonus: 5 } },
    { id: "inf_4", name: "Reality Rewrite", cost: 250000,repeatable: false,desc: "No money cap",              effect: { noMoneyCap: true } },
    { id: "inf_5", name: "True God",        cost: 2000000,repeatable: false,desc: "+50000% all income",      effect: { globalMult: 501.0 } },
    { id: "inf_6", name: "∞",               cost: 20000000,repeatable: false,desc: "+∞ income (capped at 1e50)",effect: { globalMult: 1e50 } }
  ]
};

export function getCurrencyById(id) { return CURRENCIES.find(c => c.id === id); }

export function currentAmount(state, currency) {
  if (!state.money || state.money < currency.threshold) return 0;
  return Math.floor(state.money / currency.threshold);
}

export function lifetimeMax(state, currencyId) {
  return (state.currencyLifetime && state.currencyLifetime[currencyId]) || 0;
}

export function updateLifetime(state) {
  if (!state.currencyLifetime) state.currencyLifetime = {};
  for (const c of CURRENCIES) {
    const cur = currentAmount(state, c);
    if (cur > (state.currencyLifetime[c.id] || 0)) {
      state.currencyLifetime[c.id] = cur;
    }
  }
}
