// GREEDY — skins, outfits, dialogue
export const OUTFITS = [
  // progression (auto by money)
  { id: "street",       name: "Street Kid",       unlock: s => true,                    desc: "Where everyone starts." },
  { id: "hoodie",       name: "Hustler",          unlock: s => s.money >= 5e3,          desc: "You look like you're up to something." },
  { id: "casual",       name: "Small Biz",        unlock: s => s.money >= 5e4,          desc: "Polo shirt and khakis." },
  { id: "suit",         name: "Executive",        unlock: s => s.money >= 5e5,          desc: "Sharp. Expensive. Hungry." },
  { id: "pimp",         name: "Big Spender",      unlock: s => s.money >= 5e6,          desc: "Gold chains. Fur coat. Attitude." },
  { id: "mob",          name: "Made Man",         unlock: s => s.money >= 5e7,          desc: "Nobody asks questions anymore." },
  { id: "shadow",       name: "Shadow Broker",    unlock: s => s.money >= 5e8,          desc: "No reflection in mirrors." },
  { id: "cosmic",       name: "Cosmic Entity",    unlock: s => s.money >= 5e10,         desc: "You've stopped being human." },
  { id: "god",          name: "God Corp CEO",     unlock: s => s.money >= 5e12,         desc: "You broke the game. Now you are it." },

  // unlockables by achievement / progression
  { id: "hacker",       name: "Hacker",           unlock: s => (s.upgrades && Object.keys(s.upgrades).length) >= 10, desc: "Console cowboy. Nothing is safe." },
  { id: "ninja",        name: "Ninja",            unlock: s => s.heat >= 50,            desc: "Silent. Deadly. Untraceable." },
  { id: "chef",         name: "Master Chef",      unlock: s => (s.owned && s.owned.restaurant) >= 5, desc: "Runs the kitchen like a navy ship." },
  { id: "cowboy",       name: "Cowboy",           unlock: s => s.day >= 20,             desc: "Six shooter. Ten-gallon hat." },
  { id: "pirate",       name: "Pirate Captain",   unlock: s => (s.owned && s.owned.shipping) >= 1, desc: "Yarr. Legit cargo, I swear." },
  { id: "astronaut",    name: "Astronaut",        unlock: s => (s.owned && s.owned.space_mining) >= 1, desc: "One small step for profit." },
  { id: "cyborg",       name: "Cyborg",           unlock: s => (s.upgrades && s.upgrades.ai_optimize) || s.rebirthCount >= 3, desc: "Half machine. All business." },
  { id: "vampire",      name: "Vampire Lord",     unlock: s => s.health < 50 && s.greed > 80, desc: "Night trade only." },
  { id: "wizard",       name: "Wizard",           unlock: s => (s.rebirthCount || 0) >= 5, desc: "Trades in secrets and stocks." },
  { id: "dragon",       name: "Dragon",           unlock: s => s.money >= 5e15,         desc: "Hoards everything. Obviously." },
  { id: "phoenix",      name: "Phoenix",          unlock: s => (s.rebirthCount || 0) >= 10, desc: "Born again. Again." },
  { id: "void",         name: "Void Walker",      unlock: s => (s.rebirthCount || 0) >= 25, desc: "Exists between dimensions." },
  { id: "king",         name: "King",             unlock: s => s.money >= 5e18,         desc: "Crowned by fortune." },
  { id: "emperor",      name: "Emperor",          unlock: s => s.money >= 5e21,         desc: "Rules with an iron ledger." },
  { id: "founder",      name: "The Founder",      unlock: s => s.money >= 1e30,         desc: "You wrote the rules of the game." }
];

export const DIALOGUE = {
  income: ["Another sale!", "Money moves.", "Cha-ching.", "Getting richer.", "Yes... more.", "Feed me coins."],
  buy: ["Big moves.", "Mine now.", "The empire grows.", "Locked in.", "Acquired."],
  sell: ["Liquidating.", "Cash out.", "Letting go.", "Moving on."],
  highGreed: ["I can feel it...", "More. MORE.", "I can't stop.", "The hunger..."],
  maxGreed: ["I AM the greed.", "Nothing can stop me.", "Burn it all.", "I'm not me anymore."],
  highHeat: ["They're watching.", "Cops everywhere.", "Eyes on me.", "Lay low..."],
  lowHealth: ["I need rest...", "Can't keep this up.", "Body's giving out.", "Just... a nap."],
  lowRep: ["They hate me.", "Nobody trusts me.", "Villain arc.", "Fine. Let them."],
  calm: ["This is nice.", "Steady wins.", "Peaceful day.", "I like it here."],
  idle: ["...", "Hmm.", "What's next?", "Thinking.", "Tired."],
  achievement: ["I did it!", "Trophy!", "Record broken.", "Yes!"],
  rebirth: ["Born again.", "Fresh start.", "Again.", "New life, same me."]
};

export const RARITY_COLORS = {
  street: "#4a90d9", hoodie: "#8a6ad9", casual: "#6aa76a", suit: "#1a1a2e",
  pimp: "#c8a02a", mob: "#8a1a1a", shadow: "#0a0a14", cosmic: "#5a2a8a", god: "#ffd700",
  hacker: "#00ff88", ninja: "#1a1a1a", chef: "#ffffff", cowboy: "#8a5a2a", pirate: "#3a1a1a",
  astronaut: "#e8e8f0", cyborg: "#00d4ff", vampire: "#6a0000", wizard: "#8a3aff",
  dragon: "#ff8c00", phoenix: "#ff4a00", void: "#2a0a4a", king: "#d4af37",
  emperor: "#8a1a6a", founder: "#ffffff"
};
