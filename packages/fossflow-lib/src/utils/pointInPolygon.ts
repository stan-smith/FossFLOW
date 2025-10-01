import { Coords } from 'src/types';

/**
 * Ray casting algorithm to determine if a point is inside a polygon
 * @param point - The point to check (tile coordinates)
 * @param polygon - Array of vertices defining the polygon (tile coordinates)
 * @returns true if the point is inside the polygon
 */
export const isPointInPolygon = (point: Coords, polygon: Coords[]): boolean => {
  if (polygon.length < 3) return false;

  let inside = false;
  const x = point.x;
  const y = point.y;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
};

/**
 * Convert an array of screen coordinates to tile coordinates using the screenToIso function
 */
export const screenPathToTilePath = (
  screenPath: Coords[],
  screenToIsoFn: (coords: Coords) => Coords
): Coords[] => {
  return screenPath.map((point) => screenToIsoFn(point));
};

/**
 * Create a smooth SVG path from a series of points using quadratic curves
 * @param points - Array of screen coordinates
 * @returns SVG path string
 */
export const createSmoothPath = (points: Coords[]): string => {
  if (points.length < 2) return '';

  let path = `M ${points[0].x},${points[0].y}`;

  // Use quadratic bezier curves for smooth lines
  for (let i = 1; i < points.length; i++) {
    const current = points[i];
    const previous = points[i - 1];

    // Calculate control point as midpoint
    const cpX = (previous.x + current.x) / 2;
    const cpY = (previous.y + current.y) / 2;

    if (i === 1) {
      // First segment - line to control point, then curve
      path += ` L ${cpX},${cpY}`;
    } else {
      // Subsequent segments - quadratic curve
      path += ` Q ${previous.x},${previous.y} ${cpX},${cpY}`;
    }
  }

  // Complete the curve to the last point
  const lastPoint = points[points.length - 1];
  const secondLastPoint = points[points.length - 2];
  path += ` Q ${secondLastPoint.x},${secondLastPoint.y} ${lastPoint.x},${lastPoint.y}`;

  // Close the path
  path += ' Z';

  return path;
};
