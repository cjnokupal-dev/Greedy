// GREEDY — gambling
import { BALANCE } from "../data/balance.js";

export function gamblingStats(state) {
  return state.gambling || (state.gambling = { wins: 0, losses: 0, biggest: 0, wagered: 0 });
}

export function canGamble(state) {
  if (state.heat >= BALANCE.heat.auditThreshold) {
    return { can: false, reason: "too_hot" };
  }
  return { can: true };
}

// slots — three reels, match to win
export function spinSlots(state, bet) {
  const check = canGamble(state);
  if (!check.can) return { success: false, reason: check.reason };
  if (state.money < bet) return { success: false, reason: "insufficient_funds" };
  if (bet <= 0) return { success: false, reason: "invalid_bet" };

  state.money -= bet;
  const g = gamblingStats(state);
  g.wagered += bet;

  const symbols = ["🍒", "🍋", "🔔", "💎", "7️⃣"];
  const weights = [40, 30, 15, 10, 5];
  const reels = [pickWeighted(symbols, weights), pickWeighted(symbols, weights), pickWeighted(symbols, weights)];

  let payout = 0;
  let label = "No match";
  if (reels[0] === reels[1] && reels[1] === reels[2]) {
    const mult = { "🍒": 5, "🍋": 8, "🔔": 15, "💎": 40, "7️⃣": 100 }[reels[0]];
    payout = bet * mult;
    label = "JACKPOT ×" + mult;
    g.wins++;
  } else if (reels[0] === reels[1] || reels[1] === reels[2] || reels[0] === reels[2]) {
    payout = Math.floor(bet * 1.5);
    label = "Pair ×1.5";
    g.wins++;
  } else {
    g.losses++;
  }

  if (payout > 0) {
    state.money += payout;
    if (payout > g.biggest) g.biggest = payout;
  }

  // greed rises from gambling
  state.greed = Math.min(BALANCE.greed.max, state.greed + bet / 10000);

  return { success: true, reels, payout, label, net: payout - bet };
}

// coin flip — 50/50 double or nothing
export function coinFlip(state, bet, choice) {
  const check = canGamble(state);
  if (!check.can) return { success: false, reason: check.reason };
  if (state.money < bet) return { success: false, reason: "insufficient_funds" };
  state.money -= bet;
  const g = gamblingStats(state);
  g.wagered += bet;

  const result = Math.random() < 0.5 ? "heads" : "tails";
  const won = result === choice;
  let payout = 0;
  if (won) {
    payout = bet * 2;
    state.money += payout;
    g.wins++;
    if (payout > g.biggest) g.biggest = payout;
  } else {
    g.losses++;
  }

  return { success: true, result, won, payout, net: won ? bet : -bet };
}

// dice — roll high or low vs house
export function rollDice(state, bet, target) {
  const check = canGamble(state);
  if (!check.can) return { success: false, reason: check.reason };
  if (state.money < bet) return { success: false, reason: "insufficient_funds" };
  state.money -= bet;
  const g = gamblingStats(state);
  g.wagered += bet;

  const roll = 1 + Math.floor(Math.random() * 6);
  const won = target === "high" ? roll >= 4 : roll <= 3;
  const payout = won ? Math.floor(bet * 1.9) : 0;
  if (won) {
    state.money += payout;
    g.wins++;
    if (payout > g.biggest) g.biggest = payout;
  } else {
    g.losses++;
  }

  return { success: true, roll, won, payout, net: won ? payout - bet : -bet };
}

function pickWeighted(items, weights) {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}
