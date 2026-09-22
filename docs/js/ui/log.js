// GREEDY — log panel

const panel = document.getElementById("panel-log");

export function renderLog(state) {
  panel.innerHTML = "";
  const entries = [...state.log].reverse().slice(0, 100);

  if (entries.length === 0) {
    panel.innerHTML = '<p style="color:var(--text-dim);text-align:center;padding:40px 0;">No history yet.</p>';
    return;
  }

  for (const e of entries) {
    const div = document.createElement("div");
    div.className = "log-entry " + (e.kind || "");
    div.textContent = e.text;
    panel.appendChild(div);
  }
}
