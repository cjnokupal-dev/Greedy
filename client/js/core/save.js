// GREEDY — save/load/migrate
// Owns the format. Nothing else serializes state directly.

import { ensureShape, createNewState } from "./state.js";
import { migrate } from "./migrations.js";
import * as Storage from "../utils/storage.js";

const SAVE_KEY = "save";
const CURRENT_VERSION = 1;

// ==========================================
// SERIALIZE
// ==========================================

export function toJSON(state) {
  return {
    version: CURRENT_VERSION,
    savedAt: Date.now(),
    state
  };
}

export function fromJSON(payload) {
  if (!payload || typeof payload !== "object") return null;

  let state = payload.state;
  if (!state) return null;

  // migrate old versions
  const fromVersion = payload.version ?? 0;
  if (fromVersion < CURRENT_VERSION) {
    state = migrate(state, fromVersion, CURRENT_VERSION);
  }

  // guarantee shape
  ensureShape(state);
  return state;
}

// ==========================================
// DISK
// ==========================================

export function saveGame(state) {
  const payload = toJSON(state);
  return Storage.save(SAVE_KEY, payload);
}

export function loadGame() {
  const payload = Storage.load(SAVE_KEY, null);
  if (!payload) return null;
  return fromJSON(payload);
}

export function hasSave() {
  return Storage.has(SAVE_KEY);
}

export function deleteSave() {
  return Storage.remove(SAVE_KEY);
}

// ==========================================
// EXPORT / IMPORT (text)
// ==========================================

export function exportSave(state) {
  const payload = toJSON(state);
  const json = JSON.stringify(payload);
  return btoa(unescape(encodeURIComponent(json))); // base64
}

export function importSave(base64) {
  try {
    const json = decodeURIComponent(escape(atob(base64)));
    const payload = JSON.parse(json);
    return fromJSON(payload);
  } catch (e) {
    console.error("[save] import failed:", e);
    return null;
  }
}

// ==========================================
// META
// ==========================================

export function saveMeta() {
  const payload = Storage.load(SAVE_KEY, null);
  if (!payload) return null;
  return {
    version: payload.version,
    savedAt: payload.savedAt,
    day: payload.state?.day,
    money: payload.state?.money
  };
}
