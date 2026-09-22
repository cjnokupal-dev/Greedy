// GREEDY — number formatting (supports up to vigintillion + scientific)
const UNITS = [
  { v: 1e3,  s: "K" },
  { v: 1e6,  s: "M" },
  { v: 1e9,  s: "B" },
  { v: 1e12, s: "T" },
  { v: 1e15, s: "Qa" },
  { v: 1e18, s: "Qi" },
  { v: 1e21, s: "Sx" },
  { v: 1e24, s: "Sp" },
  { v: 1e27, s: "Oc" },
  { v: 1e30, s: "No" },
  { v: 1e33, s: "Dc" },
  { v: 1e36, s: "UDc" },
  { v: 1e39, s: "DDc" },
  { v: 1e42, s: "TDc" },
  { v: 1e45, s: "QaDc" },
  { v: 1e48, s: "QiDc" },
  { v: 1e51, s: "SxDc" },
  { v: 1e54, s: "SpDc" },
  { v: 1e57, s: "OcDc" },
  { v: 1e60, s: "NoDc" },
  { v: 1e63, s: "Vg" }
];

export function formatMoney(n) {
  if (n == null || !isFinite(n)) return "$0";
  const neg = n < 0;
  const abs = Math.abs(n);
  let out;

  if (abs < 1000) {
    out = abs < 10 ? abs.toFixed(2) : abs.toFixed(abs < 100 ? 1 : 0);
  } else {
    let chosen = null;
    for (let i = UNITS.length - 1; i >= 0; i--) {
      if (abs >= UNITS[i].v) { chosen = UNITS[i]; break; }
    }
    if (chosen) {
      const val = abs / chosen.v;
      out = val.toFixed(val < 10 ? 3 : val < 100 ? 2 : val < 1000 ? 1 : 0) + chosen.s;
    } else {
      out = abs.toExponential(2).replace("e+", "e");
    }
  }

  return (neg ? "-$" : "$") + out;
}

export function formatNumber(n) {
  if (n == null || !isFinite(n)) return "0";
  const abs = Math.abs(n);
  if (abs < 1000) return abs.toString();
  for (let i = UNITS.length - 1; i >= 0; i--) {
    if (abs >= UNITS[i].v) {
      const val = abs / UNITS[i].v;
      return val.toFixed(val < 10 ? 3 : val < 100 ? 2 : val < 1000 ? 1 : 0) + UNITS[i].s;
    }
  }
  return abs.toExponential(2);
}

// Parse shorthand numbers: "1k" = 1000, "1.5m" = 1500000, "2b" = 2e9, "1t" = 1e12, "1qa" = 1e15, etc.
export function parseShorthand(input) {
  if (input == null) return 0;
  const s = String(input).trim().toLowerCase().replace(/[$,\s]/g, "");
  if (s === "") return 0;

  const match = s.match(/^([0-9.]+)\s*([a-z]*)$/);
  if (!match) {
    const n = parseFloat(s);
    return isFinite(n) ? n : 0;
  }

  const num = parseFloat(match[1]);
  if (!isFinite(num)) return 0;
  const suffix = match[2] || "";

  const mults = {
    "": 1,
    "k": 1e3,
    "m": 1e6,
    "b": 1e9,
    "t": 1e12,
    "qa": 1e15, "q": 1e15,
    "qi": 1e18,
    "sx": 1e21,
    "sp": 1e24,
    "oc": 1e27,
    "no": 1e30,
    "dc": 1e33,
    "udc": 1e36, "ud": 1e36,
    "ddc": 1e39, "dd": 1e39,
    "tdc": 1e42, "td": 1e42,
    "qadc": 1e45,
    "qidc": 1e48,
    "sxdc": 1e51,
    "spdc": 1e54,
    "ocdc": 1e57,
    "nodc": 1e60,
    "vg": 1e63
  };

  const mult = mults[suffix];
  if (mult == null) {
    const n = parseFloat(s);
    return isFinite(n) ? n : 0;
  }
  return num * mult;
}
