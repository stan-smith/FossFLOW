import { Coords } from 'src/types';
import { useScene } from 'src/hooks/useScene';
import { getItemAtTile } from './renderer';

/**
 * Finds the nearest unoccupied tile to the target tile using a spiral search pattern
 * @param targetTile - The desired tile position
 * @param scene - The current scene
 * @param maxDistance - Maximum search distance (default: 10)
 * @returns The nearest unoccupied tile, or null if none found within maxDistance
 */
export const findNearestUnoccupiedTile = (
  targetTile: Coords,
  scene: ReturnType<typeof useScene>,
  maxDistance: number = 10
): Coords | null => {
  // Check if the target tile itself is unoccupied
  const itemAtTarget = getItemAtTile({ tile: targetTile, scene });
  if (!itemAtTarget || itemAtTarget.type !== 'ITEM') {
    return targetTile;
  }

  // Spiral search pattern: right, down, left, up
  const directions = [
    { x: 1, y: 0 },   // right
    { x: 0, y: 1 },   // down
    { x: -1, y: 0 },  // left
    { x: 0, y: -1 }   // up
  ];

  // Search in expanding rings around the target
  for (let distance = 1; distance <= maxDistance; distance++) {
    // Start from the top-left of the ring
    let currentTile = {
      x: targetTile.x - distance,
      y: targetTile.y - distance
    };

    // Check all tiles in this ring
    for (let side = 0; side < 4; side++) {
      const direction = directions[side];
      const sideLength = distance * 2;
      
      for (let step = 0; step < sideLength; step++) {
        // Move to the next tile on this side of the ring
        currentTile = {
          x: currentTile.x + direction.x,
          y: currentTile.y + direction.y
        };

        // Check if this tile is within bounds and unoccupied
        const itemAtTile = getItemAtTile({ tile: currentTile, scene });
        if (!itemAtTile || itemAtTile.type !== 'ITEM') {
          return currentTile;
        }
      }
    }
  }

  // No unoccupied tile found within maxDistance
  return null;
};

/**
 * Finds the nearest unoccupied tile for multiple items being placed/moved
 * Ensures all items can be placed without overlapping
 * @param items - Array of items with their target tiles
 * @param scene - The current scene
 * @param excludeIds - IDs of items to exclude from occupation check (e.g., items being moved)
 * @returns Array of nearest unoccupied tiles for each item, or null if cannot place all
 */
export const findNearestUnoccupiedTilesForGroup = (
  items: { id: string; targetTile: Coords }[],
  scene: ReturnType<typeof useScene>,
  excludeIds: string[] = []
): Coords[] | null => {
  const result: Coords[] = [];
  const occupiedTiles = new Set<string>();

  // Add existing items to occupied tiles (excluding the ones being moved)
  scene.items.forEach(item => {
    if (!excludeIds.includes(item.id)) {
      occupiedTiles.add(`${item.tile.x},${item.tile.y}`);
    }
  });

  // Find unoccupied tiles for each item
  for (const item of items) {
    let foundTile: Coords | null = null;
    const targetKey = `${item.targetTile.x},${item.targetTile.y}`;

    // Check if target is available
    if (!occupiedTiles.has(targetKey)) {
      foundTile = item.targetTile;
    } else {
      // Search for nearest unoccupied tile
      for (let distance = 1; distance <= 10; distance++) {
        // Check tiles in a square ring at this distance
        for (let dx = -distance; dx <= distance; dx++) {
          for (let dy = -distance; dy <= distance; dy++) {
            // Only check tiles on the ring perimeter
            if (Math.abs(dx) === distance || Math.abs(dy) === distance) {
              const checkTile = {
                x: item.targetTile.x + dx,
                y: item.targetTile.y + dy
              };
              const checkKey = `${checkTile.x},${checkTile.y}`;
              
              if (!occupiedTiles.has(checkKey)) {
                const itemAtTile = getItemAtTile({ tile: checkTile, scene });
                if (!itemAtTile || itemAtTile.type !== 'ITEM' || excludeIds.includes(itemAtTile.id)) {
                  foundTile = checkTile;
                  break;
                }
              }
            }
          }
          if (foundTile) break;
        }
        if (foundTile) break;
      }
    }

    if (!foundTile) {
      return null; // Cannot place all items
    }

    result.push(foundTile);
    occupiedTiles.add(`${foundTile.x},${foundTile.y}`);
  }

  return result;
};