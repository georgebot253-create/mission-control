# CANNACART — Business Card

## Identity
| Field | Value |
|-------|-------|
| Business_ID | CANNACART |
| Business_Type | SaaS (Internal → Future B2B) |
| Owner | Anthony Ferro / Lifted Cannabis |
| Risk_Level | Low |
| Status | Active |
| Developer | Chetu (external) |

## Description
Automated order proposal system for cannabis wholesale. Imports store inventory, maps products, generates re-order proposals, and prepares orders for Cultivera submission.

## Assets
| Asset | Location |
|-------|----------|
| Production URL | http://3.146.199.109 |
| Feature Specs | `/chetu-features/` |

## Current Capabilities
| Feature | Status |
|---------|--------|
| Store Management | ✅ 38 stores |
| Master Products | ✅ 326 products |
| Inventory Import | ✅ XLSX/CSV |
| Product Mapping | ✅ AI + Manual |
| Re-Order Proposals | ✅ Active |
| Order Generation | ✅ Active |
| Categories | ✅ 18 categories |
| Excluded Keywords | ✅ 9 filters |

## KPIs
| Metric | Target | Current |
|--------|--------|---------|
| Orders Generated | 10/week | Tracking |
| Mapping Accuracy | >95% | ~90% auto |
| Time Saved/Order | 30 min | Tracking |
| Stores Active | 38 | 38 |

## Budget Caps
| Category | Limit | Period |
|----------|-------|--------|
| Development (Chetu) | TBD | Per feature |
| Hosting | $0 | Chetu managed |

---

## AGENT CLUSTER

### 1. STRATEGY AGENT
**Role:** Define product roadmap, prioritize Chetu feature requests
**Permissions:** Read-only access to usage data
**Outputs:** Feature prioritization, Chetu specs

### 2. RESEARCH AGENT
**Role:** Identify market opportunities, competitor analysis
**Permissions:** External research
**Constraints:** Focus on cannabis wholesale/distribution
**Outputs:** Market analysis, expansion opportunities

### 3. EXECUTION AGENT
**Role:** Write feature specs, coordinate with Chetu, test features
**Permissions:** Create specs, test system
**Constraints:** Cannot modify code directly (Chetu builds)
**Outputs:** Feature specs, test results, bug reports

### 4. PRICING/OPTIMIZATION AGENT
**Role:** N/A currently (internal tool)
**Status:** Dormant until SaaS launch

### 5. ADS/GROWTH AGENT
**Role:** N/A currently (internal tool)
**Status:** Dormant until SaaS launch

### 6. SUPPORT/OPERATIONS AGENT
**Role:** Handle user issues, coordinate with Chetu support
**Permissions:** Submit tickets, document issues
**Outputs:** Support log, Chetu tickets

---

## Guardrails
- Internal tool for Lifted Cannabis only (for now)
- All Cultivera orders submitted as **Backorder** (never "Submit With Corrections")
- Manual catalog entry preferred over Excel import
- Feature requests go through spec documents → Chetu

## Pending Feature Requests
| Feature | Priority | Spec Location |
|---------|----------|---------------|
| Cultivera Inventory Sync | HIGH | `/chetu-features/01-cultivera-sync.md` |
| CSV Export | MEDIUM | `/chetu-features/02-csv-export.md` |
| Order Status Tracking | LOW | `/chetu-features/03-order-status.md` |

## Integration with Other Businesses
- **LiftedPick**: CannaCart generates orders → LiftedPick verifies receiving
- **TRADING_BOT**: None
- **CONDUIT**: None (unless selling to other distributors)
