"""Parse NSE Integrated Filing XBRL into normalized financial facts.

The parser is deliberately conservative: it records only numeric facts that can be
traced to an NSE XBRL filing and derives ratios only when the required facts exist.
It rotates through the universe so the scheduled job can progressively cover all
companies without downloading every filing on every run.
"""
from __future__ import annotations
import datetime as dt
import json, os, re, time
from pathlib import Path
from urllib.parse import urljoin
import requests
import xml.etree.ElementTree as ET

ROOT=Path(__file__).resolve().parents[2]
U=ROOT/"data/generated/nse-equity-universe.json"
I=ROOT/"data/generated/nse-integrated-financials.json"
OUT=ROOT/"data/generated/nse-financial-statements.json"
UA="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/134 Safari/537.36"
HEAD={"User-Agent":UA,"Accept":"application/xml,text/xml,text/html,*/*","Referer":"https://www.nseindia.com/companies-listing/corporate-integrated-filing"}

def load(p, default):
    try:return json.loads(p.read_text(encoding="utf-8"))
    except:return default

def local(tag):
    return tag.rsplit("}",1)[-1].lower()

def number(v):
    try:
        s=str(v).replace(",","").strip()
        if not s:return None
        return float(s)
    except:return None

def contexts(root):
    out={}
    for x in root.iter():
        if local(x.tag)=="context" and x.get("id"):
            period=None
            for c in x:
                if local(c.tag)=="period":
                    for p in c:
                        n=local(p.tag)
                        if n in ("instant","startdate","enddate"): period=(period or {})|{n:p.text}
            dims=[local(m.text or "") for m in x.iter() if local(m.tag)=="explicitmember"]
            out[x.get("id")]={"period":period or {}, "dimensions":dims}
    return out

MAP={
"revenue":["revenuefromoperations","revenue","income from operations","turnover"],
"ebit":["operatingprofit","profitbeforetax","profitlossfromoperatingactivities"],
"net_profit":["profitforperiod","profitloss","netprofit","profitaftertax"],
"eps":["basicearningspershare","dilutedearningspershare","earningspershare"],
"assets":["assets"],
"equity":["equity","equityattributabletoowners"],
"cash":["cashandcashequivalents","cashandbankbalances","cashandcash"],
"debt":["borrowings","loans","debt","financialliabilities"],
"finance_cost":["financecosts","financecost","interestexpense"],
"cfo":["cashflowsfromoperatingactivities","netcashfromoperatingactivities"],
"cfi":["cashflowsfrominvestingactivities","netcashusedininvestingactivities"],
"capex":["purchaseofpropertyplantandequipment","purchaseofpropertyplantandequipmentandintangibleassets","capitalexpenditure"],
"dividend":["dividendper share","dividendpershare"],
}

def classify(name):
    n=re.sub(r"[^a-z0-9]","",name.lower())
    for metric,terms in MAP.items():
        for term in terms:
            t=re.sub(r"[^a-z0-9]","",term.lower())
            if t and (n==t or t in n):
                return metric
    return None

def parse_xml(text):
    root=ET.fromstring(text)
    ctx=contexts(root)
    facts=[]
    for x in root.iter():
        if not x.get("contextRef"):continue
        val=number(x.text)
        if val is None:continue
        name=local(x.tag); metric=classify(name)
        if not metric:continue
        c=ctx.get(x.get("contextRef"),{})
        p=c.get("period",{})
        facts.append({"metric":metric,"concept":name,"value":val,"context":x.get("contextRef"),
                      "instant":p.get("instant"),"start":p.get("startdate"),"end":p.get("enddate"),
                      "dimensions":c.get("dimensions",[])})
    return facts

def choose(facts, metric, consolidated=False):
    xs=[x for x in facts if x["metric"]==metric]
    if consolidated:
        xs=[x for x in xs if any("consolidated" in d for d in x["dimensions"])] or xs
    if not xs:return None
    # Prefer latest end/instant, then facts without dimensional breakdowns.
    def key(x):
        date=x.get("instant") or x.get("end") or ""
        return (date, -len(x.get("dimensions",[])))
    return sorted(xs,key=key,reverse=True)[0]

def annual_values(facts, metric):
    xs=[x for x in facts if x["metric"]==metric and x.get("start") and x.get("end")]
    by={}
    for x in xs:
        s=x["start"]; e=x["end"]
        try:
            days=(dt.date.fromisoformat(e)-dt.date.fromisoformat(s)).days
        except: continue
        if 330<=days<=380:
            by[e]=x["value"]
    return dict(sorted(by.items())[-6:])

def main():
    integ=load(I,{"records":{}})
    old=load(OUT,{"version":"1.0","records":{}})
    records=old.setdefault("records",{})
    symbols=list(load(U,{"companies":[]}).get("companies",[]))
    symbols=[x["nse_symbol"] for x in symbols]
    limit=int(os.getenv("XBRL_LIMIT","80"))
    today=dt.date.today().isoformat()
    stale=[]
    for s in symbols:
        stamp=records.get(s,{}).get("retrieved_at","")
        try:age=(dt.date.fromisoformat(today)-dt.date.fromisoformat(stamp[:10])).days
        except:age=9999
        if age>=7:stale.append((age,s))
    stale.sort(reverse=True)
    targets=[s for _,s in stale[:limit]]
    ses=requests.Session();ses.headers.update(HEAD)
    try:ses.get("https://www.nseindia.com/companies-listing/corporate-integrated-filing",timeout=20)
    except Exception:pass
    ok=0
    for s in targets:
        filing_rows=integ.get("records",{}).get(s,{}).get("rows",[])
        xurl=None; filing_meta=None
        for row in filing_rows:
            for k in ("xbrl","xbrl_url","xbrlFile","xbrl_file"):
                if row.get(k):
                    xurl=str(row[k]);break
            if xurl:
                filing_meta=row;break
        if not xurl:continue
        if not xurl.startswith("http"):
            xurl=urljoin("https://www.nseindia.com",xurl)
        try:
            z=ses.get(xurl,timeout=30)
            if z.status_code!=200: raise RuntimeError(f"HTTP {z.status_code}")
            facts=parse_xml(z.text)
            if not facts:continue
            latest={}
            for metric in MAP:
                f=choose(facts,metric)
                if f:latest[metric]=f
            annual={m:annual_values(facts,m) for m in ("revenue","net_profit","eps") if annual_values(facts,m)}
            if latest.get("finance_cost") and latest.get("ebit"):
                pass
            eq=latest.get("equity"); assets=latest.get("assets"); debt=latest.get("debt"); cash=latest.get("cash")
            net_debt=(debt["value"]-cash["value"]) if debt and cash else None
            cfo=latest.get("cfo"); cap=latest.get("capex")
            fcf=(cfo["value"]-abs(cap["value"])) if cfo and cap else None
            records[s]={"retrieved_at":today,"filing":filing_meta or {}, "xbrl_url":xurl,
                        "facts":latest,"annual":annual,"derived":{"net_debt":net_debt,"free_cash_flow":fcf}}
            ok+=1
        except Exception as e:
            print("xbrl",s,e)
        time.sleep(.35)
    OUT.parent.mkdir(parents=True,exist_ok=True)
    OUT.write_text(json.dumps({"version":"1.0","updated_at":today,"coverage":len(records),
                               "refreshed":ok,"records":records},indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
    print("XBRL financial statements:",len(records),"refreshed:",ok)

if __name__=="__main__":main()
