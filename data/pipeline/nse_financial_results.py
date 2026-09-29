"""Fetch and maintain NSE result-comparison data.

Refreshes newly missing records plus the oldest records so existing companies
do not become permanently stale. A bounded batch keeps each scheduled run
inside a predictable runtime.
"""
from __future__ import annotations
import datetime as dt,json,os,time
from pathlib import Path
import requests
ROOT=Path(__file__).resolve().parents[2]; U=ROOT/"data/generated/nse-equity-universe.json"; OUT=ROOT/"data/generated/nse-financial-results.json"
API="https://www.nseindia.com/api/results-comparision"
H={"User-Agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124 Safari/537.36","Accept":"application/json, text/plain, */*","Accept-Language":"en-US,en;q=0.9","Referer":"https://www.nseindia.com/companies-listing/corporate-filings-financial-results"}
def load():
 try:return json.loads(OUT.read_text())
 except:return {"version":"1.1","source":"NSE results comparison","records":{}}
def main():
 u=json.loads(U.read_text()); d=load(); rec=d.setdefault("records",{}); symbols=[x["nse_symbol"] for x in u["companies"]]
 today=dt.date.today(); stale=[]
 for s in symbols:
  r=rec.get(s); stamp=(r or {}).get("as_of") or ""
  try: age=(today-dt.date.fromisoformat(str(stamp)[:10])).days
  except: age=9999
  if not r or age>=7: stale.append((age,s))
 stale.sort(reverse=True)
 limit=int(os.getenv("RESULT_LIMIT","500")); pending=[s for _,s in stale[:limit]]
 ses=requests.Session();ses.headers.update(H)
 warmed=False
 for url in ["https://www.nseindia.com/","https://www.nseindia.com/market-data/live-equity-market","https://www.nseindia.com/companies-listing/corporate-filings-financial-results"]:
  try:
   z=ses.get(url,timeout=20,headers=H)
   if z.status_code<400:warmed=True;break
  except:pass
 if not warmed:raise RuntimeError("NSE session warmup failed")
 ok=0
 for s in pending:
  try:
   z=ses.get(API,params={"index":"equities","symbol":s},timeout=20)
   if z.status_code!=200:raise RuntimeError(f"HTTP {z.status_code}")
   rows=z.json().get("resCmpData") or []
   clean=[{k:r.get(k) for k in ["re_to_dt","re_from_dt","re_total_inc","re_net_profit","re_eps","re_op_profit","re_profit_after_tax","re_qtr_ending","re_type"] if k in r} for r in rows[:12]]
   if clean:rec[s]={"as_of":today.isoformat(),"rows":clean,"source_url":f"{API}?index=equities&symbol={s}"};ok+=1
  except Exception as e:print(s,e)
  time.sleep(1)
 d.update({"version":"1.1","updated_at":today.isoformat(),"coverage":len(rec),"attempted":len(pending),"successful":ok})
 OUT.parent.mkdir(parents=True,exist_ok=True);OUT.write_text(json.dumps(d,indent=2,ensure_ascii=False)+"\n")
 print(f"Financial result records: {len(rec)}; refreshed: {ok}; attempted: {len(pending)}")
if __name__=="__main__":main()
