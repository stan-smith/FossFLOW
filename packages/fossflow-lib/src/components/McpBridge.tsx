import { useEffect, useRef } from 'react';
import { useScene } from 'src/hooks/useScene';
import { useHistory } from 'src/hooks/useHistory';
import { useModelStoreApi } from 'src/stores/modelStore';
import { useUiStateStoreApi } from 'src/stores/uiStateStore';
import { VIEW_ITEM_DEFAULTS } from 'src/config';

/**
 * Invisible component that bridges external MCP operations to isoflow's internal scene API.
 * Listens for custom DOM events and calls scene.placeIcon / scene.createConnector.
 */
export const McpBridge = () => {
  const scene = useScene();
  const sceneRef = useRef(scene);
  const history = useHistory();
  const historyRef = useRef(history);
  const modelStoreApi = useModelStoreApi();
  const uiStateStoreApi = useUiStateStoreApi();

  useEffect(() => {
    sceneRef.current = scene;
  }, [scene]);

  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  useEffect(() => {
    const getViewItems = () => {
      const state = modelStoreApi.getState();
      const currentViewId = uiStateStoreApi.getState()?.view;
      if (!state.views || !currentViewId) return [];
      const view = state.views.find((v: { id: string }) => v.id === currentViewId);
      return view?.items ?? (state.views[0]?.items ?? []);
    };

    const handleOperation = (e: Event) => {
      const { operation, payload, resolve, reject } = (e as CustomEvent).detail;
      const currentScene = sceneRef.current;

      try {
        switch (operation) {
          case 'add_node': {
            const nodeId = `node-${Date.now()}`;
            currentScene.placeIcon({
              modelItem: {
                id: nodeId,
                name: payload.name,
                icon: payload.icon,
              },
              viewItem: {
                ...VIEW_ITEM_DEFAULTS,
                id: nodeId,
                tile: payload.position || { x: 0, y: 0 },
              },
            });
            resolve({ createdId: nodeId });
            // Trigger state sync so MCP clients get updated diagram
            requestAnimationFrame(() => {
              window.dispatchEvent(new Event('fossflow:state-dirty'));
            });
            break;
          }

          case 'connect': {
            const connectorId = `conn-${Date.now()}`;
            const viewItems = getViewItems();
            const modelItems = modelStoreApi.getState().items || [];

            // Resolve ID: direct match in view items, or name-based fallback
            const resolveId = (id: string, name?: string) => {
              if (viewItems.find((i: { id: string }) => i.id === id)) return id;
              if (name) {
                const modelByName = modelItems.find((m: { name: string }) => m.name === name);
                if (modelByName && viewItems.find((v: { id: string }) => v.id === modelByName.id)) {
                  return modelByName.id;
                }
              }
              return null;
            };

            const fromId = resolveId(payload.fromItemId, payload.fromName);
            const toId = resolveId(payload.toItemId, payload.toName);

            if (!fromId || !toId) {
              reject(new Error(`Node not found: ${!fromId ? payload.fromItemId : payload.toItemId}. Available: ${viewItems.map((i: { id: string }) => i.id).join(', ')}`));
              return;
            }

            currentScene.createConnector({
              id: connectorId,
              color: payload.color,
              style: payload.style || 'SOLID',
              anchors: [
                { id: `anchor-${Date.now()}-a`, ref: { item: fromId } },
                { id: `anchor-${Date.now()}-b`, ref: { item: toId } },
              ],
            });
            resolve({ createdId: connectorId });
            // Trigger state sync so MCP clients get updated diagram
            requestAnimationFrame(() => {
              window.dispatchEvent(new Event('fossflow:state-dirty'));
            });
            break;
          }

          case 'move': {
            const { itemId, position } = payload;
            if (!itemId || !position) {
              reject(new Error('move requires itemId and position'));
              return;
            }
            currentScene.updateViewItem(itemId, { tile: { x: position.x, y: position.y } });
            resolve({ movedId: itemId });
            // Trigger state sync so MCP clients get updated diagram
            requestAnimationFrame(() => {
              window.dispatchEvent(new Event('fossflow:state-dirty'));
            });
            break;
          }

          case 'delete': {
            const { elementId, elementType } = payload;
            if (!elementId) {
              reject(new Error('delete requires elementId'));
              return;
            }
            const type = elementType || 'item';
            switch (type) {
              case 'item':
                currentScene.deleteViewItem(elementId);
                break;
              case 'connector':
                currentScene.deleteConnector(elementId);
                break;
              case 'textBox':
                currentScene.deleteTextBox(elementId);
                break;
              case 'rectangle':
                currentScene.deleteRectangle(elementId);
                break;
              default:
                reject(new Error(`Unknown element type: ${type}`));
                return;
            }
            resolve({ deletedId: elementId });
            // Trigger state sync so MCP clients get updated diagram
            requestAnimationFrame(() => {
              window.dispatchEvent(new Event('fossflow:state-dirty'));
            });
            break;
          }

          case 'undo': {
            const currentHistory = historyRef.current;
            const result = currentHistory.undo();
            resolve({ success: result });
            // Trigger state sync so MCP clients get updated diagram
            requestAnimationFrame(() => {
              window.dispatchEvent(new Event('fossflow:state-dirty'));
            });
            break;
          }

          case 'redo': {
            const currentHistory = historyRef.current;
            const result = currentHistory.redo();
            resolve({ success: result });
            // Trigger state sync so MCP clients get updated diagram
            requestAnimationFrame(() => {
              window.dispatchEvent(new Event('fossflow:state-dirty'));
            });
            break;
          }

          default:
            reject(new Error(`Unknown operation: ${operation}`));
        }
      } catch (err) {
        reject(err);
      }
    };

    window.addEventListener('fossflow:operation', handleOperation);
    window.dispatchEvent(new Event('fossflow:bridge-ready'));
    (window as any).__fossflowBridgeReady = true;

    return () => {
      window.removeEventListener('fossflow:operation', handleOperation);
      (window as any).__fossflowBridgeReady = false;
    };
  }, [modelStoreApi, uiStateStoreApi]);

  return null;
};
