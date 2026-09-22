// GREEDY — contracts (timed goals with rewards)
export const CONTRACTS = [
  { id: "c_first_1000", name: "First Grand", desc: "Reach $1,000 in 10 days", duration: 10, reward: 500, check: s => s.money >= 1000, minDay: 1 },
  { id: "c_5_biz", name: "Diversify", desc: "Own 5 businesses in 20 days", duration: 20, reward: 5000, check: s => Object.keys(s.owned).length >= 5, minDay: 5 },
  { id: "c_greed_50", name: "Dance with Danger", desc: "Hit greed 50 in 15 days", duration: 15, reward: 10000, check: s => s.greed >= 50, minDay: 8 },
  { id: "c_nw_1m", name: "Million Dollar Club", desc: "Reach $1M net worth in 40 days", duration: 40, reward: 250000, check: s => s.money >= 1e6, minDay: 10 },
  { id: "c_bank", name: "Open a Bank", desc: "Own a Private Bank in 50 days", duration: 50, reward: 2000000, check: s => (s.owned.bank || 0) > 0, minDay: 15 },
  { id: "c_ultra", name: "Ultra Hunter", desc: "Buy any ultra upgrade", duration: 999, reward: 500000, check: s => Object.keys(s.ultras || {}).length >= 1, minDay: 10 },
  { id: "c_rep_100", name: "Beloved Boss", desc: "Reach rep 100", duration: 999, reward: 1000000, check: s => s.reputation >= 100, minDay: 12 },
  { id: "c_rebirth_1", name: "Reborn", desc: "Complete a rebirth", duration: 999, reward: 5000000, check: s => (s.rebirthCount || 0) >= 1, minDay: 20 }
];
export function getContractById(id) { return CONTRACTS.find(c => c.id === id); }
