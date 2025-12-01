import { ItemReference, Coords } from 'src/types';
import { useScene } from 'src/hooks/useScene';
import { CoordsUtils } from 'src/utils';
import { getItemByIdOrThrow } from './common';

/**
 * Align all items to the leftmost position
 */
export const alignLeft = (
  items: ItemReference[],
  scene: ReturnType<typeof useScene>
): void => {
  if (items.length < 2) {
    return;
  }

  // Find leftmost x coordinate
  let leftmostX = Infinity;

  items.forEach((item) => {
    if (item.type === 'ITEM') {
      const viewItem = scene.items.find((i) => i.id === item.id);
      if (viewItem) {
        leftmostX = Math.min(leftmostX, viewItem.tile.x);
      }
    } else if (item.type === 'RECTANGLE') {
      const rectangle = scene.rectangles.find((r) => r.id === item.id);
      if (rectangle) {
        leftmostX = Math.min(leftmostX, rectangle.from.x, rectangle.to.x);
      }
    } else if (item.type === 'TEXTBOX') {
      const textBox = scene.textBoxes.find((t) => t.id === item.id);
      if (textBox) {
        leftmostX = Math.min(leftmostX, textBox.tile.x);
      }
    }
  });

  if (leftmostX === Infinity) {
    return;
  }

  // Align all items to leftmost x
  scene.transaction(() => {
    items.forEach((item) => {
      if (item.type === 'ITEM') {
        const viewItem = getItemByIdOrThrow(scene.items, item.id).value;
        scene.updateViewItem(item.id, {
          tile: { ...viewItem.tile, x: leftmostX }
        });
      } else if (item.type === 'RECTANGLE') {
        const rectangle = getItemByIdOrThrow(scene.rectangles, item.id).value;
        const width = rectangle.to.x - rectangle.from.x;
        scene.updateRectangle(item.id, {
          from: { ...rectangle.from, x: leftmostX },
          to: { ...rectangle.to, x: leftmostX + width }
        });
      } else if (item.type === 'TEXTBOX') {
        const textBox = getItemByIdOrThrow(scene.textBoxes, item.id).value;
        scene.updateTextBox(item.id, {
          tile: { ...textBox.tile, x: leftmostX }
        });
      }
    });
  });
};

/**
 * Align all items to the rightmost position
 */
export const alignRight = (
  items: ItemReference[],
  scene: ReturnType<typeof useScene>
): void => {
  if (items.length < 2) {
    return;
  }

  // Find rightmost x coordinate
  let rightmostX = -Infinity;

  items.forEach((item) => {
    if (item.type === 'ITEM') {
      const viewItem = scene.items.find((i) => i.id === item.id);
      if (viewItem) {
        rightmostX = Math.max(rightmostX, viewItem.tile.x);
      }
    } else if (item.type === 'RECTANGLE') {
      const rectangle = scene.rectangles.find((r) => r.id === item.id);
      if (rectangle) {
        rightmostX = Math.max(rightmostX, rectangle.from.x, rectangle.to.x);
      }
    } else if (item.type === 'TEXTBOX') {
      const textBox = scene.textBoxes.find((t) => t.id === item.id);
      if (textBox) {
        rightmostX = Math.max(rightmostX, textBox.tile.x);
      }
    }
  });

  if (rightmostX === -Infinity) {
    return;
  }

  // Align all items to rightmost x
  scene.transaction(() => {
    items.forEach((item) => {
      if (item.type === 'ITEM') {
        const viewItem = getItemByIdOrThrow(scene.items, item.id).value;
        scene.updateViewItem(item.id, {
          tile: { ...viewItem.tile, x: rightmostX }
        });
      } else if (item.type === 'RECTANGLE') {
        const rectangle = getItemByIdOrThrow(scene.rectangles, item.id).value;
        const width = rectangle.to.x - rectangle.from.x;
        scene.updateRectangle(item.id, {
          from: { ...rectangle.from, x: rightmostX - width },
          to: { ...rectangle.to, x: rightmostX }
        });
      } else if (item.type === 'TEXTBOX') {
        const textBox = getItemByIdOrThrow(scene.textBoxes, item.id).value;
        scene.updateTextBox(item.id, {
          tile: { ...textBox.tile, x: rightmostX }
        });
      }
    });
  });
};

/**
 * Align all items to the topmost position
 */
export const alignTop = (
  items: ItemReference[],
  scene: ReturnType<typeof useScene>
): void => {
  if (items.length < 2) {
    return;
  }

  // Find topmost y coordinate
  let topmostY = Infinity;

  items.forEach((item) => {
    if (item.type === 'ITEM') {
      const viewItem = scene.items.find((i) => i.id === item.id);
      if (viewItem) {
        topmostY = Math.min(topmostY, viewItem.tile.y);
      }
    } else if (item.type === 'RECTANGLE') {
      const rectangle = scene.rectangles.find((r) => r.id === item.id);
      if (rectangle) {
        topmostY = Math.min(topmostY, rectangle.from.y, rectangle.to.y);
      }
    } else if (item.type === 'TEXTBOX') {
      const textBox = scene.textBoxes.find((t) => t.id === item.id);
      if (textBox) {
        topmostY = Math.min(topmostY, textBox.tile.y);
      }
    }
  });

  if (topmostY === Infinity) {
    return;
  }

  // Align all items to topmost y
  scene.transaction(() => {
    items.forEach((item) => {
      if (item.type === 'ITEM') {
        const viewItem = getItemByIdOrThrow(scene.items, item.id).value;
        scene.updateViewItem(item.id, {
          tile: { ...viewItem.tile, y: topmostY }
        });
      } else if (item.type === 'RECTANGLE') {
        const rectangle = getItemByIdOrThrow(scene.rectangles, item.id).value;
        const height = rectangle.to.y - rectangle.from.y;
        scene.updateRectangle(item.id, {
          from: { ...rectangle.from, y: topmostY },
          to: { ...rectangle.to, y: topmostY + height }
        });
      } else if (item.type === 'TEXTBOX') {
        const textBox = getItemByIdOrThrow(scene.textBoxes, item.id).value;
        scene.updateTextBox(item.id, {
          tile: { ...textBox.tile, y: topmostY }
        });
      }
    });
  });
};

/**
 * Align all items to the bottommost position
 */
export const alignBottom = (
  items: ItemReference[],
  scene: ReturnType<typeof useScene>
): void => {
  if (items.length < 2) {
    return;
  }

  // Find bottommost y coordinate
  let bottommostY = -Infinity;

  items.forEach((item) => {
    if (item.type === 'ITEM') {
      const viewItem = scene.items.find((i) => i.id === item.id);
      if (viewItem) {
        bottommostY = Math.max(bottommostY, viewItem.tile.y);
      }
    } else if (item.type === 'RECTANGLE') {
      const rectangle = scene.rectangles.find((r) => r.id === item.id);
      if (rectangle) {
        bottommostY = Math.max(bottommostY, rectangle.from.y, rectangle.to.y);
      }
    } else if (item.type === 'TEXTBOX') {
      const textBox = scene.textBoxes.find((t) => t.id === item.id);
      if (textBox) {
        bottommostY = Math.max(bottommostY, textBox.tile.y);
      }
    }
  });

  if (bottommostY === -Infinity) {
    return;
  }

  // Align all items to bottommost y
  scene.transaction(() => {
    items.forEach((item) => {
      if (item.type === 'ITEM') {
        const viewItem = getItemByIdOrThrow(scene.items, item.id).value;
        scene.updateViewItem(item.id, {
          tile: { ...viewItem.tile, y: bottommostY }
        });
      } else if (item.type === 'RECTANGLE') {
        const rectangle = getItemByIdOrThrow(scene.rectangles, item.id).value;
        const height = rectangle.to.y - rectangle.from.y;
        scene.updateRectangle(item.id, {
          from: { ...rectangle.from, y: bottommostY - height },
          to: { ...rectangle.to, y: bottommostY }
        });
      } else if (item.type === 'TEXTBOX') {
        const textBox = getItemByIdOrThrow(scene.textBoxes, item.id).value;
        scene.updateTextBox(item.id, {
          tile: { ...textBox.tile, y: bottommostY }
        });
      }
    });
  });
};

/**
 * Center items horizontally
 */
export const alignCenterHorizontal = (
  items: ItemReference[],
  scene: ReturnType<typeof useScene>
): void => {
  if (items.length < 2) {
    return;
  }

  // Find min and max x coordinates
  let minX = Infinity;
  let maxX = -Infinity;

  items.forEach((item) => {
    if (item.type === 'ITEM') {
      const viewItem = scene.items.find((i) => i.id === item.id);
      if (viewItem) {
        minX = Math.min(minX, viewItem.tile.x);
        maxX = Math.max(maxX, viewItem.tile.x);
      }
    } else if (item.type === 'RECTANGLE') {
      const rectangle = scene.rectangles.find((r) => r.id === item.id);
      if (rectangle) {
        minX = Math.min(minX, rectangle.from.x, rectangle.to.x);
        maxX = Math.max(maxX, rectangle.from.x, rectangle.to.x);
      }
    } else if (item.type === 'TEXTBOX') {
      const textBox = scene.textBoxes.find((t) => t.id === item.id);
      if (textBox) {
        minX = Math.min(minX, textBox.tile.x);
        maxX = Math.max(maxX, textBox.tile.x);
      }
    }
  });

  if (minX === Infinity || maxX === -Infinity) {
    return;
  }

  const centerX = (minX + maxX) / 2;

  // Center all items horizontally
  scene.transaction(() => {
    items.forEach((item) => {
      if (item.type === 'ITEM') {
        const viewItem = getItemByIdOrThrow(scene.items, item.id).value;
        scene.updateViewItem(item.id, {
          tile: { ...viewItem.tile, x: centerX }
        });
      } else if (item.type === 'RECTANGLE') {
        const rectangle = getItemByIdOrThrow(scene.rectangles, item.id).value;
        const width = rectangle.to.x - rectangle.from.x;
        const centerOffset = centerX - (rectangle.from.x + rectangle.to.x) / 2;
        scene.updateRectangle(item.id, {
          from: { ...rectangle.from, x: rectangle.from.x + centerOffset },
          to: { ...rectangle.to, x: rectangle.to.x + centerOffset }
        });
      } else if (item.type === 'TEXTBOX') {
        const textBox = getItemByIdOrThrow(scene.textBoxes, item.id).value;
        scene.updateTextBox(item.id, {
          tile: { ...textBox.tile, x: centerX }
        });
      }
    });
  });
};

/**
 * Center items vertically
 */
export const alignCenterVertical = (
  items: ItemReference[],
  scene: ReturnType<typeof useScene>
): void => {
  if (items.length < 2) {
    return;
  }

  // Find min and max y coordinates
  let minY = Infinity;
  let maxY = -Infinity;

  items.forEach((item) => {
    if (item.type === 'ITEM') {
      const viewItem = scene.items.find((i) => i.id === item.id);
      if (viewItem) {
        minY = Math.min(minY, viewItem.tile.y);
        maxY = Math.max(maxY, viewItem.tile.y);
      }
    } else if (item.type === 'RECTANGLE') {
      const rectangle = scene.rectangles.find((r) => r.id === item.id);
      if (rectangle) {
        minY = Math.min(minY, rectangle.from.y, rectangle.to.y);
        maxY = Math.max(maxY, rectangle.from.y, rectangle.to.y);
      }
    } else if (item.type === 'TEXTBOX') {
      const textBox = scene.textBoxes.find((t) => t.id === item.id);
      if (textBox) {
        minY = Math.min(minY, textBox.tile.y);
        maxY = Math.max(maxY, textBox.tile.y);
      }
    }
  });

  if (minY === Infinity || maxY === -Infinity) {
    return;
  }

  const centerY = (minY + maxY) / 2;

  // Center all items vertically
  scene.transaction(() => {
    items.forEach((item) => {
      if (item.type === 'ITEM') {
        const viewItem = getItemByIdOrThrow(scene.items, item.id).value;
        scene.updateViewItem(item.id, {
          tile: { ...viewItem.tile, y: centerY }
        });
      } else if (item.type === 'RECTANGLE') {
        const rectangle = getItemByIdOrThrow(scene.rectangles, item.id).value;
        const height = rectangle.to.y - rectangle.from.y;
        const centerOffset = centerY - (rectangle.from.y + rectangle.to.y) / 2;
        scene.updateRectangle(item.id, {
          from: { ...rectangle.from, y: rectangle.from.y + centerOffset },
          to: { ...rectangle.to, y: rectangle.to.y + centerOffset }
        });
      } else if (item.type === 'TEXTBOX') {
        const textBox = getItemByIdOrThrow(scene.textBoxes, item.id).value;
        scene.updateTextBox(item.id, {
          tile: { ...textBox.tile, y: centerY }
        });
      }
    });
  });
};

