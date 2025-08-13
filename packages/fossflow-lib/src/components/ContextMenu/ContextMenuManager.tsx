import React, { useCallback } from 'react';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { getTilePosition, CoordsUtils, generateId } from 'src/utils';
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

                scene.placeIcon({
                  modelItem: {
                    id: modelItemId,
                    name: 'Untitled',
                    icon: firstIcon.id
                  },
                  viewItem: {
                    ...VIEW_ITEM_DEFAULTS,
                    id: modelItemId,
                    tile: contextMenu.tile
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
      <ContextMenu
        anchorEl={anchorEl}
        onClose={onClose}
        position={CoordsUtils.multiply(
          getTilePosition({ tile: contextMenu.tile }),
          zoom
        )}
        menuItems={[
          {
            label: 'Send backward',
            onClick: () => {
              scene.changeLayerOrder('SEND_BACKWARD', contextMenu.item!);
              onClose();
            }
          },
          {
            label: 'Bring forward',
            onClick: () => {
              scene.changeLayerOrder('BRING_FORWARD', contextMenu.item!);
              onClose();
            }
          },
          {
            label: 'Send to back',
            onClick: () => {
              scene.changeLayerOrder('SEND_TO_BACK', contextMenu.item!);
              onClose();
            }
          },
          {
            label: 'Bring to front',
            onClick: () => {
              scene.changeLayerOrder('BRING_TO_FRONT', contextMenu.item!);
              onClose();
            }
          }
        ]}
      />
    );
  }

  return null;
};
