/**
 * FossFLOW WebSocket Server
 *
 * This server enables real-time co-editing with AI agents via MCP.
 * It bridges WebSocket connections to the FossFLOW React app running in the browser.
 *
 * Architecture:
 *   MCP Server <--WebSocket--> This Server <--WebSocket--> FossFLOW React App
 *
 * Usage:
 *   node websocketServer.js
 *
 * Environment:
 *   PORT - WebSocket server port (default: 3333)
 *   FOSSFLOW_PORT - FossFLOW React app port (default: 3000)
 */

import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import { URL } from 'url';

const PORT = parseInt(process.env.PORT || '3333', 10);
const FOSSFLOW_PORT = parseInt(process.env.FOSSFLOW_PORT || '3000', 10);

// Connected clients
const mcpClients = new Set();
const browserClients = new Set();

// Current diagram state
let currentDiagram = null;

// Track pending operations: operation id -> { mcpClient, resolved }
const pendingOperations = new Map();

// Create HTTP server for health checks
const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      mcpClients: mcpClients.size,
      browserClients: browserClients.size,
      hasDiagram: currentDiagram !== null
    }));
    return;
  }

  if (req.url === '/diagram') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(currentDiagram || {}));
    return;
  }

  res.writeHead(404);
  res.end();
});

// Create WebSocket server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  const url = new URL(req.url || '/', `http://localhost:${PORT}`);
  const clientType = url.searchParams.get('type') || 'mcp';

  console.log(`[${new Date().toISOString()}] New ${clientType} client connected`);

  if (clientType === 'browser') {
    browserClients.add(ws);

    // Send current state if available
    if (currentDiagram) {
      ws.send(JSON.stringify({
        type: 'state_update',
        diagram: currentDiagram
      }));
    }
  } else {
    mcpClients.add(ws);

    // Send current state if available
    if (currentDiagram) {
      ws.send(JSON.stringify({
        type: 'state_update',
        diagram: currentDiagram
      }));
    }
  }

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      handleMessage(ws, clientType, message);
    } catch (err) {
      console.error('Failed to parse message:', err);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Invalid JSON'
      }));
    }
  });

  ws.on('close', () => {
    if (clientType === 'browser') {
      browserClients.delete(ws);
    } else {
      mcpClients.delete(ws);
      // Clean up any pending operations from this MCP client
      for (const [id, pending] of pendingOperations.entries()) {
        if (pending.mcpClient === ws) {
          pendingOperations.delete(id);
        }
      }
    }
    console.log(`[${new Date().toISOString()}] ${clientType} client disconnected`);
  });

  ws.on('error', (err) => {
    console.error(`${clientType} client error:`, err);
  });
});

function handleMessage(ws, clientType, message) {
  console.log(`[${clientType}] Received:`, message.type);

  switch (message.type) {
    case 'state_update':
      // Browser sends state updates
      currentDiagram = message.diagram;
      // Broadcast to all MCP clients
      broadcast(mcpClients, {
        type: 'state_update',
        diagram: currentDiagram,
        operationId: message.operationId
      });
      break;

    case 'operation':
      // MCP server sends operations
      handleOperation(ws, message);
      break;

    case 'operation_result':
      // Browser sends operation results - route to the specific MCP client that requested it
      console.log(`[WS Server] operation_result received: id=${message.id}, success=${message.success}, mcpClients=${mcpClients.size}`);
      if (message.id) {
        const pending = pendingOperations.get(message.id);
        if (pending && !pending.resolved) {
          // Mark as resolved to ignore duplicate results
          pending.resolved = true;
          const targetClient = pending.mcpClient;
          if (targetClient && targetClient.readyState === WebSocket.OPEN) {
            targetClient.send(JSON.stringify(message));
          }
          // Clean up after a short delay to catch any late duplicates
          setTimeout(() => pendingOperations.delete(message.id), 5000);
        } else {
          console.log(`[WS Server] Ignoring duplicate or unknown operation_result for id=${message.id}`);
        }
      }
      break;

    default:
      console.warn('Unknown message type:', message.type);
  }
}

function handleOperation(ws, message) {
  const { id, operation, payload } = message;

  // Validate operation
  const validOperations = ['add_node', 'connect', 'move', 'delete', 'undo', 'redo'];
  if (!validOperations.includes(operation)) {
    ws.send(JSON.stringify({
      type: 'operation_result',
      id,
      success: false,
      error: `Unknown operation: ${operation}`
    }));
    return;
  }

  // Track which MCP client sent this operation so we can route the result back
  pendingOperations.set(id, { mcpClient: ws, resolved: false });

  // Forward to only ONE browser client (the first available) to avoid duplicate processing
  const browserClient = [...browserClients].find(c => c.readyState === WebSocket.OPEN);
  if (browserClient) {
    browserClient.send(JSON.stringify({
      type: 'operation',
      id,
      operation,
      payload
    }));
  } else {
    // No browser client available - fail the operation
    pendingOperations.delete(id);
    ws.send(JSON.stringify({
      type: 'operation_result',
      id,
      success: false,
      error: 'No browser client connected'
    }));
  }
}

function broadcast(clients, message) {
  const data = JSON.stringify(message);
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

server.listen(PORT, () => {
  console.log(`FossFLOW WebSocket server listening on port ${PORT}`);
  console.log(`  MCP clients connect to: ws://localhost:${PORT}`);
  console.log(`  Browser connects to: ws://localhost:${PORT}?type=browser`);
  console.log(`  Health check: http://localhost:${PORT}/health`);
});
