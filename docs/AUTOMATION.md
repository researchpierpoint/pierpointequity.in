# PirePoint automation contract

## Automated now

### Every 30 minutes
The primary maintenance workflow checks and refreshes:
- AMFI NAV data
- NSE equity universe
- NSE market snapshot
- NSE financial-result comparison data
- NSE Integrated Filing metadata
- NSE XBRL financial statements
- NSE ETF market, i-NAV and NAV data
- NSE ownership filings
- NSE corporate announcements
- company intelligence
- data-health
- public website integrity
- tests and Python compilation

### Specialized recurring jobs
- Mutual-fund analytics enrichment rotates stale scheme records.
- Historical valuation refreshes year-end NSE prices and rebuilds historical P/E context.
- Coverage audit identifies company records whose required evidence layers are still unavailable.
- What Changed rebuilds from current exchange evidence.
- GitHub Pages deploys after repository changes.

## Fail-closed rules

Automation must not convert missing evidence into a guessed number.

A field is:
- current/verified when its source record is present and within the freshness window;
- non-computable when the required source facts are not jointly available;
- not reported when the source does not disclose the requested fact.

The system should never label an unavailable fact as current.

## Autonomous feature work

Deterministic GitHub Actions can refresh data, run tests, audit coverage and deploy without a chat session. They do not independently invent new product features.

Repository-level coding-agent automation is a separate GitHub capability that requires its own AI engine and authentication setup. It is not treated as enabled merely because ordinary GitHub Actions exist.

## Human approval remains mandatory

- regulatory classification questions
- personalised/advisory functionality
- security incidents
- material external commercial commitments
- actions requiring credentials or licensed feeds
- publication decisions where the compliance gate cannot establish safe public-information status

Credentials must never be committed to the repository.
