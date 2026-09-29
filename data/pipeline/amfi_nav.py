"""Refresh the public AMFI mutual-fund NAV universe."""
from __future__ import annotations
import csv,io,json
from datetime import date
from pathlib import Path
from urllib.request import Request,urlopen
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/"data/generated/amfi-nav.json"
URL="https://www.amfiindia.com/spages/NAVAll.txt"
def main():
 req=Request(URL,headers={"User-Agent":"Mozilla/5.0 PirePointEquity/1.0"})
 text=urlopen(req,timeout=30).read().decode("utf-8-sig",errors="replace")
 rows=[]
 for raw in csv.reader(io.StringIO(text)):
  if len(raw)<6: continue
  if raw[0].strip().lower() in {"scheme code",""} or not raw[0].strip().isdigit(): continue
  nav=raw[4].strip()
  try: nav_value=float(nav.replace(",",""))
  except: nav_value=None
  rows.append({"scheme_code":raw[0].strip(),"isin":raw[1].strip(),"name":raw[3].strip(),"nav":nav_value,"date":raw[5].strip(),"source":"AMFI NAVAll"})
 if len(rows)<1000: raise RuntimeError(f"AMFI NAV file unexpectedly small: {len(rows)}")
 payload={"version":"1.0","as_of":date.today().isoformat(),"source":"AMFI NAVAll","source_url":URL,"count":len(rows),"funds":rows}
 OUT.parent.mkdir(parents=True,exist_ok=True);OUT.write_text(json.dumps(payload,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
 print("AMFI NAV snapshot:",len(rows))
if __name__=="__main__":main()
