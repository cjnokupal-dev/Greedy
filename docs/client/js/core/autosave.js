// GREEDY — autosave
// Saves every N days, plus on tab hide / unload.

import { saveGame } from "./save.js";
import { BALANCE } from "../data/balance.js";
import { toast } from "../ui/notifications.js";

let lastSaveDay = -1;
let dirty = false;

export function markDirty() {
  dirty = true;
}

export function maybeAutosave(state) {
  if (!BALANCE.persistence.autosaveEnabled) return;
  if (!dirty) return;

  const every = BALANCE.persistence.autosaveEveryNDays || 5;
  if (state.day - lastSaveDay < every && lastSaveDay !== -1) return;

  const ok = saveGame(state);
  if (ok) {
    lastSaveDay = state.day;
    dirty = false;
    console.log("[autosave] saved at day", state.day);
  }
}

export function forceSave(state, silent = false) {
  const ok = saveGame(state);
  if (ok) {
    lastSaveDay = state.day;
    dirty = false;
    if (!silent) toast("Saved");
  }
  return ok;
}

// Save when tab is hidden or closed
export function installLifecycleHooks(getState) {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      forceSave(getState(), true);
    }
  });
  window.addEventListener("beforeunload", () => {
    forceSave(getState(), true);
  });
}
