// GREEDY — ultra upgrades
// Rare timed offers that appear every 10 days and vanish after 30 seconds.
// Big effects, big costs. Miss it and you wait 10 more days.

export const ULTRA_INTERVAL_DAYS = 10;
export const ULTRA_DURATION_MS = 30000;   // 30 seconds on screen

export const ULTRAS = [
  {
    id: "golden_touch",
    name: "Golden Touch",
    cost: 5000,
    desc: "×3 all income permanently",
    effect: { globalMult: 3.0 },
    minDay: 10
  },
  {
    id: "greed_immunity",
    name: "Zen Mind",
    cost: 25000,
    desc: "-50% greed gain permanently",
    effect: { greedMult: 0.5 },
    minDay: 20
  },
  {
    id: "tax_haven",
    name: "Tax Haven",
    cost: 100000,
    desc: "-75% taxes permanently",
    effect: { taxMult: 0.25 },
    minDay: 30
  },
  {
    id: "market_whisper",
    name: "Market Whisper",
    cost: 500000,
    desc: "×2 stock returns permanently",
    effect: { stockMult: 2.0 },
    minDay: 40
  },
  {
    id: "shadow_deal",
    name: "Shadow Deal",
    cost: 2500000,
    desc: "×5 all income, +5 heat/day",
    effect: { globalMult: 5.0, dailyHeat: 5 },
    minDay: 50
  },
  {
    id: "time_dilation",
    name: "Time Dilation",
    cost: 25000000,
    desc: "2× tick speed permanently",
    effect: { tickMult: 2.0 },
    minDay: 60
  },
  {
    id: "infinite_empire",
    name: "Infinite Empire",
    cost: 500000000,
    desc: "×10 all income permanently",
    effect: { globalMult: 10.0 },
    minDay: 80
  }
];

export function getUltraById(id) { return ULTRAS.find(u => u.id === id); }

export function pickUltraForDay(day) {
  // eligible: unlocked by day, not already purchased
  // handled in system, this is just the pool
  return ULTRAS.filter(u => day >= u.minDay);
}
