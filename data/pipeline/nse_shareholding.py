"""Refresh latest NSE shareholding filings and parse promoter/public/institutional percentages."""
from __future__ import annotations
import datetime as dt,json,os,re,time
from pathlib import Path
import requests
ROOT=Path(__file__).resolve().parents[2]; U=ROOT/"data/generated/nse-equity-universe.json"; OUT=ROOT/"data/generated/nse-shareholding.json"
API="https://www.nseindia.com/api/corporate-share-holdings-master"; REF="https://www.nseindia.com/companies-listing/corporate-filings-shareholding-pattern"
H={"User-Agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124 Safari/537.36","Accept":"application/json, text/plain, */*","Referer":REF}
def load():
 try:return json.loads(OUT.read_text())
 except:return {"version":"1.0","records":{}}
def parse(xml):
 if not xml:return None
 ctx={m.group(1):set(re.findall(r'<xbrldi:explicitMember[^>]*>([^<]+)</xbrldi:explicitMember>',m.group(2))) for m in re.finditer(r'<xbrli:context id="([^"]+)">(.*?)</xbrli:context>',xml,re.S)}
 members={"promoter":"ShareholdingOfPromoterAndPromoterGroupMember","public":"PublicShareholdingMember","fii":"InstitutionsForeignMember","dii":"InstitutionsDomesticMember"}
 facts={}
 for cat,member in members.items():
  p=re.compile(r'<in-bse-shp:ShareholdingAsAPercentageOfTotalNumberOfShares contextRef="([^"]+)"[^>]*>([\d.\-]+)</in-bse-shp:')
  for m in p.finditer(xml):
   ms=ctx.get(m.group(1),set())
   if f"in-bse-shp:{member}" in ms:
    try:facts[cat]=float(m.group(2));break
    except:pass
 for m in re.finditer(r"<[^>]*(?:Pledge|Encumber|encumber|pledge)[^>]*contextRef="([^"]+)"[^>]*>([\\d.\\-]+)<",xml):
  try:facts["pledged"]=float(m.group(2));break
  except:pass
 if not facts:return None
 p=facts.get("promoter");q=facts.get("public"); total=(p or 0)+(q or 0)
 scale=.01 if total>1000 else (100 if 0<total<2 else 1)
 return {k:round(v*scale,4) for k,v in facts.items()}
def main():
 u=json.loads(U.read_text());d=load();rec=d.setdefault("records",{});today=dt.date.today()
 stale=[]
 for c in u["companies"]:
  s=c["nse_symbol"]; old=rec.get(s,{}).get("retrieved_at","")
  try:age=(today-dt.date.fromisoformat(old[:10])).days
  except:age=9999
  if age>=30:stale.append((age,s))
 stale.sort(reverse=True);limit=int(os.getenv("SHAREHOLDING_LIMIT","300"));targets=[s for _,s in stale[:limit]]
 ses=requests.Session();ses.headers.update(H)
 warmed=False
 for url in ["https://www.nseindia.com/","https://www.nseindia.com/market-data/live-equity-market","https://www.nseindia.com/companies-listing/corporate-filings-shareholding-pattern"]:
  try:
   warm=ses.get(url,timeout=20,headers=H)
   if warm.status_code<400:warmed=True;break
  except Exception: pass
 if not warmed: raise RuntimeError("NSE session warmup failed")
 ok=0
 for s in targets:
  try:
   z=ses.get(API,params={"index":"equities","symbol":s},timeout=20,headers=H)
   body=z.json() if z.status_code==200 else []
   if isinstance(body,list) and body:
    latest=body[0]; x=latest.get("xbrl") or ""
    if x:
     if x.startswith("/"):x="https://nsearchives.nseindia.com"+x
     elif x.startswith("http://"):x="https://"+x[7:]
     xr=ses.get(x,timeout=30,headers={"User-Agent":H["User-Agent"]})
     parsed=parse(xr.text if xr.status_code==200 else "")
     rec[s]={"as_on":latest.get("date"),"submission_date":latest.get("submissionDate"),"retrieved_at":today.isoformat(),"source_url":x,"values":parsed or {},
             "filing_history":[{"as_on":q.get("date"),"submission_date":q.get("submissionDate"),"xbrl":q.get("xbrl")} for q in body[:8] if isinstance(q,dict)]}
     ok+=1
  except Exception as e:print(s,e)
  time.sleep(.8)
 d.update({"version":"1.0","updated_at":today.isoformat(),"coverage":len(rec),"refreshed":ok})
 OUT.parent.mkdir(parents=True,exist_ok=True);OUT.write_text(json.dumps(d,indent=2,ensure_ascii=False)+"\n")
 print("Shareholding records:",len(rec),"refreshed:",ok)
if __name__=="__main__":main()
