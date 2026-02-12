#!/bin/bash
# Bot Health Check Script
# Posts status to Mission Control API

API_BASE="https://mission-control-api.georgebot253.workers.dev"

# Check SPY Blended Bot
SPY_PID=$(pgrep -f "main_blended.py" | head -1)
if [ -n "$SPY_PID" ]; then
    SPY_STATUS="running"
    SPY_ICON="check-circle"
else
    SPY_STATUS="stopped"
    SPY_ICON="exclamation-triangle"
fi

# Check Tech Momentum Bot (matches main.py but not main_blended.py)
TECH_PID=$(pgrep -f "main.py$" | head -1)
if [ -n "$TECH_PID" ]; then
    TECH_STATUS="running"
    TECH_ICON="check-circle"
else
    TECH_STATUS="stopped"  
    TECH_ICON="exclamation-triangle"
fi

# Only post if something changed or stopped
if [ "$SPY_STATUS" = "stopped" ] || [ "$TECH_STATUS" = "stopped" ]; then
    curl -s -X POST "${API_BASE}/api/activity" \
        -H "Content-Type: application/json" \
        -d "{\"type\":\"system\",\"icon\":\"$SPY_ICON\",\"text\":\"Bot Status - SPY: $SPY_STATUS (PID: ${SPY_PID:-N/A}), Tech: $TECH_STATUS (PID: ${TECH_PID:-N/A})\",\"business\":\"TRADECRAFT\",\"meta\":{\"spy_pid\":\"${SPY_PID:-null}\",\"tech_pid\":\"${TECH_PID:-null}\"}}"
fi

echo "SPY Bot: $SPY_STATUS (PID: ${SPY_PID:-N/A})"
echo "Tech Bot: $TECH_STATUS (PID: ${TECH_PID:-N/A})"
