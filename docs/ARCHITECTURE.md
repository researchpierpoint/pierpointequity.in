# PirePoint Equity — System Architecture

## Layers
1. Public web
2. Search and discovery
3. Research orchestration
4. Evidence/source layer
5. Structured financial data
6. Analysis and scenario engine
7. Red-team/quality engine
8. Compliance release gate
9. Publishing
10. Monitoring and audit

## Core principle
Evidence is immutable; interpretation can change.

## Automation
Routine collection and validation can run automatically. Material publication, regulatory ambiguity, security incidents, and high-risk external actions require human approval.

## Future integrations
- authoritative company/regulatory sources
- market-data providers with permitted licensing
- search-demand signals
- database/storage
- notification service
- AI model providers

Credentials must never be committed to the repository. Use encrypted secrets/environment variables.
