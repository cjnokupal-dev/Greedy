// GREEDY — Super + Ultra + Ascension UI
import * as SP from "../systems/superPrestige.js";
import * as Asc from "../systems/ascension.js";
import { netWorth } from "../systems/economy.js";
import { formatMoney } from "../utils/format.js";
import { toast } from "./notifications.js";

const panel = document.getElementById("panel-super");
let activeTab = "super";

export function renderSuperPrestige(state, onChange) {
  if (!panel) return;
  panel.innerHTML = "";

  const tabs = document.createElement("div");
  tabs.style.cssText = "display:flex;gap:4px;margin-bottom:16px;";
  for (const [id, label] of [["super","SUPER"],["ultra","ULTRA"],["ascend","ASCEND"]]) {
    const b = document.createElement("button");
    b.textContent = label;
    b.style.cssText = "flex:1;padding:10px;font-size:10px;letter-spacing:2px;font-weight:700;font-family:var(--font-display);border-radius:4px;border:1px solid " + (activeTab === id ? "var(--accent-2)" : "var(--border)") + ";background:" + (activeTab === id ? "rgba(124,58,237,0.15)" : "transparent") + ";color:" + (activeTab === id ? "var(--accent-2)" : "var(--text-dim)") + ";text-transform:uppercase;";
    b.onclick = () => { activeTab = id; renderSuperPrestige(state, onChange); };
    tabs.appendChild(b);
  }
  panel.appendChild(tabs);

  if (activeTab === "super") renderSuper(panel, state, onChange);
  else if (activeTab === "ultra") renderUltra(panel, state, onChange);
  else if (activeTab === "ascend") renderAscend(panel, state, onChange);
}

function card(title, sub, btnText, disabled, onClick) {
  const el = document.createElement("div");
  el.style.cssText = "padding:16px;margin-bottom:10px;background:linear-gradient(135deg,#0a0d16,#10141f);border:1px solid var(--border);border-left:2px solid var(--accent-2);border-radius:4px;font-family:var(--font-display);";
  el.innerHTML = `
    <div style="font-size:9px;color:var(--text-dim);letter-spacing:3px;font-weight:700;margin-bottom:6px;">${title}</div>
    <div style="font-size:11px;color:var(--text-dim);margin-bottom:12px;line-height:1.6;">${sub}</div>
    <button style="width:100%;padding:12px;background:${disabled ? "transparent" : "linear-gradient(135deg,var(--accent-2),#5a2aaa)"};color:${disabled ? "var(--text-mute)" : "#fff"};font-weight:800;border-radius:4px;letter-spacing:2px;font-family:var(--font-display);border:1px solid ${disabled ? "var(--border)" : "transparent"};opacity:${disabled ? 0.5 : 1};" ${disabled ? "disabled" : ""}>${btnText}</button>
  `;
  const btn = el.querySelector("button");
  if (onClick && !disabled) btn.onclick = onClick;
  return el;
}

function renderSuper(panel, state, onChange) {
  const pts = SP.superPoints(state);
  const count = SP.superCount(state);
  const can = SP.canSuperPrestige(state);
  const reward = SP.superReward(state);

  panel.appendChild(card("SUPER PRESTIGE", `
    Level: <b style="color:#fff;">${count}</b><br>
    Super Points: <b style="color:var(--accent-2);">${pts}</b><br>
    Income Bonus: <b style="color:var(--money);">×${SP.superIncomeMult(state).toFixed(1)}</b><br>
    Start Money: <b>${formatMoney(SP.superStartMoney(state))}</b><br>
    <br>
    ${can ? "Reward: +" + reward + " super points" : "Requires: rebirth 10+ and $1 Qa"}
  `, can ? "SUPER PRESTIGE NOW" : "LOCKED", !can, can ? () => {
    if (!confirm("Super Prestige resets ALL rebirth progress, businesses, upgrades, ultras. You keep super points, achievements, and city.")) return;
    const r = SP.doSuperPrestige(state);
    if (r.success) toast("★ Super Prestige! +" + r.reward + " SP");
    onChange();
  } : null));
}

function renderUltra(panel, state, onChange) {
  const pts = SP.ultraPoints(state);
  const count = SP.ultraCount(state);
  const can = SP.canUltraPrestige(state);
  const reward = SP.ultraReward(state);

  panel.appendChild(card("ULTRA PRESTIGE", `
    Level: <b style="color:#fff;">${count}</b><br>
    Ultra Points: <b style="color:var(--accent-3);">${pts}</b><br>
    Income Bonus: <b style="color:var(--money);">×${SP.ultraIncomeMult(state).toFixed(1)}</b><br>
    Greed Reduction: <b>${((1-SP.ultraGreedMult(state))*100).toFixed(0)}%</b><br>
    <br>
    ${can ? "Reward: +" + reward + " ultra points" : "Requires: super prestige 5+ and $1 Qi"}
  `, can ? "ULTRA PRESTIGE" : "LOCKED", !can, can ? () => {
    if (!confirm("Ultra Prestige resets EVERYTHING below (super, rebirth, businesses). You keep ultra points.")) return;
    const r = SP.doUltraPrestige(state);
    if (r.success) toast("★ Ultra Prestige! +" + r.reward + " UP");
    onChange();
  } : null));
}

function renderAscend(panel, state, onChange) {
  const pts = Asc.ascensionPoints(state);
  const count = Asc.ascensionCount(state);
  const can = Asc.canAscend(state);
  const reward = Asc.ascensionReward(state);

  panel.appendChild(card("ASCENSION — THE FINAL LAYER", `
    Level: <b style="color:#fff;">${count}</b><br>
    Ascension Points: <b style="color:var(--accent-3);">${pts}</b><br>
    Income Multiplier: <b style="color:var(--money);">×${Asc.ascensionIncomeMult(state).toFixed(0)}</b><br>
    <br>
    ${can ? "Reward: +" + reward + " ascension points" : "Requires: ultra prestige 3+ and $1 Sx"}
  `, can ? "ASCEND" : "LOCKED", !can, can ? () => {
    if (!confirm("ASCENDANCE resets EVERYTHING except achievements and titles. The ultimate reset.")) return;
    const r = Asc.doAscend(state);
    if (r.success) toast("✦ ASCENDED! +" + r.reward + " AP");
    onChange();
  } : null));

  // Ascension perk shop
  if (pts > 0 || Asc.boughtAscensionPerks(state) && Object.keys(Asc.boughtAscensionPerks(state)).length > 0) {
    const title = document.createElement("div");
    title.style.cssText = "font-size:10px;letter-spacing:3px;color:var(--text-dim);margin:20px 0 10px;font-weight:700;";
    title.textContent = "ASCENSION PERKS — " + pts + " AP AVAILABLE";
    panel.appendChild(title);

    const owned = Asc.boughtAscensionPerks(state);
    for (const p of Asc.ASCENSION_PERKS) {
      const has = !!owned[p.id];
      const canBuy = pts >= p.cost && !has;
      const el = document.createElement("div");
      el.style.cssText = "padding:14px;margin-bottom:8px;background:#0a0d16;border:1px solid var(--border);border-left:2px solid " + (has ? "var(--money)" : canBuy ? "var(--accent-3)" : "var(--border)") + ";border-radius:4px;font-family:var(--font-display);";
      el.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <div style="font-size:12px;font-weight:800;color:${has ? "var(--money)" : "#fff"};letter-spacing:1px;">${has ? "✓ " : ""}${p.name}</div>
          <div style="font-size:10px;color:${canBuy ? "var(--accent-3)" : "var(--text-mute)"};font-weight:700;">${p.cost} AP</div>
        </div>
        <div style="font-size:10px;color:var(--text-dim);margin-bottom:${canBuy ? "10px" : "0"};">${p.desc}</div>
        ${canBuy ? '<button style="width:100%;padding:8px;background:linear-gradient(135deg,var(--accent-3),#aa0060);color:#fff;font-weight:700;border-radius:3px;font-size:10px;letter-spacing:1px;">BUY</button>' : ""}
      `;
      if (canBuy) {
        el.querySelector("button").onclick = () => {
          const r = Asc.buyAscensionPerk(state, p.id);
          if (r.success) toast("Perk bought: " + p.name);
          onChange();
        };
      }
      panel.appendChild(el);
    }
  }
}
