// GREEDY — toast + modal

const toastEl = document.getElementById("toast");
const backdrop = document.getElementById("modal-backdrop");
const titleEl = document.getElementById("modal-title");
const descEl = document.getElementById("modal-desc");
const deltasEl = document.getElementById("modal-deltas");
const closeBtn = document.getElementById("modal-close");

let toastTimer = null;
let modalQueue = [];
let modalOpen = false;

export function toast(msg, ms = 1800) {
  toastEl.textContent = msg;
  toastEl.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.add("hidden"), ms);
}

export function showEventModal(event) {
  modalQueue.push(event);
  if (!modalOpen) openNext();
}

function openNext() {
  const ev = modalQueue.shift();
  if (!ev) return;
  modalOpen = true;
  titleEl.textContent = ev.name;
  descEl.textContent = ev.desc;
  deltasEl.innerHTML = "";
  for (const [k, v] of Object.entries(ev.deltas || {})) {
    if (Math.abs(v) < 0.01) continue;
    const color = v > 0 ? "var(--money)" : "var(--danger)";
    const sign = v > 0 ? "+" : "";
    deltasEl.innerHTML += `<div style="color:${color}">${k}: ${sign}${v.toFixed(2)}</div>`;
  }
  backdrop.classList.remove("hidden");
}

closeBtn.addEventListener("click", () => {
  backdrop.classList.add("hidden");
  modalOpen = false;
  if (modalQueue.length > 0) openNext();
});
