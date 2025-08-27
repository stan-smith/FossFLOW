import React, { useCallback } from 'react';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { getTilePosition, CoordsUtils, generateId, findNearestUnoccupiedTile } from 'src/utils';
import { useScene } from 'src/hooks/useScene';
import { useModelStore } from 'src/stores/modelStore';
import { VIEW_ITEM_DEFAULTS } from 'src/config';
import { ContextMenu } from './ContextMenu';

interface Props {
  anchorEl?: HTMLElement;
}

export const ContextMenuManager = ({ anchorEl }: Props) => {
  const scene = useScene();
  const model = useModelStore((state) => {
    return state;
  });
  const zoom = useUiStateStore((state) => {
    return state.zoom;
  });
  const contextMenu = useUiStateStore((state) => {
    return state.contextMenu;
  });

  const uiStateActions = useUiStateStore((state) => {
    return state.actions;
  });

  const onClose = useCallback(() => {
    uiStateActions.setContextMenu(null);
  }, [uiStateActions]);

  if (!contextMenu) {
    return null;
  }

  if (contextMenu.type === 'EMPTY') {
    return (
      <ContextMenu
        anchorEl={anchorEl}
        onClose={onClose}
        position={CoordsUtils.multiply(
          getTilePosition({ tile: contextMenu.tile }),
          zoom
        )}
        menuItems={[
          {
            label: 'Add Node',
            onClick: () => {
              if (model.icons.length > 0) {
                const modelItemId = generateId();
                const firstIcon = model.icons[0];
                
                // Find nearest unoccupied tile (should return the same tile since context menu is for empty tiles)
                const targetTile = findNearestUnoccupiedTile(contextMenu.tile, scene) || contextMenu.tile;

                scene.placeIcon({
                  modelItem: {
                    id: modelItemId,
                    name: 'Untitled',
                    icon: firstIcon.id
                  },
                  viewItem: {
                    ...VIEW_ITEM_DEFAULTS,
                    id: modelItemId,
                    tile: targetTile
                  }
                });
              }
              onClose();
            }
          },
          {
            label: 'Add Rectangle',
            onClick: () => {
              if (model.colors.length > 0) {
                scene.createRectangle({
                  id: generateId(),
                  color: model.colors[0].id,
                  from: contextMenu.tile,
                  to: contextMenu.tile
                });
              }
              onClose();
            }
          }
        ]}
      />
    );
  }

  // Remove ITEM context menu since layer ordering only works for rectangles
  // and provides no value for regular diagram items

  return null;
};
