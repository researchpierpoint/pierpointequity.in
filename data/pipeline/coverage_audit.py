"""Audit company intelligence coverage and expose exact remaining data gaps."""
from __future__ import annotations
import datetime as dt,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
CI=ROOT/"data/generated/company-intelligence.json";OUT=ROOT/"data/generated/coverage-audit.json"
REQUIRED=["market","financial_results","integrated_filings","xbrl_financials","ownership","announcements","balance_sheet","cash_flow","roe","roce","historical_valuation"]
def main():
    try:d=json.loads(CI.read_text(encoding="utf-8"))
    except Exception:d={"records":{}}
    gaps=[];complete=0
    for s,r in d.get("records",{}).items():
        cov=r.get("sections",{}).get("coverage",{})
        missing=[k for k in REQUIRED if not cov.get(k)]
        if missing:gaps.append({"symbol":s,"missing":missing})
        else:complete+=1
    out={"version":"1.0","checked_at":dt.datetime.now(dt.timezone.utc).isoformat(),
         "companies":len(d.get("records",{})),"complete":complete,"incomplete":len(gaps),
         "coverage_pct":round(complete/max(1,len(d.get("records",{})))*100,2),"gaps":gaps[:5000]}
    OUT.parent.mkdir(parents=True,exist_ok=True);OUT.write_text(json.dumps(out,indent=2)+"\n")
    print(json.dumps(out,indent=2))
if __name__=="__main__":main()
