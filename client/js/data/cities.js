// GREEDY — cities (locations you unlock as you grow)
export const CITIES = [
  {
    id: "hometown",
    name: "Hometown",
    desc: "Where it all starts. Small town, small dreams.",
    unlock: s => true,
    skyPalette: ["#14141c", "#1c1c28"],
    groundColor: "#2a2a3a",
    buildingColor: "#4a4a5a",
    incomeMult: 1.0,
    costMult: 1.0,
    eventMult: 1.0
  },
  {
    id: "bigcity",
    name: "Big City",
    desc: "Bright lights. Sharper elbows.",
    unlock: s => s.money >= 100000,
    skyPalette: ["#1a1420", "#22182a"],
    groundColor: "#2a2a3e",
    buildingColor: "#4a4a7a",
    incomeMult: 1.5,
    costMult: 1.3,
    eventMult: 1.2
  },
  {
    id: "capital",
    name: "Capital District",
    desc: "Where deals get made and laws get written.",
    unlock: s => s.money >= 10000000,
    skyPalette: ["#201a1a", "#2a1c1c"],
    groundColor: "#3a2a2a",
    buildingColor: "#6a4a4a",
    incomeMult: 2.5,
    costMult: 1.8,
    eventMult: 1.4
  },
  {
    id: "offshore",
    name: "Offshore Haven",
    desc: "No taxes. No laws. No questions.",
    unlock: s => s.money >= 1000000000,
    skyPalette: ["#0a1a2a", "#0a0a1a"],
    groundColor: "#1a2a3a",
    buildingColor: "#3a4a6a",
    incomeMult: 5.0,
    costMult: 3.0,
    eventMult: 0.8
  },
  {
    id: "orbit",
    name: "Orbital Station",
    desc: "Above the law. Literally.",
    unlock: s => s.money >= 100000000000,
    skyPalette: ["#000000", "#0a0a20"],
    groundColor: "#1a1a3a",
    buildingColor: "#2a2a6a",
    incomeMult: 12.0,
    costMult: 6.0,
    eventMult: 0.6
  },
  {
    id: "dimension",
    name: "Pocket Dimension",
    desc: "You broke reality. Now you trade in it.",
    unlock: s => s.money >= 10000000000000,
    skyPalette: ["#2a0a3a", "#4a0a2a"],
    groundColor: "#3a1a4a",
    buildingColor: "#8a4aff",
    incomeMult: 40.0,
    costMult: 20.0,
    eventMult: 0.4
  }
];

export function getCityById(id) { return CITIES.find(c => c.id === id); }

export function unlockedCities(state) {
  return CITIES.filter(c => c.unlock(state));
}

export function currentCity(state) {
  return getCityById(state.currentCity) || CITIES[0];
}

export function travelTo(state, cityId) {
  const city = getCityById(cityId);
  if (!city) return { success: false, reason: "unknown" };
  if (!city.unlock(state)) return { success: false, reason: "locked" };
  state.currentCity = cityId;
  return { success: true, city };
}
