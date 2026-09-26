import sqlite3, json, re

con = sqlite3.connect(r"C:\Users\Vaidya\AppData\Roaming\Cursor\User\globalStorage\state.vscdb")
cur = con.cursor()

cid = "d8ea6492-7ebb-45ca-a192-f278dcf524a3"

keys = cur.execute(
    "SELECT key, length(value) FROM cursorDiskKV WHERE key LIKE ? ORDER BY key",
    (f"%{cid}%",),
).fetchall()
print(f"keys for composer: {len(keys)}")
for k, l in keys:
    print(k[:180], l)

# dump applicationUser for plans
val = cur.execute(
    "SELECT value FROM ItemTable WHERE key=?",
    ("src.vs.platform.reactivestorage.browser.reactiveStorageServiceImpl.persistentStorage.applicationUser",),
).fetchone()
if val:
    s = val[0]
    if isinstance(s, bytes):
        s = s.decode("utf-8", "replace")
    print("\nSearching applicationUser for plan...")
    idx = s.lower().find("phase 6")
    print("idx", idx)
    if idx >= 0:
        print(s[max(0, idx-500):idx+4000])
    # also search 730c7294
    idx = s.find("730c7294")
    print("id idx", idx)
    if idx >= 0:
        print(s[max(0, idx-200):idx+2000])

# search all keys containing 'composerPlan' or similar prefixes
prefixes = ["plan", "composerPlan", "aiPlan", "agentPlan"]
all_keys = cur.execute("SELECT key FROM cursorDiskKV").fetchall()
interesting = [k[0] for k in all_keys if "plan" in k[0].lower() or "730c" in k[0] or "Phase" in k[0]]
print("\ninteresting kv keys", len(interesting))
for k in interesting[:100]:
    print(" ", k[:250])

# key prefixes histogram
from collections import Counter
c = Counter()
for (k,) in all_keys:
    c[k.split(":")[0][:60]] += 1
print("\nkey prefixes:")
for p, n in c.most_common(40):
    print(n, p)
