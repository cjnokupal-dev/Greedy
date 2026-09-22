// GREEDY — localStorage wrapper
// One place that knows how to talk to the browser.

const PREFIX = "greedy_";

export function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error("[storage] save failed:", e);
    return false;
  }
}

export function load(key, fallback = null) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error("[storage] load failed:", e);
    return fallback;
  }
}

export function remove(key) {
  try {
    localStorage.removeItem(PREFIX + key);
    return true;
  } catch {
    return false;
  }
}

export function has(key) {
  return localStorage.getItem(PREFIX + key) != null;
}

export function listKeys() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(PREFIX)) keys.push(k.slice(PREFIX.length));
  }
  return keys;
}

export function clearAll() {
  for (const k of listKeys()) remove(k);
}

export function sizeBytes() {
  let total = 0;
  for (const k of listKeys()) {
    const v = localStorage.getItem(PREFIX + k);
    if (v) total += v.length + k.length;
  }
  return total;
}
