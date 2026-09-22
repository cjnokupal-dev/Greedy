// GREEDY — research tree
export const RESEARCH = [
  { id: "r_basic_finance", name: "Basic Finance", cost: 5000, requires: [], effect: { globalMult: 1.10 }, desc: "+10% income" },
  { id: "r_supply_chain", name: "Supply Chain", cost: 25000, requires: ["r_basic_finance"], effect: { globalMult: 1.15 }, desc: "+15% income" },
  { id: "r_automation", name: "Automation", cost: 200000, requires: ["r_supply_chain"], effect: { globalMult: 1.20 }, desc: "+20% income" },
  { id: "r_ai_ops", name: "AI Operations", cost: 5000000, requires: ["r_automation"], effect: { globalMult: 1.30 }, desc: "+30% income" },
  { id: "r_quantum", name: "Quantum Ops", cost: 500000000, requires: ["r_ai_ops"], effect: { globalMult: 1.50 }, desc: "+50% income" },
  { id: "r_market_cap", name: "Market Cap", cost: 50000000000, requires: ["r_quantum"], effect: { globalMult: 2.00 }, desc: "+100% income" }
];

export function getResearchById(id) { return RESEARCH.find(r => r.id === id); }
