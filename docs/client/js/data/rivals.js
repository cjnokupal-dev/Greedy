// GREEDY — rival AI competitors
export const RIVALS = [
  { id: "mob_boss", name: "Vito the Shark", aggression: 0.3, patience: 0.7, desc: "Old money. Doesn't like new blood." },
  { id: "tech_ceo", name: "Silicon Sam", aggression: 0.6, patience: 0.4, desc: "Disrupts everything. Including you." },
  { id: "oil_tycoon", name: "Duke Barrow", aggression: 0.4, patience: 0.6, desc: "Buys politicians like candy." },
  { id: "shadow_agent", name: "The Broker", aggression: 0.8, patience: 0.2, desc: "You never see them coming." },
  { id: "ai_overlord", name: "ORACLE-9", aggression: 0.9, patience: 0.5, desc: "It's already won." }
];
export function getRivalById(id) { return RIVALS.find(r => r.id === id); }
