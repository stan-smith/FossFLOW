import React, { useCallback } from 'react';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { getTilePosition, CoordsUtils, generateId, findNearestUnoccupiedTile } from 'src/utils';
import { useScene } from 'src/hooks/useScene';
import { useModelStore } from 'src/stores/modelStore';
import { VIEW_ITEM_DEFAULTS } from 'src/config';
import { ContextMenu } from './ContextMenu';
import { EnhancedContextMenu } from './EnhancedContextMenu';
import { Coords } from 'src/types';

interface Props {
  anchorEl?: HTMLElement;
}

const EnhancedContextMenuWrapper = ({
  itemId,
  tile,
  zoom,
  anchorEl,
  onClose
}: {
  itemId: string;
  tile: Coords;
  zoom: number;
  anchorEl?: HTMLElement;
  onClose: () => void;
}) => {
  // Use mouse screen position if available for accurate positioning
  const mouse = useUiStateStore((state) => state.mouse);
  
  // Get renderer element and scroll from store
  const rendererEl = useUiStateStore((state) => state.rendererEl);
  const scroll = useUiStateStore((state) => state.scroll);
  
  // Prefer screen position from mouse, fallback to calculated position
  const screenPosition = mouse.position.screen || (() => {
    const tileScreenPos = CoordsUtils.multiply(
      getTilePosition({ tile }),
      zoom
    );
    
    if (rendererEl) {
      const rect = rendererEl.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2 + tileScreenPos.x + scroll.position.x,
        y: rect.top + rect.height / 2 + tileScreenPos.y + scroll.position.y
      };
    }
    
    return tileScreenPos;
  })();

  return (
    <EnhancedContextMenu
      itemId={itemId}
      position={screenPosition}
      anchorEl={anchorEl}
      onClose={onClose}
    />
  );
};

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

  if (contextMenu.type === 'ITEM' && contextMenu.item) {
    return (
      <EnhancedContextMenuWrapper
        itemId={contextMenu.item.id}
        tile={contextMenu.tile}
        zoom={zoom}
        anchorEl={anchorEl}
        onClose={onClose}
      />
    );
  }

  return null;
};
