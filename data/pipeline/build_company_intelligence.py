"""Build evidence-first company records from validated NSE datasets."""
from __future__ import annotations
import json
from datetime import date
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
def load(p,d):
    try:return json.loads(p.read_text(encoding="utf-8"))
    except:return d
def num(v):
    try:return float(str(v).replace(",","").replace("₹","").replace("%",""))
    except:return None
def change(a,b):
    a,b=num(a),num(b)
    return None if a in (None,0) or b is None else round((b/a-1)*100,2)
def main():
    u=load(ROOT/"data/generated/nse-equity-universe.json",{"companies":[]})
    m=load(ROOT/"data/generated/nse-market-snapshot.json",{"records":{}})
    r=load(ROOT/"data/generated/nse-financial-results.json",{"records":{},"updated_at":""})
    records={}
    for c in u.get("companies",[]):
        s=c["nse_symbol"]; md=m.get("records",{}).get(s,{}); rows=r.get("records",{}).get(s,{}).get("rows",[])
        latest=rows[0] if rows else {}; prev=rows[1] if len(rows)>1 else {}
        fin=[]
        for field,label in [("re_total_inc","Reported total income"),("re_op_profit","Reported operating profit"),("re_net_profit","Reported net profit"),("re_eps","Reported EPS")]:
            if latest.get(field) not in (None,""):
                fin.append({"metric":label,"value":latest[field],"period":latest.get("re_to_dt") or latest.get("re_qtr_ending") or "latest","source_ids":["nse-results-comparison"]})
                ch=change(prev.get(field),latest.get(field))
                if ch is not None:fin.append({"metric":label+" change vs previous returned period","value":f"{ch:+.2f}%","period":"comparison","source_ids":["nse-results-comparison"]})
        records[s]={"entity_id":c["entity_id"],"symbol":s,"name":c["legal_name"],"snapshot":{"as_of":max(str(u.get("as_of","")),str(m.get("as_of","")),str(r.get("updated_at",""))),"status":"review" if latest else "unverified","generated_at":date.today().isoformat()},"sections":{"business":f"{c['legal_name']} ({s}) is an NSE-listed equity. Business description requires a validated company filing or annual report.","financials":fin,"valuation":([{"metric":"Latest NSE close","value":f"₹{md['close']}","period":m.get("as_of"),"source_ids":["nse-market-snapshot"]}] if md.get("close") is not None else [])+[{"metric":"P/E","status":"needs-validated-earnings-and-share-count"},{"metric":"Historical valuation range","status":"needs-validated-history"}],"ownership":[{"metric":"Promoter/shareholding","status":"needs-current-filing"}],"events":([{"date":latest.get("re_to_dt") or latest.get("re_qtr_ending") or r.get("updated_at"),"event":"NSE financial-results data available","source_ids":["nse-results-comparison"]}] if latest else []),"risks":[{"risk":"Fundamental coverage is incomplete until validated company filings are ingested.","status":"data-coverage"},{"risk":"Current market price can change after this snapshot.","status":"market-data"}],"evidence":[{"source_id":"nse-equity-master","tier":1,"status":"verified"}]+([{"source_id":"nse-market-snapshot","tier":1,"status":"verified"}] if md else [])+([{"source_id":"nse-results-comparison","tier":1,"status":"verified"}] if latest else []),"timeline":([{"date":latest.get("re_to_dt") or latest.get("re_qtr_ending") or r.get("updated_at"),"type":"financial-result","title":"NSE result-comparison record available","source_ids":["nse-results-comparison"]}] if latest else []),"coverage":{"identity":True,"market":bool(md),"financial_results":bool(latest),"business_filing":False,"valuation":False,"ownership":False,"balance_sheet":False,"order_book":False}}}
    out={"version":"1.0","generated_at":date.today().isoformat(),"count":len(records),"records":records}
    p=ROOT/"data/generated/company-intelligence.json";p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(out,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
    print("Company intelligence records:",len(records))
if __name__=="__main__":main()

# Automated pipeline heartbeat: rebuild on source-data changes and scheduled runs.
