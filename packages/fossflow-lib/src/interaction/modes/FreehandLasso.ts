import { produce } from 'immer';
import { ModeActions, ItemReference, Coords } from 'src/types';
import { screenToIso, isPointInPolygon } from 'src/utils';

// Helper to find all items whose centers are within the freehand polygon
const getItemsInFreehandBounds = (
  pathTiles: Coords[],
  scene: any
): ItemReference[] => {
  const items: ItemReference[] = [];

  if (pathTiles.length < 3) return items;

  // Check all nodes/items
  scene.items.forEach((item: any) => {
    if (isPointInPolygon(item.tile, pathTiles)) {
      items.push({ type: 'ITEM', id: item.id });
    }
  });

  // Check all rectangles - they must be FULLY enclosed (all 4 corners inside)
  scene.rectangles.forEach((rectangle: any) => {
    const corners = [
      rectangle.from,
      { x: rectangle.to.x, y: rectangle.from.y },
      rectangle.to,
      { x: rectangle.from.x, y: rectangle.to.y }
    ];

    // Rectangle is only selected if ALL corners are inside the polygon
    const allCornersInside = corners.every(corner => isPointInPolygon(corner, pathTiles));

    if (allCornersInside) {
      items.push({ type: 'RECTANGLE', id: rectangle.id });
    }
  });

  // Check all text boxes
  scene.textBoxes.forEach((textBox: any) => {
    if (isPointInPolygon(textBox.tile, pathTiles)) {
      items.push({ type: 'TEXTBOX', id: textBox.id });
    }
  });

  return items;
};

export const FreehandLasso: ModeActions = {
  mousemove: ({ uiState, scene }) => {
    if (uiState.mode.type !== 'FREEHAND_LASSO' || !uiState.mouse.mousedown) return;

    // If user is dragging an existing selection, switch to DRAG_ITEMS mode
    if (uiState.mode.isDragging && uiState.mode.selection) {
      uiState.actions.setMode({
        type: 'DRAG_ITEMS',
        showCursor: true,
        items: uiState.mode.selection.items,
        isInitialMovement: true
      });
      return;
    }

    // User is drawing the freehand path - collect screen coordinates
    const newScreenPoint = uiState.mouse.position.screen;

    uiState.actions.setMode(
      produce(uiState.mode, (draft) => {
        if (draft.type === 'FREEHAND_LASSO') {
          // Add point to path if it's far enough from the last point (throttle)
          const lastPoint = draft.path[draft.path.length - 1];
          if (!lastPoint ||
              Math.abs(newScreenPoint.x - lastPoint.x) > 5 ||
              Math.abs(newScreenPoint.y - lastPoint.y) > 5) {
            draft.path.push(newScreenPoint);
          }
        }
      })
    );
  },

  mousedown: ({ uiState }) => {
    if (uiState.mode.type !== 'FREEHAND_LASSO') return;

    // If there's an existing selection, check if click is within it
    if (uiState.mode.selection) {
      // Convert click position to tile
      const clickTile = uiState.mouse.position.tile;
      const isWithinSelection = isPointInPolygon(
        clickTile,
        uiState.mode.selection.pathTiles
      );

      if (isWithinSelection) {
        // Clicked within selection - prepare to drag
        uiState.actions.setMode(
          produce(uiState.mode, (draft) => {
            if (draft.type === 'FREEHAND_LASSO') {
              draft.isDragging = true;
            }
          })
        );
        return;
      }

      // Clicked outside selection - clear it and start new path
      uiState.actions.setMode(
        produce(uiState.mode, (draft) => {
          if (draft.type === 'FREEHAND_LASSO') {
            draft.path = [uiState.mouse.position.screen];
            draft.selection = null;
            draft.isDragging = false;
          }
        })
      );
      return;
    }

    // Start a new path
    uiState.actions.setMode(
      produce(uiState.mode, (draft) => {
        if (draft.type === 'FREEHAND_LASSO') {
          draft.path = [uiState.mouse.position.screen];
          draft.selection = null;
          draft.isDragging = false;
        }
      })
    );
  },

  mouseup: ({ uiState, scene }) => {
    if (uiState.mode.type !== 'FREEHAND_LASSO') return;

    // If we've drawn a path, convert to tiles and find items
    if (uiState.mode.path.length >= 3 && !uiState.mode.selection) {
      const rendererSize = uiState.rendererEl?.getBoundingClientRect();
      if (!rendererSize) return;

      // Convert screen path to tile coordinates
      const pathTiles = uiState.mode.path.map((screenPoint) => {
        return screenToIso({
          mouse: screenPoint,
          zoom: uiState.zoom,
          scroll: uiState.scroll,
          rendererSize: {
            width: rendererSize.width,
            height: rendererSize.height
          }
        });
      });

      // Find all items within the freehand polygon
      const items = getItemsInFreehandBounds(pathTiles, scene);

      uiState.actions.setMode(
        produce(uiState.mode, (draft) => {
          if (draft.type === 'FREEHAND_LASSO') {
            draft.selection = {
              pathTiles,
              items
            };
            draft.isDragging = false;
          }
        })
      );
    } else {
      // Reset dragging state but keep selection if it exists
      uiState.actions.setMode(
        produce(uiState.mode, (draft) => {
          if (draft.type === 'FREEHAND_LASSO') {
            draft.isDragging = false;
          }
        })
      );
    }
  }
};
