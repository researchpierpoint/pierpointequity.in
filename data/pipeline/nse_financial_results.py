"""Fetch NSE quarterly result-comparison data for the listed-company universe.

The endpoint is an NSE website endpoint rather than a documented public API; the
pipeline therefore rate-limits, caches and fails closed. Only source-returned
numbers are stored.
"""
from __future__ import annotations
import json, os, time
from pathlib import Path
import requests

ROOT=Path(__file__).resolve().parents[2]
UNIVERSE=ROOT/"data/generated/nse-equity-universe.json"
OUT=ROOT/"data/generated/nse-financial-results.json"
API="https://www.nseindia.com/api/results-comparision"

HEADERS={"User-Agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36","Accept":"application/json, text/plain, */*","Accept-Language":"en-US,en;q=0.9","Referer":"https://www.nseindia.com/companies-listing/corporate-filings-financial-results"}

def load_existing():
    if not OUT.exists(): return {"version":"1.0","source":"NSE results comparison","records":{}}
    try:return json.loads(OUT.read_text(encoding="utf-8"))
    except:return {"version":"1.0","source":"NSE results comparison","records":{}}

def main():
    universe=json.loads(UNIVERSE.read_text(encoding="utf-8"))
    existing=load_existing()
    records=existing.get("records",{})
    symbols=[x["nse_symbol"] for x in universe["companies"]]
    limit=int(os.getenv("RESULT_LIMIT","0") or "0")
    pending=[s for s in symbols if s not in records]
    if limit: pending=pending[:limit]
    session=requests.Session()
    session.headers.update(HEADERS)
    warmed=False
    for warm_url in ["https://www.nseindia.com/","https://www.nseindia.com/market-data/live-equity-market","https://www.nseindia.com/companies-listing/corporate-filings-financial-results"]:
        try:
            warm=session.get(warm_url,timeout=20,headers=HEADERS)
            if warm.status_code < 400:
                warmed=True
                break
        except Exception:
            pass
    if not warmed:
        raise RuntimeError("NSE browser-session warmup failed")
    ok=0
    for symbol in pending:
        try:
            r=session.get(API,params={"index":"equities","symbol":symbol},timeout=20)
            if r.status_code!=200: raise RuntimeError(f"HTTP {r.status_code}")
            data=r.json()
            rows=data.get("resCmpData") or []
            clean=[]
            for row in rows[:8]:
                clean.append({k:row.get(k) for k in ["re_to_dt","re_from_dt","re_total_inc","re_net_profit","re_eps","re_op_profit","re_profit_after_tax","re_qtr_ending","re_type"] if k in row})
            if clean:
                records[symbol]={"as_of":data.get("timestamp"),"rows":clean,"source_url":f"{API}?index=equities&symbol={symbol}"}
                ok+=1
        except Exception as e:
            print(f"{symbol}: {e}")
        time.sleep(1.0)
    payload={"version":"1.0","updated_at":__import__("datetime").date.today().isoformat(),"source":"NSE results comparison","coverage":len(records),"attempted":len(pending),"successful":ok,"records":records}
    OUT.parent.mkdir(parents=True,exist_ok=True);OUT.write_text(json.dumps(payload,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
    print(f"Financial result records: {len(records)}; newly fetched: {ok}; attempted: {len(pending)}")

if __name__=="__main__":main()
