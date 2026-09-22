// GREEDY — achievements panel
import { ACHIEVEMENTS } from "../data/achievements.js";
import { unlockedAchievements, achievementProgress } from "../systems/achievements.js";

const panel = document.getElementById("panel-achievements");

export function renderAchievements(state) {
  if (!panel) return;
  const unlocked = unlockedAchievements(state);
  const prog = achievementProgress(state);

  panel.innerHTML = `
    <div class="owned-summary">
      <div class="row">
        <span>Unlocked</span>
        <span class="v">${prog.unlocked} / ${prog.total}</span>
      </div>
      <div class="row">
        <span>Progress</span>
        <span class="v">${((prog.unlocked / prog.total) * 100).toFixed(0)}%</span>
      </div>
    </div>
  `;

  for (const a of ACHIEVEMENTS) {
    const isUnlocked = !!unlocked[a.id];
    const card = document.createElement("div");
    card.className = "biz-card";
    card.style.opacity = isUnlocked ? "1" : "0.45";
    card.innerHTML = `
      <div class="biz-icon" style="${isUnlocked ? "background:var(--accent);color:#000;" : ""}">
        ${isUnlocked ? "🏆" : "🔒"}
      </div>
      <div class="biz-info">
        <div class="biz-name" style="${isUnlocked ? "color:var(--accent);" : ""}">${a.name}</div>
        <div class="biz-desc">${a.desc}</div>
      </div>
    `;
    panel.appendChild(card);
  }
}
