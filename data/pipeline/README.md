# Ingestion pipeline

## Current flow

source -> retrieve -> raw/point-in-time snapshot -> parse -> normalize -> validate -> provenance -> generated dataset -> coverage audit -> deploy

## Active sources

### NSE
- equity master
- securities bhavcopy
- financial results comparison
- Integrated Filing Financials
- XBRL financial statements
- shareholding filings
- corporate announcements
- ETF market/i-NAV/NAV feed

### AMFI
- daily NAV universe
- rolling NAV history

### Secondary fund enrichment
- mfdata.in is used only for additional scheme analytics such as category, AMC, AUM, TER, returns and ratios when available.
- AMFI remains the primary NAV source.

## Safety / quality rules

- Never bypass access controls.
- Never evade rate limits.
- Never publish an unverified extracted value as current.
- Never embed credentials in code.
- Never use a licensed feed outside its permitted use.
- Preserve source dates and provenance.
- Fail closed when an endpoint changes unexpectedly.

## Refresh model

The main maintenance workflow runs every 30 minutes. Specialized workflows rotate slower datasets and rebuild derived analytics.

The website labels exchange end-of-day data as end-of-day data. It does not pretend an EOD snapshot is a live tick feed.
