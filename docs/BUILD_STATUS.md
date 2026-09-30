# PirePoint build status

## Current implementation

PirePoint now has automated source refresh and validation across the main research surfaces.

### Stocks / companies
- NSE listed-equity universe refresh
- NSE market snapshot
- NSE financial-result comparison data
- NSE Integrated Filing metadata
- NSE XBRL financial-statement parser
- revenue, net profit and EPS history when reported in XBRL
- TTM EPS / P/E when computable
- book value/share and P/B when computable
- balance-sheet facts: assets/equity/debt/cash when reported
- cash-flow facts and free cash flow when the required facts are reported
- ROE and ROCE calculations when the required facts exist
- debt/equity and operating/net margins when computable
- five-year year-end price snapshots
- historical P/E observations, average and median when enough annual EPS data exists
- promoter/FII/DII/public ownership
- promoter pledge/encumbrance evidence when present in the filing
- corporate announcements, risk signals and recent order/contract evidence
- company monitoring alerts
- source/evidence records and freshness controls
- company coverage audit

### Mutual funds
- AMFI NAV universe
- rolling AMFI NAV history
- 1D and 30D NAV-change calculations
- secondary enrichment for AMC, category, AUM, TER, returns and selected ratios when available
- fund detail pages
- source separation: AMFI primary NAV vs secondary enrichment

### ETFs
- NSE ETF universe
- NSE ETF market feed
- market price
- i-NAV
- NAV when supplied by NSE
- premium/discount calculation against i-NAV
- underlying, volume and 52-week fields when supplied
- dedicated ETF detail pages

### Research / monitoring
- current What Changed feed built from current NSE announcements and integrated filings
- automated data-health report
- public-surface audit for unfinished public copy and broken local assets
- GitHub Pages deployment
- automated tests and Python compilation checks

## Automatic operation

The repository contains scheduled GitHub Actions that refresh, validate and publish generated datasets. The primary maintenance workflow is scheduled every 30 minutes, with specialized workflows for mutual-fund enrichment, historical valuation, coverage auditing and the What Changed feed.

Scheduled workflows use GitHub Actions cron triggers, and GitHub supports schedules at intervals of five minutes or longer. urlGitHub Actions workflow syntaxhttps://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax

## Remaining limitations are explicit

Some values are legitimately unavailable for a particular company, fund or ETF because the source does not report them or the required facts cannot be reconciled. PirePoint does not invent them.

Examples:
- historical P/E requires both a historical price and a matching annual EPS observation
- ROCE requires sufficient EBIT and capital-employed facts
- ETF i-NAV/NAV is shown only when the NSE feed supplies it
- fund TER/AUM/portfolio analytics depend on the enrichment source's current coverage
- recent order announcements are not presented as a company's full reported order book

A missing fact is therefore represented as non-computable/unavailable, not as a fabricated number.

## Operating principle

No credential is committed to GitHub. No unverified market number is presented as live. Evidence and source dates remain attached to generated records.


- 2026-09-30: maintenance pipeline hardened for NSE session/encoding failures and serialized execution.

- 2026-09-30: final AMFI enrichment syntax cleanup applied; rerunning end-to-end health validation.
