// GREEDY — story chapters
export const CHAPTERS = [
  {
    id: "ch1", unlockDay: 3, unlockMoney: 500,
    title: "First Profit",
    text: "The first real money hits your account. Somebody notices. A well-dressed stranger approaches you at the stand.",
    choices: [
      { id: "a", text: "Hear them out", path: "clever", effect: { money: 500, rep: 5 } },
      { id: "b", text: "Walk away", path: "honest", effect: { rep: 10 } },
      { id: "c", text: "Show them your ledger", path: "ruthless", effect: { money: 1000, heat: 5 } }
    ]
  },
  {
    id: "ch2", unlockDay: 10, unlockMoney: 25000,
    title: "The Offer",
    text: "An investor wants 40% of your business. Their money would triple your growth. Their connections are... flexible.",
    choices: [
      { id: "a", text: "Take the deal", path: "clever", effect: { money: 20000, income: 1.5 } },
      { id: "b", text: "Negotiate to 20%", path: "clever", effect: { money: 10000, income: 1.2, rep: 5 } },
      { id: "c", text: "Decline, go alone", path: "honest", effect: { rep: 15 } }
    ]
  },
  {
    id: "ch3", unlockDay: 25, unlockMoney: 500000,
    title: "The Rival",
    text: "Vito wants a meeting. He's old money. He's polite. His offer is not. 'Sell me your businesses, or I'll take them.'",
    choices: [
      { id: "a", text: "Sell to him", path: "honest", effect: { money: 200000, rep: 5 } },
      { id: "b", text: "Refuse and prepare", path: "ruthless", effect: { heat: 15, income: 1.3 } },
      { id: "c", text: "Counter-offer — buy HIM", path: "clever", effect: { money: -100000, rep: -5, income: 2.0 } }
    ]
  },
  {
    id: "ch4", unlockDay: 45, unlockMoney: 50000000,
    title: "The Foundation",
    text: "A charity reaches out. They want your name on a hospital wing. Publicity or private shame — your call.",
    choices: [
      { id: "a", text: "Donate publicly", path: "honest", effect: { money: -1000000, rep: 25 } },
      { id: "b", text: "Donate anonymously", path: "clever", effect: { money: -1000000, rep: 10, karma: 1 } },
      { id: "c", text: "Refuse, fund a PR campaign", path: "ruthless", effect: { money: -500000, rep: 15, heat: 5 } }
    ]
  },
  {
    id: "ch5", unlockDay: 70, unlockMoney: 1e10,
    title: "The Senate",
    text: "Two senators. Both want campaign donations. Both promise regulatory protection. One is lying. You can't tell which.",
    choices: [
      { id: "a", text: "Fund both", path: "clever", effect: { money: -100000000, rep: 10, heat: -10 } },
      { id: "b", text: "Fund the one your gut trusts", path: "honest", effect: { money: -100000000, rep: 20 } },
      { id: "c", text: "Fund neither — bribe a judge instead", path: "ruthless", effect: { money: -50000000, heat: 20, income: 1.5 } }
    ]
  },
  {
    id: "ch6", unlockDay: 100, unlockMoney: 1e15,
    title: "The Summit",
    text: "You've been invited to the world's most exclusive gathering. Heads of state. Private jets. Whispered conversations about who controls the future.",
    choices: [
      { id: "a", text: "Join the club", path: "ruthless", effect: { income: 2.0, rep: -10, heat: -20 } },
      { id: "b", text: "Attend, but observe only", path: "clever", effect: { income: 1.5, rep: 10 } },
      { id: "c", text: "Refuse the invitation", path: "honest", effect: { rep: 30 } }
    ]
  },
  {
    id: "ch7", unlockDay: 150, unlockMoney: 1e20,
    title: "The Question",
    text: "You sit alone at the top of your tower. Money isn't the point anymore. What IS the point?",
    choices: [
      { id: "a", text: "Legacy", path: "honest", effect: { rep: 100, income: 5.0 } },
      { id: "b", text: "Power", path: "ruthless", effect: { income: 10.0, heat: -50 } },
      { id: "c", text: "Freedom", path: "clever", effect: { income: 7.0, greed: -30 } }
    ]
  }
];

export const PATHS = {
  honest:   { name: "The Honest",   color: "#00ff9d", desc: "You built it clean." },
  clever:   { name: "The Clever",   color: "#00d4ff", desc: "You always found a way." },
  ruthless: { name: "The Ruthless", color: "#ff0080", desc: "You did what you had to." }
};
