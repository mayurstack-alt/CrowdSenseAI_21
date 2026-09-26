import json

with open("ML/Crowd.ipynb", "r", encoding="utf-8") as f:
    notebook = json.load(f)

for cell in notebook.get("cells", []):
    if cell.get("cell_type") == "code":
        source = "".join(cell.get("source", []))
        if "Peak" in source:
            print("--- CODE ---")
            print(source)
