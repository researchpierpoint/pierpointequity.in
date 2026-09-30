"""Repository-wide data health and unattended-maintenance report."""
from __future__ import annotations
import datetime as dt,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
GEN=ROOT/"data/generated"
EXPECTED={
"nse-equity-universe.json":24*3600,
"nse-market-snapshot.json":6*3600,
"nse-financial-results.json":8*3600,
"nse-shareholding.json":40*24*3600,
"nse-announcements.json":8*3600,
"amfi-nav-history.json":30*3600,
"company-intelligence.json":8*3600,
"nse-integrated-financials.json":8*3600,
"nse-financial-statements.json":8*3600,
"nse-etf-snapshot.json":8*3600,
"mf-intelligence.json":36*3600,
"nse-historical-valuation.json":72*3600,
"coverage-audit.json":36*3600,
}
def load(p):
    try:return json.loads(Path(p).read_text(encoding="utf-8"))
    except:return None
def age(v):
    try:
        s=str(v)
        if len(s)==10:
            t=dt.datetime.fromisoformat(s).replace(tzinfo=dt.timezone.utc)
        else:
            t=dt.datetime.fromisoformat(s.replace("Z","+00:00"))
        return (dt.datetime.now(dt.timezone.utc)-t).total_seconds()
    except:return None
def main():
    now=dt.datetime.now(dt.timezone.utc);checks=[];missing=[]
    for name,maxage in EXPECTED.items():
        d=load(GEN/name)
        if d is None:
            checks.append({"file":name,"status":"missing","required":name not in {"amfi-nav-history.json"}})
        if name!="amfi-nav-history.json": missing.append(name)
        continue
        stamp=d.get("updated_at") or d.get("generated_at") or d.get("as_of")
        a=age(stamp);status="fresh" if a is not None and a<=maxage else "stale"
        checks.append({"file":name,"status":status,"age_hours":None if a is None else round(a/3600,2),"count":d.get("count",d.get("coverage"))})
    wc=load(ROOT/"data/public/what-changed.json")
    if wc is None:
        checks.append({"file":"data/public/what-changed.json","status":"missing"});missing.append("data/public/what-changed.json")
    else:
        a=age(wc.get("generated_at"));status="fresh" if a is not None and a<=36*3600 else "stale"
        checks.append({"file":"data/public/what-changed.json","status":status,"age_hours":None if a is None else round(a/3600,2),"count":wc.get("count")})
    ok=not missing and all(x["status"]!="missing" or x.get("file")=="amfi-nav-history.json" for x in checks)
    out={"version":"1.1","checked_at":now.isoformat(),"status":"ok" if ok else "needs_attention","checks":checks,"missing":missing}
    (GEN/"data-health.json").write_text(json.dumps(out,indent=2)+"\n",encoding="utf-8")
    print(json.dumps(out,indent=2))
    raise SystemExit(0 if ok else 1)
if __name__=="__main__":main()
