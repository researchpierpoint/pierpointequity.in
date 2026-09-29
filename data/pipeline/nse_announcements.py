"""Refresh recent NSE corporate announcements for timeline/risk/order-book signals."""
from __future__ import annotations
import datetime as dt,json,os,re,time
from pathlib import Path
import requests
ROOT=Path(__file__).resolve().parents[2];U=ROOT/"data/generated/nse-equity-universe.json";OUT=ROOT/"data/generated/nse-announcements.json"
API="https://www.nseindia.com/api/corporate-announcements";H={"User-Agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124 Safari/537.36","Accept":"application/json, text/plain, */*","Referer":"https://www.nseindia.com/companies-listing/corporate-filings-announcements"}
KEYS=["order","contract","award","bagging","capacity","expansion","acquisition","merger","fund raising","debt","rating","pledge","promoter","resignation","appointment","production","commission","guidance","litigation","default","credit","dividend","results"]
def main():
 try:d=json.loads(OUT.read_text())
 except:d={"version":"1.0","records":{}}
 u=json.loads(U.read_text()); rec=d.setdefault("records",{}); today=dt.date.today()
 targets=[c["nse_symbol"] for c in u["companies"]]
 limit=int(os.getenv("ANNOUNCEMENT_LIMIT","300")); start=(today-dt.timedelta(days=30)).strftime("%d-%m-%Y"); end=today.strftime("%d-%m-%Y")
 ses=requests.Session();ses.headers.update(H)
 if ses.get("https://www.nseindia.com/",timeout=20).status_code>=400:raise RuntimeError("NSE warmup failed")
 ok=0
 for s in targets[:limit]:
  try:
   z=ses.get(API,params={"index":"equities","from_date":start,"to_date":end,"symbol":s},timeout=20)
   body=z.json() if z.status_code==200 else []
   if isinstance(body,dict): body=next((v for v in body.values() if isinstance(v,list)),[])
   items=[]
   for x in body if isinstance(body,list) else []:
    text=" ".join(str(x.get(k,"")) for k in ["subject","desc","details","attchmntFile","an_dt"])
    low=text.lower()
    if any(k in low for k in KEYS):
     items.append({"date":x.get("an_dt") or x.get("broadcastDate") or x.get("date"),"subject":x.get("subject") or x.get("desc") or "Corporate announcement","raw":x})
   if items:rec[s]={"updated_at":today.isoformat(),"items":items[:30]};ok+=1
  except Exception as e:print(s,e)
  time.sleep(.5)
 d.update({"version":"1.0","updated_at":today.isoformat(),"coverage":len(rec),"refreshed":ok})
 OUT.parent.mkdir(parents=True,exist_ok=True);OUT.write_text(json.dumps(d,indent=2,ensure_ascii=False)+"\n")
 print("Announcement records:",len(rec),"refreshed:",ok)
if __name__=="__main__":main()
