// GREEDY — full-screen game over overlay
import { deleteSave, saveGame } from "../core/save.js";
import { createNewState } from "../core/state.js";
import { formatMoney } from "../utils/format.js";
import * as SP from "../systems/superPrestige.js";
import * as Asc from "../systems/ascension.js";

let overlay = null;

export function showGameOver(state, onReset) {
  if (overlay) return;

  overlay = document.createElement("div");
  overlay.id = "gameover-overlay";
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: radial-gradient(circle at center, #1a0000 0%, #05060a 70%);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
    font-family: var(--font-display);
    animation: gameOverIn 0.8s ease-out;
    overflow-y: auto;
  `;

  const totalEarned = (state.stats?.totalEarned || 0);
  const totalSpent = (state.stats?.totalSpent || 0);
  const daysPlayed = (state.stats?.daysPlayed || state.day || 0);
  const peakMoney = (state.stats?.peakMoney || state.money || 0);

  // survivable reset options (keep some layers)
  const canSuperReset = (state.rebirthCount || 0) >= 5;
  const canUltraReset = (state.superCount || 0) >= 2;
  const canAscendReset = (state.ultraCount || 0) >= 1;

  overlay.innerHTML = `
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:72px;line-height:1;margin-bottom:16px;filter:drop-shadow(0 0 30px #ff3d5a);">💀</div>
      <div style="font-size:11px;letter-spacing:6px;color:#ff3d5a;font-weight:700;margin-bottom:8px;">BANKRUPT</div>
      <div style="font-size:32px;font-weight:800;letter-spacing:4px;color:#fff;text-shadow:0 0 30px #ff3d5a;margin-bottom:8px;">GAME OVER</div>
      <div style="font-size:11px;color:#6a7590;letter-spacing:1px;">Day ${state.day} · Your empire has fallen</div>
    </div>

    <div style="width:100%;max-width:400px;background:linear-gradient(135deg,#0a0d16,#10141f);border:1px solid #2a2030;border-left:2px solid #ff3d5a;border-radius:4px;padding:20px;margin-bottom:20px;">
      <div style="font-size:9px;letter-spacing:3px;color:#6a7590;font-weight:700;margin-bottom:14px;">FINAL STATISTICS</div>
      <div style="display:flex;justify-content:space-between;font-size:11px;color:#6a7590;padding:4px 0;">
        <span>Total earned</span><b style="color:#00ff9d;float:right;">${formatMoney(totalEarned)}</b>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:11px;color:#6a7590;padding:4px 0;">
        <span>Total spent</span><b style="color:#fff;float:right;">${formatMoney(totalSpent)}</b>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:11px;color:#6a7590;padding:4px 0;">
        <span>Peak money</span><b style="color:#00d4ff;float:right;">${formatMoney(peakMoney)}</b>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:11px;color:#6a7590;padding:4px 0;">
        <span>Days played</span><b style="color:#fff;float:right;">${daysPlayed}</b>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:11px;color:#6a7590;padding:4px 0;">
        <span>Rebirths</span><b style="color:#7c3aed;float:right;">${state.rebirthCount || 0}</b>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:11px;color:#6a7590;padding:4px 0;">
        <span>Super / Ultra / Ascend</span><b style="color:#8a4aff;float:right;">${state.superCount || 0} / ${state.ultraCount || 0} / ${state.ascensionCount || 0}</b>
      </div>
    </div>

    <div style="width:100%;max-width:400px;">
      <div style="font-size:9px;letter-spacing:3px;color:#6a7590;font-weight:700;margin-bottom:10px;text-align:center;">CHOOSE YOUR PATH</div>

      <button id="go-restart" style="width:100%;padding:16px;margin-bottom:8px;background:linear-gradient(135deg,#00d4ff,#0088bb);color:#000;font-weight:800;letter-spacing:2px;border-radius:4px;font-size:12px;text-transform:uppercase;box-shadow:0 0 20px rgba(0,212,255,0.4);">
        ↺ Restart Fresh
      </button>

      ${canSuperReset ? `
        <button id="go-super" style="width:100%;padding:16px;margin-bottom:8px;background:linear-gradient(135deg,#7c3aed,#5a2aaa);color:#fff;font-weight:800;letter-spacing:2px;border-radius:4px;font-size:12px;text-transform:uppercase;box-shadow:0 0 20px rgba(124,58,237,0.4);">
          ✦ Super Reset (keep SP)
        </button>
      ` : ""}

      ${canUltraReset ? `
        <button id="go-ultra" style="width:100%;padding:16px;margin-bottom:8px;background:linear-gradient(135deg,#ff0080,#aa0050);color:#fff;font-weight:800;letter-spacing:2px;border-radius:4px;font-size:12px;text-transform:uppercase;box-shadow:0 0 20px rgba(255,0,128,0.4);">
          ✦✦ Ultra Reset (keep UP)
        </button>
      ` : ""}

      ${canAscendReset ? `
        <button id="go-ascend" style="width:100%;padding:16px;margin-bottom:8px;background:linear-gradient(135deg,#ffd700,#c8a02a);color:#000;font-weight:800;letter-spacing:2px;border-radius:4px;font-size:12px;text-transform:uppercase;box-shadow:0 0 20px rgba(255,215,0,0.4);">
          ✦✦✦ Ascend (keep AP)
        </button>
      ` : ""}

      <button id="go-reload" style="width:100%;padding:12px;margin-top:16px;background:transparent;border:1px solid #1a2030;color:#6a7590;font-size:10px;letter-spacing:2px;border-radius:4px;">
        Reload Page
      </button>
    </div>

    <div style="margin-top:24px;font-size:10px;color:#3d4658;text-align:center;letter-spacing:1px;">
      Tip: staying below 30 greed prevents bankruptcy events
    </div>
  `;

  document.body.appendChild(overlay);

  // Restart fresh — hard wipe
  overlay.querySelector("#go-restart").onclick = () => {
    if (!confirm("Delete this run and start completely fresh?\n\nYou lose everything except achievements.")) return;
    const ach = state.achievements || {};
    const title = state.selectedTitle;
    // 1. delete the save entirely
    try { deleteSave(); } catch (e) { console.warn(e); }
    // 2. build a fresh state
    const fresh = createNewState({ difficulty: state.difficulty, playerName: state.playerName });
    fresh.achievements = ach;
    fresh.selectedTitle = title;
    fresh.gameOver = false;
    // 3. save it over
    try { saveGame(fresh); } catch (e) { console.warn(e); }
    // 4. wipe local storage key too
    try { localStorage.removeItem("greedy_save"); } catch (e) {}
    // 5. reload
    onReset?.();
    setTimeout(() => location.reload(), 100);
  };

  // Super reset
  const superBtn = overlay.querySelector("#go-super");
  if (superBtn) superBtn.onclick = () => {
    if (!confirm("Super Reset keeps super points, achievements, city. Wipes rebirth and everything below.")) return;
    state.money = 100;
    state.day = 1;
    state.owned = {};
    state.upgrades = {};
    state.ultras = {};
    state.employees = {};
    state.stocks = {};
    state.greed = 0;
    state.heat = 0;
    state.health = 100;
    state.reputation = 50;
    state.rebirthPoints = 0;
    state.rebirthCount = 0;
    state.rebirthPerks = {};
    state.rebirthShop = {};
    state.rebirthSpentPoints = 0;
    state.gameOver = false;
    state.log = [];
    try { deleteSave(); } catch (e) {}
    try { saveGame(state); } catch (e) {}
    onReset?.();
    setTimeout(() => location.reload(), 100);
  };

  // Ultra reset
  const ultraBtn = overlay.querySelector("#go-ultra");
  if (ultraBtn) ultraBtn.onclick = () => {
    if (!confirm("Ultra Reset keeps ultra points and everything above. Wipes super, rebirth, and everything below.")) return;
    state.money = 100;
    state.day = 1;
    state.owned = {};
    state.greed = 0;
    state.heat = 0;
    state.health = 100;
    state.reputation = 50;
    state.gameOver = false;
    state.superPoints = 0;
    state.superCount = 0;
    state.rebirthPoints = 0;
    state.rebirthCount = 0;
    state.rebirthPerks = {};
    state.rebirthShop = {};
    state.rebirthSpentPoints = 0;
    state.upgrades = {};
    state.ultras = {};
    state.employees = {};
    state.stocks = {};
    state.log = [];
    try { deleteSave(); } catch (e) {}
    try { saveGame(state); } catch (e) {}
    onReset?.();
    setTimeout(() => location.reload(), 100);
  };

  // Ascend reset
  const ascendBtn = overlay.querySelector("#go-ascend");
  if (ascendBtn) ascendBtn.onclick = () => {
    if (!confirm("Ascension keeps ascension points, achievements, titles. Wipes EVERYTHING else.")) return;
    const ach = state.achievements || {};
    const title = state.selectedTitle;
    const ap = state.ascensionPoints || 0;
    const ac = state.ascensionCount || 0;
    const perks = state.ascensionPerks || {};
    const fresh = createNewState({ difficulty: state.difficulty, playerName: state.playerName });
    fresh.achievements = ach;
    fresh.selectedTitle = title;
    fresh.ascensionPoints = ap;
    fresh.ascensionCount = ac;
    fresh.ascensionPerks = perks;
    fresh.gameOver = false;
    try { deleteSave(); } catch (e) {}
    try { saveGame(fresh); } catch (e) {}
    onReset?.();
    setTimeout(() => location.reload(), 100);
  };

  // Reload
  overlay.querySelector("#go-reload").onclick = () => location.reload();

  // add animation
  if (!document.getElementById("go-anim-style")) {
    const style = document.createElement("style");
    style.id = "go-anim-style";
    style.textContent = `
      @keyframes gameOverIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes gameOverShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-4px); }
        75% { transform: translateX(4px); }
      }
      #gameover-overlay > div:first-child > div:first-child {
        animation: gameOverShake 0.6s ease-in-out 3;
      }
    `;
    document.head.appendChild(style);
  }
}

export function hideGameOver() {
  if (overlay) {
    overlay.remove();
    overlay = null;
  }
}

export function isGameOverShowing() {
  return overlay !== null;
}
