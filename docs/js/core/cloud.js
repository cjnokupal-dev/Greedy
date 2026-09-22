// GREEDY — cloud save client
const API = "";  // same-origin

async function post(path, body) {
  const r = await fetch(API + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return r.json();
}

export const Cloud = {
  userId: null,

  async register(username, password) {
    const r = await post("/api/register", { username, password });
    if (r.ok) this.userId = r.user_id;
    return r;
  },

  async login(username, password) {
    const r = await post("/api/login", { username, password });
    if (r.ok) this.userId = r.user_id;
    return r;
  },

  async upload(payload) {
    if (!this.userId) return { error: "not_logged_in" };
    return post("/api/save", { user_id: this.userId, payload });
  },

  async download() {
    if (!this.userId) return { error: "not_logged_in" };
    const r = await fetch(`/api/load?user_id=${this.userId}`);
    return r.json();
  },

  async submitScore(day, netWorth, prestige) {
    if (!this.userId) return { error: "not_logged_in" };
    return post("/api/score", {
      user_id: this.userId, day, net_worth: netWorth, prestige
    });
  },

  async leaderboard() {
    const r = await fetch("/api/leaderboard");
    return r.json();
  }
};
