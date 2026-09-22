// GREEDY — player titles (unlock by milestones)
export const TITLES = [
  { id: "nobody",       name: "Nobody",            check: s => true },
  { id: "hustler",      name: "Street Hustler",    check: s => s.money >= 5000 },
  { id: "operator",     name: "Operator",          check: s => s.money >= 50000 },
  { id: "businessman",  name: "Businessman",       check: s => s.money >= 500000 },
  { id: "executive",    name: "Executive",         check: s => s.money >= 5000000 },
  { id: "tycoon",       name: "Tycoon",            check: s => s.money >= 50000000 },
  { id: "magnate",      name: "Magnate",           check: s => s.money >= 5e8 },
  { id: "oligarch",     name: "Oligarch",          check: s => s.money >= 5e9 },
  { id: "shadow_boss",  name: "Shadow Boss",       check: s => s.money >= 5e11 },
  { id: "world_leader", name: "World Leader",      check: s => s.money >= 5e13 },
  { id: "interstellar", name: "Interstellar",      check: s => s.money >= 5e15 },
  { id: "cosmic_entity",name: "Cosmic Entity",     check: s => s.money >= 5e17 },
  { id: "god",          name: "God Corp CEO",      check: s => s.money >= 5e19 },
  { id: "reborn",       name: "The Reborn",        check: s => (s.rebirthCount || 0) >= 1 },
  { id: "eternal",      name: "Eternal",           check: s => (s.rebirthCount || 0) >= 10 },
  { id: "transcendent", name: "Transcendent",      check: s => (s.rebirthCount || 0) >= 25 },
  { id: "immortal",     name: "Immortal",          check: s => (s.rebirthCount || 0) >= 50 }
];

export function currentTitle(state) {
  const earned = TITLES.filter(t => t.check(state));
  return earned[earned.length - 1] || TITLES[0];
}

export function allEarnedTitles(state) {
  return TITLES.filter(t => t.check(state));
}
