// GREEDY — screen juice
export function shake() {
  document.body.classList.add("shake");
  setTimeout(() => document.body.classList.remove("shake"), 400);
}

export function flash(color = "rgba(239,68,68,0.5)") {
  const el = document.createElement("div");
  el.className = "flash";
  el.style.background = color;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 400);
}

export function achievementPopup(a) {
  const el = document.createElement("div");
  el.className = "ach-popup";
  el.innerHTML = `
    <div class="icon">🏆</div>
    <div class="text">
      <div class="label">ACHIEVEMENT</div>
      <div class="name">${a.name}</div>
      <div class="desc">${a.desc}</div>
    </div>
  `;
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.animation = "achOut 0.5s ease-in forwards";
    setTimeout(() => el.remove(), 500);
  }, 3000);
}
