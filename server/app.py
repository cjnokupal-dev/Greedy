from http.server import SimpleHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs
import json, os, sqlite3, time, hashlib, secrets

PORT = int(os.environ.get("PORT", 8000))
ROOT = os.path.dirname(os.path.abspath(__file__))
CLIENT_DIR = os.path.join(ROOT, "..", "docs")
DB_PATH = os.path.join(ROOT, "db", "greedy.db")

# ---------- DB ----------
def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    con = sqlite3.connect(DB_PATH)
    con.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            pw_hash TEXT NOT NULL,
            salt TEXT NOT NULL,
            created_at INTEGER
        );
        CREATE TABLE IF NOT EXISTS saves (
            user_id INTEGER PRIMARY KEY,
            payload TEXT NOT NULL,
            updated_at INTEGER,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );
        CREATE TABLE IF NOT EXISTS bans (
            user_id INTEGER PRIMARY KEY,
            reason TEXT,
            banned_at INTEGER
        );
        CREATE TABLE IF NOT EXISTS scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            day INTEGER,
            net_worth REAL,
            prestige INTEGER,
            created_at INTEGER
        );
    """)
    con.commit()
    con.close()

def hash_pw(pw, salt):
    return hashlib.sha256((pw + salt).encode()).hexdigest()

def db():
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    return con

# ---------- API ----------
def api_register(data):
    u = (data.get("username") or "").strip()
    p = data.get("password") or ""
    if not u or not p: return 400, {"error": "missing_fields"}
    con = db()
    try:
        salt = secrets.token_hex(16)
        con.execute("INSERT INTO users (username, pw_hash, salt, created_at) VALUES (?,?,?,?)",
                    (u, hash_pw(p, salt), salt, int(time.time())))
        con.commit()
        return 200, {"ok": True, "user_id": con.execute("SELECT last_insert_rowid() AS id").fetchone()["id"]}
    except sqlite3.IntegrityError:
        return 400, {"error": "username_taken"}
    finally:
        con.close()

def api_login(data):
    u = (data.get("username") or "").strip()
    p = data.get("password") or ""
    con = db()
    row = con.execute("SELECT * FROM users WHERE username=?", (u,)).fetchone()
    con.close()
    if not row: return 400, {"error": "invalid_credentials"}
    if hash_pw(p, row["salt"]) != row["pw_hash"]:
        return 400, {"error": "invalid_credentials"}
    token = secrets.token_hex(24)
    return 200, {"ok": True, "user_id": row["id"], "token": token}

def api_save(data):
    uid = data.get("user_id")
    payload = data.get("payload")
    if not uid or payload is None: return 400, {"error": "missing_fields"}
    con = db()
    con.execute("INSERT INTO saves (user_id, payload, updated_at) VALUES (?,?,?) "
                "ON CONFLICT(user_id) DO UPDATE SET payload=excluded.payload, updated_at=excluded.updated_at",
                (uid, json.dumps(payload), int(time.time())))
    con.commit()
    con.close()
    return 200, {"ok": True}

def api_load(uid):
    con = db()
    row = con.execute("SELECT payload, updated_at FROM saves WHERE user_id=?", (uid,)).fetchone()
    con.close()
    if not row: return 200, {"ok": True, "payload": None}
    return 200, {"ok": True, "payload": json.loads(row["payload"]), "updated_at": row["updated_at"]}

def api_submit_score(data):
    uid = data.get("user_id")
    day = data.get("day")
    nw = data.get("net_worth")
    prestige = data.get("prestige", 0)
    if uid is None or day is None or nw is None:
        return 400, {"error": "missing_fields"}
    con = db()
    con.execute("INSERT INTO scores (user_id, day, net_worth, prestige, created_at) VALUES (?,?,?,?,?)",
                (uid, day, nw, prestige, int(time.time())))
    con.commit()
    con.close()
    return 200, {"ok": True}

def api_leaderboard():
    con = db()
    rows = con.execute("""
        SELECT u.username, s.day, s.net_worth, s.prestige
        FROM scores s JOIN users u ON u.id = s.user_id
        ORDER BY s.net_worth DESC LIMIT 50
    """).fetchall()
    con.close()
    return 200, {"ok": True, "scores": [dict(r) for r in rows]}


# ---------- ADMIN ----------
import os as _os
ADMIN_KEY = _os.environ.get("GREEDY_ADMIN_KEY", "dev_admin_key")

def _check_admin(data):
    return data.get("admin_key") == ADMIN_KEY

def api_admin_list(data):
    if not _check_admin(data): return 403, {"error": "forbidden"}
    con = db()
    users = con.execute("""
        SELECT u.id, u.username, u.created_at,
               (SELECT COUNT(*) FROM scores WHERE user_id = u.id) AS score_count,
               (SELECT MAX(net_worth) FROM scores WHERE user_id = u.id) AS best_nw,
               (SELECT MAX(day) FROM scores WHERE user_id = u.id) AS best_day
        FROM users u ORDER BY u.id
    """).fetchall()
    bans = con.execute("SELECT user_id, reason, banned_at FROM bans").fetchall()
    ban_map = {b["user_id"]: {"reason": b["reason"], "at": b["banned_at"]} for b in bans}
    con.close()
    out = []
    for u in users:
        d = dict(u)
        d["banned"] = ban_map.get(u["id"])
        out.append(d)
    return 200, {"ok": True, "users": out}

def api_admin_ban(data):
    if not _check_admin(data): return 403, {"error": "forbidden"}
    uid = data.get("user_id")
    reason = data.get("reason", "violation")
    if uid is None: return 400, {"error": "missing_user_id"}
    con = db()
    con.execute("INSERT OR REPLACE INTO bans (user_id, reason, banned_at) VALUES (?,?,?)",
                (uid, reason, int(time.time())))
    con.commit()
    con.close()
    return 200, {"ok": True}

def api_admin_unban(data):
    if not _check_admin(data): return 403, {"error": "forbidden"}
    uid = data.get("user_id")
    if uid is None: return 400, {"error": "missing_user_id"}
    con = db()
    con.execute("DELETE FROM bans WHERE user_id=?", (uid,))
    con.commit()
    con.close()
    return 200, {"ok": True}

def api_admin_delete_user(data):
    if not _check_admin(data): return 403, {"error": "forbidden"}
    uid = data.get("user_id")
    if uid is None: return 400, {"error": "missing_user_id"}
    con = db()
    con.execute("DELETE FROM scores WHERE user_id=?", (uid,))
    con.execute("DELETE FROM saves WHERE user_id=?", (uid,))
    con.execute("DELETE FROM bans WHERE user_id=?", (uid,))
    con.execute("DELETE FROM users WHERE id=?", (uid,))
    con.commit()
    con.close()
    return 200, {"ok": True}

def api_admin_clear_leaderboard(data):
    if not _check_admin(data): return 403, {"error": "forbidden"}
    con = db()
    con.execute("DELETE FROM scores")
    con.commit()
    con.close()
    return 200, {"ok": True}

def api_admin_stats(data):
    if not _check_admin(data): return 403, {"error": "forbidden"}
    con = db()
    users = con.execute("SELECT COUNT(*) AS c FROM users").fetchone()["c"]
    bans = con.execute("SELECT COUNT(*) AS c FROM bans").fetchone()["c"]
    saves = con.execute("SELECT COUNT(*) AS c FROM saves").fetchone()["c"]
    scores = con.execute("SELECT COUNT(*) AS c FROM scores").fetchone()["c"]
    top = con.execute("""
        SELECT u.username, MAX(s.net_worth) AS nw
        FROM scores s JOIN users u ON u.id = s.user_id
        GROUP BY u.id ORDER BY nw DESC LIMIT 5
    """).fetchall()
    con.close()
    return 200, {"ok": True, "stats": {
        "users": users, "bans": bans, "saves": saves, "scores": scores,
        "top": [dict(r) for r in top]
    }}

# ---------- Router ----------
class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=CLIENT_DIR, **kwargs)

    def log_message(self, *a): pass

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def _json(self, code, obj):
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(obj).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_POST(self):
        u = urlparse(self.path)
        length = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(length).decode() if length else "{}"
        try: data = json.loads(raw)
        except: data = {}

        if u.path == "/api/register":    code, obj = api_register(data)
        elif u.path == "/api/login":     code, obj = api_login(data)
        elif u.path == "/api/save":      code, obj = api_save(data)
        elif u.path == "/api/score":     code, obj = api_submit_score(data)
        elif u.path == "/api/admin/list":         code, obj = api_admin_list(data)
        elif u.path == "/api/admin/ban":          code, obj = api_admin_ban(data)
        elif u.path == "/api/admin/unban":        code, obj = api_admin_unban(data)
        elif u.path == "/api/admin/delete":       code, obj = api_admin_delete_user(data)
        elif u.path == "/api/admin/clear-scores": code, obj = api_admin_clear_leaderboard(data)
        elif u.path == "/api/admin/stats":        code, obj = api_admin_stats(data)
        else: code, obj = 404, {"error": "not_found"}
        self._json(code, obj)

    def do_GET(self):
        u = urlparse(self.path)
        if u.path == "/api/leaderboard":
            code, obj = api_leaderboard(); return self._json(code, obj)
        if u.path == "/api/load":
            q = parse_qs(u.query)
            uid = q.get("user_id", [None])[0]
            if not uid: return self._json(400, {"error": "missing_user_id"})
            code, obj = api_load(int(uid)); return self._json(code, obj)
        return super().do_GET()

if __name__ == "__main__":
    init_db()
    print(f"GREEDY running at http://localhost:{PORT}")
    HTTPServer(("0.0.0.0", PORT), Handler).serve_forever()
