// GREEDY — day/night cycle for the pixel scene
// A full "day" is 60 real seconds (matches ticksPerDay).

export function getTimeOfDay(state) {
  const total = 60; // ticks per day
  const progress = ((state.stats?.daysPlayed || 0) + (state.money % 1)) % 1;
  return progress;
}

// Actually use in-game tick count
let tickCount = 0;
export function tickTimeOfDay() { tickCount++; }

export function timeProgress() {
  return (tickCount % 60) / 60;
}

export function getSkyPhase() {
  const t = timeProgress();
  // 0.0 = dawn, 0.25 = noon, 0.5 = dusk, 0.75 = night
  if (t < 0.15) return { phase: "dawn",  sky1: "#2a1a3a", sky2: "#4a2a4a" };
  if (t < 0.35) return { phase: "day",   sky1: "#2a3a5a", sky2: "#4a5a7a" };
  if (t < 0.55) return { phase: "dusk",  sky1: "#5a2a3a", sky2: "#8a3a4a" };
  if (t < 0.85) return { phase: "night", sky1: "#0a0a1a", sky2: "#1a1a2a" };
  return { phase: "dawn", sky1: "#2a1a3a", sky2: "#4a2a4a" };
}

export function isNight() {
  const t = timeProgress();
  return t < 0.15 || t > 0.85;
}

export function getBuildingLight() {
  // buildings glow at night
  return isNight() ? 1 : 0.3;
}
