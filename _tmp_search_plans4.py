import sqlite3, json, os

con = sqlite3.connect(r"C:\Users\Vaidya\AppData\Roaming\Cursor\User\globalStorage\state.vscdb")
cur = con.cursor()
cid = "d8ea6492-7ebb-45ca-a192-f278dcf524a3"

out = r"c:\Users\Vaidya\OneDrive\Desktop\projects\CrowdSense\CrowdSenseAI_21\_tmp_plan_extract"
os.makedirs(out, exist_ok=True)

val = cur.execute("SELECT value FROM cursorDiskKV WHERE key=?", (f"composerData:{cid}",)).fetchone()[0]
if isinstance(val, bytes):
    try:
        val = val.decode("utf-8")
    except Exception:
        pass

path = os.path.join(out, "composerData.txt")
with open(path, "w", encoding="utf-8", errors="replace") as f:
    f.write(val if isinstance(val, str) else repr(val)[:200000])
print("composerData written", len(val) if hasattr(val, "__len__") else type(val))

# parse json if possible
try:
    data = json.loads(val)
    print("json keys", list(data.keys())[:40])
    with open(os.path.join(out, "composerData.json"), "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, default=str)
    # print headers
    headers = data.get("fullConversationHeadersOnly") or data.get("conversationHeaders") or []
    print("headers", len(headers))
    for h in headers:
        if isinstance(h, dict):
            preview = (h.get("text") or h.get("grouping", {}).get("textPreview") or "")[:180]
            print(h.get("type"), h.get("bubbleId", "")[:8], preview)
except Exception as e:
    print("json parse fail", e)
    s = val if isinstance(val, str) else str(val)
    for needle in ["Phase 6", "phase 6", "## ", "todos", "frontend"]:
        print(needle, s.lower().find(needle.lower()))

# extract user bubbles (type 1)
rows = cur.execute(
    "SELECT key, value FROM cursorDiskKV WHERE key LIKE ?",
    (f"bubbleId:{cid}:%",),
).fetchall()
print("bubbles", len(rows))
user_msgs = []
for k, v in rows:
    if isinstance(v, bytes):
        try:
            v = v.decode("utf-8")
        except Exception:
            v = v.decode("utf-8", "replace")
    try:
        obj = json.loads(v)
    except Exception:
        continue
    t = obj.get("type")
    text = obj.get("text") or ""
    if t == 1 or (text and len(text) > 40 and "Phase" in text):
        user_msgs.append((obj.get("createdAt"), t, text[:5000]))

print("candidate msgs", len(user_msgs))
for created, t, text in sorted(user_msgs, key=lambda x: x[0] or ""):
    print("=" * 60)
    print(created, "type", t)
    print(text[:3000])
