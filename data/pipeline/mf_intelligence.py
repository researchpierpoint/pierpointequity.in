"""Enrich AMFI NAV schemes with fund metadata/analytics from mfdata.in.

AMFI remains the primary NAV source. mfdata.in is an explicitly secondary enrichment
source for category, AMC, AUM, TER, returns, ratios and portfolio family metadata.
Every enriched field carries its source and retrieval timestamp.
"""
from __future__ import annotations
import datetime as dt,json,os,time
from pathlib import Path
import requests
ROOT=Path(__file__).resolve().parents[2]
NAV=ROOT/"data/generated/amfi-nav.json";OUT=ROOT/"data/generated/mf-intelligence.json"
BASE="https://mfdata.in/api/v1"
def load(p,d):
    try:return json.loads(p.read_text(encoding="utf-8"))
    except:return d
def main():
    today=dt.date.today()
    nav=load(NAV,{"funds":[]})
    old=load(OUT,{"schemes":{}})
    schemes=old.setdefault("schemes",{})
    # Refresh the public scheme master at most once per day.
    stamp=str(old.get("scheme_master_updated_at",""))
    try:master_age=(today-dt.date.fromisoformat(stamp[:10])).days
    except:master_age=999
    ses=requests.Session();ses.headers["User-Agent"]="PirePoint Equity research data pipeline"
    if master_age>=1 or not schemes:
        all_rows=[]
        offset=0
        while True:
            z=ses.get(BASE+"/schemes",params={"limit":1000,"offset":offset},timeout=30)
            if z.status_code!=200:
                print(f"mfdata scheme master unavailable HTTP {z.status_code}; continuing with AMFI-only coverage")
                break
            data=z.json().get("data",[])
            if not data:break
            all_rows.extend(data)
            if len(data)<1000:break
            offset+=1000
            time.sleep(1)
        for x in all_rows:
            code=str(x.get("scheme_code") or x.get("amfi_code") or "")
            if code:
                schemes.setdefault(code,{})
                schemes[code].update({"scheme_code":x.get("scheme_code"),"scheme_name":x.get("scheme_name") or x.get("name"),
                                      "amc":x.get("amc"),"category":x.get("category"),"nav":x.get("nav"),
                                      "aum_cr":x.get("aum_cr"),"master_source":"mfdata.in","master_updated_at":today.isoformat()})
        if not schemes:
        for f in nav.get("funds",[]):\n            code=str(f.get("scheme_code") or "")\n            if code:\n                schemes[code]={"scheme_code":code,"scheme_name":f.get("scheme_name"),"nav":f.get("nav"),"nav_date":f.get("date"),"master_source":"AMFI","master_updated_at":today.isoformat()}\n    old["scheme_master_updated_at"]=today.isoformat()
    # Keep the detailed enrichment bounded; rotate the stalest schemes.
    targets=[]
    for f in nav.get("funds",[]):
        code=str(f.get("scheme_code",""))
        if not code or code not in schemes:continue
        stamp=str(schemes[code].get("details_retrieved_at",""))
        try:age=(today-dt.date.fromisoformat(stamp[:10])).days
        except:age=999
        if age>=7:targets.append((age,code))
    targets.sort(reverse=True)
    limit=int(os.getenv("MF_DETAIL_LIMIT","20"))
    for _,code in targets[:limit]:
        try:
            z=ses.get(BASE+"/schemes/"+code,timeout=30)
            if z.status_code!=200:raise RuntimeError(f"HTTP {z.status_code}")
            d=z.json().get("data",{})
            if d:
                schemes[code].update(d)
                schemes[code]["details_source"]="mfdata.in"
                schemes[code]["details_retrieved_at"]=dt.datetime.now(dt.timezone.utc).isoformat()
        except Exception as e:print("mf detail",code,e)
        time.sleep(1.2)
    OUT.parent.mkdir(parents=True,exist_ok=True)
    OUT.write_text(json.dumps({"version":"1.0","updated_at":dt.datetime.now(dt.timezone.utc).isoformat(),
                               "coverage":len(schemes),"detail_limit":limit,"source":"mfdata.in enrichment; AMFI NAV remains primary",
                               "schemes":schemes},indent=2,ensure_ascii=False)+"\n")
    print("MF intelligence schemes:",len(schemes))
if __name__=="__main__":main()
