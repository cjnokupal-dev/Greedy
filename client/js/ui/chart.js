// GREEDY — live wealth chart
let points = [];
let canvas = null;
let ctx = null;

const MAX_POINTS = 200;

export function initChart() {
  canvas = document.getElementById("wealth-chart");
  if (!canvas) return;
  ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
}

export function pushPoint(money) {
  points.push({ t: Date.now(), m: money });
  if (points.length > MAX_POINTS) points.shift();
}

export function renderChart() {
  if (!canvas || !ctx) initChart();
  if (!canvas || !ctx) return;

  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  if (points.length < 2) return;

  const values = points.map(p => Math.max(0, p.m));
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const range = Math.max(1, maxV - minV);

  // grid
  ctx.strokeStyle = "rgba(0,212,255,0.06)";
  ctx.lineWidth = 1;
  for (let y = 0; y < H; y += H / 4) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  // line
  ctx.beginPath();
  const stepX = W / (MAX_POINTS - 1);
  const offsetX = (MAX_POINTS - points.length) * stepX;
  for (let i = 0; i < points.length; i++) {
    const x = offsetX + i * stepX;
    const y = H - ((values[i] - minV) / range) * (H - 6) - 3;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = "#00ff9d";
  ctx.lineWidth = 1.5;
  ctx.shadowColor = "#00ff9d";
  ctx.shadowBlur = 6;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // fill
  ctx.lineTo(W, H);
  ctx.lineTo(offsetX, H);
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, "rgba(0,255,157,0.25)");
  grad.addColorStop(1, "rgba(0,255,157,0)");
  ctx.fillStyle = grad;
  ctx.fill();

  // current dot
  const lastX = W - stepX;
  const lastY = H - ((values[values.length - 1] - minV) / range) * (H - 6) - 3;
  ctx.beginPath();
  ctx.arc(lastX, lastY, 3, 0, Math.PI * 2);
  ctx.fillStyle = "#00ff9d";
  ctx.shadowColor = "#00ff9d";
  ctx.shadowBlur = 12;
  ctx.fill();
  ctx.shadowBlur = 0;
}
