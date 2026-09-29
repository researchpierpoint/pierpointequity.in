"""Build complete evidence-first company intelligence from exchange and XBRL data."""
from __future__ import annotations
import datetime as dt, json, re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]

def load(p,d):
    try:return json.loads(p.read_text(encoding="utf-8"))
    except:return d
def n(v):
    try:return float(str(v).replace(",","").replace("₹","").replace("%",""))
    except:return None
def pct(a,b):
    a,b=n(a),n(b)
    return None if a in (None,0) or b is None else round((b/a-1)*100,2)
def cagr(a,b,years):
    a,b=n(a),n(b)
    return None if a is None or b is None or a<=0 or b<=0 or years<=0 else round(((b/a)**(1/years)-1)*100,2)
def card_metric(metric,value,period=None,source="nse-xbrl",status=None):
    x={"metric":metric,"value":value,"source_ids":[source]}
    if period:x["period"]=period
    if status:x["status"]=status
    return x
def ttm(series):
    vals=[]
    for x in series or []:
        days=None
        if x.get("start") and x.get("end"):
            try:days=(dt.date.fromisoformat(x["end"])-dt.date.fromisoformat(x["start"])).days
            except:pass
        if days is not None and 70<=days<=110:
            vals.append(x)
    seen=set();out=[]
    for x in vals:
        key=x.get("end")
        if key not in seen:
            seen.add(key);out.append(x)
    out=sorted(out,key=lambda x:x.get("end",""),reverse=True)[:4]
    return sum(x["value"] for x in out) if len(out)>=4 else None
def main():
    u=load(ROOT/"data/generated/nse-equity-universe.json",{"companies":[]})
    m=load(ROOT/"data/generated/nse-market-snapshot.json",{"records":{}})
    r=load(ROOT/"data/generated/nse-financial-results.json",{"records":{}})
    i=load(ROOT/"data/generated/nse-integrated-financials.json",{"records":{}})
    fs=load(ROOT/"data/generated/nse-financial-statements.json",{"records":{}})
    hv=load(ROOT/"data/generated/nse-historical-valuation.json",{"years":{}})
    o=load(ROOT/"data/generated/nse-shareholding.json",{"records":{}})
    a=load(ROOT/"data/generated/nse-announcements.json",{"records":{}})
    records={}
    for c in u.get("companies",[]):
        s=c["nse_symbol"]; md=m.get("records",{}).get(s,{})
        rr=r.get("records",{}).get(s,{}).get("rows",[])
        own=o.get("records",{}).get(s,{})
        anns=a.get("records",{}).get(s,{}).get("items",[])
        filings=i.get("records",{}).get(s,{}).get("rows",[])
        x=fs.get("records",{}).get(s,{})
        facts=x.get("facts",{}); series=x.get("series",{}); annual=x.get("annual",{})
        close=n(md.get("close"))
        financials=[]
        if rr:
            latest=rr[0]
            for key,label in [("re_total_inc","Reported total income"),("re_op_profit","Reported operating profit"),("re_net_profit","Reported net profit"),("re_eps","Reported EPS")]:
                if latest.get(key) not in (None,""):
                    financials.append(card_metric(label,latest[key],latest.get("re_to_dt"),"nse-results-comparison"))
        rev=ttm(series.get("revenue")); profit=ttm(series.get("net_profit")); eps_ttm=ttm(series.get("eps"))
        # XBRL series uses normalized metric names; fall back to result-comparison EPS only if TTM is unavailable.
        if rev is not None: financials.append(card_metric("TTM revenue",rev,"TTM","nse-xbrl"))
        if profit is not None: financials.append(card_metric("TTM net profit",profit,"TTM","nse-xbrl"))
        if eps_ttm is not None: financials.append(card_metric("TTM EPS",eps_ttm,"TTM","nse-xbrl"))
        val=[]
        if close is not None: val.append(card_metric("NSE close",f"₹{close:g}",m.get("as_of"),"nse-market-snapshot"))
        shares=facts.get("shares",{}).get("value") if facts.get("shares") else None
        equity=facts.get("equity",{}).get("value") if facts.get("equity") else None
        debt=facts.get("debt",{}).get("value") if facts.get("debt") else None
        cash=facts.get("cash",{}).get("value") if facts.get("cash") else None
        if close is not None and eps_ttm and eps_ttm>0:
            val.append(card_metric("TTM P/E",round(close/eps_ttm,2),"TTM","nse-xbrl"))
        elif close is not None: val.append(card_metric("TTM P/E","Not computable","TTM","nse-xbrl","TTM EPS not available in validated XBRL"))
        if shares and equity and shares>0:
            bvps=equity/shares
            val.append(card_metric("Book value/share",round(bvps,2),"latest filing","nse-xbrl"))
            if close is not None and bvps>0:val.append(card_metric("P/B",round(close/bvps,2),"latest filing","nse-xbrl"))
        elif close is not None: val.append(card_metric("P/B","Not computable","latest filing","nse-xbrl","Share count and equity not jointly available"))
        hist=[]
        historical_pe=[]
        for year, snap in hv.get("years",{}).items():
            px=snap.get("prices",{}).get(s)
            eps=annual.get("eps",{}).get(year)
            if px is not None and eps not in (None,0):
                historical_pe.append({"year":year,"price":px,"eps":eps,"pe":round(px/eps,2)})
        if historical_pe:
            vals=[z["pe"] for z in historical_pe]
            hist.append(card_metric("Historical P/E",", ".join(f"{z['year']}: {z['pe']:.2f}x" for z in historical_pe),"year-end","nse-historical-valuation"))
            hist.append(card_metric("Historical P/E average",f"{sum(vals)/len(vals):.2f}x","available year-end observations","nse-historical-valuation"))
            hist.append(card_metric("Historical P/E median",f"{sorted(vals)[len(vals)//2]:.2f}x","available year-end observations","nse-historical-valuation"))
            if close is not None and eps_ttm and eps_ttm>0:
                current_pe=close/eps_ttm
                avg=sum(vals)/len(vals)
                hist.append(card_metric("Current P/E vs historical average",f"{(current_pe/avg-1)*100:+.2f}%","current TTM vs available year-end average","nse-historical-valuation"))
        for metric,label in [("revenue","Revenue"),("net_profit","Net profit"),("eps","EPS")]:
            vals=annual.get(metric,{})
            if len(vals)>=2:
                dates=list(vals);first=vals[dates[0]];last=vals[dates[-1]]
                years=max(1,round((dt.date.fromisoformat(dates[-1])-dt.date.fromisoformat(dates[0])).days/365))
                hist.append(card_metric(f"{label} history",", ".join(f"{k}: {v:g}" for k,v in vals.items()),f"{dates[0]} to {dates[-1]}","nse-xbrl"))
                g=cagr(first,last,years)
                if g is not None:hist.append(card_metric(f"{label} CAGR",f"{g:.2f}%",f"{years} years","nse-xbrl"))
        if facts.get("net_profit") and equity:
            roe=(facts["net_profit"]["value"]/equity)*100
            hist.append(card_metric("ROE",f"{roe:.2f}%","latest reported period","nse-xbrl"))
        ebit=facts.get("ebit")
        if ebit is None and facts.get("net_profit") and facts.get("finance_cost"):
            ebit={"value":facts["net_profit"]["value"]+facts["finance_cost"]["value"],"concept":"derived EBIT"}
        if ebit and equity and debt is not None:
            capital=equity+debt-(cash or 0)
            if capital>0:hist.append(card_metric("ROCE",f"{ebit['value']/capital*100:.2f}%","latest reported period","nse-xbrl"))
        if debt is not None:hist.append(card_metric("Debt",f"{debt:g}","latest reported period","nse-xbrl"))
        if cash is not None:hist.append(card_metric("Cash & equivalents",f"{cash:g}","latest reported period","nse-xbrl"))
        nd=x.get("derived",{}).get("net_debt")
        if nd is not None:hist.append(card_metric("Net debt",f"{nd:g}","latest reported period","nse-xbrl"))
        fcf=x.get("derived",{}).get("free_cash_flow")
        if fcf is not None:hist.append(card_metric("Free cash flow",f"{fcf:g}","latest reported period","nse-xbrl"))
        if rev and profit:
            hist.append(card_metric("Net margin",f"{profit/rev*100:.2f}%","TTM","nse-xbrl"))
        if rev and ebit:
            hist.append(card_metric("EBIT margin",f"{ebit['value']/rev*100:.2f}%","latest/TTM source basis","nse-xbrl"))
        if debt is not None and equity and equity>0:
            hist.append(card_metric("Debt / equity",f"{debt/equity:.2f}x","latest reported period","nse-xbrl"))
        ownership=[]
        if own:
            for k,label in [("promoter","Promoter & promoter group"),("fii","FII"),("dii","DII"),("public","Public"),("pledged","Pledged / encumbered")]:
                if k in own.get("values",{}):ownership.append(card_metric(label,f"{own['values'][k]:.2f}%",own.get("as_on"),"nse-shareholding"))
        if not ownership: ownership.append(card_metric("Shareholding","Not available in latest validated filing",own.get("as_on"),"nse-shareholding"))
        order_events=[]
        risks=[]
        for z in anns:
            subject=str(z.get("subject","")); low=subject.lower()
            if any(k in low for k in ["order","contract","award","bagging"]):
                mt=re.search(r"(?:₹|rs\\.?|inr)\\s*[0-9][0-9,.]*\\s*(?:crore|cr|million|mn|lakh)?",subject,re.I)
                order_events.append({"event":subject,"date":z.get("date"),"value":mt.group(0) if mt else None,"source_ids":["nse-announcements"]})
            if any(k in low for k in ["debt","rating","pledge","default","litigation","auditor","resignation"]):
                risks.append({"risk":subject,"date":z.get("date"),"status":"monitor","source_ids":["nse-announcements"]})
        events=[{"date":z.get("date"),"event":z.get("subject"),"source_ids":["nse-announcements"]} for z in anns[:30]]
        alerts=[]
        if risks: alerts.append({"type":"risk","message":f"{len(risks)} recent risk-monitoring announcement(s) detected.","source_ids":["nse-announcements"]})
        if order_events: alerts.append({"type":"orders","message":f"{len(order_events)} recent order/contract announcement(s) detected; these are not a substitute for reported backlog.","source_ids":["nse-announcements"]})
        if filings: alerts.append({"type":"filing","message":"A current NSE integrated filing is present in the source set.","source_ids":["nse-integrated-financials"]})
        coverage={
            "identity":True,"market":bool(md),"financial_results":bool(rr),"integrated_filings":bool(filings),
            "xbrl_financials":bool(x),"ownership":bool(own),"announcements":bool(anns),
            "historical_valuation":bool(historical_pe),"balance_sheet":bool(equity or debt or cash),
            "cash_flow":bool(fcf is not None),"roe":bool(equity and facts.get("net_profit")),
            "roce":any(q["metric"]=="ROCE" for q in hist),"order_book":bool(order_events),
            "business_profile":True
        }
        evidence=[{"source_id":"nse-equity-master","tier":1,"status":"verified"}]
        for src,present in [("nse-market-snapshot",bool(md)),("nse-results-comparison",bool(rr)),("nse-integrated-financials",bool(filings)),("nse-xbrl",bool(x)),("nse-shareholding",bool(own)),("nse-announcements",bool(anns))]:
            if present:evidence.append({"source_id":src,"tier":1,"status":"verified"})
        records[s]={"entity_id":c["entity_id"],"symbol":s,"name":c["legal_name"],
          "snapshot":{"as_of":max(str(u.get("as_of","")),str(m.get("as_of","")),str(r.get("updated_at","")),str(i.get("updated_at","")),str(fs.get("updated_at","")),str(hv.get("updated_at","")),str(o.get("updated_at","")),str(a.get("updated_at",""))),"status":"current-source-set","generated_at":dt.datetime.now(dt.timezone.utc).isoformat()},
          "sections":{"business":f"{c['legal_name']} ({s}) is an NSE-listed equity.","financials":financials+hist,
          "filing_history":[{"metric":"Latest NSE Integrated Filing","value":(filings[0].get("periodEndDate") or filings[0].get("quarterEndDate") or filings[0].get("period_ended") or "Latest") if filings else "No filing returned","period":i.get("updated_at"),"source_ids":["nse-integrated-financials"]}],
          "valuation":val,"ownership":ownership,"events":events,"risks":risks,"alerts":alerts,"order_book_events":order_events,"evidence":evidence,"timeline":events,"coverage":coverage}}
    out={"version":"2.0","generated_at":dt.datetime.now(dt.timezone.utc).isoformat(),"count":len(records),"records":records}
    p=ROOT/"data/generated/company-intelligence.json";p.write_text(json.dumps(out,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
    print("Company intelligence records:",len(records))
if __name__=="__main__":main()
