"""Refresh NSE's ETF market table including i-NAV/NAV and premium-discount where NSE supplies them."""
from __future__ import annotations
import datetime as dt,json
from pathlib import Path
import requests
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/"data/generated/nse-etf-snapshot.json"
URL="https://www.nseindia.com/api/etf"
PAGE="https://www.nseindia.com/market-data/exchange-traded-funds-etf"
HEAD={"User-Agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/134 Safari/537.36","Accept":"application/json, text/plain, */*","Referer":PAGE}
def pick(x,*keys):
    for k in keys:
        if k in x and x[k] not in (None,"","-"):return x[k]
    return None
def main():
    s=requests.Session();s.headers.update(HEAD)
    warm=s.get(PAGE,timeout=20)
    if warm.status_code>=400:raise RuntimeError(f"NSE ETF page HTTP {warm.status_code}")
    z=s.get(URL,timeout=20)
    if z.status_code!=200:raise RuntimeError(f"NSE ETF API HTTP {z.status_code}")
    body=z.json(); rows=body.get("data",[]) if isinstance(body,dict) else []
    out={}
    for x in rows:
        sym=pick(x,"symbol","SYMBOL")
        if not sym:continue
        close=pick(x,"ltP","ltp","LTP","lastPrice","close")
        nav=pick(x,"nav","NAV")
        inav=pick(x,"iNAV","inav","INAV")
        prem=None
        try:
            if close not in (None,"") and inav not in (None,"",0):prem=round((float(close)/float(inav)-1)*100,4)
        except:pass
        out[sym]={"symbol":sym,"underlying":pick(x,"assets","underlying","underlyingAsset"),
          "open":pick(x,"open","OPEN"),"high":pick(x,"high","HIGH"),"low":pick(x,"low","LOW"),
          "prev_close":pick(x,"prevClose","previousClose","PREV_CLOSE"),"close":close,
          "volume":pick(x,"qty","volume","quantity"),"value":pick(x,"trdVal","value","turnover"),
          "change":pick(x,"pChange","change","changePct"),"inav":inav,"nav":nav,
          "premium_discount_pct":prem,"week52_high":pick(x,"wkhi","week52High","52WeekHigh"),
          "week52_low":pick(x,"wklo","week52Low","52WeekLow"),"raw":x}
    payload={"version":"1.0","updated_at":dt.datetime.now(dt.timezone.utc).isoformat(),
             "as_of":dt.datetime.now(dt.timezone.utc).isoformat(),"count":len(out),"records":out,
             "source_url":URL}
    OUT.parent.mkdir(parents=True,exist_ok=True);OUT.write_text(json.dumps(payload,indent=2,ensure_ascii=False)+"\n")
    print("NSE ETF records:",len(out))
if __name__=="__main__":main()
