// GREEDY — settings (inline in tab)
import { exportSave, importSave, deleteSave } from "../core/save.js";
import { forceSave } from "../core/autosave.js";
import { Cloud } from "../core/cloud.js";
import { toast } from "./notifications.js";
import { stopLoop, startLoop, isRunning } from "../core/loop.js";
import { BALANCE } from "../data/balance.js";

let state = null;
let reloadFn = null;
let activeSection = "main";

export function installSettings(getState, onReload) {
  state = getState;
  reloadFn = onReload;
}

export function refreshSettings() {
  const panel = document.getElementById("panel-settings");
  if (!panel || !state) return;

  const s = state();
  panel.innerHTML = "";

  // header
  const header = document.createElement("div");
  header.style.cssText = "margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--border);";
  header.innerHTML = `
    <div style="font-size:9px;color:var(--text-dim);letter-spacing:3px;font-weight:700;">SYSTEM</div>
    <div style="font-size:22px;font-weight:800;letter-spacing:2px;color:var(--accent);font-family:var(--font-display);text-shadow:0 0 20px var(--accent);">SETTINGS</div>
  `;
  panel.appendChild(header);

  // section tabs
  const sections = [["main","MAIN"],["cloud","CLOUD"],["data","DATA"],["about","ABOUT"]];
  const tabs = document.createElement("div");
  tabs.style.cssText = "display:flex;gap:4px;margin-bottom:16px;";
  for (const [id, label] of sections) {
    const b = document.createElement("button");
    b.textContent = label;
    b.style.cssText = "flex:1;padding:8px 4px;font-size:9px;letter-spacing:1px;font-weight:700;font-family:var(--font-display);border-radius:4px;border:1px solid " + (activeSection === id ? "var(--accent)" : "var(--border)") + ";background:" + (activeSection === id ? "rgba(0,212,255,0.12)" : "transparent") + ";color:" + (activeSection === id ? "var(--accent)" : "var(--text-dim)") + ";text-transform:uppercase;";
    b.onclick = () => { activeSection = id; refreshSettings(); };
    tabs.appendChild(b);
  }
  panel.appendChild(tabs);

  // content
  const content = document.createElement("div");
  panel.appendChild(content);

  if (activeSection === "main") renderMain(content, s);
  else if (activeSection === "cloud") renderCloud(content, s);
  else if (activeSection === "data") renderData(content, s);
  else if (activeSection === "dev" && IS_LOCALHOST) renderDev(content, s);
  else if (activeSection === "about") renderAbout(content, s);
}

function card(icon, title, sub, action) {
  const el = document.createElement("button");
  el.style.cssText = "width:100%;display:flex;align-items:center;gap:12px;padding:14px;margin-bottom:8px;background:linear-gradient(135deg,#0a0d16,#10141f);border:1px solid var(--border);border-left:2px solid var(--accent);border-radius:4px;text-align:left;font-family:var(--font-display);color:var(--text);";
  el.innerHTML = '<div style="width:36px;height:36px;display:flex;align-items:center;justify-content:center;background:rgba(0,212,255,0.1);border:1px solid var(--border-bright);border-radius:4px;font-size:16px;flex-shrink:0;">' + icon + '</div><div style="flex:1;min-width:0;"><div style="font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#fff;">' + title + '</div>' + (sub ? '<div style="font-size:10px;color:var(--text-dim);margin-top:2px;">' + sub + '</div>' : '') + '</div><div style="color:var(--accent);font-size:14px;">▸</div>';
  if (action) el.onclick = action;
  return el;
}

function sectionLabel(text) {
  const l = document.createElement("div");
  l.style.cssText = "font-size:9px;letter-spacing:3px;font-weight:700;color:var(--text-dim);text-transform:uppercase;margin:18px 0 10px;display:flex;align-items:center;gap:8px;";
  l.innerHTML = '<span>' + text + '</span><span style="flex:1;height:1px;background:linear-gradient(90deg,var(--border),transparent);"></span>';
  return l;
}

function renderMain(content, s) {
  const status = document.createElement("div");
  status.style.cssText = "padding:16px;background:linear-gradient(135deg,#0a0d16,#10141f);border:1px solid var(--border);border-left:2px solid var(--money);border-radius:4px;margin-bottom:8px;font-family:var(--font-display);";
  status.innerHTML = '<div style="font-size:9px;color:var(--text-dim);letter-spacing:2px;font-weight:700;">RUN STATUS</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px;font-size:11px;"><div><span style="color:var(--text-dim);">DAY</span> <b style="color:var(--accent);float:right;">' + s.day + '</b></div><div><span style="color:var(--text-dim);">REBIRTH</span> <b style="color:var(--accent);float:right;">' + (s.rebirthCount || 0) + '</b></div><div><span style="color:var(--text-dim);">GREED</span> <b style="color:var(--warn);float:right;">' + Math.floor(s.greed) + '</b></div><div><span style="color:var(--text-dim);">HEAT</span> <b style="color:var(--danger);float:right;">' + Math.floor(s.heat) + '</b></div></div>';
  content.appendChild(status);

  content.appendChild(sectionLabel("Simulation"));
  content.appendChild(card(isRunning() ? "⏸" : "▶", isRunning() ? "Pause Game" : "Resume Game", isRunning() ? "Freeze the sim" : "Resume ticking", () => {
    if (isRunning()) { stopLoop(); toast("Paused"); }
    else { startLoop(state(), () => {}, () => {}); toast("Resumed"); }
    refreshSettings();
  }));
  content.appendChild(card("💾", "Force Save", "Write to local storage", () => {
    const ok = forceSave(state());
    toast(ok ? "Saved" : "Failed");
  }));

  content.appendChild(sectionLabel("Preferences"));
  content.appendChild(card("🎨", "Reduce Animations", "Disable scanline + glows", () => {
    document.documentElement.classList.toggle("reduced-motion");
    toast(document.documentElement.classList.contains("reduced-motion") ? "Reduced" : "Normal");
  }));
  content.appendChild(card("📳", "Haptic Test", "Vibrate on tap (mobile only)", () => {
    if (navigator.vibrate) { navigator.vibrate(50); toast("Vibrated"); }
    else toast("Not supported");
  }));
}

function renderCloud(content, s) {
  const loggedIn = Cloud.userId != null;
  const status = document.createElement("div");
  status.style.cssText = "padding:16px;background:linear-gradient(135deg,#0a0d16,#10141f);border:1px solid var(--border);border-left:2px solid " + (loggedIn ? "var(--money)" : "var(--text-mute)") + ";border-radius:4px;margin-bottom:8px;font-family:var(--font-display);font-size:11px;";
  status.innerHTML = '<div style="font-size:9px;color:var(--text-dim);letter-spacing:2px;font-weight:700;">CLOUD STATUS</div><div style="margin-top:8px;">' + (loggedIn ? '<span style="color:var(--money);">● CONNECTED</span> <span style="color:var(--text-dim);float:right;">User #' + Cloud.userId + '</span>' : '<span style="color:var(--text-mute);">○ NOT CONNECTED</span>') + '</div>';
  content.appendChild(status);

  content.appendChild(sectionLabel("Account"));
  if (!loggedIn) {
    content.appendChild(card("🔑", "Register", "Create a new account", async () => {
      const u = prompt("Username:"); if (!u) return;
      const p = prompt("Password:"); if (!p) return;
      const r = await Cloud.register(u, p);
      toast(r.ok ? "Registered" : "Error: " + (r.error || "unknown"));
      refreshSettings();
    }));
    content.appendChild(card("🔓", "Login", "Sign in to existing account", async () => {
      const u = prompt("Username:"); if (!u) return;
      const p = prompt("Password:"); if (!p) return;
      const r = await Cloud.login(u, p);
      toast(r.ok ? "Logged in" : "Error: " + (r.error || "unknown"));
      refreshSettings();
    }));
  } else {
    content.appendChild(card("☁️", "Upload Save", "Push current run to cloud", async () => {
      const r = await Cloud.upload(state());
      toast(r.ok ? "Uploaded" : "Error");
    }));
    content.appendChild(card("⬇️", "Download Save", "Restore cloud save (overwrites)", async () => {
      if (!confirm("Replace current run?")) return;
      const r = await Cloud.download();
      if (r.ok && r.payload) {
        localStorage.setItem("greedy_save", JSON.stringify({ version: 1, savedAt: Date.now(), state: r.payload }));
        toast("Downloaded");
        setTimeout(() => location.reload(), 800);
      } else toast("No cloud save");
    }));
    content.appendChild(card("🏆", "Submit Score", "Post net worth to leaderboard", async () => {
      const r = await Cloud.submitScore(state().day, state().money, state().rebirthCount || 0);
      toast(r.ok ? "Submitted" : "Error");
    }));
    content.appendChild(card("📊", "View Leaderboard", "Top players", async () => {
      const r = await Cloud.leaderboard();
      if (!r.ok) { toast("Unavailable"); return; }
      const lines = (r.scores || []).slice(0, 10).map((x, i) => (i + 1) + ". " + x.username + " — $" + x.net_worth.toLocaleString() + " (day " + x.day + ")").join("\n") || "No scores yet.";
      alert("LEADERBOARD\n\n" + lines);
    }));
    content.appendChild(card("🚪", "Logout", "Sign out of cloud", () => {
      Cloud.userId = null;
      toast("Logged out");
      refreshSettings();
    }));
  }
}

function renderData(content, s) {
  content.appendChild(sectionLabel("Backup"));
  content.appendChild(card("📤", "Export Save", "Copy save code", async () => {
    const b64 = exportSave(state());
    try { await navigator.clipboard.writeText(b64); toast("Copied"); }
    catch (e) { prompt("Save code:", b64); }
  }));
  content.appendChild(card("📥", "Import Save", "Paste a save code", () => {
    const code = prompt("Paste save code:");
    if (!code) return;
    const imported = importSave(code.trim());
    if (!imported) { toast("Invalid"); return; }
    localStorage.setItem("greedy_save", JSON.stringify({ version: 1, savedAt: Date.now(), state: imported }));
    toast("Imported");
    setTimeout(() => reloadFn?.(), 800);
  }));

  content.appendChild(sectionLabel("Reset"));
  content.appendChild(card("🗑", "Delete Save", "Erase and restart (permanent)", () => {
    if (!confirm("Delete save?")) return;
    if (!confirm("Absolutely sure?")) return;
    deleteSave();
    location.reload();
  }));
}

function renderDev(content, s) {
  content.appendChild(sectionLabel("Cheats"));
  content.appendChild(card("💰", "Add $1M", "Instant cash", () => { s.money += 1e6; forceSave(s); toast("+$1,000,000"); reloadFn?.(); }));
  content.appendChild(card("💰", "Add $1B", "Instant cash", () => { s.money += 1e9; forceSave(s); toast("+$1B"); reloadFn?.(); }));
  content.appendChild(card("💰", "Add $1T", "Instant cash", () => { s.money += 1e12; forceSave(s); toast("+$1T"); reloadFn?.(); }));
  content.appendChild(card("⭐", "Add 100 Rebirth Pts", "Boost rebirth currency", () => { s.rebirthPoints = (s.rebirthPoints || 0) + 100; forceSave(s); toast("+100 pts"); reloadFn?.(); }));
  content.appendChild(card("🌍", "Travel Anywhere", "Jump to a city", () => {
    s.currentCity = prompt("City id (hometown, bigcity, capital, offshore, orbit, dimension):") || s.currentCity;
    forceSave(s); toast("→ " + s.currentCity); reloadFn?.();
  }));

  content.appendChild(sectionLabel("Diagnostics"));
  const diag = document.createElement("div");
  diag.style.cssText = "padding:14px;background:#0a0d16;border:1px solid var(--border);border-radius:4px;font-family:var(--font-display);font-size:10px;color:var(--text-dim);line-height:1.7;";
  diag.innerHTML = '<div style="color:var(--accent);font-weight:700;margin-bottom:6px;">RUNTIME</div>Day: ' + s.day + '<br>Money: $' + s.money.toLocaleString() + '<br>Greed: ' + s.greed.toFixed(2) + ' / ' + BALANCE.greed.max + '<br>Businesses: ' + Object.keys(s.owned || {}).length + '<br>Upgrades: ' + Object.keys(s.upgrades || {}).length + '<br>Ultras: ' + Object.keys(s.ultras || {}).length + '<br>Rebirths: ' + (s.rebirthCount || 0) + '<br>City: ' + (s.currentCity || "hometown") + '<br>Save size: ' + (JSON.stringify(s).length / 1024).toFixed(1) + ' KB';
  content.appendChild(diag);
}

function renderAbout(content, s) {
  const about = document.createElement("div");
  about.style.cssText = "padding:24px;text-align:center;background:linear-gradient(135deg,#0a0d16,#10141f);border:1px solid var(--border);border-radius:8px;font-family:var(--font-display);";
  about.innerHTML = '<div style="font-size:32px;font-weight:800;letter-spacing:6px;color:var(--accent);text-shadow:0 0 30px var(--accent);margin-bottom:4px;">GREEDY</div><div style="font-size:10px;color:var(--text-dim);letter-spacing:3px;margin-bottom:20px;">PIXEL MANAGEMENT SIM</div><div style="font-size:11px;color:var(--text-dim);line-height:1.8;">Build an empire.<br>Watch it corrupt you.<br><br><span style="color:var(--accent);">v1.0</span></div>';
  content.appendChild(about);

  content.appendChild(sectionLabel("Credits"));
  content.appendChild(card("💻", "Engine", "HTML · CSS · JS", () => {}));
  content.appendChild(card("🎨", "Art", "Programmatic pixel sprites", () => {}));
  content.appendChild(card("🌐", "Server", "Python · SQLite", () => {}));

  content.appendChild(sectionLabel("Help"));
  content.appendChild(card("📖", "How to Play", "Quick guide", () => {
    alert("HOW TO PLAY\n\n1. Buy businesses from SHOP\n2. Money ticks every second\n3. Higher income = more GREED\n4. High greed triggers bad events\n5. Watch HEALTH, HEAT, REPUTATION\n6. Buy UPGRADES to boost\n7. REBIRTH at $100K+ for permanent bonuses");
  }));
}
