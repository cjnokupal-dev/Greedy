// GREEDY — market investments
export const STOCKS = [
  { id: "techco", name: "TechCo", basePrice: 100, volatility: 0.08,
    greedPerShare: 0.01, unlockAt: { day: 8 } },
  { id: "oilcorp", name: "OilCorp", basePrice: 250, volatility: 0.06,
    greedPerShare: 0.02, unlockAt: { day: 12 } },
  { id: "biogen", name: "BioGen", basePrice: 500, volatility: 0.12,
    greedPerShare: 0.03, unlockAt: { day: 18 } },
  { id: "crypto", name: "CryptX", basePrice: 1000, volatility: 0.25,
    greedPerShare: 0.05, unlockAt: { day: 25 } },
  { id: "shadow_inc", name: "Shadow Inc.", basePrice: 5000, volatility: 0.18,
    greedPerShare: 0.10, unlockAt: { day: 35 } }
];
export function getStockById(id) { return STOCKS.find(s => s.id === id); }
