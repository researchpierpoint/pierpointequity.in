"""Optional local builder for a guide search index. The public site does not depend on live market data."""
from pathlib import Path
import json,re
ROOT=Path(__file__).resolve().parents[2]
items=[]
for p in sorted((ROOT/"guides").glob("*.html")):
    s=p.read_text(encoding="utf-8",errors="ignore")
    t=re.search(r"<h1>(.*?)</h1>",s,re.S|re.I)
    d=re.search(r'<meta name="description" content="([^"]+)"',s,re.I)
    items.append({"title":re.sub("<[^>]+>","",t.group(1)).strip() if t else p.stem.replace("-"," ").title(),"description":d.group(1) if d else "Stock-market guide","url":f"guides/{p.name}"})
out=ROOT/"data"/"guide-index.json";out.parent.mkdir(exist_ok=True);out.write_text(json.dumps(items,indent=2,ensure_ascii=False)+"\n",encoding="utf-8");print(f"Wrote {out}: {len(items)} guides")
