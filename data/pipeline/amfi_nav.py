"""Refresh AMFI's daily NAV universe with header-aware parsing."""
from __future__ import annotations
import csv,io,json,re
from datetime import date
from pathlib import Path
from urllib.request import Request,urlopen
ROOT=Path(__file__).resolve().parents[2]; OUT=ROOT/"data/generated/amfi-nav.json"
URLS=["https://portal.amfiindia.com/spages/NAVAll.txt","https://www.amfiindia.com/spages/NAVAll.txt"]
def norm(s): return re.sub(r"[^a-z0-9]+"," ",s.lower()).strip()
def fetch():
    last=None
    for url in URLS:
        try:
            r=urlopen(Request(url,headers={"User-Agent":"Mozilla/5.0 PirePointEquity/1.0","Accept":"text/plain,*/*"}),timeout=45)
            t=r.read().decode("utf-8-sig","replace")
            if len(t)>10000 and ";" in t:return t,url
        except Exception as e:last=e
    raise RuntimeError(f"AMFI NAV download failed: {last}")
def parse(text):
    out=[]; header=None
    for raw in csv.reader(io.StringIO(text),delimiter=";"):
        raw=[x.strip() for x in raw]
        if not any(raw):continue
        h=[norm(x) for x in raw]
        if "scheme code" in h and any("net asset value" in x for x in h):header=h;continue
        if not raw[0].isdigit() or header is None:continue
        try:
            code_i=next(i for i,x in enumerate(header) if x=="scheme code")
            name_i=next(i for i,x in enumerate(header) if x=="scheme name")
            nav_i=next(i for i,x in enumerate(header) if "net asset value" in x)
            date_i=next(i for i,x in enumerate(header) if x=="date")
            isin_i=next((i for i,x in enumerate(header) if "isin" in x and "div payout" in x),None)
            code=raw[code_i];name=raw[name_i];nav=float(raw[nav_i].replace(",",""));dt=raw[date_i]
            isin=raw[isin_i] if isin_i is not None and isin_i<len(raw) else ""
            if name and nav>0 and dt:out.append({"scheme_code":code,"isin":"" if isin=="-" else isin,"name":name,"nav":nav,"date":dt,"source":"AMFI NAVAll"})
        except (StopIteration,ValueError,IndexError):pass
    return out
def main():
    text,url=fetch(); rows=parse(text)
    if len(rows)<1000:raise RuntimeError(f"AMFI NAV file unexpectedly small: {len(rows)}")
    payload={"version":"1.1","as_of":date.today().isoformat(),"source":"AMFI NAVAll","source_url":url,"count":len(rows),"funds":rows}
    OUT.parent.mkdir(parents=True,exist_ok=True);OUT.write_text(json.dumps(payload,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
    print("AMFI NAV snapshot:",len(rows),url)
if __name__=="__main__":main()
