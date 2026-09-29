# Ingestion pipeline

## Current stage
The first connector is deliberately dry-run by default. This prevents an automated job from repeatedly requesting exchange pages before endpoint, rate-limit, caching and permitted-use rules have been reviewed.

## Target flow
source -> retrieve -> raw snapshot -> parse -> normalize -> validate -> deduplicate -> provenance record -> materialized fact -> change event

## Never do
- bypass access controls
- evade rate limits
- publish unverified extracted values
- overwrite prior observations
- embed credentials in code
- use a licensed feed outside its permitted use

NSE provides integrated filing and announcement interfaces with company, period and filing metadata. BSE also exposes corporate filing and financial-result interfaces. See the source registry for canonical links.
