# PirePoint Equity — System Architecture

## Layers
1. Public web
2. Search and discovery
3. Research orchestration
4. Evidence/source layer
5. Structured market and financial data
6. Analysis and valuation engine
7. Risk/change monitoring
8. Coverage and quality audit
9. Compliance/release gate
10. Publishing and deployment
11. Scheduled maintenance

## Current source layer

### NSE
- listed-equity master
- end-of-day market snapshot
- financial-result comparison
- Integrated Filing Financials
- XBRL financial statements
- shareholding filings
- corporate announcements
- ETF market/i-NAV/NAV feed

### AMFI / fund enrichment
- AMFI NAV and NAV history are the primary NAV layer.
- Secondary fund analytics can enrich scheme metadata, AUM, TER, returns, ratios and portfolio-family information when available.

## Core principle

Evidence is immutable within a generated observation. Interpretation can change as newer evidence arrives.

## Automation

Routine collection, freshness validation, coverage auditing, testing and deployment run through GitHub Actions. The main maintenance workflow is scheduled every 30 minutes, while specialized jobs handle slower or more expensive datasets.

The system fails closed when required evidence is absent. It does not manufacture financial or valuation values.

## External constraints

- licensed market-data feeds may require commercial permissions;
- exchange rate limits can constrain refresh depth;
- some company metrics are not disclosed uniformly;
- some ETF i-NAV/NAV fields are only available through exchange feeds;
- personalised/advisory functionality and regulated publication decisions remain outside unattended automation.

Credentials must never be committed to the repository.
