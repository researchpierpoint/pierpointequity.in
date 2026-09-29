"""Minimal NSE filing-ingestion foundation.

This module intentionally stores raw source metadata first. It does not publish
research or make investment recommendations. Production deployment should add
rate limiting, caching, source-specific terms/licensing checks, retries and
schema validation before enabling unattended ingestion.
"""
from __future__ import annotations
import csv, io, json, sys
from datetime import datetime, timezone
from urllib.request import Request, urlopen

NSE_INTEGRATED_FILINGS = "https://www.nseindia.com/companies-listing/corporate-integrated-filing"

def fetch_text(url: str, timeout: int = 20) -> str:
    req = Request(url, headers={
        "User-Agent": "PirePointResearch/0.1 (public research infrastructure)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    })
    with urlopen(req, timeout=timeout) as response:
        return response.read().decode("utf-8", errors="replace")

def make_source_record(url: str, title: str, publisher: str = "NSE") -> dict:
    return {
        "id": f"src-{abs(hash((url, title))) % 10**12:012d}",
        "url": url,
        "title": title,
        "publisher": publisher,
        "published_at": None,
        "retrieved_at": datetime.now(timezone.utc).isoformat(),
        "source_tier": 1,
        "document_ref": None,
        "notes": "Raw source metadata; not independently verified.",
    }

def main() -> int:
    # Network retrieval is opt-in for the first build so scheduled CI cannot
    # accidentally hammer an exchange endpoint.
    if "--probe" not in sys.argv:
        print(json.dumps({
            "status": "ready",
            "source": NSE_INTEGRATED_FILINGS,
            "mode": "dry-run",
            "next": "Enable a reviewed connector after endpoint/licensing validation."
        }, indent=2))
        return 0
    html = fetch_text(NSE_INTEGRATED_FILINGS)
    print(json.dumps({
        "status": "retrieved",
        "url": NSE_INTEGRATED_FILINGS,
        "bytes": len(html),
        "retrieved_at": datetime.now(timezone.utc).isoformat()
    }, indent=2))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
