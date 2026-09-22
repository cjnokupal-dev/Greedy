// GREEDY — contracts panel
import { activeContracts, completedContracts, availableContracts, acceptContract } from "../systems/contracts.js";
import { CONTRACTS } from "../data/contracts.js";
import { formatMoney } from "../utils/format.js";
import { toast } from "./notifications.js";

const panel = document.getElementById("panel-contracts");

export function renderContracts(state, onChange) {
  if (!panel) return;
  panel.innerHTML = "";

  const active = activeContracts(state);
  const done = completedContracts(state);

  if (active.length > 0) {
    const title = document.createElement("div");
    title.style.cssText = "font-size:11px;color:var(--text-dim);letter-spacing:2px;margin:8px 0;";
    title.textContent = "ACTIVE";
    panel.appendChild(title);

    for (const a of active) {
      const c = CONTRACTS.find(x => x.id === a.id);
      if (!c) continue;
      const daysLeft = a.expiresDay - state.day;
      const expired = daysLeft < 0;
      const card = document.createElement("div");
      card.className = "biz-card";
      card.style.borderColor = expired ? "var(--danger)" : "var(--accent)";
      card.innerHTML = `
        <div class="biz-info">
          <div class="biz-name">${c.name}</div>
          <div class="biz-desc">${c.desc}</div>
          <div class="biz-stats">Reward ${formatMoney(c.reward)} · ${expired ? "EXPIRED" : daysLeft + " days left"}</div>
        </div>
      `;
      panel.appendChild(card);
    }
  }

  if (done && Object.keys(done).length > 0) {
    const title = document.createElement("div");
    title.style.cssText = "font-size:11px;color:var(--text-dim);letter-spacing:2px;margin:16px 0 8px;";
    title.textContent = "COMPLETED";
    panel.appendChild(title);

    for (const id in done) {
      const c = CONTRACTS.find(x => x.id === id);
      if (!c) continue;
      const card = document.createElement("div");
      card.className = "biz-card";
      card.style.opacity = "0.6";
      card.innerHTML = `
        <div class="biz-icon" style="background:var(--money);color:#000;">✓</div>
        <div class="biz-info">
          <div class="biz-name">${c.name}</div>
          <div class="biz-desc">Completed day ${done[id]}</div>
        </div>
      `;
      panel.appendChild(card);
    }
  }

  const available = availableContracts(state);
  if (available.length > 0) {
    const title = document.createElement("div");
    title.style.cssText = "font-size:11px;color:var(--text-dim);letter-spacing:2px;margin:16px 0 8px;";
    title.textContent = "AVAILABLE";
    panel.appendChild(title);

    for (const c of available) {
      const card = document.createElement("div");
      card.className = "biz-card";
      card.innerHTML = `
        <div class="biz-info">
          <div class="biz-name">${c.name}</div>
          <div class="biz-desc">${c.desc}</div>
          <div class="biz-stats">Reward ${formatMoney(c.reward)} · ${c.duration} days</div>
        </div>
        <div class="biz-actions">
          <button class="btn-buy">ACCEPT</button>
        </div>
      `;
      panel.appendChild(card);
      card.querySelector("button").addEventListener("click", () => {
        const r = acceptContract(state, c.id);
        toast(r.success ? "Accepted: " + c.name : "Cannot accept");
        onChange();
      });
    }
  }
}
