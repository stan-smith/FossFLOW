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

    // Only update connector position in drag mode or when connecting in click mode
    if (uiState.connectorInteractionMode === 'drag' || uiState.mode.isConnecting) {
      const connector = getItemByIdOrThrow(
        scene.currentView.connectors ?? [],
        uiState.mode.id
      );

      const itemAtTile = getItemAtTile({
        tile: uiState.mouse.position.tile,
        scene
      });

      if (itemAtTile?.type === 'ITEM') {
        const newConnector = produce(connector.value, (draft) => {
          draft.anchors[1] = { id: generateId(), ref: { item: itemAtTile.id } };
        });

        scene.updateConnector(uiState.mode.id, newConnector);
      } else {
        const newConnector = produce(connector.value, (draft) => {
          draft.anchors[1] = {
            id: generateId(),
            ref: { tile: uiState.mouse.position.tile }
          };
        });

        scene.updateConnector(uiState.mode.id, newConnector);
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
        if (uiState.mode.id) {
          const connector = getItemByIdOrThrow(scene.connectors, uiState.mode.id);
          
          // Update the second anchor to the click position
          const newConnector = produce(connector.value, (draft) => {
            if (itemAtTile?.type === 'ITEM') {
              draft.anchors[1] = { id: generateId(), ref: { item: itemAtTile.id } };
            } else {
              draft.anchors[1] = {
                id: generateId(),
                ref: { tile: uiState.mouse.position.tile }
              };
            }
          });

          scene.updateConnector(uiState.mode.id, newConnector);

          // Validate the connection
          const firstAnchor = newConnector.anchors[0];
          const lastAnchor = newConnector.anchors[newConnector.anchors.length - 1];

          if (
            connector.value.path.tiles.length < 2 ||
            !(firstAnchor.ref.item && lastAnchor.ref.item)
          ) {
            scene.deleteConnector(uiState.mode.id);
          }

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
      const connector = getItemByIdOrThrow(scene.connectors, uiState.mode.id);
      const firstAnchor = connector.value.anchors[0];
      const lastAnchor =
        connector.value.anchors[connector.value.anchors.length - 1];

      if (
        connector.value.path.tiles.length < 2 ||
        !(firstAnchor.ref.item && lastAnchor.ref.item)
      ) {
        scene.deleteConnector(uiState.mode.id);
      }

      uiState.actions.setMode({
        type: 'CONNECTOR',
        showCursor: true,
        id: null
      });
    }
    // Click mode handles completion in mousedown (second click)
  }
};