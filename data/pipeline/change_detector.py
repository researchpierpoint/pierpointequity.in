"""Point-in-time change detection for PirePoint evidence records."""
from __future__ import annotations
from typing import Any

def index_facts(record: dict[str, Any]) -> dict[str, dict[str, Any]]:
    return {f["field"]: f for f in record.get("facts", [])}

def detect_changes(previous: dict[str, Any], current: dict[str, Any]) -> list[dict[str, Any]]:
    old = index_facts(previous)
    new = index_facts(current)
    changes = []
    for field, fact in new.items():
        prior = old.get(field)
        if prior is None:
            changes.append({"field": field, "kind": "new", "current": fact})
        elif prior.get("value") != fact.get("value") or prior.get("as_of") != fact.get("as_of"):
            changes.append({"field": field, "kind": "changed", "previous": prior, "current": fact})
    for field, prior in old.items():
        if field not in new:
            changes.append({"field": field, "kind": "missing_in_current", "previous": prior})
    return changes

def materiality(changes: list[dict[str, Any]]) -> str:
    if not changes:
        return "none"
    fields = {c["field"] for c in changes}
    high_signal = {"revenue", "ebitda", "pat", "roce", "net_cash", "debt_equity"}
    return "high" if fields & high_signal else "review"
