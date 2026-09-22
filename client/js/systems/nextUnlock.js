// GREEDY — shows what's next to unlock
import { BUSINESSES } from "../data/businesses.js";
import { UPGRADES } from "../data/upgrades.js";
import { CURRENCIES } from "../data/currencies.js";

export function findNextUnlock(state) {
  const out = [];

  // next business
  for (const b of BUSINESSES) {
    const owned = state.owned[b.id] || 0;
    if (owned > 0) continue;
    const u = b.unlockAt || {};
    if (u.day != null && state.day < u.day) {
      out.push({ type: "business", name: b.name, need: "day " + u.day, current: state.day, target: u.day, unit: "day" });
      break;
    }
    if (u.money != null && state.money < u.money) {
      out.push({ type: "business", name: b.name, need: "$" + fmtNum(u.money), current: state.money, target: u.money, unit: "$" });
      break;
    }
  }

  // next upgrade
  for (const u of UPGRADES) {
    if (state.upgrades && state.upgrades[u.id]) continue;
    const day = u.unlockAt?.day ?? 1;
    if (state.day < day) {
      out.push({ type: "upgrade", name: u.name, need: "day " + day, current: state.day, target: day, unit: "day" });
      break;
    }
  }

  // next currency
  for (const c of CURRENCIES) {
    if (state.money < c.threshold) {
      out.push({ type: "currency", name: c.name, need: "$" + fmtNum(c.threshold), current: state.money, target: c.threshold, unit: "$" });
      break;
    }
  }

  return out;
}

function fmtNum(n) {
  if (n >= 1e63) return (n / 1e63).toFixed(1) + "Vg";
  if (n >= 1e36) return (n / 1e36).toFixed(1) + "UDc";
  if (n >= 1e30) return (n / 1e30).toFixed(1) + "No";
  if (n >= 1e24) return (n / 1e24).toFixed(1) + "Sp";
  if (n >= 1e18) return (n / 1e18).toFixed(1) + "Qi";
  if (n >= 1e15) return (n / 1e15).toFixed(1) + "Qa";
  if (n >= 1e12) return (n / 1e12).toFixed(1) + "T";
  if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return n.toFixed(0);
}
