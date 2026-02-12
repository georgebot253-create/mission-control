# Mission Control - API Integrations

## Current Status

| Integration | Business | Status | Data |
|-------------|----------|--------|------|
| **Alpaca Markets** | TRADECRAFT | ✅ LIVE | Balance, P&L, Positions, Trades |
| Apollo.io | CONDUIT | ⏸️ Manual | Need API key |
| Amazon Seller | ARBITER_SUPPLY | ⏸️ Manual | Account not created |
| CJ Dropshipping | ARBITER_SUPPLY | ⏸️ Manual | Account not created |
| Cultivera Pro | CANNACART | ⏸️ Manual | No API available |

## Adding a New Integration

### 1. Create the integration file

Create `integrations/<service>.js`:

```javascript
// Example: integrations/apollo.js

const APOLLO_API_KEY = 'your-api-key';
const APOLLO_BASE = 'https://api.apollo.io/v1';

async function getApolloData() {
  try {
    const res = await fetch(`${APOLLO_BASE}/contacts/search`, {
      headers: { 'Authorization': `Bearer ${APOLLO_API_KEY}` }
    });
    const data = await res.json();
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

module.exports = { getApolloData };
```

### 2. Register in index.js

Add to `INTEGRATIONS` object:
```javascript
apollo: { 
  enabled: true, 
  name: 'Apollo.io',
  business: 'CONDUIT',
  apiKey: 'your-api-key'
},
```

### 3. Add to fetchLiveData()

```javascript
if (INTEGRATIONS.apollo.enabled) {
  const { getApolloData } = require('./apollo');
  results.apollo = await getApolloData();
}
```

### 4. Map to business metrics

In `getBusinessMetrics()`, add case for the business:
```javascript
case 'CONDUIT':
  if (liveData.apollo) {
    return {
      leads: liveData.apollo.total_contacts,
      // ... map other fields
      _live: true
    };
  }
  return { ...manual, _live: false };
```

## API Keys Needed

### Apollo.io
- Get from: https://app.apollo.io/settings/integrations/api
- Scope needed: Read contacts, Read lists

### Amazon Seller (SP-API)
- Get from: https://sellercentral.amazon.com/apps/manage
- Requires: Seller account approval, LWA credentials

### CJ Dropshipping
- Get from: https://cjdropshipping.com/developer
- Scope needed: Products, Orders

## Manual Data Updates

When APIs aren't available, update `MANUAL_DATA` in `integrations/index.js`:

```javascript
MANUAL_DATA = {
  CONDUIT: {
    leads: '100',  // Update manually
    mrr: '$0',
    // ...
  }
}
```

## Sync Schedule

- Cron runs every 30 minutes
- Frontend refreshes every 2 minutes
- Manual sync: `cd command-center && node sync.js`
