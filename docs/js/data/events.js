// GREEDY — 60 events
export const EVENTS = [
  // POSITIVE
  { id: "good_week", name: "Good Week", kind: "positive", weight: 5, minGreed: 0, maxGreed: 100, minDay: 3, desc: "Sales spike.", effects: { moneyMult: 1.5 } },
  { id: "viral", name: "Went Viral", kind: "positive", weight: 2, minGreed: 0, maxGreed: 60, minDay: 5, desc: "Someone posted.", effects: { moneyMult: 2.0, greedDelta: 2 } },
  { id: "tax_refund", name: "Tax Refund", kind: "positive", weight: 3, minGreed: 0, maxGreed: 40, minDay: 5, desc: "Government owes you.", effects: { moneyFlat: 250 } },
  { id: "loyal_customer", name: "Loyal Customer", kind: "positive", weight: 4, minGreed: 0, maxGreed: 50, minDay: 2, desc: "Big tip.", effects: { moneyFlat: 80, reputationDelta: 2 } },
  { id: "investor", name: "Angel Investor", kind: "positive", weight: 2, minGreed: 10, maxGreed: 60, minDay: 10, desc: "Believes in you.", effects: { moneyFlat: 5000 } },
  { id: "press_feature", name: "Press Feature", kind: "positive", weight: 3, minGreed: 0, maxGreed: 40, minDay: 8, desc: "Positive story.", effects: { reputationDelta: 8, moneyMult: 1.3 } },
  { id: "windfall", name: "Windfall", kind: "positive", weight: 1, minGreed: 20, maxGreed: 100, minDay: 15, desc: "Unexpected cash.", effects: { moneyFlat: 25000 } },
  { id: "award", name: "Business Award", kind: "positive", weight: 2, minGreed: 10, maxGreed: 60, minDay: 20, desc: "Industry recognition.", effects: { reputationDelta: 12, moneyMult: 1.2 } },
  { id: "mentor", name: "Mentor", kind: "positive", weight: 2, minGreed: 0, maxGreed: 30, minDay: 4, desc: "Someone teaches you.", effects: { moneyFlat: 1500, reputationDelta: 3 } },
  { id: "lucky_break", name: "Lucky Break", kind: "positive", weight: 2, minGreed: 0, maxGreed: 50, minDay: 6, desc: "Right place, right time.", effects: { moneyMult: 1.8 } },
  { id: "lottery", name: "Lottery Win", kind: "positive", weight: 1, minGreed: 0, maxGreed: 100, minDay: 20, desc: "Pure luck.", effects: { moneyFlat: 100000 } },
  { id: "ipo", name: "IPO Day", kind: "positive", weight: 1, minGreed: 40, maxGreed: 100, minDay: 55, desc: "Went public.", effects: { moneyFlat: 5000000, reputationDelta: 10 } },
  { id: "oil_strike", name: "Oil Strike", kind: "positive", weight: 1, minGreed: 30, maxGreed: 100, minDay: 40, desc: "Found oil.", effects: { moneyFlat: 2000000, greedDelta: 10 } },
  { id: "celebrity", name: "Celebrity Endorsement", kind: "positive", weight: 2, minGreed: 20, maxGreed: 80, minDay: 25, desc: "Famous face on your brand.", effects: { moneyMult: 1.6, reputationDelta: 6, greedDelta: 3 } },
  { id: "buyout", name: "Buyout Offer", kind: "positive", weight: 1, minGreed: 30, maxGreed: 100, minDay: 35, desc: "Someone wants to buy.", effects: { moneyFlat: 500000 } },

  // NEUTRAL
  { id: "news_article", name: "News Article", kind: "neutral", weight: 3, minGreed: 20, maxGreed: 100, minDay: 8, desc: "Journalist poking.", effects: { reputationDelta: -3, heatDelta: 5 } },
  { id: "rival_opens", name: "Rival Opens", kind: "neutral", weight: 4, minGreed: 10, maxGreed: 100, minDay: 6, desc: "Someone copying you.", effects: { incomeDebuffNextDay: 0.7 } },
  { id: "supplier_issue", name: "Supplier Issue", kind: "neutral", weight: 3, minGreed: 15, maxGreed: 100, minDay: 10, desc: "Shipment delayed.", effects: { moneyMult: 0.5 } },
  { id: "union_talks", name: "Union Talks", kind: "neutral", weight: 3, minGreed: 30, maxGreed: 100, minDay: 15, desc: "Employees organizing.", effects: { moneyMult: 0.85, reputationDelta: 2 } },
  { id: "regulator_visit", name: "Regulator Visit", kind: "neutral", weight: 3, minGreed: 40, maxGreed: 100, minDay: 18, desc: "Routine inspection.", effects: { heatDelta: 8 } },
  { id: "market_shift", name: "Market Shift", kind: "neutral", weight: 4, minGreed: 10, maxGreed: 100, minDay: 12, desc: "Consumers change.", effects: { moneyMult: 0.9 } },
  { id: "power_outage", name: "Power Outage", kind: "neutral", weight: 3, minGreed: 5, maxGreed: 100, minDay: 10, desc: "Blackout.", effects: { moneyMult: 0.75 } },
  { id: "insurance", name: "Insurance Claim", kind: "neutral", weight: 2, minGreed: 20, maxGreed: 100, minDay: 15, desc: "Covered.", effects: { moneyMult: 1.2 } },
  { id: "rent_hike", name: "Rent Hike", kind: "neutral", weight: 3, minGreed: 20, maxGreed: 100, minDay: 20, desc: "Landlord wants more.", effects: { moneyMult: 0.9 } },
  { id: "new_hire", name: "Key Hire", kind: "neutral", weight: 2, minGreed: 10, maxGreed: 100, minDay: 14, desc: "Someone valuable joins.", effects: { moneyMult: 1.15 } },

  // HOSTILE
  { id: "shoplifter", name: "Shoplifter", kind: "hostile", weight: 3, minGreed: 25, maxGreed: 100, minDay: 5, desc: "Cleaned out register.", effects: { moneyMult: 0.85 } },
  { id: "tax_audit", name: "Tax Audit", kind: "hostile", weight: 3, minGreed: 40, maxGreed: 100, minDay: 15, desc: "IRS wants a word.", effects: { moneyMult: 0.7, greedDelta: -3, heatDelta: -10 } },
  { id: "robbery", name: "Robbery", kind: "hostile", weight: 2, minGreed: 50, maxGreed: 100, minDay: 10, desc: "Armed men.", effects: { moneyMult: 0.6, healthDelta: -5 } },
  { id: "lawsuit", name: "Lawsuit", kind: "hostile", weight: 2, minGreed: 60, maxGreed: 100, minDay: 20, desc: "Former employee suing.", effects: { moneyMult: 0.5, reputationDelta: -8, healthDelta: -3 } },
  { id: "hacker", name: "Hacker Attack", kind: "hostile", weight: 2, minGreed: 45, maxGreed: 100, minDay: 22, desc: "Systems breached.", effects: { moneyMult: 0.75, reputationDelta: -3 } },
  { id: "extortion", name: "Extortion", kind: "hostile", weight: 2, minGreed: 65, maxGreed: 100, minDay: 25, desc: "Wants a cut.", effects: { moneyMult: 0.7, heatDelta: 3 } },
  { id: "betrayal", name: "Betrayal", kind: "hostile", weight: 2, minGreed: 70, maxGreed: 100, minDay: 20, desc: "Insider sold you out.", effects: { moneyMult: 0.55, reputationDelta: -5, greedDelta: -5 } },
  { id: "federal_raid", name: "Federal Raid", kind: "hostile", weight: 2, minGreed: 80, maxGreed: 100, minDay: 25, desc: "Warrant served.", effects: { moneyMult: 0.3, reputationDelta: -15, heatDelta: 20, healthDelta: -10 } },
  { id: "cartel", name: "Cartel Interest", kind: "hostile", weight: 1, minGreed: 75, maxGreed: 100, minDay: 35, desc: "Dangerous people noticed.", effects: { moneyMult: 0.4, healthDelta: -15, heatDelta: 10 } },
  { id: "leak", name: "Data Leak", kind: "hostile", weight: 2, minGreed: 55, maxGreed: 100, minDay: 28, desc: "Records surfaced.", effects: { reputationDelta: -12, heatDelta: 15 } },
  { id: "burnout", name: "Burnout", kind: "hostile", weight: 3, minGreed: 55, maxGreed: 100, minDay: 15, desc: "Body says stop.", effects: { healthDelta: -15, incomeDebuffNextDay: 0.5 } },
  { id: "market_crash", name: "Market Crash", kind: "hostile", weight: 2, minGreed: 65, maxGreed: 100, minDay: 30, desc: "Everything drops.", effects: { moneyMult: 0.4, reputationDelta: -3 } },
  { id: "heart_attack", name: "Health Scare", kind: "hostile", weight: 2, minGreed: 70, maxGreed: 100, minDay: 40, desc: "Hospital visit.", effects: { healthDelta: -25, moneyMult: 0.85 } },
  { id: "assassination", name: "Assassination Attempt", kind: "hostile", weight: 1, minGreed: 90, maxGreed: 100, minDay: 50, desc: "Someone wants you gone.", effects: { healthDelta: -30, moneyMult: 0.6 } },
  { id: "hostile_takeover", name: "Hostile Takeover", kind: "hostile", weight: 1, minGreed: 70, maxGreed: 100, minDay: 55, desc: "Boardroom war.", effects: { moneyMult: 0.5, reputationDelta: -10 } },
  { id: "insider_trading", name: "Insider Trading Charge", kind: "hostile", weight: 2, minGreed: 60, maxGreed: 100, minDay: 45, desc: "SEC is calling.", effects: { moneyMult: 0.55, reputationDelta: -15, heatDelta: 12 } },
  { id: "whistleblower", name: "Whistleblower", kind: "hostile", weight: 2, minGreed: 60, maxGreed: 100, minDay: 32, desc: "Insider talking.", effects: { heatDelta: 20, reputationDelta: -5 } },
  { id: "embezzlement", name: "Embezzlement Found", kind: "hostile", weight: 2, minGreed: 50, maxGreed: 100, minDay: 28, desc: "Missing money.", effects: { moneyMult: 0.5, greedDelta: -8 } },
  { id: "money_laundering", name: "Laundering Charges", kind: "hostile", weight: 1, minGreed: 70, maxGreed: 100, minDay: 50, desc: "Bank statements subpoenaed.", effects: { moneyMult: 0.4, heatDelta: 25 } },
  { id: "cyber_attack", name: "Coordinated Cyber Attack", kind: "hostile", weight: 1, minGreed: 55, maxGreed: 100, minDay: 40, desc: "Everything offline.", effects: { moneyMult: 0.5, reputationDelta: -5 } },
  { id: "worker_strike", name: "Worker Strike", kind: "hostile", weight: 2, minGreed: 40, maxGreed: 100, minDay: 35, desc: "Nobody's working.", effects: { moneyMult: 0.4, reputationDelta: -3 } },
  { id: "power_grab", name: "Board Power Grab", kind: "hostile", weight: 1, minGreed: 60, maxGreed: 100, minDay: 50, desc: "Executives moving.", effects: { moneyMult: 0.65, reputationDelta: -8 } },
  { id: "market_manip", name: "Manipulation Probe", kind: "hostile", weight: 2, minGreed: 65, maxGreed: 100, minDay: 45, desc: "Regulators asking questions.", effects: { moneyMult: 0.6, heatDelta: 18, reputationDelta: -7 } }
];

export function getEventById(id) { return EVENTS.find(e => e.id === id); }
