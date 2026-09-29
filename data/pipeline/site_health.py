"""Repository-wide data health and unattended-maintenance report."""
from __future__ import annotations
import datetime as dt,json,subprocess
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
}
def load(n):
 p=GEN/n
 try:return json.loads(p.read_text(encoding="utf-8"))
 except:return None
def age(v):
 try:return (dt.datetime.now(dt.timezone.utc)-dt.datetime.fromisoformat(str(v).replace("Z","+00:00"))).total_seconds()
 except:return None
def main():
 now=dt.datetime.now(dt.timezone.utc)
 checks=[]; missing=[]
 for n,maxage in EXPECTED.items():
  d=load(n)
  if d is None: checks.append({"file":n,"status":"missing"});missing.append(n);continue
  stamp=d.get("updated_at") or d.get("generated_at") or d.get("as_of")
  a=age(stamp) if stamp else None
  count=d.get("count",d.get("coverage"))
  status="fresh" if a is not None and a<=maxage else "stale"
  checks.append({"file":n,"status":status,"age_hours":None if a is None else round(a/3600,2),"count":count})
 out={"version":"1.0","checked_at":now.isoformat(),"status":"ok" if not missing and all(x["status"]=="fresh" for x in checks) else "needs_attention","checks":checks,"missing":missing}
 (GEN/"data-health.json").write_text(json.dumps(out,indent=2)+"\n",encoding="utf-8")
 print(json.dumps(out,indent=2))
 raise SystemExit(0)
if __name__=="__main__":main()
