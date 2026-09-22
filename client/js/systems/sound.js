// GREEDY — procedural sound engine (Web Audio API, no files)
let ctx = null;
let enabled = true;
let masterGain = null;

function init() {
  if (ctx) return;
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.15;
    masterGain.connect(ctx.destination);
  } catch (e) { enabled = false; }
}

function tone(freq, dur, type = "sine", vol = 1) {
  if (!enabled) return;
  init();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(vol * 0.3, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start();
    osc.stop(ctx.currentTime + dur);
  } catch (e) {}
}

export function coin() { tone(880, 0.08, "square", 0.5); tone(1320, 0.06, "square", 0.3); }
export function click() { tone(440, 0.04, "square", 0.4); }
export function bigPurchase() {
  tone(523, 0.1, "triangle", 0.6);
  setTimeout(() => tone(659, 0.1, "triangle", 0.6), 60);
  setTimeout(() => tone(784, 0.15, "triangle", 0.8), 120);
  setTimeout(() => tone(1047, 0.25, "triangle", 1.0), 200);
}
export function achievement() {
  [523, 659, 784, 1047, 1319].forEach((f, i) => setTimeout(() => tone(f, 0.15, "sine", 0.7), i * 80));
}
export function danger() {
  tone(110, 0.4, "sawtooth", 0.5);
  setTimeout(() => tone(100, 0.4, "sawtooth", 0.5), 200);
}
export function ominous() { tone(80, 0.8, "sine", 0.3); }
export function jackpot() {
  [523, 587, 659, 698, 784, 880, 988, 1047, 1175, 1319, 1568].forEach((f, i) =>
    setTimeout(() => tone(f, 0.2, "square", 0.6), i * 60)
  );
}
export function gameOver() {
  [440, 415, 392, 370, 349, 330, 311, 294, 262].forEach((f, i) =>
    setTimeout(() => tone(f, 0.3, "sawtooth", 0.5), i * 120)
  );
}
export function setEnabled(v) { enabled = v; init(); if (ctx && ctx.state === "suspended") ctx.resume(); }
export function isEnabled() { return enabled; }
export function setVolume(v) { if (masterGain) masterGain.gain.value = Math.max(0, Math.min(1, v)) * 0.3; }
