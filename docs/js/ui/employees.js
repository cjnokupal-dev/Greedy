// GREEDY — employees panel
import { EMPLOYEES } from "../data/employees.js";
import { hiredEmployees, hireEmployee, fireEmployee } from "../systems/upgrades.js";
import { formatMoney } from "../utils/format.js";

const panel = document.getElementById("panel-employees");

export function renderEmployees(state, onChange) {
  if (!panel) return;
  panel.innerHTML = "";
  const hired = hiredEmployees(state);

  const visible = EMPLOYEES.filter(e => state.day >= (e.unlockAt?.day ?? 1));
  if (visible.length === 0) {
    panel.innerHTML = '<p style="color:var(--text-dim);text-align:center;padding:40px 0;">No staff available yet.</p>';
    return;
  }

  for (const e of visible) {
    const count = hired[e.id] || 0;
    const card = document.createElement("div");
    card.className = "biz-card";
    card.innerHTML = `
      <div class="biz-info">
        <div class="biz-name">${e.name}</div>
        <div class="biz-desc">${e.desc}</div>
        <div class="biz-stats">Wage: ${formatMoney(e.wage)}/day</div>
      </div>
      <div class="biz-owned">${count}</div>
      <div class="biz-actions">
        <button class="btn-buy" data-hire="${e.id}">HIRE</button>
        ${count > 0 ? `<button class="btn-sell" data-fire="${e.id}">FIRE</button>` : ""}
      </div>
    `;
    panel.appendChild(card);
  }

  panel.querySelectorAll("[data-hire]").forEach(btn => {
    btn.addEventListener("click", () => { hireEmployee(state, btn.dataset.hire); onChange(); });
  });
  panel.querySelectorAll("[data-fire]").forEach(btn => {
    btn.addEventListener("click", () => { fireEmployee(state, btn.dataset.fire); onChange(); });
  });
}
