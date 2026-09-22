// GREEDY — gambling panel
import { spinSlots, coinFlip, rollDice, gamblingStats, canGamble } from "../systems/gambling.js";
import { formatMoney, parseShorthand } from "../utils/format.js";
import { toast } from "./notifications.js";

const panel = document.getElementById("panel-gambling");

let activeGame = "slots";
let lastResult = null;
let spinFrame = 0;
let spinning = false;

export function renderGambling(state, onChange) {
  if (!panel) return;

  const check = canGamble(state);
  const stats = gamblingStats(state);

  panel.innerHTML = "";

  // summary
  const summary = document.createElement("div");
  summary.className = "owned-summary";
  summary.innerHTML = `
    <div class="row"><span>Wins</span><span class="v" style="color:var(--money);">${stats.wins}</span></div>
    <div class="row"><span>Losses</span><span class="v" style="color:var(--danger);">${stats.losses}</span></div>
    <div class="row"><span>Biggest win</span><span class="v money">${formatMoney(stats.biggest)}</span></div>
    <div class="row"><span>Total wagered</span><span class="v">${formatMoney(stats.wagered)}</span></div>
  `;
  panel.appendChild(summary);

  if (!check.can) {
    const warn = document.createElement("div");
    warn.className = "biz-card";
    warn.style.borderColor = "var(--danger)";
    warn.innerHTML = `<div class="biz-info"><div class="biz-name" style="color:var(--danger);">🚫 Too Hot to Gamble</div><div class="biz-desc">Your heat is too high. Cool down before playing.</div></div>`;
    panel.appendChild(warn);
    return;
  }

  // game selector
  const tabs = document.createElement("div");
  tabs.style.cssText = "display:flex;gap:4px;margin:12px 0;";
  for (const g of [["slots", "🎰 Slots"], ["coin", "🪙 Coin"], ["dice", "🎲 Dice"]]) {
    const btn = document.createElement("button");
    btn.textContent = g[1];
    btn.style.cssText = `flex:1;padding:10px;border:1px solid var(--border);border-radius:6px;font-size:11px;font-weight:700;${activeGame === g[0] ? "background:var(--accent);color:#000;" : "background:var(--bg-panel);color:var(--text-dim);"}`;
    btn.addEventListener("click", () => { activeGame = g[0]; lastResult = null; renderGambling(state, onChange); });
    tabs.appendChild(btn);
  }
  panel.appendChild(tabs);

  // result display
  const display = document.createElement("div");
  display.style.cssText = "background:var(--bg-elevated);border:2px solid var(--border);border-radius:12px;padding:24px;text-align:center;margin-bottom:12px;min-height:100px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;";
  if (activeGame === "slots") {
    const r = lastResult?.reels || ["❓", "❓", "❓"];
    display.innerHTML = `<div style="font-size:40px;letter-spacing:8px;">${r.join(" ")}</div>${lastResult ? `<div style="font-size:14px;color:${lastResult.payout > 0 ? "var(--money)" : "var(--text-dim)"};font-weight:700;">${lastResult.label}${lastResult.payout > 0 ? " +" + formatMoney(lastResult.payout) : ""}</div>` : ""}`;
  } else if (activeGame === "coin") {
    const r = lastResult?.result;
    display.innerHTML = `<div style="font-size:60px;">${r === "heads" ? "🪙" : r === "tails" ? "🔘" : "🪙"}</div>${lastResult ? `<div style="font-size:14px;color:${lastResult.won ? "var(--money)" : "var(--danger)"};font-weight:700;">${lastResult.won ? "WON +" + formatMoney(lastResult.payout) : "LOST"}</div>` : ""}`;
  } else if (activeGame === "dice") {
    const r = lastResult?.roll;
    const faces = ["⚀","⚁","⚂","⚃","⚄","⚅"];
    display.innerHTML = `<div style="font-size:60px;">${r ? faces[r - 1] : "🎲"}</div>${lastResult ? `<div style="font-size:14px;color:${lastResult.won ? "var(--money)" : "var(--danger)"};font-weight:700;">${lastResult.won ? "WON +" + formatMoney(lastResult.payout) : "LOST"} (rolled ${r})</div>` : ""}`;
  }
  panel.appendChild(display);

  // bet input
  const betRow = document.createElement("div");
  betRow.style.cssText = "display:flex;gap:6px;margin-bottom:12px;";
  for (const amt of [100, 1000, 10000, 100000]) {
    const b = document.createElement("button");
    b.textContent = formatMoney(amt);
    b.style.cssText = "flex:1;padding:10px;background:var(--bg-panel);border:1px solid var(--border);border-radius:6px;font-size:11px;color:var(--text);";
    b.addEventListener("click", () => playBet(state, amt, onChange));
    betRow.appendChild(b);
  }
  panel.appendChild(betRow);

  // custom bet with shorthand
  const customRow = document.createElement("div");
  customRow.style.cssText = "display:flex;flex-direction:column;gap:6px;margin-bottom:12px;";
  customRow.innerHTML = `
    <div style="display:flex;gap:6px;">
      <input id="g-bet" type="text" inputmode="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="1m, 500k, 2b, 1qa..." style="flex:1;padding:12px;background:var(--bg-panel);border:1px solid var(--border);border-radius:6px;color:var(--text);font-size:14px;font-family:var(--font-display);" />
      <button id="g-play" style="padding:12px 22px;background:var(--accent);color:#000;font-weight:800;border-radius:6px;font-family:var(--font-display);letter-spacing:1px;">PLAY</button>
    </div>
    <div id="g-bet-preview" style="font-size:11px;color:var(--text-dim);font-family:var(--font-display);padding-left:4px;min-height:16px;"></div>
    <div id="g-quick-chips" style="display:flex;gap:4px;flex-wrap:wrap;"></div>
  `;
  panel.appendChild(customRow);

  const betInput = customRow.querySelector("#g-bet");
  const preview = customRow.querySelector("#g-bet-preview");
  const chips = customRow.querySelector("#g-quick-chips");

  // quick chips for common shorthands
  const chipValues = ["100k", "1m", "10m", "100m", "1b", "10b", "100b", "1t", "1qa"];
  for (const v of chipValues) {
    const chip = document.createElement("button");
    chip.textContent = v.toUpperCase();
    chip.style.cssText = "padding:6px 10px;background:var(--bg-elevated);border:1px solid var(--border);color:var(--text-dim);border-radius:4px;font-size:10px;font-family:var(--font-display);letter-spacing:1px;font-weight:700;";
    chip.onclick = () => {
      betInput.value = v;
      betInput.dispatchEvent(new Event("input"));
    };
    chips.appendChild(chip);
  }

  function updatePreview() {
    const raw = betInput.value;
    if (!raw) { preview.textContent = ""; return; }
    const val = parseShorthand(raw);
    if (val <= 0) { preview.textContent = "Invalid amount"; preview.style.color = "var(--danger)"; return; }
    preview.textContent = "= " + formatMoney(val);
    if (val > state.money) {
      preview.textContent += "  ⚠ more than your cash";
      preview.style.color = "var(--warn)";
    } else {
      preview.style.color = "var(--text-dim)";
    }
  }

  betInput.addEventListener("input", updatePreview);

  customRow.querySelector("#g-play").addEventListener("click", () => {
    const amt = Math.floor(parseShorthand(betInput.value));
    if (amt <= 0) { toast("Invalid bet"); return; }
    playBet(state, amt, onChange);
  });

  // also play on Enter
  betInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const amt = Math.floor(parseShorthand(betInput.value));
      if (amt <= 0) { toast("Invalid bet"); return; }
      playBet(state, amt, onChange);
    }
  });

  // game-specific controls
  if (activeGame === "coin") {
    const coinRow = document.createElement("div");
    coinRow.style.cssText = "display:flex;gap:6px;margin-top:12px;";
    coinRow.innerHTML = `
      <button data-side="heads" style="flex:1;padding:14px;background:var(--bg-panel);border:1px solid var(--border);border-radius:8px;font-size:14px;font-weight:700;">🪙 HEADS</button>
      <button data-side="tails" style="flex:1;padding:14px;background:var(--bg-panel);border:1px solid var(--border);border-radius:8px;font-size:14px;font-weight:700;">🔘 TAILS</button>
    `;
    panel.appendChild(coinRow);
    coinRow.querySelectorAll("[data-side]").forEach(b => {
      b.addEventListener("click", () => {
        const amt = Math.floor(parseShorthand(customRow.querySelector("#g-bet").value)) || 1000;
        const r = coinFlip(state, amt, b.dataset.side);
        if (!r.success) { toast("Cannot play: " + r.reason); return; }
        lastResult = r;
        renderGambling(state, onChange);
        onChange();
      });
    });
  } else if (activeGame === "dice") {
    const diceRow = document.createElement("div");
    diceRow.style.cssText = "display:flex;gap:6px;margin-top:12px;";
    diceRow.innerHTML = `
      <button data-dir="low" style="flex:1;padding:14px;background:var(--bg-panel);border:1px solid var(--border);border-radius:8px;font-size:14px;font-weight:700;">LOW (1-3) ×1.9</button>
      <button data-dir="high" style="flex:1;padding:14px;background:var(--bg-panel);border:1px solid var(--border);border-radius:8px;font-size:14px;font-weight:700;">HIGH (4-6) ×1.9</button>
    `;
    panel.appendChild(diceRow);
    diceRow.querySelectorAll("[data-dir]").forEach(b => {
      b.addEventListener("click", () => {
        const amt = Math.floor(parseShorthand(customRow.querySelector("#g-bet").value)) || 1000;
        const r = rollDice(state, amt, b.dataset.dir);
        if (!r.success) { toast("Cannot play: " + r.reason); return; }
        lastResult = r;
        renderGambling(state, onChange);
        onChange();
      });
    });
  }
}

function playBet(state, amount, onChange) {
  if (activeGame === "slots") {
    const r = spinSlots(state, amount);
    if (!r.success) { toast("Cannot spin: " + r.reason); return; }
    lastResult = r;
    renderGambling(state, onChange);
    onChange();
  }
}
