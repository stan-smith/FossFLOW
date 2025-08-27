import { produce } from 'immer';
import {
  generateId,
  getItemAtTile,
  getItemByIdOrThrow,
  hasMovedTile,
  setWindowCursor
} from 'src/utils';
import { ModeActions, Connector as ConnectorI } from 'src/types';

export const Connector: ModeActions = {
  entry: () => {
    setWindowCursor('crosshair');
  },
  exit: () => {
    setWindowCursor('default');
  },
  mousemove: ({ uiState, scene }) => {
    if (
      uiState.mode.type !== 'CONNECTOR' ||
      !uiState.mode.id ||
      !hasMovedTile(uiState.mouse)
    )
      return;

    // TypeScript type guard - we know mode is CONNECTOR type here
    const connectorMode = uiState.mode;
    
    // Only update connector position in drag mode or when connecting in click mode
    if (uiState.connectorInteractionMode === 'drag' || connectorMode.isConnecting) {
      // Try to find the connector - it might not exist yet
      const connectorItem = (scene.currentView.connectors ?? []).find(
        c => c.id === connectorMode.id
      );
      
      // If connector doesn't exist yet, return early
      if (!connectorItem) {
        return;
      }

      const itemAtTile = getItemAtTile({
        tile: uiState.mouse.position.tile,
        scene
      });

      if (itemAtTile?.type === 'ITEM') {
        const newConnector = produce(connectorItem, (draft) => {
          draft.anchors[1] = { id: generateId(), ref: { item: itemAtTile.id } };
        });

        scene.updateConnector(connectorMode.id!, newConnector);
      } else {
        const newConnector = produce(connectorItem, (draft) => {
          draft.anchors[1] = {
            id: generateId(),
            ref: { tile: uiState.mouse.position.tile }
          };
        });

        scene.updateConnector(connectorMode.id!, newConnector);
      }
    }
  },
  mousedown: ({ uiState, scene, isRendererInteraction }) => {
    if (uiState.mode.type !== 'CONNECTOR' || !isRendererInteraction) return;

    const itemAtTile = getItemAtTile({
      tile: uiState.mouse.position.tile,
      scene
    });

    if (uiState.connectorInteractionMode === 'click') {
      // Click mode: handle first and second clicks
      if (!uiState.mode.startAnchor) {
        // First click: store the start position
        const startAnchor = itemAtTile?.type === 'ITEM' 
          ? { itemId: itemAtTile.id }
          : { tile: uiState.mouse.position.tile };

        // Create a connector but don't finalize it yet
        const newConnector: ConnectorI = {
          id: generateId(),
          color: scene.colors[0].id,
          anchors: []
        };

        if (itemAtTile && itemAtTile.type === 'ITEM') {
          newConnector.anchors = [
            { id: generateId(), ref: { item: itemAtTile.id } },
            { id: generateId(), ref: { item: itemAtTile.id } }
          ];
        } else {
          newConnector.anchors = [
            { id: generateId(), ref: { tile: uiState.mouse.position.tile } },
            { id: generateId(), ref: { tile: uiState.mouse.position.tile } }
          ];
        }

        scene.createConnector(newConnector);

        uiState.actions.setMode({
          type: 'CONNECTOR',
          showCursor: true,
          id: newConnector.id,
          startAnchor,
          isConnecting: true
        });
      } else {
        // Second click: complete the connection
        // We already checked mode.type === 'CONNECTOR' above
        const currentMode = uiState.mode;
        if (currentMode.id) {
          // Try to find the connector - it might not exist
          const connector = (scene.currentView.connectors ?? []).find(
            c => c.id === currentMode.id
          );
          
          // If connector doesn't exist, reset mode and return
          if (!connector) {
            uiState.actions.setMode({
              type: 'CONNECTOR',
              showCursor: true,
              id: null,
              startAnchor: undefined,
              isConnecting: false
            });
            return;
          }
          
          // Update the second anchor to the click position
          const newConnector = produce(connector, (draft) => {
            if (itemAtTile?.type === 'ITEM') {
              draft.anchors[1] = { id: generateId(), ref: { item: itemAtTile.id } };
            } else {
              draft.anchors[1] = {
                id: generateId(),
                ref: { tile: uiState.mouse.position.tile }
              };
            }
          });

          scene.updateConnector(currentMode.id, newConnector);

          // Don't delete connectors to empty space - they're valid
          // Only validate minimum path length will be handled by the update

          // Reset for next connection
          uiState.actions.setMode({
            type: 'CONNECTOR',
            showCursor: true,
            id: null,
            startAnchor: undefined,
            isConnecting: false
          });
        }
      }
    } else {
      // Drag mode: original behavior
      const newConnector: ConnectorI = {
        id: generateId(),
        color: scene.colors[0].id,
        anchors: []
      };

      if (itemAtTile && itemAtTile.type === 'ITEM') {
        newConnector.anchors = [
          { id: generateId(), ref: { item: itemAtTile.id } },
          { id: generateId(), ref: { item: itemAtTile.id } }
        ];
      } else {
        newConnector.anchors = [
          { id: generateId(), ref: { tile: uiState.mouse.position.tile } },
          { id: generateId(), ref: { tile: uiState.mouse.position.tile } }
        ];
      }

      scene.createConnector(newConnector);

      uiState.actions.setMode({
        type: 'CONNECTOR',
        showCursor: true,
        id: newConnector.id
      });
    }
  },
  mouseup: ({ uiState, scene }) => {
    if (uiState.mode.type !== 'CONNECTOR' || !uiState.mode.id) return;

    // Only handle mouseup for drag mode
    if (uiState.connectorInteractionMode === 'drag') {
      // Don't delete connectors to empty space - they're valid
      // Validation is handled in the reducer layer

      uiState.actions.setMode({
        type: 'CONNECTOR',
        showCursor: true,
        id: null
      });
    }
    // Click mode handles completion in mousedown (second click)
  }
};