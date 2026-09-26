import sqlite3, json, os

con = sqlite3.connect(r"C:\Users\Vaidya\AppData\Roaming\Cursor\User\globalStorage\state.vscdb")
cur = con.cursor()
cid = "d8ea6492-7ebb-45ca-a192-f278dcf524a3"
data = json.loads(cur.execute("SELECT value FROM cursorDiskKV WHERE key=?", (f"composerData:{cid}",)).fetchone()[0])
print("MENTIONS")
print(json.dumps(data["context"]["mentions"], indent=2)[:8000])
print("\nextraContext")
print(json.dumps(data["context"].get("extraContext"), indent=2)[:3000])

outdir = r"c:\Users\Vaidya\OneDrive\Desktop\projects\CrowdSense\CrowdSenseAI_21\_tmp_plan_extract"
os.makedirs(outdir, exist_ok=True)

keys = [
    "composer.content.ed3ed2f490dba6625f50c654c77ecb08517986de56f249a117a35aab244bf4ff",
    "composer.content.bee49f8cfda391a07e04cda718ad9a03f2e4b5a32b9439bc79b16c3dae927180",
    "composer.content.898ba9c97a626c7db0342ceb317d43012c36c50f235ee20354316e7f89a27534",
    "bubbleId:d8ea6492-7ebb-45ca-a192-f278dcf524a3:fe713405-e7d3-4340-9045-b19be92a85aa",
    "bubbleId:d8ea6492-7ebb-45ca-a192-f278dcf524a3:0d50373d-1703-4573-a631-65a89c2e17a4",
    "bubbleId:d8ea6492-7ebb-45ca-a192-f278dcf524a3:665b86e1-7790-4de8-aefd-e3b46c64970f",
    "agentKv:blob:fd04b81aa641c114e6b3ecff8e4a3c32f3c51d47da9b4e71ac998c71dc1546a5",
    "agentKv:blob:25e8359fa259dbb07f8a85c6080d17359cb1d07c6bdbfa7988da76ac58554d6f",
]

for k in keys:
    v = cur.execute("SELECT value FROM cursorDiskKV WHERE key=?", (k,)).fetchone()
    if not v:
        print("missing", k)
        continue
    v = v[0]
    if isinstance(v, bytes):
        try:
            v = v.decode("utf-8")
        except Exception:
            v = v.decode("utf-8", "replace")
    fn = os.path.join(outdir, k.replace(":", "_")[:80] + ".txt")
    with open(fn, "w", encoding="utf-8", errors="replace") as f:
        f.write(v)
    print("wrote", fn, "len", len(v), "start", v[:120].replace("\n"," "))
