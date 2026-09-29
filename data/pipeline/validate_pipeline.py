"""Fail-closed validation for PirePoint's public data foundation."""
from __future__ import annotations
import json, pathlib, sys

ROOT=pathlib.Path(__file__).resolve().parents[2]
errors=[]

def load(path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as e:
        errors.append(f"{path}: invalid JSON: {e}")
        return None

schema=load(ROOT/"data/schema/company.schema.json")
universe=load(ROOT/"data/universe/company-master.json")
policy=load(ROOT/"monitoring/monitor-policy.json")

for p in ["data/schema/company-page.schema.json","data/pipeline/universe-rules.json","data/pipeline/source-registry.json"]:
    if load(ROOT/p) is None:
        pass

if schema is None or universe is None or policy is None:
    pass

for required in [
    "data/README.md","research/README.md","compliance/README.md",
    "monitoring/README.md","data/sources/registry.json"
]:
    if not (ROOT/required).exists():
        errors.append(f"Missing required foundation file: {required}")

if errors:
    print("\n".join(errors))
    sys.exit(1)

print("PirePoint data foundation validation: PASS")
