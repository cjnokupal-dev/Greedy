// GREEDY — environment detection
export const IS_LOCALHOST = (() => {
  try {
    const h = location.hostname;
    return h === "localhost" || h === "127.0.0.1" || h === "0.0.0.0" || h.endsWith(".local");
  } catch (e) { return false; }
})();

export const IS_RELEASE = !IS_LOCALHOST;

export function shouldShowDevTools() {
  return IS_LOCALHOST;
}
