# LIFTEDPICK — Business Card

## Identity
| Field | Value |
|-------|-------|
| Business_ID | LIFTEDPICK |
| Business_Type | SaaS (Internal Tool) |
| Owner | Anthony Ferro / Lifted Cannabis |
| Risk_Level | Low |
| Status | Active |

## Description
Barcode verification system for cannabis shipment receiving. Currently internal tool for Lifted Cannabis operations, potential future external SaaS product.

## Assets
| Asset | Location |
|-------|----------|
| Production URL | https://liftedpick.fly.dev |
| Web UI | https://liftedpick.fly.dev/ui |
| Codebase | `/projects/liftedpick/` |
| SOP | `/projects/liftedpick/docs/LiftedPick_SOP.md` |
| Watcher | `/projects/liftedpick/watcher/` |

## Accounts
| Service | Email | Purpose |
|---------|-------|---------|
| Fly.io | georgebot253@gmail.com | Hosting |

## User Accounts
| Username | Password | Purpose |
|----------|----------|---------|
| lifted | cannabis2026 | Staff account |
| anthony | lifted420 | Admin account |

## KPIs
| Metric | Target | Current |
|--------|--------|---------|
| Verification Accuracy | 100% | Tracking |
| Time per Order | <15 min | Tracking |
| Mispull Detection | 100% | Tracking |
| Uptime | 99.9% | Active |

## Budget Caps
| Category | Limit | Period |
|----------|-------|--------|
| Hosting (Fly.io) | $0 | Monthly (free tier) |
| Development | Internal | As needed |

---

## AGENT CLUSTER

### 1. STRATEGY AGENT
**Role:** Define product roadmap, prioritize features
**Permissions:** Read-only usage data
**Outputs:** Feature prioritization, expansion recommendations

### 2. RESEARCH AGENT
**Role:** Identify market opportunities for SaaS expansion
**Permissions:** External research, competitor analysis
**Constraints:** Focus on cannabis/logistics verticals
**Outputs:** Market analysis, pricing research

### 3. EXECUTION AGENT
**Role:** Implement features, fix bugs, deploy updates
**Permissions:** Code changes, deployments
**Constraints:** 
- Test before deploy
- No breaking changes to production
**Outputs:** Release notes, deployment logs

### 4. PRICING/OPTIMIZATION AGENT
**Role:** N/A currently (internal tool)
**Status:** Dormant until SaaS launch

### 5. ADS/GROWTH AGENT
**Role:** N/A currently (internal tool)
**Status:** Dormant until SaaS launch

### 6. SUPPORT/OPERATIONS AGENT
**Role:** Handle user issues, monitor system health
**Permissions:** View logs, restart services
**Constraints:** Escalate data issues
**Outputs:** Support log, health reports

---

## Guardrails
- Internal tool only until explicit SaaS launch approval
- No customer data shared externally
- All manifests are sensitive cannabis compliance data
- Maintain audit trail for all verifications

## Features
| Feature | Status |
|---------|--------|
| PDF Manifest Parsing | ✅ Active |
| Barcode Scanning | ✅ Active |
| Quick Count (25+ units) | ✅ Active |
| Photo Verification | ✅ Active |
| Mispull Tracking | ✅ Active |
| Login System | ✅ Active |
| Watcher (Auto-upload) | ✅ Active |

## Future Roadmap (Pending Approval)
- [ ] Multi-tenant SaaS version
- [ ] API integrations (Cultivera, METRC)
- [ ] Mobile native app
- [ ] Analytics dashboard
