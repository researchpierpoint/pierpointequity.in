from data.pipeline.change_detector import detect_changes, materiality

def test_detects_material_change():
    old={"facts":[{"field":"pat","value":100,"as_of":"2025-03-31"}]}
    new={"facts":[{"field":"pat","value":120,"as_of":"2026-03-31"}]}
    changes=detect_changes(old,new)
    assert changes[0]["kind"]=="changed"
    assert materiality(changes)=="high"
