/**
 * Hook to integrate WebSocket with FossFLOW diagram state.
 *
 * Operations are dispatched via custom DOM events to the McpBridge component
 * inside isoflow's tree, which calls scene.placeIcon / scene.createConnector
 * directly — avoiding React state loops.
 */

import { useEffect, useRef } from 'react';
import { getWebSocketClient, connectWebSocket } from '../services/websocketService';

interface UseWebSocketIntegrationOptions {
  currentModel: any;
  enabled?: boolean;
}

/** Dispatch an operation to the McpBridge component inside isoflow. */
function dispatchToMcpBridge(
  operation: string,
  payload: any,
): Promise<any> {
  return new Promise((resolve, reject) => {
    const event = new CustomEvent('fossflow:operation', {
      detail: { operation, payload, resolve, reject },
    });
    window.dispatchEvent(event);
  });
}

export function useWebSocketIntegration({
  currentModel,
  enabled = true,
}: UseWebSocketIntegrationOptions) {
  const currentModelRef = useRef(currentModel);
  const isProcessingOperation = useRef(false);

  useEffect(() => {
    currentModelRef.current = currentModel;
  }, [currentModel]);

  // Connect on mount and handle incoming messages
  useEffect(() => {
    if (!enabled) return;

    console.log('[WebSocket Hook] Initializing...');

    const ws = getWebSocketClient();

    connectWebSocket().catch(err => {
      console.log('[WebSocket Hook] Could not connect:', err.message);
    });

    const unsubscribe = ws.onMessage(async (message) => {
      if (message.type === 'operation') {
        await handleOperation(message);
      }
    });

    // Listen for state-dirty events from McpBridge to immediately sync state
    const handleStateDirty = () => {
      // Delay slightly to let React update state via onModelUpdated callback
      setTimeout(() => {
        const ws = getWebSocketClient();
        const model = currentModelRef.current;
        if (ws.isConnected() && model) {
          ws.sendStateUpdate(model);
        }
      }, 100);
    };
    window.addEventListener('fossflow:state-dirty', handleStateDirty);

    return () => {
      unsubscribe();
      window.removeEventListener('fossflow:state-dirty', handleStateDirty);
    };
  }, [enabled]);

  // Throttled state broadcasting
  const throttleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingModelRef = useRef<any>(null);

  useEffect(() => {
    if (!enabled || !currentModel || isProcessingOperation.current) return;

    pendingModelRef.current = currentModel;

    if (!throttleRef.current) {
      throttleRef.current = setTimeout(() => {
        throttleRef.current = null;
        const ws = getWebSocketClient();
        if (ws.isConnected() && pendingModelRef.current) {
          ws.sendStateUpdate(pendingModelRef.current);
        }
      }, 500);
    }
  }, [currentModel, enabled]);

  async function handleOperation(message: any) {
    const { id, operation, payload } = message;
    const ws = getWebSocketClient();

    isProcessingOperation.current = true;

    try {
      const result = await dispatchToMcpBridge(operation, payload);

      ws.sendOperationResult(id, true, result);

      setTimeout(() => {
        isProcessingOperation.current = false;
      }, 100);
    } catch (err: any) {
      console.error('[WebSocket Hook] Operation failed:', err);
      ws.sendOperationResult(id, false, undefined, err.message);
      isProcessingOperation.current = false;
    }
  }

  return {
    isConnected: () => getWebSocketClient().isConnected(),
  };
}
