// GREEDY — HUD renderer
import * as Greed from "../systems/greed.js";
import { formatMoney } from "../utils/format.js";
import { currentTitle } from "../data/titles.js";

const el = {
  day: document.getElementById("hud-day"),
  money: document.getElementById("hud-money"),
  greedFill: document.getElementById("greed-fill"),
  greedValue: document.getElementById("greed-value"),
  rep: document.getElementById("hud-rep"),
  heat: document.getElementById("hud-heat"),
  health: document.getElementById("hud-health")
};

let titleEl = null;
let lastTitle = "";

export function renderHUD(state) {
  if (el.day) el.day.textContent = state.day;
  if (el.money) el.money.textContent = formatMoney(state.money);

  const ratio = Greed.getGreedRatio(state);
  if (el.greedFill) {
    el.greedFill.style.width = (ratio * 100).toFixed(1) + "%";
    el.greedFill.className = "meter-fill " + Greed.dangerLevel(state);
  }
  if (el.greedValue) el.greedValue.textContent = Math.floor(state.greed);

  if (el.rep) el.rep.textContent = Math.floor(state.reputation);
  if (el.heat) el.heat.textContent = Math.floor(state.heat);
  if (el.health) el.health.textContent = Math.floor(state.health);

  // title display
  const titleName = state.selectedTitle
    ? (window.__TITLES__?.find(t => t.id === state.selectedTitle)?.name || state.selectedTitle)
    : currentTitle(state).name;

  if (titleName !== lastTitle) {
    lastTitle = titleName;
    if (!titleEl && el.day) {
      titleEl = document.createElement("div");
      titleEl.style.cssText = "font-size:9px;color:var(--accent);letter-spacing:2px;margin-top:2px;";
      el.day.parentElement.appendChild(titleEl);
    }
    if (titleEl) titleEl.textContent = titleName.toUpperCase();
  }
}
