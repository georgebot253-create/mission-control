# TRADECRAFT — Business Card
*"Precision trading, forged by algorithms"*

## Identity
| Field | Value |
|-------|-------|
| Business_ID | TRADECRAFT |
| Business_Type | Other (Algorithmic Trading) |
| Owner | Anthony Ferro |
| Risk_Level | High |
| Status | Active |

## Description
Automated options trading system using Opening Range Breakout (ORB) strategy with 0DTE SPX options.

## Assets
| Asset | Location |
|-------|----------|
| Codebase | `/projects/alpaca-trading-bot/` |
| Main Script | `alpaca_orb_bot.py` |
| Config | `config.py` |

## Accounts
| Service | Purpose |
|---------|---------|
| Alpaca | Paper trading (transitioning to live) |

## KPIs
| Metric | Target | Current |
|--------|--------|---------|
| Win Rate | >55% | Tracking |
| Daily P&L | +$200 | Tracking |
| Max Drawdown | <$2,000 | Enforced |
| Sharpe Ratio | >1.5 | Tracking |

## Risk Parameters
| Parameter | Value |
|-----------|-------|
| Max Risk Per Trade | $10,000 |
| Max Trades/Day | 4 |
| Daily Loss Limit | $2,000 (HARD STOP) |
| Account Balance | $100,000 (paper) |

## Budget Caps
| Category | Limit | Period |
|----------|-------|--------|
| Max Daily Loss | $2,000 | Daily |
| Max Position Size | $10,000 | Per trade |

---

## AGENT CLUSTER

### 1. STRATEGY AGENT
**Role:** Define trading strategy, set risk parameters
**Permissions:** Read-only access to performance data
**Outputs:** Weekly performance review, strategy adjustments

### 2. RESEARCH AGENT
**Role:** Backtest strategies, analyze market conditions
**Permissions:** Historical data access, no live trading
**Outputs:** Backtest reports, market regime analysis

### 3. EXECUTION AGENT
**Role:** Execute approved trades via Alpaca API
**Permissions:** Place orders within risk limits
**Constraints:** 
- Must respect daily loss limit
- Must respect max trades/day
- No manual overrides without approval
**Outputs:** Trade logs, execution confirmations

### 4. PRICING/OPTIMIZATION AGENT
**Role:** Optimize entry/exit timing, position sizing
**Permissions:** Adjust parameters within bands
**Constraints:** Cannot exceed risk limits
**Outputs:** Parameter optimization reports

### 5. ADS/GROWTH AGENT
**Role:** N/A for this business
**Status:** Disabled

### 6. SUPPORT/OPERATIONS AGENT
**Role:** Monitor bot health, alert on errors
**Permissions:** Restart bot, send notifications
**Constraints:** Cannot modify trading parameters
**Outputs:** Health logs, error alerts

---

## Guardrails
- **HARD STOP:** Bot pauses if daily loss hits $2,000
- **NO** live trading without explicit human approval
- **NO** margin/leverage beyond account equity
- Trade notifications to Telegram (6711228839) — PENDING IMPLEMENTATION

## Safety Rules
| Trigger | Action |
|---------|--------|
| Daily loss limit hit | Pause trading for day |
| API error | Pause bot, notify Anthony |
| Unusual market volatility | Reduce position size 50% |
| 3 consecutive losses | Pause, await human review |
