// GREEDY — dev panel (localhost only) — MEGA EDITION
const panel = () => document.getElementById("panel-dev");
const ADMIN_KEY = "dev_admin_key";

function isLocalhost() {
  const h = location.hostname;
  return h === "localhost" || h === "127.0.0.1" || h === "0.0.0.0" || h.endsWith(".local");
}

async function api(path, body = {}) {
  try {
    const r = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, admin_key: ADMIN_KEY })
    });
    return await r.json();
  } catch (e) { return { error: "network" }; }
}

let activeSection = "cheats";
let cachedUsers = null;

import { shouldShowDevTools } from "../core/mode.js";

export function renderDevPanel(state, onChange) {
  const el = panel();
  if (!el) return;

  if (!shouldShowDevTools()) {
    el.innerHTML = '<p style="color:var(--text-dim);text-align:center;padding:40px;">Dev panel only available on localhost.</p>';
    return;
  }

  el.innerHTML = "";

  const header = document.createElement("div");
  header.style.cssText = "margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid var(--border);";
  header.innerHTML = `
    <div style="font-size:9px;color:var(--danger);letter-spacing:3px;font-weight:700;">⚠ ADMIN</div>
    <div style="font-size:20px;font-weight:800;letter-spacing:2px;color:var(--danger);font-family:var(--font-display);text-shadow:0 0 20px var(--danger);">DEV PANEL</div>
    <div style="font-size:9px;color:var(--text-dim);margin-top:3px;">localhost only</div>
  `;
  el.appendChild(header);

  const tabs = ["cheats","money","meters","progress","world","spawn","players","server","tools","danger"];
  const tabLabels = {
    cheats: "CHEATS", money: "MONEY", meters: "METERS", progress: "PROG",
    world: "WORLD", spawn: "SPAWN", players: "USERS", server: "SRV",
    tools: "TOOLS", danger: "⚠"
  };
  const tabStrip = document.createElement("div");
  tabStrip.style.cssText = "display:flex;gap:3px;overflow-x:auto;margin-bottom:14px;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding-bottom:4px;";
  for (const id of tabs) {
    const b = document.createElement("button");
    b.textContent = tabLabels[id];
    const active = activeSection === id;
    const isDanger = id === "danger";
    b.style.cssText = `
      flex:0 0 auto;padding:7px 11px;
      font-size:9px;letter-spacing:1px;font-weight:700;
      font-family:var(--font-display);border-radius:4px;
      border:1px solid ${active ? (isDanger ? "var(--danger)" : "var(--accent)") : "var(--border)"};
      background:${active ? (isDanger ? "rgba(255,61,90,0.15)" : "rgba(0,212,255,0.12)") : "transparent"};
      color:${active ? (isDanger ? "var(--danger)" : "var(--accent)") : "var(--text-dim)"};
      text-transform:uppercase;white-space:nowrap;
    `;
    b.onclick = () => { activeSection = id; renderDevPanel(state, onChange); };
    tabStrip.appendChild(b);
  }
  el.appendChild(tabStrip);

  const content = document.createElement("div");
  el.appendChild(content);

  const renderers = {
    cheats: renderCheats, money: renderMoney, meters: renderMeters,
    progress: renderProgress, world: renderWorld, spawn: renderSpawn,
    players: renderPlayers, server: renderServer, tools: renderTools,
    danger: renderDanger
  };
  renderers[activeSection]?.(content, state, onChange);
}

function card(icon, title, sub, action, danger = false) {
  const el = document.createElement("button");
  const c = danger ? "var(--danger)" : "var(--accent)";
  el.style.cssText = "width:100%;display:flex;align-items:center;gap:10px;padding:11px;margin-bottom:6px;background:linear-gradient(135deg,#0a0d16,#10141f);border:1px solid var(--border);border-left:2px solid " + c + ";border-radius:4px;text-align:left;font-family:var(--font-display);color:var(--text);";
  el.innerHTML = '<div style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:rgba(255,61,90,0.1);border:1px solid var(--border-bright);border-radius:4px;font-size:15px;flex-shrink:0;">' + icon + '</div><div style="flex:1;min-width:0;"><div style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#fff;">' + title + '</div>' + (sub ? '<div style="font-size:9px;color:var(--text-dim);margin-top:2px;">' + sub + '</div>' : '') + '</div><div style="color:' + c + ';font-size:13px;">▸</div>';
  if (action) el.onclick = action;
  return el;
}

function label(text) {
  const l = document.createElement("div");
  l.style.cssText = "font-size:9px;letter-spacing:3px;font-weight:700;color:var(--text-dim);text-transform:uppercase;margin:14px 0 8px;display:flex;align-items:center;gap:8px;";
  l.innerHTML = '<span>' + text + '</span><span style="flex:1;height:1px;background:linear-gradient(90deg,var(--border),transparent);"></span>';
  return l;
}

// ---------- CHEATS ----------
function renderCheats(content, state, onChange) {
  const s = state();
  content.appendChild(label("Money"));
  content.appendChild(card("💵", "+$100", "", () => { s.money += 100; onChange(); }));
  content.appendChild(card("💵", "+$1K", "", () => { s.money += 1e3; onChange(); }));
  content.appendChild(card("💵", "+$100K", "", () => { s.money += 1e5; onChange(); }));
  content.appendChild(card("💵", "+$1M", "", () => { s.money += 1e6; onChange(); }));
  content.appendChild(card("💰", "+$1B", "", () => { s.money += 1e9; onChange(); }));
  content.appendChild(card("💰", "+$1T", "", () => { s.money += 1e12; onChange(); }));
  content.appendChild(card("💰", "+$1Qa", "", () => { s.money += 1e15; onChange(); }));
  content.appendChild(card("💎", "+$1Qi", "", () => { s.money += 1e18; onChange(); }));
  content.appendChild(card("⚡", "+$1Sx", "", () => { s.money += 1e21; onChange(); }));
  content.appendChild(card("∞", "+$1Vg", "", () => { s.money += 1e63; onChange(); }));
  content.appendChild(card("✖", "×2 Money", "", () => { s.money *= 2; onChange(); }));
  content.appendChild(card("✖", "×10 Money", "", () => { s.money *= 10; onChange(); }));
  content.appendChild(card("✖", "×1e6 Money", "", () => { s.money *= 1e6; onChange(); }));
  content.appendChild(card("🔢", "Set Money...", "Enter any value", () => {
    const v = prompt("Set money to:", s.money);
    if (v == null) return;
    s.money = parseFloat(v) || 0; onChange();
  }));

  content.appendChild(label("Businesses"));
  content.appendChild(card("🏢", "Own ALL Businesses", "1 of each", () => {
    import("../data/businesses.js").then(m => {
      for (const b of m.BUSINESSES) if (!s.owned[b.id]) s.owned[b.id] = 1;
      onChange();
    });
  }));
  content.appendChild(card("🏢", "×10 All Businesses", "", () => {
    for (const id in s.owned) s.owned[id] = (s.owned[id] || 0) * 10;
    onChange();
  }));
  content.appendChild(card("🏢", "×100 All Businesses", "", () => {
    for (const id in s.owned) s.owned[id] = (s.owned[id] || 0) * 100;
    onChange();
  }));
  content.appendChild(card("🗑", "Clear All Businesses", "", () => {
    if (!confirm("Wipe all owned businesses?")) return;
    s.owned = {}; onChange();
  }, true));

  content.appendChild(label("Upgrades"));
  content.appendChild(card("⚡", "Unlock ALL Upgrades", "", () => {
    import("../data/upgrades.js").then(m => {
      if (!s.upgrades) s.upgrades = {};
      for (const u of m.UPGRADES) s.upgrades[u.id] = true;
      onChange();
    });
  }));
  content.appendChild(card("🗑", "Clear All Upgrades", "", () => {
    if (!confirm("Clear all upgrades?")) return;
    s.upgrades = {}; onChange();
  }, true));

  content.appendChild(label("Ultras"));
  content.appendChild(card("🌟", "Unlock ALL Ultras", "", () => {
    import("../data/ultra.js").then(m => {
      if (!s.ultras) s.ultras = {};
      for (const u of m.ULTRAS) s.ultras[u.id] = true;
      onChange();
    });
  }));
}

// ---------- MONEY ----------
function renderMoney(content, state, onChange) {
  const s = state();

  content.appendChild(label("Passive Income"));
  content.appendChild(card("📈", "×2 Income (permanent)", "", () => { s.devIncomeMult = (s.devIncomeMult || 1) * 2; onChange(); }));
  content.appendChild(card("📈", "×10 Income (permanent)", "", () => { s.devIncomeMult = (s.devIncomeMult || 1) * 10; onChange(); }));
  content.appendChild(card("📈", "×100 Income (permanent)", "", () => { s.devIncomeMult = (s.devIncomeMult || 1) * 100; onChange(); }));

  content.appendChild(label("Start Money"));
  content.appendChild(card("🏁", "+$1K Start", "", () => { s.devStartMoney = (s.devStartMoney || 0) + 1e3; onChange(); }));
  content.appendChild(card("🏁", "+$1M Start", "", () => { s.devStartMoney = (s.devStartMoney || 0) + 1e6; onChange(); }));
  content.appendChild(card("🏁", "+$1B Start", "", () => { s.devStartMoney = (s.devStartMoney || 0) + 1e9; onChange(); }));

  content.appendChild(label("Instant Actions"));
  content.appendChild(card("💰", "Sell Everything", "Cash out all businesses", () => {
    import("../systems/economy.js").then(m => {
      let total = 0;
      for (const id in s.owned) {
        const n = s.owned[id];
        for (let i = 0; i < n; i++) total += m.nextCost(id, i);
      }
      s.money += total * 0.6;
      s.owned = {};
      onChange();
    });
  }));
  content.appendChild(card("🎁", "Trigger Offline Earnings", "", async () => {
    const m = await import("../systems/offline.js");
    localStorage.setItem("greedy_offline_last_seen", (Date.now() - 3600000).toString());
    alert("Offline timestamp set to 1 hour ago. Reload to claim.");
  }));
}

// ---------- METERS ----------
function renderMeters(content, state, onChange) {
  const s = state();

  content.appendChild(label("Greed"));
  content.appendChild(card("🔥", "Greed = 0", "", () => { s.greed = 0; onChange(); }));
  content.appendChild(card("🔥", "Greed = 25", "", () => { s.greed = 25; onChange(); }));
  content.appendChild(card("🔥", "Greed = 50", "", () => { s.greed = 50; onChange(); }));
  content.appendChild(card("🔥", "Greed = 75", "", () => { s.greed = 75; onChange(); }));
  content.appendChild(card("🔥", "Greed = 100", "", () => { s.greed = 100; onChange(); }));
  content.appendChild(card("🔥", "Set Greed...", "", () => {
    const v = prompt("Set greed (0-100):", s.greed);
    s.greed = Math.max(0, Math.min(100, parseFloat(v) || 0)); onChange();
  }));

  content.appendChild(label("Heat"));
  content.appendChild(card("🚨", "Heat = 0", "", () => { s.heat = 0; onChange(); }));
  content.appendChild(card("🚨", "Heat = 50", "", () => { s.heat = 50; onChange(); }));
  content.appendChild(card("🚨", "Heat = 100", "", () => { s.heat = 100; onChange(); }));

  content.appendChild(label("Health"));
  content.appendChild(card("❤️", "Health = 100", "", () => { s.health = 100; onChange(); }));
  content.appendChild(card("❤️", "Health = 50", "", () => { s.health = 50; onChange(); }));
  content.appendChild(card("❤️", "Health = 1", "", () => { s.health = 1; onChange(); }));

  content.appendChild(label("Reputation"));
  content.appendChild(card("⭐", "Rep = 100", "", () => { s.reputation = 100; onChange(); }));
  content.appendChild(card("⭐", "Rep = 50", "", () => { s.reputation = 50; onChange(); }));
  content.appendChild(card("⭐", "Rep = 0", "", () => { s.reputation = 0; onChange(); }));

  content.appendChild(label("Reset All Meters"));
  content.appendChild(card("🔄", "Set All to Safe", "Greed 0, Heat 0, HP 100, Rep 50", () => {
    s.greed = 0; s.heat = 0; s.health = 100; s.reputation = 50; onChange();
  }));
}

// ---------- PROGRESS ----------
function renderProgress(content, state, onChange) {
  const s = state();

  content.appendChild(label("Day"));
  content.appendChild(card("📅", "+1 Day", "", () => { s.day += 1; onChange(); }));
  content.appendChild(card("📅", "+10 Days", "", () => { s.day += 10; onChange(); }));
  content.appendChild(card("📅", "+100 Days", "", () => { s.day += 100; onChange(); }));
  content.appendChild(card("📅", "+1000 Days", "", () => { s.day += 1000; onChange(); }));
  content.appendChild(card("📅", "Set Day...", "", () => {
    const v = prompt("Set day:", s.day);
    s.day = Math.max(1, parseInt(v) || 1); onChange();
  }));

  content.appendChild(label("Rebirth"));
  content.appendChild(card("★", "+1 Rebirth", "", () => { s.rebirthCount = (s.rebirthCount || 0) + 1; onChange(); }));
  content.appendChild(card("★", "+10 Rebirths", "", () => { s.rebirthCount = (s.rebirthCount || 0) + 10; onChange(); }));
  content.appendChild(card("★", "+100 Rebirths", "", () => { s.rebirthCount = (s.rebirthCount || 0) + 100; onChange(); }));
  content.appendChild(card("✦", "+100 Rebirth Points", "", () => { s.rebirthPoints = (s.rebirthPoints || 0) + 100; onChange(); }));
  content.appendChild(card("✦", "+1000 Rebirth Points", "", () => { s.rebirthPoints = (s.rebirthPoints || 0) + 1000; onChange(); }));
  content.appendChild(card("✦", "Unlock ALL Perks", "", async () => {
    const m = await import("../data/rebirth.js");
    for (const u of m.REBIRTH.unlocks) {
      if (!s.rebirthPerks) s.rebirthPerks = {};
      s.rebirthPerks[u.id] = true;
    }
    onChange();
  }));

  content.appendChild(label("Super / Ultra / Ascend"));
  content.appendChild(card("✦", "+1 Super Point", "", () => { s.superPoints = (s.superPoints || 0) + 1; onChange(); }));
  content.appendChild(card("✦", "+10 Super Points", "", () => { s.superPoints = (s.superPoints || 0) + 10; onChange(); }));
  content.appendChild(card("✦", "+100 Super Count", "", () => { s.superCount = (s.superCount || 0) + 100; onChange(); }));
  content.appendChild(card("✦✦", "+1 Ultra Point", "", () => { s.ultraPoints = (s.ultraPoints || 0) + 1; onChange(); }));
  content.appendChild(card("✦✦", "+10 Ultra Points", "", () => { s.ultraPoints = (s.ultraPoints || 0) + 10; onChange(); }));
  content.appendChild(card("✦✦", "+100 Ultra Count", "", () => { s.ultraCount = (s.ultraCount || 0) + 100; onChange(); }));
  content.appendChild(card("✦✦✦", "+1 Ascension Point", "", () => { s.ascensionPoints = (s.ascensionPoints || 0) + 1; onChange(); }));
  content.appendChild(card("✦✦✦", "+10 Ascension Points", "", () => { s.ascensionPoints = (s.ascensionPoints || 0) + 10; onChange(); }));

  content.appendChild(label("Currencies"));
  content.appendChild(card("💠", "+100 of Every Currency", "Bypasses money threshold", async () => {
    const m = await import("../data/currencies.js");
    if (!s.currencyFloor) s.currencyFloor = {};
    if (!s.currencyLifetime) s.currencyLifetime = {};
    for (const c of m.CURRENCIES) {
      // lower the floor and raise lifetime
      s.currencyLifetime[c.id] = (s.currencyLifetime[c.id] || 0) + 100;
      s.currencyFloor[c.id] = 0;
    }
    onChange();
    alert("Lowered floors. Money won't grant them until you earn it back — but lifetime maxed.");
  }));
  content.appendChild(card("💠", "Reset Currency Floors", "Fresh spend", () => {
    s.currencyFloor = {}; onChange();
  }));

  content.appendChild(label("Achievements"));
  content.appendChild(card("🏆", "Unlock ALL Achievements", "", async () => {
    const m = await import("../data/achievements.js");
    if (!s.achievements) s.achievements = {};
    for (const a of m.ACHIEVEMENTS) s.achievements[a.id] = Date.now();
    onChange();
  }));
  content.appendChild(card("🏆", "Clear Achievements", "", () => {
    if (!confirm("Clear achievements?")) return;
    s.achievements = {}; onChange();
  }, true));
}

// ---------- WORLD ----------
function renderWorld(content, state, onChange) {
  const s = state();

  content.appendChild(label("Cities"));
  content.appendChild(card("🌍", "Travel: Hometown", "", () => { s.currentCity = "hometown"; onChange(); }));
  content.appendChild(card("🌍", "Travel: Big City", "", () => { s.currentCity = "bigcity"; onChange(); }));
  content.appendChild(card("🌍", "Travel: Capital", "", () => { s.currentCity = "capital"; onChange(); }));
  content.appendChild(card("🌍", "Travel: Offshore", "", () => { s.currentCity = "offshore"; onChange(); }));
  content.appendChild(card("🌍", "Travel: Orbit", "", () => { s.currentCity = "orbit"; onChange(); }));
  content.appendChild(card("🌍", "Travel: Dimension", "", () => { s.currentCity = "dimension"; onChange(); }));
  content.appendChild(card("🌍", "Custom City...", "", () => {
    const v = prompt("City id:", s.currentCity);
    if (v) { s.currentCity = v; onChange(); }
  }));

  content.appendChild(label("Outfit"));
  content.appendChild(card("👕", "Reset to Auto", "Outfit by money tier", () => {
    delete s.outfit; onChange();
  }));
  content.appendChild(card("👕", "Set Outfit...", "Any skin id", () => {
    const v = prompt("Outfit id (street, hoodie, suit, pimp, mob, shadow, cosmic, god, dragon, phoenix, void, king, emperor, founder...):");
    if (v) { s.outfit = v; onChange(); }
  }));

  content.appendChild(label("Rivals"));
  content.appendChild(card("👤", "Spawn All Rivals", "", async () => {
    const m = await import("../data/rivals.js");
    if (!s.rivals) s.rivals = [];
    for (const r of m.RIVALS) {
      if (!s.rivals.find(x => x.id === r.id)) {
        s.rivals.push({ id: r.id, tier: s.rivals.length, aggression: r.aggression, patience: r.patience, spawnedDay: s.day });
      }
    }
    onChange();
  }));
  content.appendChild(card("👤", "Clear Rivals", "", () => { s.rivals = []; onChange(); }));

  content.appendChild(label("Prestige Shop"));
  content.appendChild(card("⭐", "+100 Prestige Currency", "", () => {
    s.rebirthPoints = (s.rebirthPoints || 0) + 100;
    s.prestigePoints = (s.prestigePoints || 0) + 100;
    onChange();
  }));
}

// ---------- SPAWN ----------
function renderSpawn(content, state, onChange) {
  const s = state();

  content.appendChild(label("Events"));
  content.appendChild(card("🎲", "Fire Random Event", "", async () => {
    const m = await import("../systems/events.js");
    const list = await import("../data/events.js");
    const ev = list.EVENTS[Math.floor(Math.random() * list.EVENTS.length)];
    const res = m.applyEvent(s, ev);
    alert("Event: " + ev.name + "\n\n" + ev.desc);
    onChange();
  }));
  content.appendChild(card("🎲", "Fire Crisis", "", async () => {
    const m = await import("../systems/crisis.js");
    const c = m.getAllCrises()[Math.floor(Math.random() * m.getAllCrises().length)];
    const res = m.applyCrisis(s, c);
    alert("Crisis: " + c.name + "\n\n" + c.desc);
    onChange();
  }));
  content.appendChild(card("🎲", "Fire 5 Random Events", "", async () => {
    const m = await import("../systems/events.js");
    const list = await import("../data/events.js");
    for (let i = 0; i < 5; i++) {
      const ev = list.EVENTS[Math.floor(Math.random() * list.EVENTS.length)];
      m.applyEvent(s, ev);
    }
    onChange();
  }));

  content.appendChild(label("Story"));
  content.appendChild(card("📖", "Trigger Next Chapter", "", async () => {
    const m = await import("../systems/story.js");
    const data = await import("../data/story.js");
    const ch = m.nextChapter(s);
    if (!ch) { alert("No chapter available. Unlock conditions not met."); return; }
    // show it
    const mod = await import("../ui/storyModal.js");
    mod.showStoryModal(ch, (choiceId) => {
      m.applyChoice(s, ch, choiceId);
      onChange();
    });
  }));
  content.appendChild(card("📖", "Reset Story", "", () => {
    if (!confirm("Clear all story progress?")) return;
    s.storyRead = {}; s.pathProgress = { honest: 0, clever: 0, ruthless: 0 };
    onChange();
  }, true));
  content.appendChild(card("📖", "Set Path: Honest", "", () => {
    s.pathProgress = { honest: 10, clever: 0, ruthless: 0 };
    s.path = "honest"; onChange();
  }));
  content.appendChild(card("📖", "Set Path: Clever", "", () => {
    s.pathProgress = { honest: 0, clever: 10, ruthless: 0 };
    s.path = "clever"; onChange();
  }));
  content.appendChild(card("📖", "Set Path: Ruthless", "", () => {
    s.pathProgress = { honest: 0, clever: 0, ruthless: 10 };
    s.path = "ruthless"; onChange();
  }));

  content.appendChild(label("Collectibles"));
  content.appendChild(card("💎", "Drop Random Collectible", "", async () => {
    const m = await import("../systems/collectibles.js");
    const drop = m.tryDrop(s);
    alert(drop ? "Dropped: " + drop.name : "No drop rolled");
    onChange();
  }));
  content.appendChild(card("💎", "Grant ALL Collectibles", "", async () => {
    const data = await import("../data/collectibles.js");
    if (!s.collectibles) s.collectibles = {};
    for (const c of data.COLLECTIBLES) s.collectibles[c.id] = (s.collectibles[c.id] || 0) + 1;
    onChange();
  }));
  content.appendChild(card("💎", "Clear Collectibles", "", () => {
    if (!confirm("Clear all collectibles?")) return;
    s.collectibles = {}; onChange();
  }, true));

  content.appendChild(label("Ultra Offer"));
  content.appendChild(card("🌟", "Force Ultra Offer", "Spawn the modal now", async () => {
    const m = await import("../systems/ultra.js");
    const u = m.activeOffer(s);
    // spawn manually
    const data = await import("../data/ultra.js");
    const pool = data.ULTRAS.filter(x => s.day >= x.minDay && !(s.ultras && s.ultras[x.id]));
    if (pool.length === 0) { alert("No ultras left to offer"); return; }
    const pick = pool[0];
    s.ultraOffer = { id: pick.id, expiresAt: Date.now() + 30000, startedAt: Date.now() };
    alert("Ultra offer spawned: " + pick.name);
    onChange();
  }));

  content.appendChild(label("Heist"));
  content.appendChild(card("🎯", "Reset Heist Cooldown", "", () => {
    s.lastHeistDay = -999; onChange();
  }));
  content.appendChild(card("🎯", "Trigger Random Heist", "Auto target + crew", async () => {
    const m = await import("../systems/heist.js");
    const target = m.TARGETS[Math.floor(Math.random() * m.TARGETS.length)];
    const crew = m.CREWS[0];
    const r = m.runHeist(s, target.id, crew.id);
    alert(r.won ? "WON: $" + (r.payout || 0).toLocaleString() : "LOST: $" + (r.fine || 0).toLocaleString());
    onChange();
  }));
}

// ---------- PLAYERS ----------
async function renderPlayers(content, state, onChange) {
  content.appendChild(label("Player Management"));

  content.appendChild(card("🔄", "Refresh Player List", "Fetch all users", async () => {
    const r = await api("/api/admin/list");
    if (!r.ok) { alert("Error: " + (r.error || "unknown")); return; }
    cachedUsers = r.users || [];
    renderDevPanel(state, onChange);
  }));

  content.appendChild(card("👤", "Search User...", "Find by username", async () => {
    if (!cachedUsers) { alert("Refresh list first"); return; }
    const q = prompt("Username contains:");
    if (!q) return;
    const found = cachedUsers.filter(u => u.username.toLowerCase().includes(q.toLowerCase()));
    alert(found.length ? found.map(u => "#" + u.id + " " + u.username).join("\n") : "No matches");
  }));

  content.appendChild(card("📊", "Show All Users", "", () => {
    if (!cachedUsers) { alert("Refresh list first"); return; }
    alert(cachedUsers.map(u => "#" + u.id + " " + u.username + (u.banned ? " [BANNED]" : "")).join("\n"));
  }));

  content.appendChild(card("🗑", "Clear All Bans", "Unban every user", async () => {
    if (!cachedUsers) { alert("Refresh list first"); return; }
    if (!confirm("Unban every banned user?")) return;
    for (const u of cachedUsers) {
      if (u.banned) await api("/api/admin/unban", { user_id: u.id });
    }
    alert("All bans cleared");
    cachedUsers = null;
    renderDevPanel(state, onChange);
  }, true));

  if (!cachedUsers) return;

  content.appendChild(label("Users (" + cachedUsers.length + ")"));

  for (const u of cachedUsers) {
    const banned = u.banned;
    const cardEl = document.createElement("div");
    cardEl.style.cssText = "padding:12px;margin-bottom:6px;background:linear-gradient(135deg,#0a0d16,#10141f);border:1px solid var(--border);border-left:2px solid " + (banned ? "var(--danger)" : "var(--money)") + ";border-radius:4px;font-family:var(--font-display);";
    cardEl.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <div>
          <div style="font-size:13px;font-weight:800;color:#fff;">${u.username}</div>
          <div style="font-size:9px;color:var(--text-dim);">ID #${u.id}</div>
        </div>
        <div style="font-size:9px;color:${banned ? "var(--danger)" : "var(--money)"};letter-spacing:1px;font-weight:700;">
          ${banned ? "● BANNED" : "● ACTIVE"}
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;font-size:9px;color:var(--text-dim);margin-bottom:8px;">
        <div>Best NW <b style="color:var(--money);float:right;">$${(u.best_nw || 0).toLocaleString()}</b></div>
        <div>Best Day <b style="color:var(--accent);float:right;">${u.best_day || 0}</b></div>
        <div>Scores <b style="color:var(--accent);float:right;">${u.score_count || 0}</b></div>
        <div>Joined <b style="color:var(--text);float:right;">${new Date((u.created_at || 0) * 1000).toLocaleDateString()}</b></div>
      </div>
      ${banned ? '<div style="font-size:9px;color:var(--danger);margin-bottom:6px;">Reason: ' + (banned.reason || "—") + "</div>" : ""}
      <div style="display:flex;gap:5px;">
        ${banned
          ? '<button data-act="unban" style="flex:1;padding:7px;background:rgba(0,255,157,0.15);border:1px solid var(--money);color:var(--money);border-radius:4px;font-size:9px;font-weight:700;font-family:var(--font-display);">UNBAN</button>'
          : '<button data-act="ban" style="flex:1;padding:7px;background:rgba(255,61,90,0.15);border:1px solid var(--danger);color:var(--danger);border-radius:4px;font-size:9px;font-weight:700;font-family:var(--font-display);">BAN</button>'}
        <button data-act="delete" style="flex:1;padding:7px;background:rgba(255,61,90,0.15);border:1px solid var(--danger);color:var(--danger);border-radius:4px;font-size:9px;font-weight:700;font-family:var(--font-display);">DELETE</button>
      </div>
    `;
    content.appendChild(cardEl);

    cardEl.querySelectorAll("[data-act]").forEach(btn => {
      btn.onclick = async () => {
        const act = btn.dataset.act;
        if (act === "ban") {
          const reason = prompt("Ban reason:", "cheating") || "violation";
          const r = await api("/api/admin/ban", { user_id: u.id, reason });
          alert(r.ok ? "Banned " + u.username : "Failed");
        } else if (act === "unban") {
          const r = await api("/api/admin/unban", { user_id: u.id });
          alert(r.ok ? "Unbanned " + u.username : "Failed");
        } else if (act === "delete") {
          if (!confirm("Delete " + u.username + "?")) return;
          if (!confirm("Absolutely sure?")) return;
          const r = await api("/api/admin/delete", { user_id: u.id });
          alert(r.ok ? "Deleted" : "Failed");
        }
        cachedUsers = null;
        renderDevPanel(state, onChange);
      };
    });
  }
}

// ---------- SERVER ----------
async function renderServer(content) {
  content.appendChild(label("Stats"));

  const r = await api("/api/admin/stats");
  if (!r.ok) {
    content.appendChild(card("⚠️", "Server offline", r.error || "unknown", null));
    return;
  }
  const st = r.stats;

  const box = document.createElement("div");
  box.style.cssText = "padding:14px;background:#0a0d16;border:1px solid var(--border);border-left:2px solid var(--accent);border-radius:4px;font-family:var(--font-display);font-size:10px;color:var(--text-dim);line-height:1.8;margin-bottom:8px;";
  box.innerHTML = `
    <div style="color:var(--accent);font-weight:700;letter-spacing:2px;margin-bottom:6px;">DATABASE</div>
    Users: <b style="color:#fff;float:right;">${st.users}</b><br>
    Bans: <b style="color:var(--danger);float:right;">${st.bans}</b><br>
    Saves: <b style="color:#fff;float:right;">${st.saves}</b><br>
    Scores: <b style="color:#fff;float:right;">${st.scores}</b>
  `;
  content.appendChild(box);

  content.appendChild(label("Actions"));
  content.appendChild(card("🗑️", "Clear Leaderboard", "Delete all scores", async () => {
    if (!confirm("Clear all scores?")) return;
    const rr = await api("/api/admin/clear-scores");
    alert(rr.ok ? "Cleared" : "Failed");
    renderDevPanel(window.__state ? window.__state() : {}, () => {});
  }, true));
  content.appendChild(card("📊", "Refresh Stats", "", () => renderDevPanel(window.__state ? window.__state() : {}, () => {})));

  if (st.top && st.top.length > 0) {
    content.appendChild(label("Top 5"));
    for (const t of st.top) {
      content.appendChild(card("🏆", t.username, "$" + (t.nw || 0).toLocaleString(), null));
    }
  }
}

// ---------- TOOLS ----------
function renderTools(content, state, onChange) {
  const s = state();

  content.appendChild(label("Debug"));
  content.appendChild(card("📋", "Copy Save JSON", "Full state to clipboard", async () => {
    const json = JSON.stringify(s, null, 2);
    try { await navigator.clipboard.writeText(json); alert("Copied (" + json.length + " chars)"); }
    catch (e) { prompt("JSON:", json); }
  }));
  content.appendChild(card("📊", "Print State to Console", "", () => {
    console.log("[DEV] full state:", s);
    alert("Printed to console");
  }));
  content.appendChild(card("📊", "Print Business Summary", "", async () => {
    const m = await import("../systems/economy.js");
    console.log("[DEV] business summary:", m.summarize(s));
    alert("Printed to console");
  }));
  content.appendChild(card("📊", "Print All Bonuses", "", async () => {
    const m = await import("../systems/currencies.js");
    console.log("[DEV] currency bonuses:", m.totalBonus(s));
    alert("Printed to console");
  }));

  content.appendChild(label("Quicksave"));
  content.appendChild(card("💾", "Force Save", "", async () => {
    const m = await import("../core/autosave.js");
    m.forceSave(s);
    alert("Saved");
  }));
  content.appendChild(card("📤", "Export Save", "Base64 to clipboard", async () => {
    const m = await import("../core/save.js");
    const b64 = m.exportSave(s);
    try { await navigator.clipboard.writeText(b64); alert("Copied (" + b64.length + " chars)"); }
    catch (e) { prompt("Save code:", b64); }
  }));
  content.appendChild(card("📥", "Import Save", "Paste base64 to load", async () => {
    const code = prompt("Paste save code:");
    if (!code) return;
    const m = await import("../core/save.js");
    const imported = m.importSave(code.trim());
    if (!imported) { alert("Invalid save"); return; }
    localStorage.setItem("greedy_save", JSON.stringify({ version: 1, savedAt: Date.now(), state: imported }));
    alert("Imported — reloading");
    location.reload();
  }));

  content.appendChild(label("Time"));
  content.appendChild(card("⏰", "Fast Forward 1 Hour", "Run 60 days instantly", async () => {
    const m = await import("../actions/advanceDay.js");
    for (let i = 0; i < 60; i++) m.advanceDay(s);
    alert("Ran 60 days");
    onChange();
  }));

  content.appendChild(label("Runtime"));
  const info = document.createElement("div");
  info.style.cssText = "padding:12px;background:#0a0d16;border:1px solid var(--border);border-radius:4px;font-family:var(--font-display);font-size:9px;color:var(--text-dim);line-height:1.7;margin-bottom:8px;";
  info.innerHTML = `
    <div style="color:var(--accent);font-weight:700;letter-spacing:2px;margin-bottom:4px;">INFO</div>
    Host: ${location.hostname}<br>
    Port: ${location.port || "80"}<br>
    Protocol: ${location.protocol}<br>
    Save size: ${(JSON.stringify(s).length / 1024).toFixed(1)} KB<br>
    Day: ${s.day} · Money: $${(s.money || 0).toExponential(2)}<br>
    Businesses: ${Object.keys(s.owned || {}).length}<br>
    Upgrades: ${Object.keys(s.upgrades || {}).length}
  `;
  content.appendChild(info);
}

// ---------- DANGER ----------
function renderDanger(content, state, onChange) {
  const s = state();

  content.appendChild(label("⚠️ DANGER ZONE"));
  const warn = document.createElement("div");
  warn.style.cssText = "padding:12px;background:rgba(255,61,90,0.08);border:1px solid var(--danger);border-radius:4px;font-family:var(--font-display);font-size:10px;color:var(--danger);line-height:1.5;margin-bottom:12px;";
  warn.textContent = "These actions CANNOT be undone. Use with caution.";
  content.appendChild(warn);

  content.appendChild(card("💀", "Bankrupt", "Money = -10000 (game over)", () => {
    if (!confirm("Trigger bankruptcy?")) return;
    s.money = -10000; onChange();
  }, true));

  content.appendChild(card("💀", "Trigger Game Over", "", () => {
    if (!confirm("Force game over?")) return;
    s.gameOver = true; onChange();
  }, true));

  content.appendChild(card("🗑️", "Clear Log", "", () => {
    s.log = []; onChange();
  }, true));

  content.appendChild(card("🔄", "Hard Reset (keep achievements)", "Everything else resets", async () => {
    if (!confirm("Hard reset? Keeps only achievements + titles.")) return;
    if (!confirm("Really sure?")) return;
    const ach = s.achievements || {};
    const title = s.selectedTitle;
    const m = await import("../core/state.js");
    const fresh = m.createNewState({ difficulty: s.difficulty, playerName: s.playerName });
    fresh.achievements = ach;
    fresh.selectedTitle = title;
    Object.keys(s).forEach(k => delete s[k]);
    Object.assign(s, fresh);
    onChange();
  }, true));

  content.appendChild(card("💣", "Full Wipe", "Delete save + reload", () => {
    if (!confirm("DELETE EVERYTHING and restart?")) return;
    if (!confirm("Absolutely sure?")) return;
    localStorage.clear();
    location.reload();
  }, true));

  content.appendChild(card("♻️", "Reload Page", "", () => location.reload()));
}

export function installDevPanel() {}

// Load admin key from localStorage (only exists on dev machine)
try {
  const k = localStorage.getItem("greedy_admin_key");
  if (k && typeof window !== "undefined") {
    window.__GREEDY_ADMIN_KEY__ = k;
  }
} catch (e) {}
