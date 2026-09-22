// GREEDY — pixel character sprite renderer (24 skins)

const SKIN_LIGHT = "#f0c8a0";
const SKIN_MED = "#e8b48a";
const SKIN_DARK = "#b89878";
const SKIN_SHADOW = "#8a6a50";
const EYE_DARK = "#0a0a14";
const EYE_RED = "#ff2020";

export const SPRITE_PALETTES = {
  street:     { hair:"#3a2418", hairShade:"#1a0f08", shirt:"#4a90d9", shirtShade:"#2a5a90", pants:"#2a2a3a", pantsShade:"#1a1a20", shoe:"#1a1a20", accent:null, aura:null },
  hoodie:     { hair:"#2a1a10", hairShade:"#0f0805", shirt:"#3a3a5a", shirtShade:"#20203a", pants:"#1a1a28", pantsShade:"#0a0a14", shoe:"#0a0a10", accent:"#8a6ad9", aura:null },
  casual:     { hair:"#3a2418", hairShade:"#1a0f08", shirt:"#6aa76a", shirtShade:"#3a6a3a", pants:"#4a4a5a", pantsShade:"#2a2a3a", shoe:"#2a1a10", accent:"#d4d4d4", aura:null },
  suit:       { hair:"#1a1a1a", hairShade:"#0a0a0a", shirt:"#1a1a2e", shirtShade:"#0a0a18", pants:"#0a0a18", pantsShade:"#000000", shoe:"#000000", accent:"#ffd700", aura:null },
  pimp:       { hair:"#1a1a1a", hairShade:"#000000", shirt:"#c8a02a", shirtShade:"#8a6a1a", pants:"#8a1a6a", pantsShade:"#5a0a4a", shoe:"#8a1a1a", accent:"#ffd700", aura:"gold" },
  mob:        { hair:"#0a0a0a", hairShade:"#000000", shirt:"#8a1a1a", shirtShade:"#5a0a0a", pants:"#1a1a1a", pantsShade:"#0a0a0a", shoe:"#000000", accent:"#c0c0c0", aura:"red" },
  shadow:     { hair:"#000000", hairShade:"#000000", shirt:"#0a0a14", shirtShade:"#000000", pants:"#000000", pantsShade:"#000000", shoe:"#000000", accent:"#ff2020", aura:"purple" },
  cosmic:     { hair:"#5a2a8a", hairShade:"#3a1a5a", shirt:"#8a4aff", shirtShade:"#5a2aff", pants:"#2a0a4a", pantsShade:"#1a0a3a", shoe:"#5a2a8a", accent:"#00ffff", aura:"cosmic" },
  god:        { hair:"#ffd700", hairShade:"#c8a02a", shirt:"#ffd700", shirtShade:"#8a6a1a", pants:"#ffd700", pantsShade:"#8a6a1a", shoe:"#ffd700", accent:"#ffffff", aura:"holy" },

  // Unlockables
  hacker:     { hair:"#00ff88", hairShade:"#00aa55", shirt:"#0a0a14", shirtShade:"#000000", pants:"#1a1a1a", pantsShade:"#0a0a0a", shoe:"#000000", accent:"#00ff88", aura:"matrix" },
  ninja:      { hair:"#000000", hairShade:"#000000", shirt:"#1a1a1a", shirtShade:"#0a0a0a", pants:"#0a0a0a", pantsShade:"#000000", shoe:"#000000", accent:"#ff2020", aura:"smoke" },
  chef:       { hair:"#ffffff", hairShade:"#c0c0c0", shirt:"#ffffff", shirtShade:"#c8c8c8", pants:"#1a1a1a", pantsShade:"#0a0a0a", shoe:"#2a1a10", accent:"#ffd700", aura:null },
  cowboy:     { hair:"#4a2a10", hairShade:"#2a1508", shirt:"#8a5a2a", shirtShade:"#5a3a1a", pants:"#3a2a1a", pantsShade:"#1a0f08", shoe:"#4a2a10", accent:"#c8a02a", aura:null },
  pirate:     { hair:"#1a0a0a", hairShade:"#000000", shirt:"#3a1a1a", shirtShade:"#1a0a0a", pants:"#2a1a1a", pantsShade:"#0a0a0a", shoe:"#1a0a0a", accent:"#c8a02a", aura:null },
  astronaut:  { hair:"#e8e8f0", hairShade:"#a8a8b8", shirt:"#e8e8f0", shirtShade:"#b8b8c8", pants:"#c8c8d8", pantsShade:"#8888a0", shoe:"#666680", accent:"#00d4ff", aura:null },
  cyborg:     { hair:"#2a2a3a", hairShade:"#1a1a2a", shirt:"#00d4ff", shirtShade:"#0090b0", pants:"#1a1a2a", pantsShade:"#0a0a14", shoe:"#0a0a14", accent:"#ff2020", aura:"tech" },
  vampire:    { hair:"#000000", hairShade:"#000000", shirt:"#6a0000", shirtShade:"#3a0000", pants:"#1a0000", pantsShade:"#0a0000", shoe:"#000000", accent:"#ff2020", aura:"blood" },
  wizard:     { hair:"#c8c8d8", hairShade:"#8888a8", shirt:"#8a3aff", shirtShade:"#5a1aaa", pants:"#3a1a5a", pantsShade:"#1a0a2a", shoe:"#1a0a2a", accent:"#00ffff", aura:"magic" },
  dragon:     { hair:"#ff8c00", hairShade:"#c86000", shirt:"#8a1a00", shirtShade:"#5a0a00", pants:"#3a1a00", pantsShade:"#1a0a00", shoe:"#1a0000", accent:"#ffd700", aura:"fire" },
  phoenix:    { hair:"#ff4a00", hairShade:"#c83000", shirt:"#ffb84d", shirtShade:"#c88000", pants:"#8a1a00", pantsShade:"#5a0a00", shoe:"#3a0a00", accent:"#ffd700", aura:"fire" },
  void:       { hair:"#2a0a4a", hairShade:"#0a001a", shirt:"#1a0033", shirtShade:"#0a001a", pants:"#0a001a", pantsShade:"#000000", shoe:"#000000", accent:"#8a4aff", aura:"void" },
  king:       { hair:"#8a6a1a", hairShade:"#5a4010", shirt:"#d4af37", shirtShade:"#8a6a1a", pants:"#3a1a4a", pantsShade:"#1a0a2a", shoe:"#5a3a1a", accent:"#ff2020", aura:"royal" },
  emperor:    { hair:"#0a0a0a", hairShade:"#000000", shirt:"#8a1a6a", shirtShade:"#5a0a4a", pants:"#1a0a2a", pantsShade:"#0a001a", shoe:"#000000", accent:"#ffd700", aura:"royal" },
  founder:    { hair:"#ffffff", hairShade:"#c8c8d8", shirt:"#ffffff", shirtShade:"#c8c8d8", pants:"#ffd700", pantsShade:"#8a6a1a", shoe:"#ffd700", accent:"#00ffff", aura:"holy" }
};

export function drawSprite(ctx, x, y, opts = {}) {
  const {
    outfit = "street",
    frame = 0,
    state = "idle",
    greed = 0,
    facing = 1,
    scale = 1
  } = opts;

  const p = SPRITE_PALETTES[outfit] || SPRITE_PALETTES.street;

  const greedT = Math.min(1, greed / 100);
  const skinBase = greedT > 0.7 ? SKIN_DARK : greedT > 0.4 ? SKIN_MED : SKIN_LIGHT;
  const skin = mixHex(skinBase, "#7a4a2a", greedT * 0.3);
  const eyeColor = greedT > 0.85 ? EYE_RED : EYE_DARK;

  if (p.aura || greedT > 0.9) {
    const auraColor = greedT > 0.9 ? "#ff0000" : auraColorFor(p.aura);
    const auraAlpha = 0.15 + greedT * 0.3;
    drawAura(ctx, x, y, auraColor, auraAlpha, frame);
  }

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale * facing, scale);

  let bobY = 0, legOffset = 0, armOffset = 0, hunchY = 0;
  if (state === "idle") bobY = frame % 2 === 0 ? 0 : 1;
  else if (state === "walk_left" || state === "walk_right") {
    legOffset = frame % 4 === 0 || frame % 4 === 2 ? 1 : -1;
    armOffset = -legOffset;
    bobY = frame % 2 === 0 ? 0 : 1;
  }
  hunchY = Math.floor(greedT * 2);

  // LEGS
  ctx.fillStyle = p.pants;
  ctx.fillRect(5, 15 + legOffset, 3, 6);
  ctx.fillRect(9, 15 - legOffset, 3, 6);
  ctx.fillStyle = p.pantsShade;
  ctx.fillRect(5, 19 + legOffset, 3, 2);
  ctx.fillRect(9, 19 - legOffset, 3, 2);

  // SHOES
  ctx.fillStyle = p.shoe;
  ctx.fillRect(4, 21 + legOffset, 4, 1);
  ctx.fillRect(9, 21 - legOffset, 4, 1);

  // TORSO
  ctx.fillStyle = p.shirt;
  ctx.fillRect(4, 8 + hunchY, 8, 7);
  ctx.fillStyle = p.shirtShade;
  ctx.fillRect(10, 8 + hunchY, 2, 7);

  if (outfit === "suit" || outfit === "mob") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(7, 8 + hunchY, 2, 1);
    ctx.fillStyle = p.accent || "#8a1a1a";
    ctx.fillRect(7, 9 + hunchY, 2, 3);
  }
  if (outfit === "pimp" || outfit === "king" || outfit === "emperor") {
    ctx.fillStyle = "#ffd700";
    ctx.fillRect(6, 9 + hunchY, 4, 1);
    ctx.fillRect(7, 10 + hunchY, 2, 2);
  }
  if (outfit === "cosmic" || outfit === "cyborg" || outfit === "wizard") {
    ctx.fillStyle = p.accent || "#00ffff";
    ctx.fillRect(5, 10 + hunchY, 1, 1);
    ctx.fillRect(10, 12 + hunchY, 1, 1);
    ctx.fillRect(6, 13 + hunchY, 1, 1);
  }
  if (outfit === "god" || outfit === "founder" || outfit === "phoenix") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(4, 9 + hunchY, 1, 1);
    ctx.fillRect(11, 9 + hunchY, 1, 1);
    ctx.fillRect(6, 14 + hunchY, 1, 1);
    ctx.fillRect(9, 14 + hunchY, 1, 1);
  }
  if (outfit === "hacker") {
    ctx.fillStyle = "#00ff88";
    ctx.fillRect(5, 9 + hunchY, 6, 1);
    ctx.fillRect(6, 12 + hunchY, 4, 1);
  }
  if (outfit === "ninja") {
    ctx.fillStyle = "#ff2020";
    ctx.fillRect(6, 6 + hunchY, 4, 1);
  }
  if (outfit === "cowboy" || outfit === "pirate") {
    ctx.fillStyle = p.accent || "#c8a02a";
    ctx.fillRect(5, 9 + hunchY, 6, 1);
  }
  if (outfit === "astronaut") {
    ctx.fillStyle = "#00d4ff";
    ctx.fillRect(5, 10 + hunchY, 6, 1);
    ctx.fillRect(6, 12 + hunchY, 4, 1);
  }
  if (outfit === "vampire") {
    ctx.fillStyle = "#6a0000";
    ctx.fillRect(5, 9 + hunchY, 6, 2);
  }
  if (outfit === "dragon") {
    ctx.fillStyle = "#ffd700";
    ctx.fillRect(5, 12 + hunchY, 1, 1);
    ctx.fillRect(10, 12 + hunchY, 1, 1);
  }
  if (outfit === "void") {
    ctx.fillStyle = "#8a4aff";
    ctx.fillRect(6, 10 + hunchY, 1, 1);
    ctx.fillRect(9, 10 + hunchY, 1, 1);
    ctx.fillRect(5, 13 + hunchY, 1, 1);
    ctx.fillRect(10, 13 + hunchY, 1, 1);
  }

  // ARMS
  ctx.fillStyle = p.shirt;
  ctx.fillRect(3, 8 + hunchY + armOffset, 1, 5);
  ctx.fillRect(12, 8 + hunchY - armOffset, 1, 5);
  ctx.fillStyle = skin;
  ctx.fillRect(3, 13 + hunchY + armOffset, 1, 1);
  ctx.fillRect(12, 13 + hunchY - armOffset, 1, 1);

  // HEAD
  ctx.fillStyle = p.hair;
  ctx.fillRect(4, 2 + hunchY, 8, 2);
  ctx.fillRect(3, 3 + hunchY, 2, 4);
  ctx.fillRect(11, 3 + hunchY, 2, 4);
  ctx.fillStyle = p.hairShade;
  ctx.fillRect(4, 2 + hunchY, 8, 1);

  ctx.fillStyle = skin;
  ctx.fillRect(4, 4 + hunchY, 8, 5);
  ctx.fillStyle = SKIN_SHADOW;
  ctx.globalAlpha = 0.3;
  ctx.fillRect(10, 4 + hunchY, 2, 5);
  ctx.globalAlpha = 1;

  ctx.fillStyle = eyeColor;
  ctx.fillRect(6, 6 + hunchY, 1, 1);
  ctx.fillRect(9, 6 + hunchY, 1, 1);

  if (greedT > 0.5) {
    ctx.fillStyle = "rgba(80, 30, 30, 0.6)";
    ctx.fillRect(6, 7 + hunchY, 1, 1);
    ctx.fillRect(9, 7 + hunchY, 1, 1);
  }
  if (greedT > 0.6) {
    ctx.fillStyle = "#3a1a1a";
    ctx.fillRect(6, 8 + hunchY, 4, 1);
  }
  if (greedT > 0.85) {
    ctx.fillStyle = "#8a0000";
    ctx.fillRect(4, 5 + hunchY, 1, 1);
    ctx.fillRect(11, 7 + hunchY, 1, 1);
  }

  // HATS / ACCESSORIES per outfit
  if (outfit === "pimp") {
    ctx.fillStyle = "#8a1a6a";
    ctx.fillRect(3, 1 + hunchY, 10, 2);
    ctx.fillStyle = "#ffd700";
    ctx.fillRect(4, 2 + hunchY, 8, 1);
  }
  if (outfit === "mob") {
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(3, 1 + hunchY, 10, 2);
  }
  if (outfit === "cosmic") {
    ctx.fillStyle = "#00ffff";
    ctx.fillRect(2, 2 + hunchY, 1, 1);
    ctx.fillRect(13, 3 + hunchY, 1, 1);
    ctx.fillRect(7, 0 + hunchY, 2, 1);
  }
  if (outfit === "god") {
    ctx.fillStyle = "rgba(255,255,0,0.4)";
    ctx.fillRect(4, 0 + hunchY, 8, 1);
    ctx.fillStyle = "#ffd700";
    ctx.fillRect(5, 1 + hunchY, 6, 1);
  }
  if (outfit === "hacker") {
    ctx.fillStyle = "#00ff88";
    ctx.fillRect(3, 2 + hunchY, 10, 1);
    ctx.fillRect(11, 3 + hunchY, 3, 2);
  }
  if (outfit === "ninja") {
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(3, 1 + hunchY, 10, 2);
    ctx.fillRect(3, 5 + hunchY, 10, 1);
  }
  if (outfit === "chef") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(3, 0 + hunchY, 10, 3);
  }
  if (outfit === "cowboy") {
    ctx.fillStyle = "#4a2a10";
    ctx.fillRect(2, 2 + hunchY, 12, 2);
    ctx.fillStyle = "#2a1508";
    ctx.fillRect(3, 0 + hunchY, 10, 2);
    ctx.fillStyle = "#c8a02a";
    ctx.fillRect(2, 4 + hunchY, 2, 1);
  }
  if (outfit === "pirate") {
    ctx.fillStyle = "#1a0a0a";
    ctx.fillRect(2, 1 + hunchY, 12, 2);
    ctx.fillStyle = "#c8a02a";
    ctx.fillRect(2, 1 + hunchY, 12, 1);
  }
  if (outfit === "astronaut") {
    ctx.fillStyle = "rgba(0,212,255,0.3)";
    ctx.fillRect(3, 3 + hunchY, 10, 6);
    ctx.fillStyle = "#e8e8f0";
    ctx.fillRect(3, 1 + hunchY, 10, 2);
  }
  if (outfit === "cyborg") {
    ctx.fillStyle = "#ff2020";
    ctx.fillRect(10, 6 + hunchY, 1, 1);
    ctx.fillStyle = "#00d4ff";
    ctx.fillRect(5, 6 + hunchY, 1, 1);
  }
  if (outfit === "vampire") {
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(2, 0 + hunchY, 12, 3);
    ctx.fillStyle = "#8a0000";
    ctx.fillRect(2, 3 + hunchY, 12, 1);
  }
  if (outfit === "wizard") {
    ctx.fillStyle = "#3a1a5a";
    ctx.fillRect(3, -1 + hunchY, 10, 4);
    ctx.fillStyle = "#8a3aff";
    ctx.fillRect(4, 0 + hunchY, 8, 1);
    ctx.fillStyle = "#00ffff";
    ctx.fillRect(7, 2 + hunchY, 2, 1);
  }
  if (outfit === "dragon") {
    ctx.fillStyle = "#ff8c00";
    ctx.fillRect(2, 0 + hunchY, 3, 2);
    ctx.fillRect(11, 0 + hunchY, 3, 2);
    ctx.fillStyle = "#ffd700";
    ctx.fillRect(3, 1 + hunchY, 1, 1);
    ctx.fillRect(12, 1 + hunchY, 1, 1);
  }
  if (outfit === "phoenix") {
    ctx.fillStyle = "#ff4a00";
    ctx.fillRect(2, -2 + hunchY, 12, 3);
    ctx.fillStyle = "#ffd700";
    ctx.fillRect(3, -1 + hunchY, 10, 1);
  }
  if (outfit === "void") {
    ctx.fillStyle = "#0a001a";
    ctx.fillRect(2, 0 + hunchY, 12, 3);
    ctx.fillStyle = "#8a4aff";
    ctx.fillRect(3, 1 + hunchY, 10, 1);
  }
  if (outfit === "king") {
    ctx.fillStyle = "#d4af37";
    ctx.fillRect(3, 0 + hunchY, 10, 3);
    ctx.fillStyle = "#ff2020";
    ctx.fillRect(6, 1 + hunchY, 1, 1);
    ctx.fillRect(9, 1 + hunchY, 1, 1);
  }
  if (outfit === "emperor") {
    ctx.fillStyle = "#8a1a6a";
    ctx.fillRect(2, 0 + hunchY, 12, 3);
    ctx.fillStyle = "#ffd700";
    ctx.fillRect(3, 1 + hunchY, 10, 1);
    ctx.fillRect(11, 0 + hunchY, 1, 2);
  }
  if (outfit === "founder") {
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.fillRect(3, 0 + hunchY, 10, 2);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(4, 1 + hunchY, 8, 1);
    ctx.fillStyle = "#00ffff";
    ctx.fillRect(7, 2 + hunchY, 2, 1);
  }

  ctx.restore();

  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.fillRect(x - 4 * scale, y + 22 * scale, 12 * scale, 1 * scale);
}

function auraColorFor(aura) {
  const map = {
    gold: "#ffd700", red: "#ff2020", purple: "#8a4aff", cosmic: "#8a4aff",
    holy: "#ffd700", matrix: "#00ff88", smoke: "#333333", tech: "#00d4ff",
    blood: "#8a0000", magic: "#8a3aff", fire: "#ff4a00", void: "#2a0a4a",
    royal: "#d4af37"
  };
  return map[aura] || "#00d4ff";
}

function drawAura(ctx, x, y, color, alpha, frame) {
  ctx.save();
  ctx.globalAlpha = alpha * (0.7 + Math.sin(frame * 0.2) * 0.3);
  const grad = ctx.createRadialGradient(x + 8, y + 12, 2, x + 8, y + 12, 20);
  grad.addColorStop(0, color);
  grad.addColorStop(1, "transparent");
  ctx.fillStyle = grad;
  ctx.fillRect(x - 8, y - 8, 32, 40);
  ctx.restore();
}

function mixHex(a, b, t) {
  const ar = parseInt(a.slice(1, 3), 16), ag = parseInt(a.slice(3, 5), 16), ab = parseInt(a.slice(5, 7), 16);
  const br = parseInt(b.slice(1, 3), 16), bg = parseInt(b.slice(3, 5), 16), bb = parseInt(b.slice(5, 7), 16);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `rgb(${r},${g},${bl})`;
}
