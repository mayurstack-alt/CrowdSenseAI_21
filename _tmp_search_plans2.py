import sqlite3
import json

con = sqlite3.connect(r"C:\Users\Vaidya\AppData\Roaming\Cursor\User\globalStorage\state.vscdb")
cur = con.cursor()

plan_id = "730c7294-5e76-429c-b1cf-64951f9e1066"

# keys containing plan id
rows = cur.execute(
    "SELECT key, length(value) FROM cursorDiskKV WHERE key LIKE ? LIMIT 50",
    (f"%{plan_id}%",),
).fetchall()
print("keys with plan id:", rows)

rows = cur.execute(
    "SELECT key, length(value) FROM ItemTable WHERE key LIKE ? LIMIT 50",
    (f"%{plan_id}%",),
).fetchall()
print("item keys with plan id:", rows)

# search for plan content
needles = [
    "%730c7294%",
    "%Phase 6 implementation%",
    "%phase 6%",
    "%Phase 6%",
    "%hasPendingPlan%",
]

for n in ["%plan%", "%Plan%"]:
    keys = cur.execute(
        "SELECT key FROM ItemTable WHERE key LIKE ? LIMIT 100", (n,)
    ).fetchall()
    print("ItemTable keys like", n, keys)

keys = cur.execute(
    "SELECT key FROM cursorDiskKV WHERE key LIKE '%plan%' LIMIT 200"
).fetchall()
print("cursorDiskKV keys like plan, count", len(keys))
for k in keys[:80]:
    print(" ", k[0][:200])

# dump itemtable keys
print("\nALL ItemTable keys:")
for k, vlen in cur.execute("SELECT key, length(value) FROM ItemTable"):
    print(k, vlen)
