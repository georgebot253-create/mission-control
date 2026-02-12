#!/bin/bash
# Mission Control Status Script
# Quick overview of all systems

echo "=============================================="
echo "    MISSION CONTROL STATUS"
echo "    $(date '+%Y-%m-%d %H:%M:%S %Z')"
echo "=============================================="
echo

# Trading Bots
echo "🤖 TRADING BOTS"
echo "---------------"
SPY_PID=$(pgrep -f "main_blended.py" 2>/dev/null)
# Tech momentum bot - find by checking working directory or known PID
TECH_PID=""
# First check if PID 65416 is running (known tech bot PID)
if ps -p 65416 > /dev/null 2>&1; then
    TECH_PID="65416"
fi
# Also try to find any main.py that's NOT main_blended.py
if [ -z "$TECH_PID" ]; then
    TECH_PID=$(ps aux | grep "Python main.py$" | grep -v grep | awk '{print $2}' | head -1)
fi

if [ -n "$SPY_PID" ]; then
    echo "  ✅ SPY Blended Bot: Running (PID: $SPY_PID)"
else
    echo "  ❌ SPY Blended Bot: STOPPED"
fi

if [ -n "$TECH_PID" ]; then
    echo "  ✅ Tech Momentum Bot: Running (PID: $TECH_PID)"
else
    echo "  ❌ Tech Momentum Bot: STOPPED"
fi
echo

# Services
echo "🌐 SERVICES"
echo "-----------"

# MC API
MC_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://mission-control-api.georgebot253.workers.dev/api/health" 2>/dev/null)
if [ "$MC_STATUS" = "200" ]; then
    echo "  ✅ Mission Control API: Online (HTTP $MC_STATUS)"
else
    echo "  ❌ Mission Control API: DOWN (HTTP $MC_STATUS)"
fi

# LiftedPick
LP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://liftedpick.fly.dev/" 2>/dev/null)
if [ "$LP_STATUS" = "200" ]; then
    echo "  ✅ LiftedPick: Online (HTTP $LP_STATUS)"
else
    echo "  ❌ LiftedPick: DOWN (HTTP $LP_STATUS)"
fi

# Hardhat Ledger
HL_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://hardhatledger.com/" 2>/dev/null)
if [ "$HL_STATUS" = "200" ]; then
    echo "  ✅ Hardhat Ledger: Online (HTTP $HL_STATUS)"
else
    echo "  ❌ Hardhat Ledger: DOWN (HTTP $HL_STATUS)"
fi
echo

# Bot Status from MC API
echo "📊 BOT STATUS (from MC API)"
echo "---------------------------"
curl -s "https://mission-control-api.georgebot253.workers.dev/api/bots" 2>/dev/null | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    for bot_id, bot in data.items():
        status = '✅' if bot['status'] == 'running' else '❌'
        print(f\"  {status} {bot['name']}: {bot['status']} (PID: {bot['pid']})\")
        print(f\"      Last heartbeat: {bot['last_heartbeat']}\")
except:
    print('  Unable to fetch bot status')
"
echo

# Recent Activity
echo "📜 RECENT ACTIVITY (last 5)"
echo "---------------------------"
curl -s "https://mission-control-api.georgebot253.workers.dev/api/activity?limit=5" 2>/dev/null | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    for item in data[:5]:
        business = item.get('business', 'SYSTEM')
        text = item.get('text', 'No text')[:60]
        print(f\"  [{business}] {text}\")
except:
    print('  Unable to fetch activity')
"
echo

echo "=============================================="
echo "Status check complete."
