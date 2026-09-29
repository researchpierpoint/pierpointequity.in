from compliance.release_gate import evaluate

def test_blocks_recommendation_language():
    r = evaluate("Company earnings improved. Buy the stock.",
                  all_material_facts_sourced=True)
    assert r.status == "blocked"

def test_allows_sourced_factual_update():
    r = evaluate("Revenue increased year over year.",
                  all_material_facts_sourced=True)
    assert r.status == "publishable"

def test_blocks_unsourced_material_fact():
    r = evaluate("Revenue increased materially.",
                  all_material_facts_sourced=False)
    assert r.status == "blocked"
