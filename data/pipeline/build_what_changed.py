"""Build a current What Changed feed from the latest validated exchange records."""
from __future__ import annotations
import datetime as dt,json,hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/"data/public/what-changed.json"
def load(p,d):
    try:return json.loads(p.read_text(encoding="utf-8"))
    except:return d
def main():
    u=load(ROOT/"data/generated/nse-equity-universe.json",{"companies":[]})
    a=load(ROOT/"data/generated/nse-announcements.json",{"records":{}})
    i=load(ROOT/"data/generated/nse-integrated-financials.json",{"records":{}})
    names={x["nse_symbol"]:x["legal_name"] for x in u.get("companies",[])}
    items=[]
    for s,d in a.get("records",{}).items():
        for x in d.get("items",[])[:10]:
            subject=x.get("subject") or "Corporate announcement"
            digest=hashlib.sha1(subject.encode("utf-8")).hexdigest()[:10]
            items.append({"id":f"ann-{s}-{x.get('date')}-{digest}",
                          "symbol":s,"title":f"{names.get(s,s)}: {subject}",
                          "summary":"Recent NSE corporate announcement captured by the automated evidence feed.",
                          "date":x.get("date"),"classification":"exchange-announcement",
                          "source_ids":["nse-announcements"],"requires_human_review":False})
    for s,d in i.get("records",{}).items():
        rows=d.get("rows",[])
        if rows:
            x=rows[0]
            period=x.get("periodEndDate") or x.get("quarterEndDate") or x.get("period_ended") or "latest"
            items.append({"id":f"filing-{s}-{period}","symbol":s,
                          "title":f"{names.get(s,s)}: latest integrated financial filing",
                          "summary":f"NSE Integrated Filing record for period {period} is in the current source set.",
                          "date":x.get("broadcastDate") or x.get("broadcast_date") or x.get("sort_date"),
                          "classification":"financial-filing","source_ids":["nse-integrated-financials"],
                          "requires_human_review":False})
    items.sort(key=lambda x:str(x.get("date") or ""),reverse=True)
    OUT.parent.mkdir(parents=True,exist_ok=True)
    OUT.write_text(json.dumps({"generated_at":dt.datetime.now(dt.timezone.utc).isoformat(),
                               "status":"current-feed","count":len(items),"items":items[:100]},indent=2,ensure_ascii=False)+"\n")
    print("What Changed items:",min(100,len(items)))
if __name__=="__main__":main()
