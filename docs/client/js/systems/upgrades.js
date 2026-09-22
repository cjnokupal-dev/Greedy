// GREEDY — upgrades, employees, stocks logic
import { BALANCE } from "../data/balance.js";
import { UPGRADES } from "../data/upgrades.js";
import { EMPLOYEES } from "../data/employees.js";
import { STOCKS } from "../data/stocks.js";

export function purchasedUpgrades(state) { return state.upgrades || (state.upgrades = {}); }
export function hiredEmployees(state) { return state.employees || (state.employees = {}); }
export function stockHoldings(state) { return state.stocks || (state.stocks = {}); }
export function stockPrices(state) { return state.stockPrices || (state.stockPrices = {}); }

export function globalIncomeMult(state) {
  let m = 1;
  for (const id in purchasedUpgrades(state)) {
    const u = UPGRADES.find(x => x.id === id);
    if (u?.effect?.globalMult) m *= u.effect.globalMult;
  }
  for (const id in hiredEmployees(state)) {
    const e = EMPLOYEES.find(x => x.id === id);
    if (e?.incomeBonus) m *= 1 + e.incomeBonus;
  }
  return m;
}

export function businessIncomeMult(state, bizId) {
  let m = 1;
  for (const id in purchasedUpgrades(state)) {
    const u = UPGRADES.find(x => x.id === id);
    if (u?.effect?.bizMult?.[bizId]) m *= u.effect.bizMult[bizId];
  }
  return m;
}

export function dailyUpkeep(state) {
  let cost = 0;
  for (const id in hiredEmployees(state)) {
    const e = EMPLOYEES.find(x => x.id === id);
    if (e) cost += e.wage * hiredEmployees(state)[id];
  }
  return cost;
}

export function dailyEmployeeBonus(state) {
  let rep = 0, health = 0, heat = 0, greed = 0;
  for (const id in hiredEmployees(state)) {
    const e = EMPLOYEES.find(x => x.id === id);
    if (!e) continue;
    const n = hiredEmployees(state)[id];
    if (e.repPerDay) rep += e.repPerDay * n;
    if (e.healthPerDay) health += e.healthPerDay * n;
    if (e.heatPerDay) heat += e.heatPerDay * n;
    if (e.greedPerDay) greed += e.greedPerDay * n;
  }
  return { rep, health, heat, greed };
}

export function initStockPrices(state) {
  const prices = stockPrices(state);
  for (const s of STOCKS) {
    if (prices[s.id] == null) prices[s.id] = s.basePrice;
  }
}

export function tickStockPrices(state) {
  const prices = stockPrices(state);
  for (const s of STOCKS) {
    const cur = prices[s.id] ?? s.basePrice;
    const drift = (s.basePrice - cur) * 0.05;
    const noise = (Math.random() - 0.5) * s.basePrice * s.volatility;
    prices[s.id] = Math.max(s.basePrice * 0.2, cur + drift + noise);
  }
}

export function buyUpgrade(state, id) {
  const u = UPGRADES.find(x => x.id === id);
  if (!u) return { success: false, reason: "unknown" };
  const owned = purchasedUpgrades(state);
  if (owned[id]) return { success: false, reason: "already_owned" };
  if (state.money < u.cost) return { success: false, reason: "insufficient_funds" };
  state.money -= u.cost;
  owned[id] = true;
  return { success: true, spent: u.cost };
}

export function hireEmployee(state, id) {
  const e = EMPLOYEES.find(x => x.id === id);
  if (!e) return { success: false, reason: "unknown" };
  const hired = hiredEmployees(state);
  hired[id] = (hired[id] || 0) + 1;
  return { success: true };
}

export function fireEmployee(state, id) {
  const hired = hiredEmployees(state);
  if (!hired[id]) return { success: false, reason: "not_hired" };
  hired[id] -= 1;
  if (hired[id] <= 0) delete hired[id];
  return { success: true };
}

export function buyStock(state, id, shares) {
  const prices = stockPrices(state);
  const price = prices[id];
  if (!price) return { success: false, reason: "no_price" };
  const cost = price * shares;
  if (state.money < cost) return { success: false, reason: "insufficient_funds" };
  state.money -= cost;
  const hold = stockHoldings(state);
  hold[id] = (hold[id] || 0) + shares;
  return { success: true, spent: cost, shares };
}

export function sellStock(state, id, shares) {
  const hold = stockHoldings(state);
  if (!hold[id] || hold[id] < shares) return { success: false, reason: "not_owned" };
  const prices = stockPrices(state);
  const price = prices[id] || 0;
  const gained = price * shares;
  state.money += gained;
  hold[id] -= shares;
  if (hold[id] <= 0) delete hold[id];
  return { success: true, gained, shares };
}
