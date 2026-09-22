// GREEDY — rare collectible drops
export const COLLECTIBLES = [
  { id: "gold_bar",       name: "Gold Bar",           rarity: "common",    drop: 0.008, bonus: { incomePct: 0.02 },  desc: "+2% income" },
  { id: "antique_coin",   name: "Antique Coin",       rarity: "common",    drop: 0.008, bonus: { greedPct: -0.02 },   desc: "-2% greed gain" },
  { id: "ruby",           name: "Blood Ruby",         rarity: "common",    drop: 0.008, bonus: { incomePct: 0.03 },  desc: "+3% income" },
  { id: "diamond",        name: "Blue Diamond",       rarity: "uncommon",  drop: 0.004, bonus: { incomePct: 0.05 },  desc: "+5% income" },
  { id: "relic",          name: "Ancient Relic",      rarity: "uncommon",  drop: 0.004, bonus: { heatPct: -0.05 },    desc: "-5% heat gain" },
  { id: "black_card",     name: "Black Card",         rarity: "uncommon",  drop: 0.003, bonus: { incomePct: 0.07 },  desc: "+7% income" },
  { id: "crown",          name: "Lost Crown",         rarity: "rare",      drop: 0.0015, bonus: { incomePct: 0.10 }, desc: "+10% income" },
  { id: "artifact",       name: "Alien Artifact",     rarity: "rare",      drop: 0.001, bonus: { globalMult: 1.15 }, desc: "+15% all income" },
  { id: "singularity",    name: "Pocket Singularity", rarity: "epic",      drop: 0.0005, bonus: { globalMult: 1.25 }, desc: "+25% all income" },
  { id: "philosophers",   name: "Philosopher's Stone",rarity: "epic",      drop: 0.0003, bonus: { globalMult: 1.5 },  desc: "+50% all income" },
  { id: "gods_tear",      name: "God's Tear",         rarity: "legendary", drop: 0.0001, bonus: { globalMult: 2.0 },  desc: "+100% all income" },
  { id: "infinity",       name: "Infinity Gem",       rarity: "legendary", drop: 0.00005,bonus: { globalMult: 3.0 },  desc: "+200% all income" }
];

export const RARITY_COLORS = {
  common: "#6a7590",
  uncommon: "#00d4ff",
  rare: "#8a4aff",
  epic: "#ff0080",
  legendary: "#ffd700"
};

export const RARITY_LABELS = {
  common: "COMMON", uncommon: "UNCOMMON", rare: "RARE", epic: "EPIC", legendary: "LEGENDARY"
};

export function rollCollectible(moneyTier) {
  // base drop chance scales with wealth
  const baseChance = 0.001 + Math.min(0.02, moneyTier * 0.001);
  if (Math.random() > baseChance) return null;

  const weights = { common: 60, uncommon: 25, rare: 10, epic: 4, legendary: 1 };
  const pool = COLLECTIBLES.map(c => ({ c, w: weights[c.rarity] * (1 / (c.drop / 0.001)) }));
  const total = pool.reduce((s, p) => s + p.w, 0);
  let r = Math.random() * total;
  for (const { c, w } of pool) {
    r -= w;
    if (r <= 0) return c;
  }
  return pool[0].c;
}
