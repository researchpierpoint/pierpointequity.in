"""Build the public search index from the validated NSE universe.

Only identity/discoverability fields are emitted here. No prices, recommendations,
or unsupported fundamentals are fabricated.
"""
import json
from datetime import date
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]
source=ROOT/"data/generated/nse-equity-universe.json"
target=ROOT/"data/public/search-index.json"
universe=json.loads(source.read_text(encoding="utf-8"))
items=[
 {"type":"research","name":"What Changed?","keywords":["changes","events","updates","research"],"url":"what-changed.html","description":"Material evidence changes tracked by PirePoint."},
 {"type":"methodology","name":"PirePoint Methodology","keywords":["methodology","evidence","sources","uncertainty"],"url":"methodology.html","description":"How PirePoint separates evidence, calculations and interpretation."},
]
for x in universe.get("companies",[]):
    symbol=x["nse_symbol"]
    name=x["legal_name"]
    items.append({
        "type":"company",
        "name":name,
        "symbol":symbol,
        "isin":x["isin"],
        "keywords":[symbol.lower(), name.lower()],
        "url":f"company.html?symbol={symbol}",
        "description":"NSE listed-company identity record; verified financial intelligence is added separately when evidence is available."
    })
payload={"version":"2.0","updated_at":date.today().isoformat(),"source":"NSE equity master","source_as_of":universe.get("as_of"),"item_count":len(items),"items":items}
target.parent.mkdir(parents=True,exist_ok=True)
target.write_text(json.dumps(payload,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
print(f"Built {len(items)} public search items.")
