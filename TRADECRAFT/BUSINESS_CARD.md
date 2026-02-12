# TRADECRAFT — Business Card
*"Precision trading, forged by algorithms"*

## Identity
| Field | Value |
|-------|-------|
| Business_ID | TRADECRAFT |
| Business_Type | Algorithmic Trading |
| Owner | Anthony Ferro |
| Risk_Level | High |
| Status | **LIVE (Paper)** |

## Description
Multi-strategy automated trading system running two independent bots:
1. **SPY Blended Bot** - Mean Reversion + Credit Spreads on SPY
2. **Tech Momentum Bot** - Breakout trading on TSLA, MSFT, NVDA, AAPL

## Active Bots

### SPY Blended Bot (Account 1)
| Field | Value |
|-------|-------|
| Location | `/projects/alpaca-trading-bot/main_blended.py` |
| PID | 62297 |
| Capital | $100,000 (paper) |
| Strategy | 60/30/10 - Mean Reversion / Credit Spreads / Cash |
| API Key | PK64FBIDPV3O2DZIL7ZQI4GLHC |

### Tech Momentum Bot (Account 2)
| Field | Value |
|-------|-------|
| Location | `/projects/tech-momentum-bot/main.py` |
| PID | 65416 |
| Capital | $100,000 (paper) |
| Symbols | TSLA, MSFT, NVDA, AAPL |
| Strategy | 15-min breakout + RSI + VWAP + volume |
| API Key | PKVZUGAAVWEDYXRO2J7SNE7ZFK |

## Accounts
| Account | Email | Purpose |
|---------|-------|---------|
| Alpaca #1 | (original) | SPY Blended Bot |
| Alpaca #2 | anthony@hardhatledger.com | Tech Momentum Bot |

## KPIs
| Metric | Target | Current |
|--------|--------|---------|
| Win Rate | >55% | Tracking |
| Monthly Return | 8-11% | Tracking |
| Max Drawdown | <$2,000/day | Enforced |
| Blended Win Rate | ~65% | Tracking |

## Risk Parameters
| Parameter | SPY Bot | Tech Bot |
|-----------|---------|----------|
| Max Daily Drawdown | 2% ($2K) | 2% ($2K) |
| Emergency Stop | $5K | $5K |
| Max Concurrent Positions | 10 | 2 |
| Max VIX | 30 | 30 |

## Key Rules
- **DAY TRADES ONLY** - All positions flat by 3:55 PM ET
- **No overnight holds** - Anthony's firm requirement
- **IEX data feed** - Free tier Alpaca (no SIP)
- **Paper trading** - Until human approval for live

## Budget Caps
| Category | Limit |
|----------|-------|
| Max Daily Loss (per bot) | $2,000 |
| Max Position Size | $10,000 |
| Emergency Stop (per bot) | $5,000 |

---

## Mission Control Integration
- **Activity Feed**: Bots post status to `/api/activity`
- **Status Reporting**: Startup/shutdown notifications
- **Health Checks**: `scripts/check-bots.sh`

## Guardrails
- **HARD STOP:** Bot pauses if daily loss hits $2,000
- **NO** live trading without explicit human approval
- **NO** overnight positions
- Trade notifications to Telegram (6711228839)

## Last Updated
2026-02-11 23:00 PST
