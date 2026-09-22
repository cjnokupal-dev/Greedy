// GREEDY — heist panel
import { TARGETS, CREWS, canHeist, runHeist, daysUntilHeist } from "../systems/heist.js";
import { formatMoney } from "../utils/format.js";
import { toast } from "./notifications.js";

const panel = () => document.getElementById("panel-heist");
let selectedTarget = null;
let selectedCrew = "locals";

export function renderHeist(state, onChange) {
  const el = panel();
  if (!el) return;
  el.innerHTML = "";

  const ready = canHeist(state);
  const wait = daysUntilHeist(state);

  const summary = document.createElement("div");
  summary.className = "owned-summary";
  summary.innerHTML = `
    <div class="row"><span>Status</span><span class="v" style="color:${ready ? "var(--money)" : "var(--warn)"};">${ready ? "READY" : "COOLDOWN " + wait + " DAYS"}</span></div>
    <div class="row"><span>Heists run</span><span class="v">${state.heistCount || 0}</span></div>
    <div class="row"><span>Successes</span><span class="v" style="color:var(--money);">${state.heistSuccess || 0}</span></div>
    <div class="row"><span>Failures</span><span class="v" style="color:var(--danger);">${state.heistFail || 0}</span></div>
  `;
  el.appendChild(summary);

  // targets
  const ttl = document.createElement("div");
  ttl.style.cssText = "font-size:10px;letter-spacing:2px;color:var(--text-dim);margin:14px 0 8px;font-weight:700;";
  ttl.textContent = "SELECT TARGET";
  el.appendChild(ttl);

  for (const t of TARGETS) {
    const sel = selectedTarget === t.id;
    const card = document.createElement("div");
    card.className = "biz-card";
    card.style.borderLeftColor = sel ? "var(--accent-3)" : "var(--border)";
    card.style.background = sel ? "linear-gradient(135deg,#2a0a1a,#1a0a1a)" : "";
    card.style.cursor = "pointer";
    card.innerHTML = `
      <div class="biz-info">
        <div class="biz-name" style="${sel ? "color:var(--accent-3);" : ""}">${t.name}</div>
        <div class="biz-stats">Reward ${formatMoney(t.reward)} · Base ${(t.successBase * 100).toFixed(0)}% · Heat +${t.heat}</div>
      </div>
    `;
    card.onclick = () => { selectedTarget = t.id; renderHeist(state, onChange); };
    el.appendChild(card);
  }

  // crews
  const ctl = document.createElement("div");
  ctl.style.cssText = "font-size:10px;letter-spacing:2px;color:var(--text-dim);margin:14px 0 8px;font-weight:700;";
  ctl.textContent = "SELECT CREW";
  el.appendChild(ctl);

  for (const c of CREWS) {
    const sel = selectedCrew === c.id;
    const canAfford = state.money >= c.cost;
    const card = document.createElement("div");
    card.className = "biz-card";
    card.style.borderLeftColor = sel ? "var(--accent-2)" : "var(--border)";
    card.style.background = sel ? "linear-gradient(135deg,#1a0a2a,#0a0a1a)" : "";
    card.style.opacity = canAfford ? "1" : "0.4";
    card.style.cursor = canAfford ? "pointer" : "not-allowed";
    card.innerHTML = `
      <div class="biz-info">
        <div class="biz-name" style="${sel ? "color:var(--accent-2);" : ""}">${c.name}</div>
        <div class="biz-stats">Cost ${formatMoney(c.cost)} · +${(c.bonus * 100).toFixed(0)}% success</div>
      </div>
    `;
    if (canAfford) card.onclick = () => { selectedCrew = c.id; renderHeist(state, onChange); };
    el.appendChild(card);
  }

  // run button
  const runBtn = document.createElement("button");
  runBtn.style.cssText = `
    width:100%;margin-top:20px;padding:18px;
    background:${ready && selectedTarget ? "linear-gradient(135deg,#ff0080,#aa0050)" : "transparent"};
    border:1px solid ${ready && selectedTarget ? "transparent" : "var(--border)"};
    border-radius:6px;
    color:${ready && selectedTarget ? "#fff" : "var(--text-mute)"};
    font-weight:800;letter-spacing:3px;font-size:14px;
    font-family:var(--font-display);
    box-shadow:${ready && selectedTarget ? "0 0 30px rgba(255,0,128,0.4)" : "none"};
    text-transform:uppercase;
  `;
  runBtn.textContent = !selectedTarget ? "SELECT TARGET" : !ready ? "COOLDOWN " + wait + " DAYS" : "RUN HEIST";
  runBtn.disabled = !ready || !selectedTarget;
  runBtn.onclick = () => {
    const r = runHeist(state, selectedTarget, selectedCrew);
    if (!r.success) { toast("Cannot heist: " + r.reason); return; }
    showHeistResult(r, onChange);
  };
  el.appendChild(runBtn);
}

function showHeistResult(result, onChange) {
  const backdrop = document.createElement("div");
  backdrop.style.cssText = "position:fixed;inset:0;background:rgba(5,6,10,0.95);z-index:800;display:flex;align-items:center;justify-content:center;padding:20px;";

  const won = result.won;
  const modal = document.createElement("div");
  modal.style.cssText = `
    width:100%;max-width:400px;
    background:linear-gradient(135deg,#0a0d16,#10141f);
    border:1px solid ${won ? "var(--money)" : "var(--danger)"};
    border-radius:6px;padding:28px;text-align:center;
    font-family:var(--font-display);
    box-shadow:0 0 40px ${won ? "rgba(0,255,157,0.4)" : "rgba(255,61,90,0.4)"};
  `;
  modal.innerHTML = `
    <div style="font-size:64px;line-height:1;margin-bottom:16px;filter:drop-shadow(0 0 20px ${won ? "#00ff9d" : "#ff3d5a"});">${won ? "💰" : "🚔"}</div>
    <div style="font-size:11px;letter-spacing:4px;color:${won ? "var(--money)" : "var(--danger)"};font-weight:700;margin-bottom:8px;">${won ? "SUCCESS" : "BUSTED"}</div>
    <div style="font-size:26px;font-weight:800;color:#fff;margin-bottom:12px;">${won ? "+" + formatMoney(result.payout) : "-" + formatMoney(result.fine)}</div>
    <div style="font-size:11px;color:var(--text-dim);margin-bottom:20px;">
      ${result.target.name} · ${result.crew.name}<br>
      Chance was ${(result.chance * 100).toFixed(1)}%
    </div>
    <button id="heist-ok" style="width:100%;padding:14px;background:${won ? "linear-gradient(135deg,#00ff9d,#00aa66)" : "linear-gradient(135deg,#ff3d5a,#aa1030)"};color:${won ? "#000" : "#fff"};font-weight:800;letter-spacing:2px;border-radius:4px;">CONTINUE</button>
  `;
  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);
  modal.querySelector("#heist-ok").onclick = () => {
    backdrop.remove();
    onChange();
  };
}
