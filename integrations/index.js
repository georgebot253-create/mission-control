// Mission Control - API Integrations Manager
// Add new integrations here as they become available

const { getAlpacaData, isMarketOpen } = require('./alpaca');

// Integration status tracking
const INTEGRATIONS = {
  alpaca: { 
    enabled: true, 
    name: 'Alpaca Markets',
    business: 'TRADECRAFT'
  },
  apollo: { 
    enabled: false, // TODO: Add API key
    name: 'Apollo.io',
    business: 'CONDUIT',
    apiKey: null
  },
  amazon: {
    enabled: false, // Not set up yet
    name: 'Amazon Seller',
    business: 'ARBITER_SUPPLY',
    apiKey: null
  },
  cj_dropshipping: {
    enabled: false, // Not set up yet
    name: 'CJ Dropshipping',
    business: 'ARBITER_SUPPLY',
    apiKey: null
  },
  cultivera: {
    enabled: false, // No API available
    name: 'Cultivera Pro',
    business: 'CANNACART',
    apiKey: null
  }
};

// Manual data fallbacks (used when API not available)
const MANUAL_DATA = {
  CONDUIT: {
    leads: '100',
    mrr: '$0',
    clients: '0',
    warmup: 'In Progress',
    reply_rate: '—',
    deliverability: 'Warming'
  },
  TRADECRAFT: {
    // Will be overwritten by live API
    daily_pnl: '$0',
    total_trades: '0',
    win_rate: '—',
    balance: '$100K',
    status: 'Disabled'
  },
  LIFTEDPICK: {
    scans: '0',
    accuracy: '100%',
    orders: '0',
    users: '2',
    status: 'Ready'
  },
  ARBITER_SUPPLY: {
    products_found: '52',
    products_listed: '0',
    orders: '0',
    revenue: '$0',
    amazon_account: 'Pending'
  },
  ATLAS_DIGITAL: {
    sites: '0',
    traffic: '0',
    revenue: '$0',
    status: 'On Hold'
  },
  CANNACART: {
    orders_generated: '11',
    stores: '38',
    products_mapped: '326',
    accuracy: '>95%',
    time_saved: '30 min/order'
  }
};

// Fetch live data from all enabled integrations
async function fetchLiveData() {
  const results = {
    alpaca: null,
    apollo: null,
    amazon: null
  };

  // Alpaca
  if (INTEGRATIONS.alpaca.enabled) {
    try {
      const alpacaData = await getAlpacaData();
      const marketOpen = await isMarketOpen();
      if (alpacaData.success) {
        alpacaData.data.is_market_open = marketOpen;
        results.alpaca = alpacaData.data;
      }
    } catch (err) {
      console.error('Alpaca API error:', err.message);
    }
  }

  // Apollo (placeholder for future)
  if (INTEGRATIONS.apollo.enabled && INTEGRATIONS.apollo.apiKey) {
    // TODO: Implement Apollo API
    // results.apollo = await getApolloData();
  }

  // Amazon (placeholder for future)
  if (INTEGRATIONS.amazon.enabled && INTEGRATIONS.amazon.apiKey) {
    // TODO: Implement Amazon SP-API
    // results.amazon = await getAmazonData();
  }

  return results;
}

// Get metrics for a specific business, with live data where available
async function getBusinessMetrics(businessId) {
  const liveData = await fetchLiveData();
  const manual = MANUAL_DATA[businessId] || {};

  switch (businessId) {
    case 'TRADECRAFT':
      if (liveData.alpaca) {
        const a = liveData.alpaca;
        return {
          daily_pnl: `$${a.daily_pnl}`,
          trades_today: a.trades_today.toString(),
          positions: a.positions_count.toString(),
          balance: `$${(parseFloat(a.equity) / 1000).toFixed(0)}K`,
          buying_power: `$${(parseFloat(a.buying_power) / 1000).toFixed(0)}K`,
          market: a.is_market_open ? 'Open' : 'Closed',
          _live: true
        };
      }
      return { ...manual, _live: false };

    case 'CONDUIT':
      // TODO: Pull from Apollo when API key added
      return { ...manual, _live: false };

    case 'ARBITER_SUPPLY':
      // TODO: Pull from Amazon when account set up
      return { ...manual, _live: false };

    default:
      return { ...manual, _live: false };
  }
}

// Get integration status for display
function getIntegrationStatus() {
  return Object.entries(INTEGRATIONS).map(([key, val]) => ({
    id: key,
    name: val.name,
    enabled: val.enabled,
    business: val.business,
    hasApiKey: !!val.apiKey
  }));
}

module.exports = {
  fetchLiveData,
  getBusinessMetrics,
  getIntegrationStatus,
  MANUAL_DATA,
  INTEGRATIONS
};
