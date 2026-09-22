// GREEDY — story choice modal
export function showStoryModal(chapter, onChoice) {
  const existing = document.getElementById("story-modal");
  if (existing) existing.remove();

  const backdrop = document.createElement("div");
  backdrop.id = "story-modal";
  backdrop.style.cssText = `
    position: fixed; inset: 0;
    background: rgba(5,6,10,0.9);
    backdrop-filter: blur(8px);
    z-index: 800;
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
  `;

  const modal = document.createElement("div");
  modal.style.cssText = `
    width: 100%; max-width: 440px;
    background: linear-gradient(135deg, #0a0d16, #10141f);
    border: 1px solid var(--accent);
    border-left: 3px solid var(--accent);
    border-radius: 6px;
    padding: 24px;
    font-family: var(--font-display);
    box-shadow: 0 0 40px rgba(0,212,255,0.3);
    max-height: 90vh;
    overflow-y: auto;
  `;

  modal.innerHTML = `
    <div style="font-size:9px;letter-spacing:4px;color:var(--accent);font-weight:700;margin-bottom:8px;">◆ CHAPTER</div>
    <div style="font-size:22px;font-weight:800;letter-spacing:2px;color:#fff;margin-bottom:16px;text-shadow:0 0 20px var(--accent);">${chapter.title}</div>
    <div style="font-size:13px;line-height:1.7;color:var(--text);margin-bottom:20px;">${chapter.text}</div>
    <div id="story-choices" style="display:flex;flex-direction:column;gap:8px;"></div>
  `;

  const choicesEl = modal.querySelector("#story-choices");
  chapter.choices.forEach((c) => {
    const btn = document.createElement("button");
    btn.style.cssText = `
      padding: 14px 16px;
      background: linear-gradient(135deg, #0a0d16, #10141f);
      border: 1px solid var(--border-bright);
      border-left: 2px solid var(--accent);
      border-radius: 4px;
      text-align: left;
      color: var(--text);
      font-family: var(--font-display);
      font-size: 12px;
      letter-spacing: 0.5px;
    `;
    const effectTxt = Object.entries(c.effect || {}).map(([k, v]) => {
      const map = { money: "$", rep: "rep ", heat: "heat ", greed: "greed ", income: "income ×" };
      return (map[k] || k + " ") + (typeof v === "number" && v > 0 ? "+" : "") + v;
    }).join(" · ");
    btn.innerHTML = `<div style="font-weight:700;">${c.text}</div><div style="font-size:10px;color:var(--text-dim);margin-top:4px;">${effectTxt}</div>`;
    btn.onclick = () => {
      backdrop.remove();
      onChoice(c.id);
    };
    choicesEl.appendChild(btn);
  });

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);
}
