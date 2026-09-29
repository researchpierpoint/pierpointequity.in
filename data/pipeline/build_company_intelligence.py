"""Build evidence-first company intelligence from validated exchange datasets."""
from __future__ import annotations
import datetime as dt, json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

def load(p, d):
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except Exception:
        return d

def num(v):
    try:
        return float(str(v).replace(",", "").replace("₹", "").replace("%", ""))
    except Exception:
        return None

def growth(a, b):
    a, b = num(a), num(b)
    return None if a in (None, 0) or b is None else round((b / a - 1) * 100, 2)

def main():
    u = load(ROOT/"data/generated/nse-equity-universe.json", {"companies":[]})
    m = load(ROOT/"data/generated/nse-market-snapshot.json", {"records":{}})
    r = load(ROOT/"data/generated/nse-financial-results.json", {"records":{}})
    i = load(ROOT/"data/generated/nse-integrated-financials.json", {"records":{}})
    o = load(ROOT/"data/generated/nse-shareholding.json", {"records":{}})
    a = load(ROOT/"data/generated/nse-announcements.json", {"records":{}})

    records = {}
    for c in u.get("companies", []):
        s = c["nse_symbol"]
        md = m.get("records", {}).get(s, {})
        rr = r.get("records", {}).get(s, {}).get("rows", [])
        latest = rr[0] if rr else {}
        prev = rr[1] if len(rr) > 1 else {}
        own = o.get("records", {}).get(s, {})
        anns = a.get("records", {}).get(s, {}).get("items", [])
        filings = i.get("records", {}).get(s, {}).get("rows", [])
        latest_filing = filings[0] if filings else {}

        fin = []
        for f, label in [
            ("re_total_inc", "Reported total income"),
            ("re_op_profit", "Reported operating profit"),
            ("re_net_profit", "Reported net profit"),
            ("re_eps", "Reported EPS"),
        ]:
            if latest.get(f) not in (None, ""):
                fin.append({"metric":label,"value":latest[f],
                            "period":latest.get("re_to_dt") or latest.get("re_qtr_ending") or "latest",
                            "source_ids":["nse-results-comparison"]})
                g = growth(prev.get(f), latest.get(f))
                if g is not None:
                    fin.append({"metric":label+" change vs previous returned period",
                                "value":f"{g:+.2f}%","period":"comparison",
                                "source_ids":["nse-results-comparison"]})

        filing_section = []
        if latest_filing:
            period = latest_filing.get("periodEndDate") or latest_filing.get("quarterEndDate") or latest_filing.get("period_ended") or latest_filing.get("to_date") or "latest filing"
            filing_section.append({
                "metric":"Latest NSE Integrated Filing",
                "value":period,
                "period":latest_filing.get("broadcastDate") or latest_filing.get("broadcast_date") or latest_filing.get("sort_date") or i.get("updated_at"),
                "source_ids":["nse-integrated-financials"],
                "source_url": i.get("records",{}).get(s,{}).get("source_url")
            })
            filing_section.append({
                "metric":"Financial statement values",
                "status":"XBRL/detail link captured; normalized balance-sheet, cash-flow, ROCE and 5-year series are next parsing layer.",
                "source_ids":["nse-integrated-financials"]
            })
        else:
            filing_section.append({"metric":"Latest NSE Integrated Filing","status":"pending current filing ingestion"})

        close = num(md.get("close"))
        eps = num(latest.get("re_eps"))
        valuation = []
        if close is not None:
            valuation.append({"metric":"Latest NSE close","value":f"₹{close:g}",
                              "period":m.get("as_of"),"source_ids":["nse-market-snapshot"]})
        if close is not None and eps and eps > 0:
            valuation.append({"metric":"Price / latest reported EPS","value":round(close/eps,2),
                              "period":latest.get("re_to_dt") or latest.get("re_qtr_ending"),
                              "status":"indicative; not TTM P/E",
                              "source_ids":["nse-market-snapshot","nse-results-comparison"]})
        else:
            valuation.append({"metric":"P/E","status":"needs validated TTM EPS/share count"})
        valuation.append({"metric":"Historical valuation range","status":"needs validated valuation history"})

        ownership = []
        if own:
            for k, label in [("promoter","Promoter & promoter group"),("fii","FII"),("dii","DII"),("public","Public")]:
                if k in own.get("values", {}):
                    ownership.append({"metric":label,"value":f"{own['values'][k]:.2f}%",
                                      "period":own.get("as_on"),"source_ids":["nse-shareholding"]})
            ownership.append({"metric":"Latest shareholding filing","value":own.get("as_on") or "—",
                              "source_ids":["nse-shareholding"]})
        else:
            ownership = [{"metric":"Promoter/shareholding","status":"pending latest NSE filing"}]

        risks = []
        for x in anns:
            text = str(x.get("subject", ""))
            low = text.lower()
            if any(k in low for k in ["debt","rating","pledge","default","litigation","auditor","resignation"]):
                risks.append({"risk":text,"date":x.get("date"),"status":"monitor",
                              "source_ids":["nse-announcements"]})
        risks.append({"risk":"Current valuation can diverge from operating fundamentals.","status":"monitor"})

        events = [{"date":x.get("date"),"event":x.get("subject"),
                   "source_ids":["nse-announcements"]} for x in anns[:20]]

        order_events = []
        for x in anns:
            subject = str(x.get("subject", ""))
            low = subject.lower()
            if any(k in low for k in ["order", "contract", "award", "bagging"]):
                match = re.search(r"(?:₹|rs\\.?|inr)\\s*([0-9][0-9,]*(?:\\.\\d+)?)\\s*(crore|cr|million|mn|lakh)?", subject, re.I)
                order_events.append({"event":subject,"date":x.get("date"),
                                     "value":match.group(0) if match else None,
                                     "source_ids":["nse-announcements"]})

        evidence = [{"source_id":"nse-equity-master","tier":1,"status":"verified"}]
        if md: evidence.append({"source_id":"nse-market-snapshot","tier":1,"status":"verified"})
        if latest: evidence.append({"source_id":"nse-results-comparison","tier":1,"status":"verified"})
        if filings: evidence.append({"source_id":"nse-integrated-financials","tier":1,"status":"verified"})
        if own: evidence.append({"source_id":"nse-shareholding","tier":1,"status":"verified"})
        if anns: evidence.append({"source_id":"nse-announcements","tier":1,"status":"verified"})

        coverage = {
            "identity":True, "market":bool(md), "financial_results":bool(latest),
            "integrated_filings":bool(filings), "ownership":bool(own),
            "announcements":bool(anns), "business_filing":bool(filings),
            "historical_valuation":False, "balance_sheet":False, "roce":False,
            "order_book":False
        }

        records[s] = {
            "entity_id":c["entity_id"], "symbol":s, "name":c["legal_name"],
            "snapshot":{
                "as_of":max(str(u.get("as_of","")),str(m.get("as_of","")),
                           str(r.get("updated_at","")),str(i.get("updated_at","")),
                           str(o.get("updated_at","")),str(a.get("updated_at",""))),
                "status":"review" if latest or filings or md else "unverified",
                "generated_at":dt.date.today().isoformat()
            },
            "sections":{
                "business":f"{c['legal_name']} ({s}) is an NSE-listed equity. Business description requires validated company filings.",
                "financials":fin,
                "filing_history":filing_section,
                "valuation":valuation,
                "ownership":ownership,
                "events":events,
                "risks":risks,
                "order_book_events":order_events,
                "evidence":evidence,
                "timeline":events,
                "coverage":coverage
            }
        }

    out = {"version":"1.2","generated_at":dt.date.today().isoformat(),
           "count":len(records),"records":records}
    p = ROOT/"data/generated/company-intelligence.json"
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(out, indent=2, ensure_ascii=False)+"\n", encoding="utf-8")
    print("Company intelligence records:", len(records))

if __name__ == "__main__":
    main()
