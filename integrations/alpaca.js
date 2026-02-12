// Alpaca Markets API Integration
const ALPACA_API_KEY = 'PK64FBIDPV3O2DZIL7ZQI4GLHC';
const ALPACA_SECRET = '24EpVviJdHvpiuGwj7hLLNS4UrhvQVCmaE1vvTgGWgex';
const ALPACA_BASE = 'https://paper-api.alpaca.markets';

async function getAlpacaData() {
  const headers = {
    'APCA-API-KEY-ID': ALPACA_API_KEY,
    'APCA-API-SECRET-KEY': ALPACA_SECRET
  };

  try {
    // Get account info
    const accountRes = await fetch(`${ALPACA_BASE}/v2/account`, { headers });
    const account = await accountRes.json();

    // Get positions
    const positionsRes = await fetch(`${ALPACA_BASE}/v2/positions`, { headers });
    const positions = await positionsRes.json();

    // Get today's portfolio history for P&L
    const today = new Date().toISOString().split('T')[0];
    const historyRes = await fetch(`${ALPACA_BASE}/v2/account/portfolio/history?period=1D&timeframe=1D`, { headers });
    const history = await historyRes.json();

    // Calculate daily P&L
    const equity = parseFloat(account.equity || 0);
    const lastEquity = parseFloat(account.last_equity || equity);
    const dailyPnL = equity - lastEquity;

    // Get today's orders for trade count
    const ordersRes = await fetch(`${ALPACA_BASE}/v2/orders?status=closed&after=${today}T00:00:00Z`, { headers });
    const orders = await ordersRes.json();

    return {
      success: true,
      data: {
        equity: equity.toFixed(2),
        buying_power: parseFloat(account.buying_power || 0).toFixed(2),
        daily_pnl: dailyPnL.toFixed(2),
        daily_pnl_pct: ((dailyPnL / lastEquity) * 100).toFixed(2),
        positions_count: Array.isArray(positions) ? positions.length : 0,
        trades_today: Array.isArray(orders) ? orders.length : 0,
        status: account.status || 'unknown',
        is_market_open: false // Will check separately
      }
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
      data: null
    };
  }
}

async function isMarketOpen() {
  const headers = {
    'APCA-API-KEY-ID': ALPACA_API_KEY,
    'APCA-API-SECRET-KEY': ALPACA_SECRET
  };

  try {
    const res = await fetch(`${ALPACA_BASE}/v2/clock`, { headers });
    const clock = await res.json();
    return clock.is_open || false;
  } catch {
    return false;
  }
}

module.exports = { getAlpacaData, isMarketOpen };
