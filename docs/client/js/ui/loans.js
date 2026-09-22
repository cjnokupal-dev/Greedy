// GREEDY — loans panel
import { activeLoans, totalDebt, maxBorrow, takeLoan, repayLoan } from "../systems/loans.js";
import { netWorth } from "../systems/economy.js";
import { BALANCE } from "../data/balance.js";
import { formatMoney } from "../utils/format.js";
import { toast } from "./notifications.js";

const panel = document.getElementById("panel-loans");

export function renderLoans(state, onChange) {
  if (!panel) return;
  const loans = activeLoans(state);
  const debt = totalDebt(state);
  const nw = netWorth(state);
  const cap = maxBorrow(state, nw);

  panel.innerHTML = `
    <div class="owned-summary">
      <div class="row"><span>Total debt</span><span class="v" style="color:var(--danger)">${formatMoney(debt)}</span></div>
      <div class="row"><span>Max borrow available</span><span class="v money">${formatMoney(cap)}</span></div>
      <div class="row"><span>Interest rate</span><span class="v">${(BALANCE.loans.dailyInterestRate * 100).toFixed(2)}%/day</span></div>
    </div>
  `;

  const takeCard = document.createElement("div");
  takeCard.className = "biz-card";
  takeCard.innerHTML = `
    <div class="biz-info">
      <div class="biz-name">Take New Loan</div>
      <div class="biz-desc">Borrow cash. Pay it back or heat rises.</div>
    </div>
    <div class="biz-actions">
      <button class="btn-buy" id="l-take-1k" ${cap >= 1000 ? "" : "disabled"}>BORROW $1K</button>
      <button class="btn-buy" id="l-take-10k" ${cap >= 10000 ? "" : "disabled"}>BORROW $10K</button>
      <button class="btn-buy" id="l-take-max" ${cap >= 100 ? "" : "disabled"}>BORROW MAX</button>
    </div>
  `;
  panel.appendChild(takeCard);

  takeCard.querySelector("#l-take-1k")?.addEventListener("click", () => {
    const r = takeLoan(state, Math.min(1000, cap));
    toast(r.success ? "Borrowed " + formatMoney(r.amount) : "Cannot borrow");
    onChange();
  });
  takeCard.querySelector("#l-take-10k")?.addEventListener("click", () => {
    const r = takeLoan(state, Math.min(10000, cap));
    toast(r.success ? "Borrowed " + formatMoney(r.amount) : "Cannot borrow");
    onChange();
  });
  takeCard.querySelector("#l-take-max")?.addEventListener("click", () => {
    const r = takeLoan(state, Math.floor(cap));
    toast(r.success ? "Borrowed " + formatMoney(r.amount) : "Cannot borrow");
    onChange();
  });

  for (const l of loans) {
    const card = document.createElement("div");
    card.className = "biz-card";
    card.innerHTML = `
      <div class="biz-info">
        <div class="biz-name">Loan #${l.id.slice(-4)}</div>
        <div class="biz-stats">Principal ${formatMoney(l.principal)} · remaining ${formatMoney(l.remaining)}</div>
        <div class="biz-stats">Taken day ${l.takenDay} · ${(l.rate * 100).toFixed(2)}%/day</div>
      </div>
      <div class="biz-actions">
        <button class="btn-sell" data-pay="${l.id}" data-amt="${l.remaining}">REPAY</button>
        <button class="btn-sell" data-pay="${l.id}" data-amt="${l.remaining / 2}">HALF</button>
      </div>
    `;
    panel.appendChild(card);
    card.querySelectorAll("[data-pay]").forEach(btn => {
      btn.addEventListener("click", () => {
        const amt = parseFloat(btn.dataset.amt);
        const r = repayLoan(state, btn.dataset.pay, amt);
        toast(r.success ? "Repaid " + formatMoney(r.paid) : "Cannot repay");
        onChange();
      });
    });
  }
}
