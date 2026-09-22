// GREEDY — loans
import { BALANCE } from "../data/balance.js";

export function activeLoans(state) { return state.loans || (state.loans = []); }

export function totalDebt(state) {
  return activeLoans(state).reduce((sum, l) => sum + l.remaining, 0);
}

export function maxBorrow(state, netWorth) {
  const cap = Math.max(0, netWorth) * BALANCE.loans.maxLoanToNetWorthRatio;
  return Math.max(0, cap - totalDebt(state));
}

export function takeLoan(state, amount) {
  if (amount <= 0) return { success: false, reason: "invalid" };
  const rate = BALANCE.loans.dailyInterestRate;
  state.money += amount;
  activeLoans(state).push({
    id: "loan_" + Date.now(),
    principal: amount,
    remaining: amount,
    rate,
    takenDay: state.day
  });
  return { success: true, amount, rate };
}

export function repayLoan(state, loanId, amount) {
  const loan = activeLoans(state).find(l => l.id === loanId);
  if (!loan) return { success: false, reason: "not_found" };
  const pay = Math.min(amount, loan.remaining, state.money);
  if (pay <= 0) return { success: false, reason: "cannot_pay" };
  state.money -= pay;
  loan.remaining -= pay;
  if (loan.remaining <= 0.01) {
    state.loans = activeLoans(state).filter(l => l.id !== loanId);
  }
  return { success: true, paid: pay };
}

export function tickLoans(state, fraction = 1) {
  let interest = 0;
  for (const l of activeLoans(state)) {
    const i = l.remaining * l.rate * fraction;
    l.remaining += i;
    interest += i;
  }
  // auto-deduct daily minimum
  if (fraction === 1) {
    for (const l of activeLoans(state)) {
      const minPay = l.principal * BALANCE.loans.minPaymentRate;
      if (state.money >= minPay) {
        state.money -= minPay;
        l.remaining -= minPay;
      } else {
        l.remaining *= 1.05;
        state.heat = Math.min(BALANCE.heat.max, state.heat + BALANCE.loans.missedPaymentHeat);
        state.reputation = Math.max(0, state.reputation + BALANCE.loans.missedPaymentReputation);
      }
      if (l.remaining <= 0.01) {
        state.loans = activeLoans(state).filter(x => x.id !== l.id);
      }
    }
  }
  return interest;
}
