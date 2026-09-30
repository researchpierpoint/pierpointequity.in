"""Build the public search index from the validated NSE universe.

Only identity/discoverability fields are emitted here. No prices, recommendations,
or unsupported fundamentals are fabricated.
"""
import json
import re
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
# Index every published guide automatically so site search can answer educational queries.
guides_dir=ROOT/"guides"
for guide_path in sorted(guides_dir.glob("*.html")):
    html=guide_path.read_text(encoding="utf-8", errors="ignore")
    title_match=re.search(r"<h1>(.*?)</h1>", html, re.I|re.S)
    desc_match=re.search(r'<meta name="description" content="([^"]+)"', html, re.I)
    title=re.sub("<[^>]+>","",title_match.group(1)).strip() if title_match else guide_path.stem.replace("-"," ").title()
    desc=desc_match.group(1).strip() if desc_match else "Indian stock-market education guide from PirePoint Equity."
    slug_words=guide_path.stem.replace("-"," ").lower().split()
    items.append({"type":"guide","name":title,"keywords":slug_words+[title.lower(),"guide","indian stock market","investing"],"url":f"guides/{guide_path.name}","description":desc})

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
