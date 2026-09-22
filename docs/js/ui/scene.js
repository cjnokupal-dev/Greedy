// GREEDY — pixel scene (320×200 logical, phone-display scale)
import { drawSprite } from "./sprite.js";
import { OUTFITS, DIALOGUE } from "../data/character.js";

const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const W = canvas.width;    // 320
const H = canvas.height;   // 200
const GROUND_Y = H - 40;
const CHAR_SCALE = 4;      // ×4 for 320-wide canvas
const CHAR_W = 16 * CHAR_SCALE; // 64
const CHAR_H = 24 * CHAR_SCALE; // 96

let t = 0;
let frame = 0;
let sparkles = [];
let lastMoney = 0;
let lastDay = 0;
let bubble = null;
let walkTarget = null;
let walkTimeout = 0;
let charX = W / 2;

export function renderScene(state) {
  t += 0.05;
  frame = Math.floor(t * 4) % 4;

  if (state.money > lastMoney + 0.5 && Math.random() < 0.3) {
    sparkles.push({
      x: charX + (Math.random() - 0.5) * 80,
      y: GROUND_Y - 60 - Math.random() * 40,
      vy: -1 - Math.random(),
      life: 1
    });
  }
  lastMoney = state.money;

  if (state.day > lastDay) {
    lastDay = state.day;
    say(reactTo(state));
  }

  if (Math.random() < 0.002 && !bubble) say(pick(DIALOGUE.idle));
  if (bubble && Date.now() > bubble.expiresAt) bubble = null;

  // SKY
  const greedRatio = state.greed / 100;
  const tierIdx = Math.min(4, Math.floor(greedRatio * 5));
  const skies = [
    ["#14141c", "#1c1c28"],
    ["#1a1420", "#22182a"],
    ["#201a1a", "#2a1c1c"],
    ["#2a1414", "#3a1010"],
    ["#3a0a0a", "#500000"]
  ];
  const [s1, s2] = skies[tierIdx];
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, s1);
  grad.addColorStop(1, s2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // STARS
  ctx.fillStyle = `rgba(255,255,255,${0.2 + greedRatio * 0.4})`;
  for (let i = 0; i < 60; i++) {
    const sx = (i * 37 + Math.floor(t * 0.5)) % W;
    const sy = (i * 17) % (GROUND_Y - 80);
    ctx.fillRect(sx, sy, 2, 2);
  }

  // DISTANT HILLS
  ctx.fillStyle = tierIdx >= 3 ? "#1a0808" : "#10101a";
  for (let i = 0; i < 8; i++) {
    const hx = (i * 60 - (state.day * 3 + t * 0.4) % (W + 60)) % (W + 60);
    const px = hx < 0 ? hx + W + 60 : hx;
    ctx.beginPath();
    ctx.moveTo(px, GROUND_Y);
    ctx.lineTo(px + 30, GROUND_Y - 60);
    ctx.lineTo(px + 60, GROUND_Y);
    ctx.closePath();
    ctx.fill();
  }

  // CITY
  const dayOffset = (state.day * 4 + t * 0.6) % W;
  ctx.fillStyle = tierIdx >= 3 ? "#2a0808" : "#1a1a28";
  for (let i = 0; i < 14; i++) {
    const bx = ((i * 44 - dayOffset) % (W + 44) + W + 44) % (W + 44) - 22;
    const bh = 48 + (i * 14) % 80;
    ctx.fillRect(bx, GROUND_Y - bh, 24, bh);
    ctx.fillStyle = tierIdx >= 3 ? "#4a1010" : "#2a2a3a";
    for (let wy = 0; wy < bh - 16; wy += 16) {
      for (let wx = 4; wx < 20; wx += 8) {
        if (Math.random() < 0.85) ctx.fillRect(bx + wx, GROUND_Y - bh + 8 + wy, 4, 4);
      }
    }
    ctx.fillStyle = tierIdx >= 3 ? "#2a0808" : "#1a1a28";
  }

  // GROUND
  ctx.fillStyle = "#2a2a3a";
  ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);
  ctx.fillStyle = "#1a1a24";
  ctx.fillRect(0, GROUND_Y, W, 2);
  ctx.fillStyle = "#20202e";
  for (let i = 0; i < W; i += 48) ctx.fillRect(i, GROUND_Y + 8, 2, 8);

  // FOREGROUND BUILDINGS
  const ownedIds = Object.keys(state.owned).slice(0, 6);
  const slots = ownedIds.map((_, i) => 16 + i * 48);
  for (let i = 0; i < ownedIds.length; i++) {
    drawBuilding(ownedIds[i], slots[i], GROUND_Y);
  }

  // CHARACTER
  const outfit = currentOutfit(state);
  const pos = updateWalk(slots);

  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.fillRect(pos.x + 8, GROUND_Y - 8, CHAR_W - 16, 8);

  const animState = walkTimeout > 0 ? "walk_right" : "idle";
  drawSprite(ctx, pos.x, GROUND_Y - CHAR_H, {
    outfit, frame, state: animState,
    greed: state.greed, facing: 1, scale: CHAR_SCALE
  });

  // SPARKLES
  for (let i = sparkles.length - 1; i >= 0; i--) {
    const s = sparkles[i];
    s.y += s.vy;
    s.life -= 0.015;
    if (s.life <= 0) { sparkles.splice(i, 1); continue; }
    ctx.globalAlpha = s.life;
    ctx.fillStyle = "#ffd700";
    ctx.fillRect(Math.floor(s.x), Math.floor(s.y), 4, 4);
    ctx.globalAlpha = 1;
  }

  // BUBBLE
  if (bubble) drawBubble(bubble.text, pos.x + CHAR_W / 2, GROUND_Y - CHAR_H - 8);
}

function updateWalk(slots) {
  if (walkTimeout <= 0 && Math.random() < 0.008 && slots.length > 0) {
    walkTarget = slots[Math.floor(Math.random() * slots.length)] + 20;
    walkTimeout = 80 + Math.floor(Math.random() * 80);
  }
  if (walkTarget != null) {
    const dx = walkTarget - charX;
    if (Math.abs(dx) < 2) walkTarget = null;
    else charX += Math.sign(dx) * 0.7;
    walkTimeout--;
  }
  charX = Math.max(12, Math.min(W - CHAR_W - 12, charX));
  return { x: Math.floor(charX) };
}

function currentOutfit(state) {
  if (state.outfit && OUTFITS.find(o => o.id === state.outfit)) return state.outfit;
  const m = state.money;
  if (m >= 5e12) return "god";
  if (m >= 5e10) return "cosmic";
  if (m >= 5e8) return "shadow";
  if (m >= 5e7) return "mob";
  if (m >= 5e6) return "pimp";
  if (m >= 5e5) return "suit";
  if (m >= 5e4) return "casual";
  if (m >= 5e3) return "hoodie";
  return "street";
}

export function say(text) {
  if (!text) return;
  bubble = { text, expiresAt: Date.now() + 3500 };
}

export function react(event) {
  if (event === "buy") say(pick(DIALOGUE.buy));
  else if (event === "sell") say(pick(DIALOGUE.sell));
  else if (event === "income") say(pick(DIALOGUE.income));
  else if (event === "rebirth") say(pick(DIALOGUE.rebirth));
  else if (event === "achievement") say(pick(DIALOGUE.achievement));
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function reactTo(state) {
  if (state.health < 25) return pick(DIALOGUE.lowHealth);
  if (state.heat > 70) return pick(DIALOGUE.highHeat);
  if (state.greed >= 99) return pick(DIALOGUE.maxGreed);
  if (state.greed > 60) return pick(DIALOGUE.highGreed);
  if (state.reputation < 15) return pick(DIALOGUE.lowRep);
  if (state.greed < 15) return pick(DIALOGUE.calm);
  return pick(DIALOGUE.idle);
}

function drawBubble(text, x, y) {
  if (!text) return;
  ctx.font = "bold 14px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  const padX = 8, padY = 6, lineH = 18;

  const maxW = W - 40;
  const words = text.split(" ");
  const lines = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? cur + " " + w : w;
    if (ctx.measureText(test).width > maxW - padX * 2) {
      if (cur) lines.push(cur);
      cur = w;
    } else cur = test;
  }
  if (cur) lines.push(cur);

  const widest = Math.max(...lines.map(l => ctx.measureText(l).width));
  const bw = Math.ceil(widest + padX * 2);
  const bh = lines.length * lineH + padY * 2;
  let bx = Math.round(x - bw / 2);
  let by = Math.round(y - bh - 12);

  bx = Math.max(8, Math.min(W - bw - 8, bx));
  by = Math.max(8, by);

  ctx.fillStyle = "#e6e6f0";
  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, 6);
    ctx.fill();
  } else {
    ctx.fillRect(bx, by, bw, bh);
  }

  // tail
  ctx.beginPath();
  ctx.moveTo(x - 5, by + bh);
  ctx.lineTo(x + 5, by + bh);
  ctx.lineTo(x, by + bh + 8);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#0a0a14";
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], bx + bw / 2, by + padY + i * lineH);
  }
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
}

// BUILDINGS — scaled ×2
const BUILDING_DRAWERS = {
  lemonade: (x, y) => { ctx.fillStyle="#e8c34a"; ctx.fillRect(x, y-24, 32, 24); ctx.fillStyle="#d43a3a"; ctx.fillRect(x-2, y-28, 36, 6); },
  newspaper: (x, y) => { ctx.fillStyle="#4a4a8a"; ctx.fillRect(x+6, y-20, 20, 20); ctx.fillStyle="#e6e6f0"; ctx.fillRect(x+8, y-16, 16, 6); },
  hotdog: (x, y) => { ctx.fillStyle="#c83a3a"; ctx.fillRect(x, y-20, 32, 16); ctx.fillStyle="#8a8a8a"; ctx.fillRect(x, y-24, 32, 4); },
  car_wash: (x, y) => { ctx.fillStyle="#4a8ac8"; ctx.fillRect(x+2, y-24, 28, 24); ctx.fillStyle="#e6e6f0"; ctx.fillRect(x+6, y-20, 20, 4); },
  corner_shop: (x, y) => { ctx.fillStyle="#4a6a4a"; ctx.fillRect(x+2, y-32, 28, 32); ctx.fillStyle="#ffd700"; ctx.fillRect(x+12, y-20, 8, 8); },
  food_truck: (x, y) => { ctx.fillStyle="#e8b84a"; ctx.fillRect(x, y-28, 40, 24); ctx.fillStyle="#333"; ctx.fillRect(x+4, y-6, 8, 6); ctx.fillRect(x+28, y-6, 8, 6); },
  laundromat: (x, y) => { ctx.fillStyle="#8ac8e8"; ctx.fillRect(x+2, y-32, 28, 32); ctx.fillStyle="#fff"; ctx.fillRect(x+6, y-26, 20, 12); },
  coffee_shop: (x, y) => { ctx.fillStyle="#6a4a2a"; ctx.fillRect(x+2, y-28, 28, 28); ctx.fillStyle="#e8e0d0"; ctx.fillRect(x+6, y-24, 20, 8); },
  gym_small: (x, y) => { ctx.fillStyle="#8a8a8a"; ctx.fillRect(x+2, y-28, 28, 28); ctx.fillStyle="#c8c8c8"; ctx.fillRect(x+6, y-22, 6, 6); ctx.fillRect(x+20, y-22, 6, 6); },
  restaurant: (x, y) => { ctx.fillStyle="#8a3a3a"; ctx.fillRect(x, y-40, 36, 40); ctx.fillStyle="#ffd700"; ctx.fillRect(x+14, y-16, 8, 16); },
  nightclub: (x, y) => { ctx.fillStyle="#3a1a5a"; ctx.fillRect(x, y-48, 40, 48); ctx.fillStyle="#ff00ff"; ctx.fillRect(x+6, y-40, 6, 4); ctx.fillStyle="#00ffff"; ctx.fillRect(x+17, y-40, 6, 4); ctx.fillStyle="#ff00aa"; ctx.fillRect(x+28, y-40, 6, 4); },
  casino: (x, y) => { ctx.fillStyle="#2a1a3a"; ctx.fillRect(x, y-52, 44, 52); ctx.fillStyle="#ffd700"; for(let i=0;i<4;i++) ctx.fillRect(x+4+i*10, y-48, 6, 6); },
  hotel: (x, y) => { ctx.fillStyle="#d4c8a0"; ctx.fillRect(x, y-52, 40, 52); for(let i=0;i<3;i++){ ctx.fillStyle="#ffd700"; ctx.fillRect(x+6+i*12, y-44, 4, 8); } },
  car_dealer: (x, y) => { ctx.fillStyle="#4a4a8a"; ctx.fillRect(x, y-40, 40, 40); ctx.fillStyle="#c8c8c8"; ctx.fillRect(x+6, y-32, 28, 8); },
  warehouse: (x, y) => { ctx.fillStyle="#5a5a6a"; ctx.fillRect(x, y-36, 44, 36); ctx.fillStyle="#3a3a4a"; ctx.fillRect(x+8, y-28, 28, 16); },
  shipping: (x, y) => { ctx.fillStyle="#8a4a2a"; ctx.fillRect(x, y-44, 44, 44); ctx.fillStyle="#3a3a3a"; ctx.fillRect(x+6, y-36, 32, 8); },
  bank: (x, y) => { ctx.fillStyle="#e8e0c0"; ctx.fillRect(x, y-56, 48, 56); ctx.fillStyle="#8a7a4a"; for(let i=0;i<4;i++) ctx.fillRect(x+4+i*12, y-52, 6, 52); },
  pharma: (x, y) => { ctx.fillStyle="#e8e8e8"; ctx.fillRect(x, y-40, 40, 40); ctx.fillStyle="#3aa83a"; ctx.fillRect(x+12, y-32, 16, 6); },
  airline: (x, y) => { ctx.fillStyle="#3a3a8a"; ctx.fillRect(x, y-36, 44, 36); ctx.fillStyle="#fff"; ctx.fillRect(x+6, y-28, 32, 4); },
  hedge_fund: (x, y) => { ctx.fillStyle="#0a0a2a"; ctx.fillRect(x, y-60, 48, 60); ctx.fillStyle="#ffd700"; ctx.fillRect(x+12, y-48, 24, 4); },
  media_network: (x, y) => { ctx.fillStyle="#8a1a3a"; ctx.fillRect(x, y-52, 44, 52); ctx.fillStyle="#fff"; ctx.fillRect(x+8, y-44, 28, 6); },
  conglomerate: (x, y) => { ctx.fillStyle="#1a1a2e"; ctx.fillRect(x, y-64, 52, 64); ctx.fillStyle="#ffd700"; ctx.fillRect(x+10, y-52, 32, 4); },
  central_bank: (x, y) => { ctx.fillStyle="#e8d8a0"; ctx.fillRect(x, y-60, 52, 60); ctx.fillStyle="#8a6a1a"; for(let i=0;i<5;i++) ctx.fillRect(x+4+i*10, y-56, 6, 56); },
  shadow_corp: (x, y) => { ctx.fillStyle="#000"; ctx.fillRect(x, y-60, 48, 60); ctx.fillStyle="#ff2020"; ctx.fillRect(x+16, y-48, 16, 4); },
  arms_dealer: (x, y) => { ctx.fillStyle="#3a3a2a"; ctx.fillRect(x, y-48, 44, 48); ctx.fillStyle="#8a1a1a"; ctx.fillRect(x+8, y-40, 28, 6); },
  space_mining: (x, y) => { ctx.fillStyle="#2a2a4a"; ctx.fillRect(x, y-56, 48, 56); ctx.fillStyle="#00ffff"; for(let i=0;i<3;i++) ctx.fillRect(x+8+i*14, y-48, 6, 6); },
  ai_singularity: (x, y) => { ctx.fillStyle="#0a2a4a"; ctx.fillRect(x, y-64, 48, 64); ctx.fillStyle="#00ffff"; ctx.fillRect(x+12, y-56, 24, 4); ctx.fillRect(x+12, y-44, 24, 4); },
  private_gov: (x, y) => { ctx.fillStyle="#1a1a1a"; ctx.fillRect(x, y-68, 52, 68); ctx.fillStyle="#ffd700"; for(let i=0;i<3;i++) ctx.fillRect(x+6+i*16, y-60, 8, 8); },
  reality_broker: (x, y) => { ctx.fillStyle="#2a0a3a"; ctx.fillRect(x, y-72, 52, 72); ctx.fillStyle="#ff00ff"; for(let i=0;i<4;i++) ctx.fillRect(x+6+i*10, y-64, 4, 8); },
  time_bank: (x, y) => { ctx.fillStyle="#0a0a2a"; ctx.fillRect(x, y-76, 52, 76); ctx.fillStyle="#ffff00"; ctx.fillRect(x+26, y-38, 4, 4); },
  dimension_hop: (x, y) => { ctx.fillStyle="#1a0a3a"; ctx.fillRect(x, y-80, 56, 80); ctx.fillStyle="#00ffff"; ctx.fillRect(x+8, y-68, 40, 4); ctx.fillStyle="#ff00ff"; ctx.fillRect(x+8, y-52, 40, 4); },
  god_corp: (x, y) => { ctx.fillStyle="#ffd700"; ctx.fillRect(x, y-88, 60, 88); ctx.fillStyle="#fff"; for(let i=0;i<5;i++) ctx.fillRect(x+6+i*10, y-76, 4, 4); }
};

function drawBuilding(id, x, y) {
  const drawer = BUILDING_DRAWERS[id];
  if (drawer) drawer(x, y);
  else { ctx.fillStyle = "#4a4a5a"; ctx.fillRect(x + 4, y - 32, 28, 32); }
}
