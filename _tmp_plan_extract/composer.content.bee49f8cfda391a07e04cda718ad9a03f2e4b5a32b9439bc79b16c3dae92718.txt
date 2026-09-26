import sqlite3, json, os

con = sqlite3.connect(r"C:\Users\Vaidya\AppData\Roaming\Cursor\User\globalStorage\state.vscdb")
cur = con.cursor()
cid = "d8ea6492-7ebb-45ca-a192-f278dcf524a3"
val = cur.execute("SELECT value FROM cursorDiskKV WHERE key=?", (f"composerData:{cid}",)).fetchone()[0]
data = json.loads(val)

# dump context
ctx = data.get("context")
print("context type", type(ctx))
if isinstance(ctx, dict):
    print("context keys", ctx.keys())
    for k, v in ctx.items():
        s = json.dumps(v, default=str)
        print(" ", k, "len", len(s))
        if "plan" in k.lower() or "plan" in s.lower()[:500] or "730c" in s:
            print("   SAMPLE", s[:3000])

# capabilities
caps = data.get("capabilities")
print("\ncapabilities type", type(caps), "len", len(caps) if hasattr(caps, "__len__") else None)
if isinstance(caps, list):
    for c in caps[:20]:
        print(c if not isinstance(c, dict) else {k: c[k] for k in list(c)[:8]})

# search whole composerData for plan
s = json.dumps(data)
print("\nplan mentions", s.lower().count("plan"))
idx = s.find("730c7294")
print("plan id idx", idx)
idx2 = s.lower().find("phase 6 implementation")
print("name idx", idx2)
if idx2 >= 0:
    print(s[max(0,idx2-300):idx2+1500])

# look at conversationMap
cm = data.get("conversationMap")
print("\nconversationMap type", type(cm))
if isinstance(cm, dict):
    print("map keys sample", list(cm.keys())[:10], "n", len(cm))
    # find plan bubbles
    for k, v in cm.items():
        vs = json.dumps(v, default=str)
        if "plan" in vs.lower() and ("Phase" in vs or "phase" in vs):
            print("MAP HIT", k, vs[:1500])
            print("---")

# composer.content keys containing plan-like
keys = cur.execute("SELECT key, length(value) FROM cursorDiskKV WHERE key LIKE 'composer.content.%'").fetchall()
print("\ncomposer.content count", len(keys))
# search values for Phase 6 implementation plan
hits = cur.execute(
    "SELECT key, length(value) FROM cursorDiskKV WHERE typeof(value)='text' AND value LIKE '%Phase 6 implementation%' LIMIT 20"
).fetchall()
print("text hits", hits)
hits = cur.execute(
    "SELECT key, length(value) FROM cursorDiskKV WHERE typeof(value)='blob' AND CAST(value AS TEXT) LIKE '%Phase 6 implementation%' LIMIT 20"
).fetchall()
print("blob hits", hits)

hits = cur.execute(
    "SELECT key, length(value) FROM cursorDiskKV WHERE CAST(value AS TEXT) LIKE '%730c7294%' LIMIT 20"
).fetchall()
print("id hits", hits)

# agentKv
ak = cur.execute("SELECT key FROM cursorDiskKV WHERE key LIKE 'agentKv%' LIMIT 30").fetchall()
print("agentKv sample", ak[:15])
