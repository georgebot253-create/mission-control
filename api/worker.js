// Mission Control API - Cloudflare Worker
// v2.0 - Agent Ops System

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // ============================================
    // BUSINESS DATA ENDPOINTS (Original)
    // ============================================
    
    if (url.pathname === '/api/businesses') {
      const data = await env.MISSION_CONTROL.get('businesses', 'json') || [];
      return Response.json(data, { headers: corsHeaders });
    }

    // GET activity log
    if (url.pathname === '/api/activity' && request.method === 'GET') {
      const limit = parseInt(url.searchParams.get('limit') || '50');
      const data = await env.MISSION_CONTROL.get('activity', 'json') || [];
      return Response.json(data.slice(0, limit), { headers: corsHeaders });
    }
    
    // POST new activity (no auth required - public logging)
    if (url.pathname === '/api/activity' && request.method === 'POST') {
      const body = await request.json();
      
      const activity = {
        id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: body.type || 'general',       // trade, message, wake, system, task
        icon: body.icon || 'activity',      // Bootstrap icon name
        text: body.text,
        business: body.business || 'SYSTEM', // TRADECRAFT, CONDUIT, LIFTED, etc.
        meta: body.meta || {},              // Additional data
        created_at: new Date().toISOString()
      };
      
      const existing = await env.MISSION_CONTROL.get('activity', 'json') || [];
      const updated = [activity, ...existing].slice(0, 200); // Keep last 200
      await env.MISSION_CONTROL.put('activity', JSON.stringify(updated));
      
      return Response.json({ ok: true, activity_id: activity.id }, { headers: corsHeaders });
    }

    if (url.pathname === '/api/stats') {
      const data = await env.MISSION_CONTROL.get('stats', 'json') || {};
      return Response.json(data, { headers: corsHeaders });
    }
    
    // ============================================
    // TRADECRAFT ENDPOINTS
    // ============================================
    
    // GET trade history
    if (url.pathname === '/api/tradecraft/trades' && request.method === 'GET') {
      const data = await env.MISSION_CONTROL.get('tradecraft_trades', 'json') || [];
      return Response.json(data, { headers: corsHeaders });
    }
    
    // POST new trade (called by George when TradeCraft executes)
    if (url.pathname === '/api/tradecraft/trades' && request.method === 'POST') {
      const body = await request.json();
      
      const trade = {
        id: `trade-${Date.now()}`,
        date: body.date,
        entry_time: body.entry_time,
        exit_time: body.exit_time,
        spread: `${body.short_strike}/${body.long_strike}`,
        short_strike: body.short_strike,
        long_strike: body.long_strike,
        contracts: body.contracts,
        credit: body.credit_received,
        exit_price: body.exit_price,
        pnl: body.pnl,
        pnl_pct: body.pnl_pct,
        exit_reason: body.exit_reason,
        dte: body.dte,
        vix: body.vix_at_entry,
        spy_price: body.spx_at_entry,
        created_at: new Date().toISOString()
      };
      
      const existing = await env.MISSION_CONTROL.get('tradecraft_trades', 'json') || [];
      const updated = [trade, ...existing].slice(0, 100); // Keep last 100 trades
      await env.MISSION_CONTROL.put('tradecraft_trades', JSON.stringify(updated));
      
      // Also log to activity feed
      const pnlSign = trade.pnl >= 0 ? '+' : '';
      const activityText = `${trade.spread} x${trade.contracts}: ${pnlSign}$${trade.pnl.toFixed(2)} (${trade.exit_reason})`;
      const activityType = trade.pnl >= 0 ? 'trade' : 'error';
      
      const activity = {
        id: `act-${Date.now()}-trade`,
        type: activityType,
        icon: trade.pnl >= 0 ? 'graph-up-arrow' : 'graph-down-arrow',
        text: activityText,
        business: 'TRADECRAFT',
        meta: { trade_id: trade.id },
        created_at: new Date().toISOString()
      };
      
      const activityLog = await env.MISSION_CONTROL.get('activity', 'json') || [];
      await env.MISSION_CONTROL.put('activity', JSON.stringify([activity, ...activityLog].slice(0, 200)));
      
      return Response.json({ ok: true, trade_id: trade.id }, { headers: corsHeaders });
    }
    
    // GET TradeCraft stats summary
    if (url.pathname === '/api/tradecraft/stats') {
      const trades = await env.MISSION_CONTROL.get('tradecraft_trades', 'json') || [];
      
      const stats = {
        total_trades: trades.length,
        winning_trades: trades.filter(t => t.pnl > 0).length,
        losing_trades: trades.filter(t => t.pnl < 0).length,
        total_pnl: trades.reduce((sum, t) => sum + (t.pnl || 0), 0),
        win_rate: trades.length > 0 ? (trades.filter(t => t.pnl > 0).length / trades.length * 100).toFixed(1) : 0,
        avg_win: trades.filter(t => t.pnl > 0).length > 0 
          ? (trades.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0) / trades.filter(t => t.pnl > 0).length).toFixed(2) 
          : 0,
        avg_loss: trades.filter(t => t.pnl < 0).length > 0 
          ? (trades.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0) / trades.filter(t => t.pnl < 0).length).toFixed(2) 
          : 0
      };
      
      return Response.json(stats, { headers: corsHeaders });
    }

    // ============================================
    // AGENT OPS ENDPOINTS (New)
    // ============================================
    
    // Get all agents
    if (url.pathname === '/api/agents') {
      const data = await env.MISSION_CONTROL.get('agents', 'json') || [];
      return Response.json(data, { headers: corsHeaders });
    }
    
    // Get active sessions
    if (url.pathname === '/api/sessions') {
      const data = await env.MISSION_CONTROL.get('sessions', 'json') || [];
      return Response.json(data, { headers: corsHeaders });
    }
    
    // Get task log
    if (url.pathname === '/api/tasks') {
      const limit = parseInt(url.searchParams.get('limit') || '50');
      const data = await env.MISSION_CONTROL.get('tasks', 'json') || [];
      return Response.json(data.slice(0, limit), { headers: corsHeaders });
    }
    
    // Get cron jobs
    if (url.pathname === '/api/cron') {
      const data = await env.MISSION_CONTROL.get('cron_jobs', 'json') || [];
      return Response.json(data, { headers: corsHeaders });
    }
    
    // Get system metrics
    if (url.pathname === '/api/metrics') {
      const data = await env.MISSION_CONTROL.get('metrics', 'json') || {};
      return Response.json(data, { headers: corsHeaders });
    }

    // ============================================
    // SYNC ENDPOINT (Enhanced)
    // ============================================
    
    if (url.pathname === '/api/sync' && request.method === 'POST') {
      const authHeader = request.headers.get('Authorization');
      const expectedToken = env.SYNC_TOKEN;
      
      if (authHeader !== `Bearer ${expectedToken}`) {
        return new Response('Unauthorized', { status: 401, headers: corsHeaders });
      }

      const body = await request.json();
      const synced = [];
      
      // Original data
      if (body.businesses) {
        await env.MISSION_CONTROL.put('businesses', JSON.stringify(body.businesses));
        synced.push('businesses');
      }
      if (body.activity) {
        await env.MISSION_CONTROL.put('activity', JSON.stringify(body.activity));
        synced.push('activity');
      }
      if (body.stats) {
        await env.MISSION_CONTROL.put('stats', JSON.stringify(body.stats));
        synced.push('stats');
      }
      
      // Agent ops data
      if (body.agents) {
        await env.MISSION_CONTROL.put('agents', JSON.stringify(body.agents));
        synced.push('agents');
      }
      if (body.sessions) {
        await env.MISSION_CONTROL.put('sessions', JSON.stringify(body.sessions));
        synced.push('sessions');
      }
      if (body.tasks) {
        // Append to existing tasks (keep last 500)
        const existing = await env.MISSION_CONTROL.get('tasks', 'json') || [];
        const merged = [...body.tasks, ...existing].slice(0, 500);
        await env.MISSION_CONTROL.put('tasks', JSON.stringify(merged));
        synced.push('tasks');
      }
      if (body.cron_jobs) {
        await env.MISSION_CONTROL.put('cron_jobs', JSON.stringify(body.cron_jobs));
        synced.push('cron_jobs');
      }
      if (body.metrics) {
        await env.MISSION_CONTROL.put('metrics', JSON.stringify(body.metrics));
        synced.push('metrics');
      }

      return Response.json({ 
        ok: true, 
        synced,
        timestamp: new Date().toISOString()
      }, { headers: corsHeaders });
    }
    
    // ============================================
    // TASK LOGGING ENDPOINT
    // ============================================
    
    if (url.pathname === '/api/tasks/log' && request.method === 'POST') {
      const authHeader = request.headers.get('Authorization');
      const expectedToken = env.SYNC_TOKEN;
      
      if (authHeader !== `Bearer ${expectedToken}`) {
        return new Response('Unauthorized', { status: 401, headers: corsHeaders });
      }

      const task = await request.json();
      task.logged_at = new Date().toISOString();
      
      const existing = await env.MISSION_CONTROL.get('tasks', 'json') || [];
      const updated = [task, ...existing].slice(0, 500);
      await env.MISSION_CONTROL.put('tasks', JSON.stringify(updated));

      return Response.json({ ok: true, task_id: task.id }, { headers: corsHeaders });
    }

    // ============================================
    // CONTROL PLANE ENDPOINTS (Phase 2)
    // ============================================
    
    // Queue a command (spawn, kill, pause, resume)
    if (url.pathname === '/api/commands' && request.method === 'POST') {
      const body = await request.json();
      
      // Commands don't require auth - they're queued and George executes on next sync
      const command = {
        id: `cmd-${Date.now()}`,
        type: body.type, // spawn, kill, pause, resume, priority
        agent: body.agent,
        task: body.task,
        target_task_id: body.target_task_id,
        priority: body.priority,
        status: 'pending',
        created_at: new Date().toISOString()
      };
      
      const existing = await env.MISSION_CONTROL.get('command_queue', 'json') || [];
      existing.push(command);
      await env.MISSION_CONTROL.put('command_queue', JSON.stringify(existing));
      
      return Response.json({ 
        ok: true, 
        command_id: command.id,
        message: 'Command queued. George will execute on next sync.'
      }, { headers: corsHeaders });
    }
    
    // Get pending commands (George calls this)
    if (url.pathname === '/api/commands' && request.method === 'GET') {
      const authHeader = request.headers.get('Authorization');
      const expectedToken = env.SYNC_TOKEN;
      
      if (authHeader !== `Bearer ${expectedToken}`) {
        return new Response('Unauthorized', { status: 401, headers: corsHeaders });
      }
      
      const commands = await env.MISSION_CONTROL.get('command_queue', 'json') || [];
      const pending = commands.filter(c => c.status === 'pending');
      return Response.json(pending, { headers: corsHeaders });
    }
    
    // Mark command as executed
    if (url.pathname === '/api/commands/complete' && request.method === 'POST') {
      const authHeader = request.headers.get('Authorization');
      const expectedToken = env.SYNC_TOKEN;
      
      if (authHeader !== `Bearer ${expectedToken}`) {
        return new Response('Unauthorized', { status: 401, headers: corsHeaders });
      }
      
      const body = await request.json();
      const commands = await env.MISSION_CONTROL.get('command_queue', 'json') || [];
      
      const updated = commands.map(c => {
        if (c.id === body.command_id) {
          return { ...c, status: body.status || 'completed', result: body.result, completed_at: new Date().toISOString() };
        }
        return c;
      });
      
      // Keep only last 100 commands
      await env.MISSION_CONTROL.put('command_queue', JSON.stringify(updated.slice(-100)));
      
      return Response.json({ ok: true }, { headers: corsHeaders });
    }
    
    // Update agent status (pause/resume)
    if (url.pathname === '/api/agents/status' && request.method === 'POST') {
      const authHeader = request.headers.get('Authorization');
      const expectedToken = env.SYNC_TOKEN;
      
      if (authHeader !== `Bearer ${expectedToken}`) {
        return new Response('Unauthorized', { status: 401, headers: corsHeaders });
      }
      
      const body = await request.json();
      const agents = await env.MISSION_CONTROL.get('agents', 'json') || [];
      
      const updated = agents.map(a => {
        if (a.id === body.agent_id) {
          return { ...a, status: body.status };
        }
        return a;
      });
      
      await env.MISSION_CONTROL.put('agents', JSON.stringify(updated));
      return Response.json({ ok: true }, { headers: corsHeaders });
    }

    // ============================================
    // MESSAGING ENDPOINTS
    // ============================================
    
    // Send a message to George (queued for pickup)
    if (url.pathname === '/api/messages' && request.method === 'POST') {
      const body = await request.json();
      
      const message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        from: body.from || 'Anthony',
        text: body.text,
        agent: body.agent || 'george', // Target agent (george, rex, dexter, etc.)
        priority: body.priority || 'normal',
        status: 'pending',
        created_at: new Date().toISOString()
      };
      
      const existing = await env.MISSION_CONTROL.get('message_queue', 'json') || [];
      existing.push(message);
      await env.MISSION_CONTROL.put('message_queue', JSON.stringify(existing));
      
      return Response.json({ 
        ok: true, 
        message_id: message.id,
        info: 'Message queued. George checks every sync cycle.'
      }, { headers: corsHeaders });
    }
    
    // Get pending messages (George polls this)
    if (url.pathname === '/api/messages' && request.method === 'GET') {
      const authHeader = request.headers.get('Authorization');
      const expectedToken = env.SYNC_TOKEN;
      
      if (authHeader !== `Bearer ${expectedToken}`) {
        return new Response('Unauthorized', { status: 401, headers: corsHeaders });
      }
      
      const messages = await env.MISSION_CONTROL.get('message_queue', 'json') || [];
      const pending = messages.filter(m => m.status === 'pending');
      return Response.json(pending, { headers: corsHeaders });
    }
    
    // Mark messages as read/processed
    if (url.pathname === '/api/messages/ack' && request.method === 'POST') {
      const authHeader = request.headers.get('Authorization');
      const expectedToken = env.SYNC_TOKEN;
      
      if (authHeader !== `Bearer ${expectedToken}`) {
        return new Response('Unauthorized', { status: 401, headers: corsHeaders });
      }
      
      const body = await request.json();
      const messageIds = body.message_ids || [];
      
      const messages = await env.MISSION_CONTROL.get('message_queue', 'json') || [];
      const updated = messages.map(m => {
        if (messageIds.includes(m.id)) {
          return { ...m, status: 'read', read_at: new Date().toISOString() };
        }
        return m;
      });
      
      // Keep only last 200 messages
      await env.MISSION_CONTROL.put('message_queue', JSON.stringify(updated.slice(-200)));
      
      return Response.json({ ok: true, acked: messageIds.length }, { headers: corsHeaders });
    }
    
    // Get message history (for UI display)
    if (url.pathname === '/api/messages/history') {
      const limit = parseInt(url.searchParams.get('limit') || '50');
      const messages = await env.MISSION_CONTROL.get('message_queue', 'json') || [];
      return Response.json(messages.slice(-limit), { headers: corsHeaders });
    }

    // ============================================
    // BOT STATUS ENDPOINTS
    // ============================================
    
    // Get all bot statuses
    if (url.pathname === '/api/bots' && request.method === 'GET') {
      const data = await env.MISSION_CONTROL.get('bot_status', 'json') || {};
      return Response.json(data, { headers: corsHeaders });
    }
    
    // Update bot status (called by bots on startup/shutdown)
    if (url.pathname === '/api/bots' && request.method === 'POST') {
      const body = await request.json();
      
      const existing = await env.MISSION_CONTROL.get('bot_status', 'json') || {};
      
      existing[body.bot_id] = {
        name: body.name,
        status: body.status, // running, stopped, error
        pid: body.pid,
        account: body.account,
        strategy: body.strategy,
        capital: body.capital,
        symbols: body.symbols,
        pnl_today: body.pnl_today || 0,
        trades_today: body.trades_today || 0,
        last_heartbeat: new Date().toISOString(),
        meta: body.meta || {}
      };
      
      await env.MISSION_CONTROL.put('bot_status', JSON.stringify(existing));
      
      return Response.json({ ok: true, bot_id: body.bot_id }, { headers: corsHeaders });
    }
    
    // Bot heartbeat (lightweight status update)
    if (url.pathname === '/api/bots/heartbeat' && request.method === 'POST') {
      const body = await request.json();
      
      const existing = await env.MISSION_CONTROL.get('bot_status', 'json') || {};
      
      if (existing[body.bot_id]) {
        existing[body.bot_id].last_heartbeat = new Date().toISOString();
        existing[body.bot_id].pnl_today = body.pnl_today || existing[body.bot_id].pnl_today;
        existing[body.bot_id].trades_today = body.trades_today || existing[body.bot_id].trades_today;
        existing[body.bot_id].status = body.status || existing[body.bot_id].status;
        
        await env.MISSION_CONTROL.put('bot_status', JSON.stringify(existing));
      }
      
      return Response.json({ ok: true }, { headers: corsHeaders });
    }

    // ============================================
    // HEALTH CHECK
    // ============================================
    
    if (url.pathname === '/api/health') {
      return Response.json({ 
        status: 'ok', 
        version: '2.2',
        timestamp: new Date().toISOString(),
        features: ['businesses', 'agents', 'sessions', 'tasks', 'cron', 'metrics', 'commands', 'messages', 'bots']
      }, { headers: corsHeaders });
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders });
  }
};
