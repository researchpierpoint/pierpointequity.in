"""Build a point-in-time NSE market snapshot for the PirePoint universe."""
from __future__ import annotations
import csv, io, json, time
from datetime import date, timedelta
from pathlib import Path
from urllib.request import Request, urlopen

ROOT=Path(__file__).resolve().parents[2]
UNIVERSE=ROOT/"data/generated/nse-equity-universe.json"
OUT=ROOT/"data/generated/nse-market-snapshot.json"
BASE="https://nsearchives.nseindia.com/products/content/sec_bhavdata_full_{}.csv"

HEADERS={"User-Agent":"Mozilla/5.0 PirePointEquity/1.0","Accept-Language":"en-US,en;q=0.9"}

def clean(v): return (v or "").strip()

def fetch_csv(d, timeout=30):
    url=BASE.format(d.strftime("%d%m%Y"))
    req=Request(url,headers=HEADERS)
    with urlopen(req,timeout=timeout) as r:
        return r.read().decode("utf-8-sig",errors="replace"),url

def parse(text, min_rows=1000):
    reader=csv.DictReader(io.StringIO(text))
    if not reader.fieldnames: raise RuntimeError("empty NSE bhavcopy")
    fields={clean(x) for x in reader.fieldnames}
    required={"SYMBOL","SERIES","CLOSE_PRICE","PREV_CLOSE","OPEN_PRICE","HIGH_PRICE","LOW_PRICE","TTL_TRD_QNTY","TURNOVER_LACS"}
    if not required.issubset(fields): raise RuntimeError(f"unexpected bhavcopy fields: {sorted(fields)}")
    rows=[]
    for raw in reader:
        r={clean(k):clean(v) for k,v in raw.items()}
        if r.get("SERIES")!="EQ" or not r.get("SYMBOL"): continue
        def num(k):
            try: return float(r[k].replace(",",""))
            except: return None
        rows.append({
          "symbol":r["SYMBOL"],"close":num("CLOSE_PRICE"),"prev_close":num("PREV_CLOSE"),
          "open":num("OPEN_PRICE"),"high":num("HIGH_PRICE"),"low":num("LOW_PRICE"),
          "volume":num("TTL_TRD_QNTY"),"turnover_lakh":num("TURNOVER_LACS"),
          "delivery_qty":num("DELIV_QTY"),"delivery_pct":num("DELIV_PER")
        })
    if len(rows)<min_rows: raise RuntimeError(f"unexpectedly small EQ snapshot: {len(rows)}")
    return rows

def latest(max_days=7):
    today=date.today()
    last_error=None
    for i in range(max_days):
        d=today-timedelta(days=i)
        if d.weekday()>=5: continue
        try:
            text,url=fetch_csv(d); return d,text,url
        except Exception as e: last_error=e
        time.sleep(1)
    raise RuntimeError(f"could not obtain recent NSE bhavcopy: {last_error}")

def main():
    d,text,url=latest()
    rows=parse(text)
    universe=json.loads(UNIVERSE.read_text(encoding="utf-8"))
    allowed={x["nse_symbol"] for x in universe["companies"]}
    data={r["symbol"]:r for r in rows if r["symbol"] in allowed}
    payload={"version":"1.0","as_of":d.isoformat(),"source":"NSE securities bhavcopy with delivery","source_url":url,"count":len(data),"records":data}
    OUT.parent.mkdir(parents=True,exist_ok=True)
    OUT.write_text(json.dumps(payload,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
    print(f"NSE market snapshot: {len(data)} symbols for {d.isoformat()}")
if __name__=="__main__": main()
