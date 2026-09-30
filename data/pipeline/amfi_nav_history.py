from __future__ import annotations
import json
from datetime import date
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]
NAV=ROOT/"data/generated/amfi-nav.json"
OUT=ROOT/"data/generated/amfi-nav-history.json"

def main():
    nav=json.loads(NAV.read_text(encoding="utf-8"))
    hist=json.loads(OUT.read_text(encoding="utf-8")) if OUT.exists() else {"version":"1.0","snapshots":[]}
    today=nav.get("as_of") or date.today().isoformat()
    if not any(x.get("as_of")==today for x in hist["snapshots"]):
        hist["snapshots"].append({
            "as_of":today,
            "source":nav.get("source"),
            "count":nav.get("count"),
            "funds":nav.get("funds",[])
        })
    hist["snapshots"]=hist["snapshots"][-30:]
    hist["latest_as_of"]=today
    hist["snapshot_count"]=len(hist["snapshots"])
    OUT.write_text(json.dumps(hist,ensure_ascii=False,separators=(",",":"))+"\n",encoding="utf-8")
    print("AMFI NAV history snapshots:",len(hist["snapshots"]),"latest",today)
if __name__=="__main__": main()
