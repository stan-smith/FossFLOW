import { Coords } from '../types';
/**
 * Ray casting algorithm to determine if a point is inside a polygon
 * @param point - The point to check (tile coordinates)
 * @param polygon - Array of vertices defining the polygon (tile coordinates)
 * @returns true if the point is inside the polygon
 */
export declare const isPointInPolygon: (point: Coords, polygon: Coords[]) => boolean;
/**
 * Convert an array of screen coordinates to tile coordinates using the screenToIso function
 */
export declare const screenPathToTilePath: (screenPath: Coords[], screenToIsoFn: (coords: Coords) => Coords) => Coords[];
/**
 * Create a smooth SVG path from a series of points using quadratic curves
 * @param points - Array of screen coordinates
 * @returns SVG path string
 */
export declare const createSmoothPath: (points: Coords[]) => string;
