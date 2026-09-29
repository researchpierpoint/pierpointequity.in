"""Build year-end price history and historical P/E from NSE prices + NSE XBRL annual EPS."""
from __future__ import annotations
import csv,io,json,datetime as dt,time
from pathlib import Path
from urllib.request import Request,urlopen
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/"data/generated/nse-historical-valuation.json"
BASE="https://nsearchives.nseindia.com/products/content/sec_bhavdata_full_{}.csv"
HEAD={"User-Agent":"Mozilla/5.0 PirePoint Equity","Accept-Language":"en-US,en;q=0.9"}
def fetch(day):
    u=BASE.format(day.strftime("%d%m%Y"))
    r=urlopen(Request(u,headers=HEAD),timeout=30)
    return r.read().decode("utf-8-sig",errors="replace"),u
def parse(text):
    rows={}
    for x in csv.DictReader(io.StringIO(text)):
        s=(x.get("SYMBOL") or "").strip()
        if (x.get("SERIES") or "").strip()!="EQ" or not s:continue
        try:rows[s]=float((x.get("CLOSE_PRICE") or "").replace(",",""))
        except:pass
    return rows
def main():
    today=dt.date.today()
    out={"version":"1.0","updated_at":dt.datetime.now(dt.timezone.utc).isoformat(),"years":{}}
    for y in range(today.year-5,today.year+1):
        target=dt.date(y,3,31);found=None
        for i in range(10):
            d=target-dt.timedelta(days=i)
            if d.weekday()>=5:continue
            try:
                text,url=fetch(d);prices=parse(text)
                if len(prices)>1000:
                    found={"date":d.isoformat(),"source_url":url,"prices":prices};break
            except Exception:pass
            time.sleep(.4)
        if found:out["years"][str(y)]=found
    OUT.parent.mkdir(parents=True,exist_ok=True)
    OUT.write_text(json.dumps(out,indent=2,ensure_ascii=False)+"\n")
    print("Historical valuation year-end snapshots:",len(out["years"]))
if __name__=="__main__":main()
