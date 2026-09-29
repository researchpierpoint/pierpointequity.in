"""PirePoint publication gate.

The gate is intentionally conservative: material uncertainty or regulated-style
language stops publication instead of being silently rewritten.
"""
from __future__ import annotations
from dataclasses import dataclass

@dataclass
class GateResult:
    status: str
    reasons: list[str]

BLOCKED_TERMS = (
    "buy", "sell", "hold", "target price", "price target",
    "guaranteed return", "sure return", "personalised", "personalized"
)

def evaluate(text: str, *, all_material_facts_sourced: bool,
             has_human_review: bool = False) -> GateResult:
    reasons = []
    lowered = text.lower()

    if not all_material_facts_sourced:
        reasons.append("material fact lacks verified source")
    if any(term in lowered for term in BLOCKED_TERMS):
        reasons.append("recommendation/personalised-or-guarantee language detected")
    if not has_human_review and "regulatory" in lowered:
        reasons.append("regulatory-sensitive wording requires review")

    if reasons:
        return GateResult("blocked", reasons)
    return GateResult("publishable", [])

def release_or_stop(text: str, *, all_material_facts_sourced: bool,
                    has_human_review: bool = False) -> dict:
    result = evaluate(text, all_material_facts_sourced=all_material_facts_sourced,
                      has_human_review=has_human_review)
    return {"status": result.status, "reasons": result.reasons}
