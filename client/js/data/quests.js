// GREEDY — daily quests
export const QUEST_POOL = [
  { id: "q_buy5",     name: "Buy 5 businesses",       check: (s, b) => (s.ownedTotal || 0) - b.ownedTotal >= 5,              reward: 1000 },
  { id: "q_earn10k",  name: "Earn $10,000",           check: (s, b) => (s.stats.totalEarned || 0) - b.earned >= 10000,       reward: 5000 },
  { id: "q_greed40",  name: "Reach greed 40",         check: (s, b) => s.greed >= 40,                                        reward: 8000 },
  { id: "q_lowgreed", name: "Keep greed under 20",    check: (s, b) => s.greed < 20,                                         reward: 3000 },
  { id: "q_rep70",    name: "Raise rep to 70",        check: (s, b) => s.reputation >= 70,                                   reward: 4000 },
  { id: "q_heat30",   name: "Stay under 30 heat",     check: (s, b) => s.heat < 30,                                          reward: 3000 },
  { id: "q_hp90",     name: "Keep health above 90",   check: (s, b) => s.health >= 90,                                       reward: 3000 },
  { id: "q_upg1",     name: "Buy any upgrade",        check: (s, b) => Object.keys(s.upgrades || {}).length > b.upgrades,    reward: 6000 },
  { id: "q_sell",     name: "Sell any business",      check: (s, b) => (s.stats.totalSales || 0) > b.sales,                  reward: 2000 },
  { id: "q_hire",     name: "Hire any employee",      check: (s, b) => Object.keys(s.employees || {}).length > b.employees,  reward: 4000 },
  { id: "q_stock",    name: "Buy any stock",          check: (s, b) => Object.keys(s.stocks || {}).length > b.stocks,        reward: 5000 },
  { id: "q_loan",     name: "Take a loan",            check: (s, b) => (s.loans || []).length > b.loans,                     reward: 3000 }
];

export function pickDailyQuests(seed, count = 3) {
  const shuffled = [...QUEST_POOL].sort((a, b) => {
    const sa = (seed * 9301 + 49297) % 233280;
    const sb = (seed * 49297 + 9301) % 233280;
    return (sa % 100) - (sb % 100);
  });
  return shuffled.slice(0, count);
}
