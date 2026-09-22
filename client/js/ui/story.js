// GREEDY — story panel + modal
import { CHAPTERS, PATHS } from "../data/story.js";
import { readChapters, nextChapter, applyChoice, pathInfo, storyIncomeMult } from "../systems/story.js";
import { toast } from "./notifications.js";
import { showStoryModal } from "./storyModal.js";

const panel = () => document.getElementById("panel-story");

export function renderStory(state, onChange) {
  const el = panel();
  if (!el) return;
  el.innerHTML = "";

  const read = readChapters(state);
  const path = pathInfo(state);
  const pp = state.pathProgress || { honest: 0, clever: 0, ruthless: 0 };

  const summary = document.createElement("div");
  summary.className = "owned-summary";
  summary.innerHTML = `
    <div class="row"><span>Chapters read</span><span class="v">${Object.keys(read).length} / ${CHAPTERS.length}</span></div>
    <div class="row"><span>Path</span><span class="v" style="color:${path ? path.color : "var(--text-dim)"};">${path ? path.name : "Undecided"}</span></div>
    <div class="row"><span>Story bonus</span><span class="v money">×${storyIncomeMult(state).toFixed(2)}</span></div>
  `;
  el.appendChild(summary);

  // path breakdown
  const pathBox = document.createElement("div");
  pathBox.style.cssText = "display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:14px;";
  for (const pid of ["honest", "clever", "ruthless"]) {
    const p = PATHS[pid];
    const n = pp[pid] || 0;
    const cell = document.createElement("div");
    cell.style.cssText = "padding:10px;text-align:center;background:var(--bg-panel);border:1px solid var(--border);border-radius:4px;font-family:var(--font-display);";
    cell.innerHTML = `<div style="font-size:16px;font-weight:800;color:${p.color};">${n}</div><div style="font-size:8px;color:var(--text-dim);letter-spacing:1px;margin-top:2px;">${p.name.toUpperCase()}</div>`;
    pathBox.appendChild(cell);
  }
  el.appendChild(pathBox);

  // chapters list
  for (const ch of CHAPTERS) {
    const wasRead = !!read[ch.id];
    const isNext = nextChapter(state)?.id === ch.id;
    const locked = !wasRead && state.day < ch.unlockDay;

    const card = document.createElement("div");
    card.className = "biz-card";
    card.style.opacity = wasRead ? "1" : locked ? "0.35" : "1";
    card.style.borderLeftColor = isNext ? "var(--accent)" : "var(--border)";
    card.innerHTML = `
      <div class="biz-icon" style="${wasRead ? "background:var(--money);color:#000;" : isNext ? "background:var(--accent);color:#000;" : ""}">${wasRead ? "✓" : isNext ? "!" : "🔒"}</div>
      <div class="biz-info">
        <div class="biz-name">${ch.title}</div>
        <div class="biz-desc">${locked ? "Unlocks at day " + ch.unlockDay + " · $" + ch.unlockMoney.toLocaleString() : "Day " + ch.unlockDay}</div>
      </div>
      ${isNext ? '<div style="color:var(--accent);font-size:14px;">▸</div>' : ""}
    `;
    if (isNext) {
      card.style.cursor = "pointer";
      card.onclick = () => {
        showStoryModal(ch, (choiceId) => {
          const choice = applyChoice(state, ch, choiceId);
          if (choice) toast("Path: " + (PATHS[choice.path]?.name || "—"));
          onChange();
        });
      };
    }
    el.appendChild(card);
  }
}

export function checkStoryPopup(state, onChange) {
  const ch = nextChapter(state);
  if (!ch) return;
  showStoryModal(ch, (choiceId) => {
    applyChoice(state, ch, choiceId);
    onChange();
  });
}
