"""Collect current NSE Integrated Filing (Financials) records.

Uses the NSE-backed jugaad-data connector for the current Integrated Filing
Financials endpoint, then stores filing metadata and XBRL/detail links. The
collector is evidence-first: it never invents financial values when an XBRL
fact cannot be parsed.
"""
from __future__ import annotations
import datetime as dt, json, os, time
from pathlib import Path
from urllib.parse import urljoin
import requests

ROOT = Path(__file__).resolve().parents[2]
U = ROOT / "data/generated/nse-equity-universe.json"
OUT = ROOT / "data/generated/nse-integrated-financials.json"
NSE = "https://www.nseindia.com"

def load():
    try:
        return json.loads(OUT.read_text(encoding="utf-8"))
    except Exception:
        return {"version":"1.0","records":{}}

def normalise_url(v):
    if not v:
        return None
    v = str(v)
    if v.startswith("http"):
        return v
    return urljoin(NSE, v)

def main():
    # Install at runtime so the repository stays lightweight.
    from jugaad_data.nse import NSELive
    u = json.loads(U.read_text(encoding="utf-8"))
    d = load()
    rec = d.setdefault("records", {})
    today = dt.date.today().isoformat()
    limit = int(os.getenv("INTEGRATED_FINANCIAL_LIMIT", "300"))
    symbols = [c["nse_symbol"] for c in u.get("companies", [])][:limit]

    n = NSELive()
    ok = 0
    for s in symbols:
        try:
            rows = n.corporate_integrated_filing(
                index="equities", symbol=s, period_ended="all", page=1, size=20
            )
            if hasattr(rows, "to_dict"):
                rows = rows.to_dict("records")
            if not isinstance(rows, list):
                rows = rows.get("data", rows.get("results", [])) if isinstance(rows, dict) else []
            clean = []
            for x in rows[:20]:
                if not isinstance(x, dict):
                    continue
                y = dict(x)
                for k in ("xbrl", "xbrl_url", "xbrlFile", "xbrl_file", "details", "details_url", "detailsFile"):
                    if k in y:
                        y[k] = normalise_url(y[k])
                clean.append(y)
            if clean:
                rec[s] = {"updated_at": today, "rows": clean, "source_url": f"{NSE}/companies-listing/corporate-integrated-filing?symbol={s}&tabIndex=equity"}
                ok += 1
        except Exception as e:
            print("integrated filing", s, e)
        time.sleep(0.35)

    d.update({"version":"1.0","updated_at":today,"coverage":len(rec),"refreshed":ok})
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(d, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print("Integrated financial filing records:", len(rec), "refreshed:", ok)

if __name__ == "__main__":
    main()
