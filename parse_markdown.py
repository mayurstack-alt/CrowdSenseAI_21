import json

with open("ML/Crowd.ipynb", "r", encoding="utf-8") as f:
    notebook = json.load(f)

for cell in notebook.get("cells", []):
    if cell.get("cell_type") == "markdown":
        source = "".join(cell.get("source", []))
        if "Peak" in source or "Hour" in source or "hour" in source:
            print("--- MARKDOWN ---")
            print(source)
