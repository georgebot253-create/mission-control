#!/usr/bin/env node
/**
 * Mission Control Sync Script
 * Checks for pending messages and commands from Mission Control
 * Run via: node sync.js
 */

const API_BASE = 'https://mission-control-api.georgebot253.workers.dev';
const SYNC_TOKEN = 'mc-sync-2026';

async function checkPendingMessages() {
    try {
        const res = await fetch(`${API_BASE}/api/messages`, {
            headers: { 'Authorization': `Bearer ${SYNC_TOKEN}` }
        });
        const messages = await res.json();
        
        if (messages.length > 0) {
            console.log(`\n📬 ${messages.length} pending message(s) from Mission Control:\n`);
            messages.forEach((msg, i) => {
                console.log(`[${i + 1}] From: ${msg.from}`);
                console.log(`    Text: ${msg.text}`);
                console.log(`    ID: ${msg.id}`);
                console.log(`    Time: ${msg.created_at}\n`);
            });
            return messages;
        } else {
            console.log('✓ No pending messages');
            return [];
        }
    } catch (err) {
        console.error('Error checking messages:', err.message);
        return [];
    }
}

async function checkPendingCommands() {
    try {
        const res = await fetch(`${API_BASE}/api/commands`, {
            headers: { 'Authorization': `Bearer ${SYNC_TOKEN}` }
        });
        const commands = await res.json();
        
        if (commands.length > 0) {
            console.log(`\n🎮 ${commands.length} pending command(s) from Mission Control:\n`);
            commands.forEach((cmd, i) => {
                console.log(`[${i + 1}] Type: ${cmd.type}`);
                console.log(`    Agent: ${cmd.agent}`);
                if (cmd.task) console.log(`    Task: ${cmd.task}`);
                console.log(`    ID: ${cmd.id}`);
                console.log(`    Time: ${cmd.created_at}\n`);
            });
            return commands;
        } else {
            console.log('✓ No pending commands');
            return [];
        }
    } catch (err) {
        console.error('Error checking commands:', err.message);
        return [];
    }
}

async function ackMessages(messageIds) {
    if (messageIds.length === 0) return;
    
    try {
        const res = await fetch(`${API_BASE}/api/messages/ack`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SYNC_TOKEN}`
            },
            body: JSON.stringify({ message_ids: messageIds })
        });
        const data = await res.json();
        console.log(`✓ Acknowledged ${data.acked} message(s)`);
    } catch (err) {
        console.error('Error acknowledging messages:', err.message);
    }
}

async function completeCommand(commandId, status = 'completed', result = null) {
    try {
        const res = await fetch(`${API_BASE}/api/commands/complete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SYNC_TOKEN}`
            },
            body: JSON.stringify({ command_id: commandId, status, result })
        });
        const data = await res.json();
        if (data.ok) {
            console.log(`✓ Completed command ${commandId}`);
        }
    } catch (err) {
        console.error('Error completing command:', err.message);
    }
}

async function sendMessage(text, from = 'George') {
    try {
        const res = await fetch(`${API_BASE}/api/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ from, text, agent: 'george' })
        });
        const data = await res.json();
        console.log(`✓ Sent message: ${data.message_id}`);
        return data.message_id;
    } catch (err) {
        console.error('Error sending message:', err.message);
        return null;
    }
}

// Main sync function
async function sync() {
    console.log('='.repeat(50));
    console.log('Mission Control Sync - ' + new Date().toISOString());
    console.log('='.repeat(50));
    
    const messages = await checkPendingMessages();
    const commands = await checkPendingCommands();
    
    return { messages, commands };
}

// Export for use as module
module.exports = {
    sync,
    checkPendingMessages,
    checkPendingCommands,
    ackMessages,
    completeCommand,
    sendMessage
};

// Run if called directly
if (require.main === module) {
    sync().then(({ messages, commands }) => {
        if (messages.length > 0 || commands.length > 0) {
            console.log('\n⚠️  Items need attention!');
        } else {
            console.log('\n✅ All clear');
        }
    });
}
