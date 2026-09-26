import sqlite3, json, os, re

con = sqlite3.connect(r"C:\Users\Vaidya\AppData\Roaming\Cursor\User\globalStorage\state.vscdb")
cur = con.cursor()

# other composers
rows = cur.execute("SELECT composerId, name, createdAt, value FROM composerHeaders").fetchall()
print("COMPOSERS")
for cid, name, created, val in rows:
    print(cid, name, created)

# extract text from large bubble
bid = "bubbleId:d8ea6492-7ebb-45ca-a192-f278dcf524a3:fe713405-e7d3-4340-9045-b19be92a85aa"
v = json.loads(cur.execute("SELECT value FROM cursorDiskKV WHERE key=?", (bid,)).fetchone()[0])
print("\nlarge bubble keys", v.keys())
print("text len", len(v.get("text") or ""))
print((v.get("text") or "")[:4000])
print("\n--- tool results snippet ---")
tr = v.get("toolResults") or []
print("toolResults n", len(tr))
print("capabilityType", v.get("capabilityType"))

# search composer.content for markdown-like plan (starts with #)
keys = cur.execute("SELECT key, value FROM cursorDiskKV WHERE key LIKE 'composer.content.%'").fetchall()
print("\ncomposer.content scanning", len(keys))
for k, val in keys:
    if isinstance(val, bytes):
        try:
            val = val.decode("utf-8")
        except Exception:
            continue
    if not isinstance(val, str):
        continue
    if "Phase" in val and ("backend" in val.lower() or "frontend" in val.lower() or "##" in val):
        print("HIT", k, len(val))
        print(val[:1500])
        print("====")

# search agentKv blobs for markdown plan
print("\nscanning agentKv blobs for markdown phases...")
rows = cur.execute("SELECT key, value FROM cursorDiskKV WHERE key LIKE 'agentKv:blob:%'").fetchall()
print("n blobs", len(rows))
n = 0
for k, val in rows:
    if isinstance(val, bytes):
        try:
            val = val.decode("utf-8")
        except Exception:
            continue
    if not isinstance(val, str):
        continue
    if "Phase 6" in val and ("location_id" in val or "venues" in val or "## Phase" in val or "TODO" in val):
        n += 1
        if n <= 8:
            print("BLOB HIT", k, len(val))
            # find phase 6 context
            idx = val.find("Phase 6")
            print(val[max(0, idx-400):idx+2500])
            print("====")
print("total blob hits", n)
