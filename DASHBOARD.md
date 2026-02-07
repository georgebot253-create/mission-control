# COMMAND CENTER DASHBOARD
*Last Updated: 2026-02-06 22:30 PST*

---

## SECTION 1 — PORTFOLIO OVERVIEW

| Business_ID | Status | Profit_24h | Spend_24h | ROAS/Margin | Health | Alerts | Approval |
|-------------|--------|------------|-----------|-------------|--------|--------|----------|
| CONDUIT | TESTING | $0 | $0 | N/A | 🟡 Warming | NO | NO |
| TRADECRAFT | TESTING | $0 | $0 | N/A | 🟢 Ready | NO | NO |
| LIFTEDPICK | TESTING | $0 | $0 | 100% | 🟢 Live | NO | NO |

**Legend:** 🟢 Operational | 🟡 Setup/Waiting | 🔴 Error/Paused

---

## SECTION 2 — BUSINESS CARDS

### CONDUIT
| Field | Value |
|-------|-------|
| Business_ID | CONDUIT |
| Business_Type | Agency |
| Status | TESTING |
| NorthStarKPI | MRR |
| Health | 🟡 Email warmup in progress |

**KPIs_24h**
| Revenue | Profit | Spend | CAC | Refunds |
|---------|--------|-------|-----|---------|
| $0 | $0 | $0 | N/A | $0 |

**KPIs_7d**
| Revenue | Profit | Spend | CAC | Refunds |
|---------|--------|-------|-----|---------|
| $0 | $0 | $0 | N/A | $0 |

**Budget_Caps**
| ads_cap | tools_cap | monthly_cap |
|---------|-----------|-------------|
| $100/campaign | $250/mo | $500/mo |

**Guardrails**
- margin_floor: 70%
- CAC_max: $150
- prohibited: No spam, CAN-SPAM/GDPR compliant

**Top_Risks**
1. Email deliverability during warmup
2. No clients yet

**Human_Approvals_Needed:** NO

---

### TRADECRAFT
| Field | Value |
|-------|-------|
| Business_ID | TRADECRAFT |
| Business_Type | Algorithmic Trading |
| Status | TESTING |
| NorthStarKPI | Daily P&L |
| Health | 🟢 Ready for market open |

**KPIs_24h**
| Revenue | Profit | Spend | Win Rate | Trades |
|---------|--------|-------|----------|--------|
| $0 | $0 | $0 | N/A | 0 |

**KPIs_7d**
| Revenue | Profit | Spend | Win Rate | Trades |
|---------|--------|-------|----------|--------|
| $0 | $0 | $0 | N/A | 0 |

**Budget_Caps**
| daily_loss_limit | max_per_trade | max_trades_day |
|------------------|---------------|----------------|
| $2,000 | $10,000 | 4 |

**Guardrails**
- HARD STOP at $2k daily loss
- Paper trading only until approval
- 3 consecutive losses → pause

**Top_Risks**
1. Market volatility
2. API connectivity

**Human_Approvals_Needed:** NO

---

### LIFTEDPICK
| Field | Value |
|-------|-------|
| Business_ID | LIFTEDPICK |
| Business_Type | SaaS (Internal) |
| Status | TESTING |
| NorthStarKPI | Verification Accuracy |
| Health | 🟢 Production live |

**KPIs_24h**
| Orders Verified | Accuracy | Mispulls Caught | Avg Time |
|-----------------|----------|-----------------|----------|
| 0 | N/A | 0 | N/A |

**KPIs_7d**
| Orders Verified | Accuracy | Mispulls Caught | Avg Time |
|-----------------|----------|-----------------|----------|
| 0 | N/A | 0 | N/A |

**Budget_Caps**
| hosting | development |
|---------|-------------|
| $0 (free tier) | Internal |

**Guardrails**
- Internal tool only
- No external customer data

**Top_Risks**
1. Adoption by staff
2. Scanner hardware needed

**Human_Approvals_Needed:** NO

---

## SECTION 3 — TODAY'S PRIORITIES

| # | Business_ID | Task | Agent | Impact | Approval | Command |
|---|-------------|------|-------|--------|----------|---------|
| 1 | CONDUIT | Set up Stripe account | Human | HIGH | YES | Manual: stripe.com |
| 2 | TRADECRAFT | Implement Telegram notifications | Dexter | MED | NO | `/task TRADECRAFT telegram_alerts` |
| 3 | LIFTEDPICK | Install watcher on sales PC | Human | MED | NO | Run install_windows.bat |

---

## SECTION 4 — ACTIVE TESTS & SCALING

| Test_ID | Business_ID | Age | Spend | Revenue | CAC | Decision |
|---------|-------------|-----|-------|---------|-----|----------|
| ORB_SPREADS_01 | TRADECRAFT | 0d | $0 | $0 | N/A | TESTING |
| EMAIL_WARMUP_01 | CONDUIT | 1d | $0 | $0 | N/A | TESTING |
| PROD_DEPLOY_01 | LIFTEDPICK | 1d | $0 | $0 | N/A | TESTING |

**Countdown Timers:**
- CONDUIT warmup complete: ~18 days
- TRADECRAFT next market open: Mon 6:30 AM PST

---

## SECTION 5 — RECENT LOGS

| Timestamp | Business_ID | Agent | Action | Reason | Result | Log_ID |
|-----------|-------------|-------|--------|--------|--------|--------|
| 2026-02-06 22:30 | ALL | George | Dashboard initialized | New system | ✅ Success | LOG_001 |
| 2026-02-06 22:19 | ALL | George | Command Center deployed | Architecture spec | ✅ Success | LOG_002 |
| 2026-02-06 19:30 | CONDUIT | George | Email warmup enabled | Instantly setup | ✅ Success | LOG_003 |
| 2026-02-06 17:00 | LIFTEDPICK | Dexter | Production deployed | Fly.io | ✅ Success | LOG_004 |

---

## COMMANDS

| Command | Output |
|---------|--------|
| `Business_ID=CONDUIT` | Portfolio line + Business Card + Priorities |
| `/portfolio` | Portfolio Overview + Top 5 actions |
| `/daily Business_ID=...` | Daily report + deltas |
| `/new_business` | Initialize new business cluster |

---

*Dashboard Mirroring Active*
