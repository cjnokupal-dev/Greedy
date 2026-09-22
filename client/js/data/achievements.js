// GREEDY — 80 achievements
export const ACHIEVEMENTS = [
  // MONEY
  { id: "first_dollar", name: "First Dollar", desc: "Earn your first $1", check: s => s.stats.totalEarned >= 1 },
  { id: "hundred", name: "Pocket Change", desc: "Reach $100", check: s => s.money >= 100 },
  { id: "k1", name: "Thousandaire", desc: "Reach $1,000", check: s => s.money >= 1000 },
  { id: "k10", name: "Ten Kay", desc: "Reach $10,000", check: s => s.money >= 10000 },
  { id: "k100", name: "Six Figures", desc: "Reach $100,000", check: s => s.money >= 100000 },
  { id: "m1", name: "Millionaire", desc: "Reach $1M", check: s => s.money >= 1e6 },
  { id: "m10", name: "Ten Million", desc: "Reach $10M", check: s => s.money >= 1e7 },
  { id: "m100", name: "Hundred Million", desc: "Reach $100M", check: s => s.money >= 1e8 },
  { id: "b1", name: "Billionaire", desc: "Reach $1B", check: s => s.money >= 1e9 },
  { id: "b10", name: "Ten Billion", desc: "Reach $10B", check: s => s.money >= 1e10 },
  { id: "b100", name: "Hundred Billion", desc: "Reach $100B", check: s => s.money >= 1e11 },
  { id: "t1", name: "Trillionaire", desc: "Reach $1T", check: s => s.money >= 1e12 },

  // EMPIRE
  { id: "first_biz", name: "Open for Business", desc: "Buy your first business", check: s => Object.keys(s.owned).length >= 1 },
  { id: "biz_5", name: "Diversified", desc: "Own 5 business types", check: s => Object.keys(s.owned).length >= 5 },
  { id: "biz_10", name: "Conglomerate", desc: "Own 10 business types", check: s => Object.keys(s.owned).length >= 10 },
  { id: "biz_20", name: "Empire", desc: "Own 20 business types", check: s => Object.keys(s.owned).length >= 20 },
  { id: "biz_30", name: "Overlord", desc: "Own 30 business types", check: s => Object.keys(s.owned).length >= 30 },
  { id: "units_10", name: "Small Time", desc: "Own 10 total units", check: s => sumUnits(s) >= 10 },
  { id: "units_50", name: "Landlord", desc: "Own 50 total units", check: s => sumUnits(s) >= 50 },
  { id: "units_200", name: "Tycoon", desc: "Own 200 total units", check: s => sumUnits(s) >= 200 },
  { id: "units_500", name: "Industrialist", desc: "Own 500 total units", check: s => sumUnits(s) >= 500 },
  { id: "units_1000", name: "Robber Baron", desc: "Own 1000 total units", check: s => sumUnits(s) >= 1000 },

  // GREED
  { id: "greed_25", name: "Getting Hungry", desc: "Greed hits 25", check: s => s.greed >= 25 },
  { id: "greed_50", name: "Getting Greedy", desc: "Greed hits 50", check: s => s.greed >= 50 },
  { id: "greed_75", name: "Overindulgent", desc: "Greed hits 75", check: s => s.greed >= 75 },
  { id: "greed_100", name: "Maximum Greed", desc: "Greed hits 100", check: s => s.greed >= 100 },
  { id: "greed_calm", name: "Zen Master", desc: "Stay below 10 greed for 20 days", check: s => s.day >= 20 && s.greed < 10 },

  // DANGER
  { id: "heat_25", name: "Noticed", desc: "Heat hits 25", check: s => s.heat >= 25 },
  { id: "heat_50", name: "On the Radar", desc: "Heat hits 50", check: s => s.heat >= 50 },
  { id: "heat_100", name: "Most Wanted", desc: "Heat hits 100", check: s => s.heat >= 100 },
  { id: "hostile_1", name: "Bad Day", desc: "Survive your first hostile event", check: s => (s.stats.hostileEventsSurvived || 0) >= 1 },
  { id: "hostile_10", name: "Battle Tested", desc: "Survive 10 hostile events", check: s => (s.stats.hostileEventsSurvived || 0) >= 10 },
  { id: "hostile_50", name: "Scarred", desc: "Survive 50 hostile events", check: s => (s.stats.hostileEventsSurvived || 0) >= 50 },
  { id: "hostile_100", name: "Unkillable", desc: "Survive 100 hostile events", check: s => (s.stats.hostileEventsSurvived || 0) >= 100 },

  // HEALTH & REP
  { id: "healthy", name: "Fit Boss", desc: "Health at 100 for 10 days", check: s => s.health >= 100 && s.day >= 10 },
  { id: "rep_100", name: "Beloved", desc: "Reach reputation 100", check: s => s.reputation >= 100 },
  { id: "rep_0", name: "Villain", desc: "Reputation hits 0", check: s => s.reputation <= 0 },

  // UPGRADES
  { id: "upg_1", name: "Upskilled", desc: "Buy your first upgrade", check: s => Object.keys(s.upgrades || {}).length >= 1 },
  { id: "upg_10", name: "Well Equipped", desc: "Buy 10 upgrades", check: s => Object.keys(s.upgrades || {}).length >= 10 },
  { id: "upg_30", name: "Optimized", desc: "Buy 30 upgrades", check: s => Object.keys(s.upgrades || {}).length >= 30 },
  { id: "upg_50", name: "Perfected", desc: "Buy 50 upgrades", check: s => Object.keys(s.upgrades || {}).length >= 50 },
  { id: "ultra_1", name: "Ultra!", desc: "Buy your first ultra", check: s => Object.keys(s.ultras || {}).length >= 1 },
  { id: "ultra_5", name: "Ultra Collector", desc: "Buy 5 ultras", check: s => Object.keys(s.ultras || {}).length >= 5 },
  { id: "ultra_all", name: "Ultra Master", desc: "Buy all ultras", check: s => Object.keys(s.ultras || {}).length >= 7 },

  // EMPLOYEES
  { id: "hire_1", name: "First Hire", desc: "Hire your first employee", check: s => Object.values(s.employees || {}).some(v => v > 0) },
  { id: "hire_10", name: "Team Builder", desc: "Have 10 employees", check: s => sumEmployees(s) >= 10 },
  { id: "hire_50", name: "Chief Executive", desc: "Have 50 employees", check: s => sumEmployees(s) >= 50 },

  // STOCKS
  { id: "stock_1", name: "Investor", desc: "Buy your first stock", check: s => Object.keys(s.stocks || {}).length >= 1 },
  { id: "stock_all", name: "Diversified Portfolio", desc: "Own all 5 stocks", check: s => Object.keys(s.stocks || {}).length >= 5 },

  // REBIRTH
  { id: "rebirth_1", name: "Born Again", desc: "First rebirth", check: s => (s.rebirthCount || 0) >= 1 },
  { id: "rebirth_5", name: "Cycle Master", desc: "5 rebirths", check: s => (s.rebirthCount || 0) >= 5 },
  { id: "rebirth_10", name: "Eternal", desc: "10 rebirths", check: s => (s.rebirthCount || 0) >= 10 },
  { id: "rebirth_25", name: "Ascended", desc: "25 rebirths", check: s => (s.rebirthCount || 0) >= 25 },
  { id: "rebirth_100", name: "Beyond", desc: "100 rebirths", check: s => (s.rebirthCount || 0) >= 100 },

  // TIME
  { id: "day_10", name: "Ten Days In", desc: "Survive 10 days", check: s => s.day >= 10 },
  { id: "day_30", name: "One Month", desc: "Survive 30 days", check: s => s.day >= 30 },
  { id: "day_100", name: "Long Haul", desc: "Survive 100 days", check: s => s.day >= 100 },
  { id: "day_365", name: "One Year In", desc: "Survive 365 days", check: s => s.day >= 365 },
  { id: "day_1000", name: "Millennium", desc: "Survive 1000 days", check: s => s.day >= 1000 },

  // NET WORTH
  { id: "nw_1m", name: "First Million NW", desc: "Net worth $1M", check: s => calcNW(s) >= 1e6 },
  { id: "nw_100m", name: "Real Money", desc: "Net worth $100M", check: s => calcNW(s) >= 1e8 },
  { id: "nw_1b", name: "Billion NW", desc: "Net worth $1B", check: s => calcNW(s) >= 1e9 },
  { id: "nw_1t", name: "Trillion NW", desc: "Net worth $1T", check: s => calcNW(s) >= 1e12 },

  // SPECIAL
  { id: "all_tier1", name: "Starter Kit", desc: "Own all tier 1 businesses", check: s => ["lemonade","newspaper","hotdog","car_wash"].every(id => s.owned[id] > 0) },
  { id: "bank_owner", name: "Banker", desc: "Own a Private Bank", check: s => (s.owned.bank || 0) > 0 },
  { id: "casino_owner", name: "House", desc: "Own a Casino", check: s => (s.owned.casino || 0) > 0 },
  { id: "space_owner", name: "Off-Worlder", desc: "Own Asteroid Mining", check: s => (s.owned.space_mining || 0) > 0 },
  { id: "god_owner", name: "God Corp Owner", desc: "Own a God Corp", check: s => (s.owned.god_corp || 0) > 0 },
  { id: "no_debt", name: "Debt Free", desc: "Reach day 50 with no loans", check: s => s.day >= 50 && (s.loans || []).length === 0 }
];

function sumUnits(s) { return Object.values(s.owned || {}).reduce((a, b) => a + b, 0); }
function sumEmployees(s) { return Object.values(s.employees || {}).reduce((a, b) => a + b, 0); }
function calcNW(s) {
  let nw = s.money;
  for (const id in s.owned || {}) {
    const count = s.owned[id];
    nw += count * 100 * Math.pow(1.15, count);
  }
  return nw;
}

export function getAchievementById(id) { return ACHIEVEMENTS.find(a => a.id === id); }
