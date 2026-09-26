import sqlite3
import os

paths = [
    r"C:\Users\Vaidya\AppData\Roaming\Cursor\User\globalStorage\state.vscdb",
    r"C:\Users\Vaidya\AppData\Roaming\Cursor\User\globalStorage\conversation-search.db",
]

for p in paths:
    print("=" * 80)
    print("DB:", p, "exists", os.path.exists(p))
    if not os.path.exists(p):
        continue
    con = sqlite3.connect(p)
    cur = con.cursor()
    tables = cur.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()
    print("tables:", tables)
    for (t,) in tables:
        cols = cur.execute(f"PRAGMA table_info({t})").fetchall()
        print("  ", t, [c[1] for c in cols])
        try:
            n = cur.execute(f"SELECT COUNT(*) FROM {t}").fetchone()[0]
            print("   count", n)
        except Exception as e:
            print("   count err", e)
    # search ItemTable-like
    for (t,) in tables:
        cols = [c[1] for c in cur.execute(f"PRAGMA table_info({t})").fetchall()]
        for col in cols:
            try:
                rows = cur.execute(
                    f"SELECT {col} FROM {t} WHERE CAST({col} AS TEXT) LIKE ? LIMIT 5",
                    ("%Phase 6%",),
                ).fetchall()
                if rows:
                    print("HIT", t, col, "n=", len(rows))
                    for r in rows:
                        s = str(r[0])
                        print(s[:2000])
                        print("---")
            except Exception:
                pass
            try:
                rows = cur.execute(
                    f"SELECT {col} FROM {t} WHERE CAST({col} AS TEXT) LIKE ? LIMIT 5",
                    ("%phase 6%",),
                ).fetchall()
                if rows:
                    print("HIT2", t, col)
                    for r in rows:
                        print(str(r[0])[:2000])
            except Exception:
                pass
    con.close()
