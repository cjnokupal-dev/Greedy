// GREEDY — big tappable zone for tap-to-earn
import { tap, getCombo, comboMult } from "../systems/tap.js";
import { formatMoney } from "../utils/format.js";

let zone = null;
let floatLayer = null;

export function installTapZone(state, onChange) {
  if (zone) return;

  zone = document.createElement("div");
  zone.id = "tap-zone";
  zone.style.cssText = `
    position: fixed;
    bottom: 130px;
    right: 14px;
    width: 84px;
    height: 84px;
    background: radial-gradient(circle at center, #00d4ff22, #0a0d16);
    border: 2px solid var(--accent);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    z-index: 80;
    user-select: none;
    cursor: pointer;
    box-shadow: 0 0 30px rgba(0, 212, 255, 0.4), inset 0 0 20px rgba(0, 212, 255, 0.1);
    transition: transform 0.1s;
    font-family: var(--font-display);
  `;
  zone.innerHTML = `
    <div id="tap-icon" style="font-size:28px;">💸</div>
    <div id="tap-combo" style="font-size:10px;font-weight:800;color:var(--accent);letter-spacing:1px;margin-top:2px;"></div>
  `;
  document.body.appendChild(zone);

  floatLayer = document.createElement("div");
  floatLayer.id = "tap-float-layer";
  floatLayer.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:200;";
  document.body.appendChild(floatLayer);

  let comboInterval = setInterval(() => {
    const c = getCombo();
    const combEl = document.getElementById("tap-combo");
    if (combEl) {
      if (c > 0) {
        combEl.textContent = "×" + comboMult().toFixed(2);
        combEl.style.color = c > 20 ? "#ff0080" : c > 10 ? "#ffd700" : "var(--accent)";
      } else {
        combEl.textContent = "";
      }
    }
  }, 100);

  const doTap = (x, y) => {
    const result = tap(state, x, y);
    spawnFloat(result, x, y);
    // shake on crit
    if (result.isCrit) {
      document.body.classList.add("shake");
      setTimeout(() => document.body.classList.remove("shake"), 400);
    }
    zone.style.transform = "scale(0.9)";
    setTimeout(() => { zone.style.transform = "scale(1)"; }, 100);
    onChange?.();
  };

  zone.addEventListener("click", (e) => {
    const rect = zone.getBoundingClientRect();
    doTap(e.clientX || rect.left + 42, e.clientY || rect.top + 42);
  });

  zone.addEventListener("touchstart", (e) => {
    e.preventDefault();
    const t = e.touches[0];
    doTap(t.clientX, t.clientY);
  }, { passive: false });
}

function spawnFloat(result, x, y) {
  const el = document.createElement("div");
  el.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    transform: translate(-50%, -50%);
    color: ${result.isCrit ? "#ffd700" : "#00ff9d"};
    font-weight: 800;
    font-size: ${result.isCrit ? "22px" : "15px"};
    font-family: var(--font-display);
    text-shadow: 0 0 12px currentColor;
    pointer-events: none;
    animation: tapFloat 0.9s ease-out forwards;
    z-index: 300;
  `;
  el.textContent = (result.isCrit ? "CRIT! " : "") + "+" + formatMoney(result.earned);
  floatLayer.appendChild(el);
  setTimeout(() => el.remove(), 900);
}

// add animation
if (!document.getElementById("tap-float-style")) {
  const style = document.createElement("style");
  style.id = "tap-float-style";
  style.textContent = `
    @keyframes tapFloat {
      0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
      20% { transform: translate(-50%, -80%) scale(1.1); opacity: 1; }
      100% { transform: translate(-50%, -150%) scale(1); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}
