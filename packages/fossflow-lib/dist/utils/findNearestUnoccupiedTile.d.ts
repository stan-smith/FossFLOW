import { Coords } from '../types';
import { useScene } from '../hooks/useScene';
/**
 * Finds the nearest unoccupied tile to the target tile using a spiral search pattern
 * @param targetTile - The desired tile position
 * @param scene - The current scene
 * @param maxDistance - Maximum search distance (default: 10)
 * @returns The nearest unoccupied tile, or null if none found within maxDistance
 */
export declare const findNearestUnoccupiedTile: (targetTile: Coords, scene: ReturnType<typeof useScene>, maxDistance?: number) => Coords | null;
/**
 * Finds the nearest unoccupied tile for multiple items being placed/moved
 * Ensures all items can be placed without overlapping
 * @param items - Array of items with their target tiles
 * @param scene - The current scene
 * @param excludeIds - IDs of items to exclude from occupation check (e.g., items being moved)
 * @returns Array of nearest unoccupied tiles for each item, or null if cannot place all
 */
export declare const findNearestUnoccupiedTilesForGroup: (items: {
    id: string;
    targetTile: Coords;
}[], scene: ReturnType<typeof useScene>, excludeIds?: string[]) => Coords[] | null;
