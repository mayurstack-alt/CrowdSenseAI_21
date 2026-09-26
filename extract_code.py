import json

with open("ML/Crowd.ipynb", "r", encoding="utf-8") as f:
    notebook = json.load(f)

with open("notebook_source.py", "w", encoding="utf-8") as out:
    for cell in notebook.get("cells", []):
        if cell.get("cell_type") == "code":
            source = "".join(cell.get("source", []))
            out.write(source)
            out.write("\n\n")
