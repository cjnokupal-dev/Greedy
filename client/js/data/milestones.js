// GREEDY — milestone unlocks
export const MILESTONES = [
  { id: "m_market_open", name: "Market Opens", check: s => s.day >= 8, unlock: "stocks", desc: "Stocks tab unlocks at day 8." },
  { id: "m_ultra_intro", name: "Ultra Introduced", check: s => s.day >= 10, unlock: "ultra", desc: "Ultra offers begin at day 10." },
  { id: "m_rebirth_ready", name: "Rebirth Ready", check: s => s.money >= 100000, unlock: "rebirth", desc: "Rebirth unlocks at $100K." },
  { id: "m_research", name: "Research Lab", check: s => s.day >= 15, unlock: "research", desc: "Research tree opens at day 15." },
  { id: "m_rivals", name: "Rivals Noticed", check: s => s.day >= 20, unlock: "rivals", desc: "Rivals appear after day 20." }
];
export function getMilestoneById(id) { return MILESTONES.find(m => m.id === id); }
