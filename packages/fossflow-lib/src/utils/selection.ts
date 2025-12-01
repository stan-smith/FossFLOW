import { UiState, ItemReference, Coords } from 'src/types';
import { useScene } from 'src/hooks/useScene';
import { CoordsUtils } from 'src/utils';
import { getTilePosition } from './renderer';
import { getBoundingBox } from './renderer';

/**
 * Extract selected items from UI state
 */
export const getSelectedItems = (uiState: UiState): ItemReference[] => {
  const { mode, itemControls } = uiState;

  // Check for multi-selection in lasso modes
  if (mode.type === 'LASSO' && mode.selection) {
    return mode.selection.items;
  }

  if (mode.type === 'FREEHAND_LASSO' && mode.selection) {
    return mode.selection.items;
  }

  // Check for drag mode selection
  if (mode.type === 'DRAG_ITEMS') {
    return mode.items;
  }

  // Check for single item selection
  if (itemControls && itemControls.type !== 'ADD_ITEM') {
    return [itemControls];
  }

  return [];
};

/**
 * Get selected connectors from UI state and scene
 */
export const getSelectedConnectors = (
  uiState: UiState,
  scene: ReturnType<typeof useScene>
): string[] => {
  const selectedConnectorIds: string[] = [];

  // Check if connector is selected via itemControls
  if (uiState.itemControls?.type === 'CONNECTOR') {
    selectedConnectorIds.push(uiState.itemControls.id);
  }

  // Check if connector is selected via mode
  if (uiState.mode.type === 'CONNECTOR' && uiState.mode.id) {
    selectedConnectorIds.push(uiState.mode.id);
  }

  // Filter to only existing connectors
  return selectedConnectorIds.filter((id) => {
    return scene.connectors.some((c) => c.id === id);
  });
};

/**
 * Calculate bounding box of selected items in tile coordinates
 */
export const getSelectionBounds = (
  items: ItemReference[],
  scene: ReturnType<typeof useScene>
): { from: Coords; to: Coords } | null => {
  if (items.length === 0) {
    return null;
  }

  const tiles: Coords[] = [];

  items.forEach((item) => {
    if (item.type === 'ITEM') {
      const viewItem = scene.items.find((i) => i.id === item.id);
      if (viewItem) {
        tiles.push(viewItem.tile);
      }
    } else if (item.type === 'RECTANGLE') {
      const rectangle = scene.rectangles.find((r) => r.id === item.id);
      if (rectangle) {
        tiles.push(rectangle.from);
        tiles.push(rectangle.to);
      }
    } else if (item.type === 'TEXTBOX') {
      const textBox = scene.textBoxes.find((t) => t.id === item.id);
      if (textBox) {
        tiles.push(textBox.tile);
      }
    }
  });

  if (tiles.length === 0) {
    return null;
  }

  const boundingBox = getBoundingBox(tiles);
  // Convert BoundingBox (4 corners) to { from, to } format
  // BoundingBox is [bottom-left, bottom-right, top-right, top-left]
  // We can use the first corner for 'from' and third corner for 'to'
  // But to be safe, we calculate min/max from all corners
  const minX = Math.min(...boundingBox.map(c => c.x));
  const minY = Math.min(...boundingBox.map(c => c.y));
  const maxX = Math.max(...boundingBox.map(c => c.x));
  const maxY = Math.max(...boundingBox.map(c => c.y));
  
  return { from: { x: minX, y: minY }, to: { x: maxX, y: maxY } };
};

/**
 * Check if multiple items are selected
 */
export const isMultiSelection = (uiState: UiState): boolean => {
  const items = getSelectedItems(uiState);
  return items.length > 1;
};

/**
 * Get selection center position in screen coordinates
 */
export const getSelectionCenter = (
  items: ItemReference[],
  scene: ReturnType<typeof useScene>,
  rendererSize: { width: number; height: number }
): Coords | null => {
  const bounds = getSelectionBounds(items, scene);
  if (!bounds) {
    return null;
  }

  const centerTile: Coords = {
    x: (bounds.from.x + bounds.to.x) / 2,
    y: (bounds.from.y + bounds.to.y) / 2
  };

  const centerPosition = getTilePosition({
    tile: centerTile,
    origin: 'CENTER'
  });

  return {
    x: centerPosition.x + rendererSize.width / 2,
    y: centerPosition.y + rendererSize.height / 2
  };
};

