// GREEDY — auto-rebirth
import * as Rebirth from "./rebirth.js";
import { netWorth } from "./economy.js";

export function maybeAutoRebirth(state) {
  if (!Rebirth.hasPerk(state, "auto_prestige")) return false;
  const nw = netWorth(state);
  const info = Rebirth.nextRebirth(state, nw);
  if (!info.canRebirth) return false;

  const r = Rebirth.doRebirth(state, nw);
  return r.success;
}
