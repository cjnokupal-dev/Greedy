// GREEDY — prestige panel
import { BALANCE } from "../data/balance.js";
import { netWorth } from "../systems/economy.js";
import { resetState } from "../core/state.js";
import { forceSave } from "../core/autosave.js";
import { formatMoney } from "../utils/format.js";

export function installPrestige(getState, onReload) {
  const panel = document.createElement("div");
  panel.id = "prestige-panel";
  panel.innerHTML = `
    <h2>⭐ Prestige</h2>
    <p id="prestige-info" style="color:var(--text-dim);margin-bottom:20px;font-size:13px;"></p>
    <button id="prestige-confirm" style="padding:16px;background:var(--accent);color:#000;border-radius:8px;font-weight:800;margin-bottom:12px;">PRESTIGE NOW</button>
    <button id="prestige-close" style="padding:12px;background:var(--bg-panel);border:1px solid var(--border);border-radius:8px;">Cancel</button>
  `;
  document.body.appendChild(panel);

  panel.querySelector("#prestige-close").onclick = () => panel.classList.remove("open");

  window.addEventListener("prestige-open", () => {
    const s = getState();
    const nw = netWorth(s);
    const can = nw >= BALANCE.prestige.minNetWorth;
    const gain = can ? Math.floor(Math.sqrt(nw / BALANCE.prestige.minNetWorth)) : 0;
    document.getElementById("prestige-info").innerHTML = `
      Net worth: <b style="color:var(--money)">${formatMoney(nw)}</b><br>
      Required: ${formatMoney(BALANCE.prestige.minNetWorth)}<br>
      Current points: <b>${s.prestigePoints || 0}</b><br>
      Gain on reset: <b style="color:var(--accent)">+${gain}</b>
    `;
    panel.querySelector("#prestige-confirm").disabled = !can;
    panel.querySelector("#prestige-confirm").style.opacity = can ? 1 : 0.4;
    panel.querySelector("#prestige-confirm").onclick = () => {
      if (!can) return;
      if (!confirm("Reset run and keep prestige points?")) return;
      const s = getState();
      const newPoints = (s.prestigePoints || 0) + gain;
      resetState(s);
      s.prestigePoints = newPoints;
      s.prestigeCount = (s.prestigeCount || 0) + 1;
      forceSave(s);
      onReload();
    };
  });
}
