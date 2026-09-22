// GREEDY — real-time tick engine
import { BALANCE } from "../data/balance.js";
import { BUSINESSES } from "../data/businesses.js";
import * as Economy from "../systems/economy.js";
import * as Greed from "../systems/greed.js";
import * as Events from "../systems/events.js";
import * as Upgrades from "../systems/upgrades.js";
import * as Rebirth from "../systems/rebirth.js";
import * as Ultra from "../systems/ultra.js";
import * as Achievements from "../systems/achievements.js";
import * as Research from "../systems/research.js";
import * as Loans from "../systems/loans.js";
import * as Contracts from "../systems/contracts.js";
import * as Rivals from "../systems/rivals.js";
import * as Quests from "../systems/quests.js";
import { currentCity } from "../data/cities.js";
import * as Crisis from "../systems/crisis.js";
import * as SuperPrestige from "../systems/superPrestige.js";
import * as Ascension from "../systems/ascension.js";
import * as Collectibles from "../systems/collectibles.js";
import * as Currencies from "../systems/currencies.js";
import * as Story from "../systems/story.js";
import * as TimeOfDay from "../systems/timeOfDay.js";
import * as AutoPrestige from "../systems/autoPrestige.js";

let timerId = null;
let tickCount = 0;
export const pendingEvents = [];
export const pendingStory = [];
export const pendingWarnings = [];

// money ticks every N ms
const MONEY_TICK_MS = 500;
// day advances every N money-ticks
const TICKS_PER_DAY = 60;

export function startLoop(state, onTick, onDay) {
  if (timerId) clearInterval(timerId);
  tickCount = 0;
  timerId = setInterval(() => {
    const report = tick(state, onDay);
    tickCount++;
    onTick?.(report, state);
  }, MONEY_TICK_MS);
}

export function stopLoop() {
  if (timerId) clearInterval(timerId);
  timerId = null;
}

export function isRunning() { return timerId !== null; }

function tick(state, onDay) {
  const report = { income: 0, greedDelta: 0, dayAdvanced: false, events: [], warnings: [] };

  // FULL daily income every money-tick
  const baseGross = Economy.grossDailyIncome(state.owned);
  const businessMult = computeBusinessMultiplier(state);
  const upgradeMult = Upgrades.globalIncomeMult(state);
  const gross = baseGross * businessMult * upgradeMult;
  const opCost = Economy.dailyOperatingCost(state.owned);
  const upkeep = Upgrades.dailyUpkeep(state);
  const rTaxMult = Rebirth.rebirthTaxMult(state);
  const city = currentCity(state);
  const cityIncome = city ? city.incomeMult : 1;
  const currencyBonus = Currencies.totalBonus(state);
  const rMult = Rebirth.rebirthIncomeMult(state) * Collectibles.collectionMult(state) * Story.storyIncomeMult(state) * currencyBonus.globalMult * cityIncome * SuperPrestige.superIncomeMult(state) * SuperPrestige.ultraIncomeMult(state) * Ascension.ascensionIncomeMult(state) * Ultra.ultraIncomeMult(state) * Research.researchIncomeMult(state) * Rivals.rivalPressure(state);
  const gMult = Greed.incomeMultiplier(state) * rMult;
  const inc = (gross - opCost - upkeep) * gMult;

  state.money += inc;
  report.income = inc;
  state.stats.totalEarned = (state.stats.totalEarned || 0) + Math.max(0, inc);

  // greed gain scaled per tick
  let ownedGreed = 0;
  for (const id in state.owned) {
    const biz = BUSINESSES.find(b => b.id === id);
    if (biz) ownedGreed += biz.greedPerUnit * state.owned[id];
  }
  const greedDecay = BALANCE.greed.decayPerDay / TICKS_PER_DAY;
  const heatMult = Rebirth.rebirthHeatMult(state);
  const greedMult = Rebirth.rebirthGreedMult(state) * Ultra.ultraGreedMult(state);
  state.greed = clamp(state.greed + ownedGreed * greedMult / TICKS_PER_DAY - greedDecay, 0, BALANCE.greed.max);

  // health/heat/rep drift
  if (state.greed > 50) {
    state.health = clamp(state.health - (state.greed - 50) * 0.003 / TICKS_PER_DAY, 0, BALANCE.health.max);
  } else {
    state.health = clamp(state.health + BALANCE.health.regenPerCalmDay / TICKS_PER_DAY, 0, BALANCE.health.max);
  }
  if (state.greed >= BALANCE.greed.highRiskThreshold) {
    state.heat = clamp(state.heat + BALANCE.heat.gainPerDayHighGreed / TICKS_PER_DAY, 0, BALANCE.heat.max);
  } else {
    state.heat = clamp(state.heat - BALANCE.heat.decayPerDay / TICKS_PER_DAY, 0, BALANCE.heat.max);
  }
  if (state.greed < BALANCE.greed.dangerThreshold) {
    state.reputation = clamp(state.reputation + BALANCE.reputation.gainPerCleanDay / TICKS_PER_DAY, 0, BALANCE.reputation.max);
  } else {
    state.reputation = clamp(state.reputation - state.greed * BALANCE.reputation.drainPerGreedPoint * 0.01 / TICKS_PER_DAY, 0, BALANCE.reputation.max);
  }

  state.stats.peakMoney = Math.max(state.stats.peakMoney || 0, state.money);
  state.stats.peakGreed = Math.max(state.stats.peakGreed || 0, state.greed);

  // day rollover every TICKS_PER_DAY ticks
  if (tickCount % TICKS_PER_DAY === 0) {
    dayRollover(state, report);
    report.dayAdvanced = true;
    onDay?.(state);
  }

  if (state.money < BALANCE.economy.bankruptcyThreshold) state.gameOver = true;
  return report;
}

function dayRollover(state, report) {
  Events.expireActiveEvents(state);
  const evs = Events.rollEvents(state);
  for (const ev of evs) {
    const summary = Events.applyEvent(state, ev);
    report.events.push(summary);
    pendingEvents.push(summary);
    state.eventCooldowns[ev.id] = state.day + (BALANCE.events.hostileCooldownDays || 3);
  }
  state.day += 1;
  state.stats.daysPlayed = (state.stats.daysPlayed || 0) + 1;
  try { Upgrades.tickStockPrices(state); } catch(e) {}
  try { Ultra.maybeSpawnOffer(state); } catch(e) {}
  try { Loans.tickLoans(state, 1); } catch(e) {}
  try { Contracts.checkContracts(state); } catch(e) {}
  try { Rivals.spawnRival(state, state.money); } catch(e) {}
  try { const drop = Collectibles.tryDrop(state); if (drop) { const ev = { id: "drop_" + drop.id, name: "FOUND: " + drop.name, desc: drop.desc, deltas: { } }; report.events.push(ev); pendingEvents.push(ev); } } catch(e) {}
  try { const ch = Story.nextChapter(state); if (ch) { pendingStory.push(ch); } } catch(e) {}
  try { Quests.refreshQuestsIfNeeded(state); } catch(e) {}
  try { const cr = Crisis.rollCrisis(state); if (cr) { const res = Crisis.applyCrisis(state, cr); report.events.push(res); pendingEvents.push(res); } } catch(e) {}
  try { Quests.checkQuests(state); } catch(e) {}
  try { AutoPrestige.maybeAutoRebirth(state); } catch(e) {}
  try { Currencies.tickCurrencies(state); } catch(e) {}
  const newAch = Achievements.checkAchievements(state);
  for (const a of newAch) { if (typeof window !== "undefined" && window.__greedyAch) window.__greedyAch(a); }
  if (Greed.isCritical(state)) { report.warnings.push("Greed is critical."); pendingWarnings.push("Greed is critical."); }
  if (state.health <= BALANCE.health.exhaustionThreshold) { report.warnings.push("Exhausted."); pendingWarnings.push("Exhausted."); }
  if (state.heat >= BALANCE.heat.auditThreshold) { report.warnings.push("Auditors watching."); pendingWarnings.push("Auditors watching."); }
}

function computeBusinessMultiplier(state) {
  let m = 1;
  for (const id in state.owned) {
    m *= Upgrades.businessIncomeMult(state, id);
  }
  return m;
}

function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
