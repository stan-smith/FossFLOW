/**
 * FossFLOW WebSocket Client for React App
 *
 * Connects to the WebSocket server for real-time co-editing with AI agents.
 */

interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

type MessageHandler = (message: WebSocketMessage) => void;

class FossflowWebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private messageHandlers: Set<MessageHandler> = new Set();
  private operationCallbacks: Map<string, { resolve: Function; reject: Function }> = new Map();
  private operationId = 0;

  constructor(url: string = 'ws://localhost:3333?type=browser') {
    this.url = url;
    console.log('[FossFLOW WS] Initialized with URL:', this.url);
  }

  connect(): Promise<void> {
    // Already connected or connecting — return immediately
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      try {
        console.log('[FossFLOW WS] Connecting to', this.url);
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('[FossFLOW WS] Connected');
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (err) {
            console.error('[FossFLOW WS] Failed to parse message:', err);
          }
        };

        this.ws.onclose = (event) => {
          console.log('[FossFLOW WS] Disconnected:', event.code, event.reason);
          this.ws = null;

          // Attempt reconnect
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`[FossFLOW WS] Reconnecting in ${this.reconnectDelay}ms (attempt ${this.reconnectAttempts})`);
            setTimeout(() => this.connect(), this.reconnectDelay);
          }
        };

        this.ws.onerror = (err) => {
          console.error('[FossFLOW WS] Error:', err);
          if (this.reconnectAttempts === 0) {
            reject(err);
          }
        };
      } catch (err) {
        reject(err);
      }
    });
  }

  private handleMessage(message: WebSocketMessage) {
    console.log('[FossFLOW WS] Received:', message.type);

    // Handle operation results
    if (message.type === 'operation_result') {
      const callback = this.operationCallbacks.get(message.id);
      if (callback) {
        if (message.success) {
          callback.resolve(message);
        } else {
          callback.reject(new Error(message.error || 'Operation failed'));
        }
        this.operationCallbacks.delete(message.id);
      }
      return;
    }

    // Notify all handlers
    this.messageHandlers.forEach(handler => {
      try {
        handler(message);
      } catch (err) {
        console.error('[FossFLOW WS] Handler error:', err);
      }
    });
  }

  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  sendStateUpdate(diagram: any, operationId?: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('[FossFLOW WS] Not connected, skipping state update');
      return;
    }

    const message: WebSocketMessage = {
      type: 'state_update',
      diagram,
    };

    if (operationId) {
      message.operationId = operationId;
    }

    this.ws.send(JSON.stringify(message));
  }

  sendOperationResult(id: string, success: boolean, result?: any, error?: string) {
    console.log('[FossFLOW WS] sendOperationResult called, ws exists:', !!this.ws, 'readyState:', this.ws?.readyState, 'OPEN:', WebSocket.OPEN);
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('[FossFLOW WS] Cannot send operation_result: WebSocket not open');
      return;
    }

    const message: WebSocketMessage = {
      type: 'operation_result',
      id,
      success,
    };

    if (error) {
      message.error = error;
    }

    if (result) {
      Object.assign(message, result);
    }

    this.ws.send(JSON.stringify(message));
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Singleton instance
let wsClient: FossflowWebSocketClient | null = null;

export function getWebSocketClient(): FossflowWebSocketClient {
  if (!wsClient) {
    const wsUrl = 'ws://localhost:3333?type=browser';
    wsClient = new FossflowWebSocketClient(wsUrl);
  }
  return wsClient;
}

export function connectWebSocket(): Promise<void> {
  return getWebSocketClient().connect();
}

export { FossflowWebSocketClient };
