"""Refresh the NSE listed-equity universe from NSE's published equity master.

Design goals:
- official/public source first
- deterministic normalization
- no market-price or recommendation data
- preserve a point-in-time snapshot
- fail closed on malformed input
"""
from __future__ import annotations
import csv, io, json, os, re
from datetime import datetime, timezone
from urllib.request import Request, urlopen

URL = "https://archives.nseindia.com/content/equities/EQUITY_L.csv"
OUT = "data/generated/nse-equity-universe.json"

def fetch(timeout=30):
    req = Request(URL, headers={"User-Agent":"PirePointEquity/1.0 research infrastructure"})
    with urlopen(req, timeout=timeout) as r:
        return r.read().decode("utf-8-sig", errors="replace")

def clean(v):
    return re.sub(r"\s+", " ", (v or "").strip())

def build(text):
    rows = list(csv.DictReader(io.StringIO(text)))
    if not rows:
        raise RuntimeError("NSE equity master returned zero rows")
    required = {"SYMBOL","NAME OF COMPANY","ISIN NUMBER"}
    if not required.issubset(rows[0].keys()):
        raise RuntimeError(f"Unexpected NSE columns: {sorted(rows[0].keys())}")
    out=[]
    seen=set()
    for r in rows:
        symbol=clean(r.get("SYMBOL"))
        name=clean(r.get("NAME OF COMPANY"))
        isin=clean(r.get("ISIN NUMBER"))
        if not symbol or not isin or isin in seen:
            continue
        seen.add(isin)
        out.append({
            "entity_id": f"nse-{symbol.lower()}",
            "isin": isin,
            "nse_symbol": symbol,
            "legal_name": name,
            "status": "listed-equity",
            "source_id": "nse-equity-master",
            "source_url": URL
        })
    if len(out) < 100:
        raise RuntimeError(f"Universe unexpectedly small: {len(out)}")
    return {
        "version":"1.0",
        "as_of":datetime.now(timezone.utc).date().isoformat(),
        "source":"NSE equity master",
        "source_url":URL,
        "count":len(out),
        "companies":sorted(out,key=lambda x:(x["legal_name"].lower(),x["isin"]))
    }

if __name__ == "__main__":
    data=build(fetch())
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT,"w",encoding="utf-8") as f:
        json.dump(data,f,indent=2,ensure_ascii=False)
        f.write("\n")
    print(f"Wrote {OUT}: {data['count']} entities")
