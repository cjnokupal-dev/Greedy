// GREEDY — wardrobe screen
import { OUTFITS } from "../data/character.js";
import { drawSprite } from "./sprite.js";

const panel = document.getElementById("panel-wardrobe");
let previewCanvas = null;
let previewCtx = null;
let previewFrame = 0;
let animId = null;

export function renderWardrobe(state, onChange) {
  if (!panel) return;

  const current = state.outfit || null;

  panel.innerHTML = `
    <div class="owned-summary">
      <div class="row"><span>Current outfit</span><span class="v">${current || "auto (based on money)"}</span></div>
      <div class="row"><span>Tip</span><span class="v" style="font-size:11px;">Outfits unlock as you earn.</span></div>
    </div>
  `;

  for (const o of OUTFITS) {
    const unlocked = o.unlock(state);
    const isCurrent = current === o.id;
    const card = document.createElement("div");
    card.className = "biz-card";
    card.style.opacity = unlocked ? "1" : "0.4";
    card.innerHTML = `
      <canvas width="32" height="48" data-outfit="${o.id}" style="image-rendering:pixelated;width:48px;height:72px;margin-right:10px;"></canvas>
      <div class="biz-info">
        <div class="biz-name" style="${isCurrent ? "color:var(--accent);" : ""}">${o.name} ${isCurrent ? "✓" : ""}</div>
        <div class="biz-desc">${o.desc}</div>
        <div class="biz-stats">${unlocked ? "" : "🔒 Locked"}</div>
      </div>
      <div class="biz-actions">
        <button class="btn-buy" ${!unlocked || isCurrent ? "disabled" : ""}>${isCurrent ? "WEARING" : "WEAR"}</button>
      </div>
    `;
    panel.appendChild(card);

    const cv = card.querySelector("canvas");
    const cx = cv.getContext("2d");
    cx.imageSmoothingEnabled = false;
    if (unlocked) {
      cx.clearRect(0, 0, 32, 48);
      drawSprite(cx, 8, 8, { outfit: o.id, state: "idle", frame: 0, greed: state.greed, scale: 1 });
    }

    const btn = card.querySelector("button");
    if (unlocked && !isCurrent) {
      btn.addEventListener("click", () => {
        state.outfit = o.id;
        onChange();
      });
    }
  }

  // auto option
  const autoCard = document.createElement("div");
  autoCard.className = "biz-card";
  autoCard.innerHTML = `
    <div class="biz-info">
      <div class="biz-name" style="${!current ? "color:var(--accent);" : ""}">Auto ${!current ? "✓" : ""}</div>
      <div class="biz-desc">Outfit changes automatically based on wealth and greed</div>
    </div>
    <div class="biz-actions">
      <button class="btn-buy" ${!current ? "disabled" : ""}>${!current ? "ACTIVE" : "USE AUTO"}</button>
    </div>
  `;
  panel.appendChild(autoCard);
  const autoBtn = autoCard.querySelector("button");
  if (current) {
    autoBtn.addEventListener("click", () => {
      delete state.outfit;
      onChange();
    });
  }
}
