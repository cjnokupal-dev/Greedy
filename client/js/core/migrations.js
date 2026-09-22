// GREEDY — save-format migrations
// When you add a field or rename something, add a step here.
// Never delete old migrations — players' saves depend on them.

export const MIGRATIONS = {
  // from version → function that mutates state in place
  0: (state) => {
    // v0 → v1 : no-op, original format
    return state;
  },
  1: (state) => {
    // v1 → v2 (future)
    return state;
  }
};

export function migrate(state, fromVersion, toVersion) {
  let v = fromVersion;
  while (v < toVersion) {
    const fn = MIGRATIONS[v];
    if (fn) state = fn(state);
    v++;
  }
  return state;
}
