import type { Connector } from 'src/types';

function getAnchorRefString(ref: Connector['anchors'][0]['ref']): string {
  if (ref.item !== undefined) {
    return ref.item;
  }
  if (ref.tile !== undefined) {
    return `tile:${ref.tile.x},${ref.tile.y}`;
  }
  if (ref.anchor !== undefined) {
    return `anchor:${ref.anchor}`;
  }
  return JSON.stringify(ref);
}

/**
 * Group connectors that share the same pair of anchor references.
 * Returns a Map where each connector ID maps to its index within its group
 * and the total group size.
 */
export function getConnectorGroups(
  connectors: Connector[]
): Map<string, { index: number; total: number }> {
  const groups = new Map<string, string[]>();

  for (const connector of connectors) {
    if (connector.anchors.length !== 2) {
      continue;
    }

    const ref1 = getAnchorRefString(connector.anchors[0].ref);
    const ref2 = getAnchorRefString(connector.anchors[1].ref);
    const key = [ref1, ref2].sort().join('|');

    const existing = groups.get(key);
    if (existing) {
      existing.push(connector.id);
    } else {
      groups.set(key, [connector.id]);
    }
  }

  const result = new Map<string, { index: number; total: number }>();

  for (const connectorIds of groups.values()) {
    const total = connectorIds.length;
    connectorIds.forEach((id, index) => {
      result.set(id, { index, total });
    });
  }

  return result;
}

/**
 * Calculate the perpendicular pixel offset for a connector within a group.
 * All connectors in a group are guaranteed to fit within a single tile.
 *
 * @param index - Position of the connector within its group (0-based)
 * @param total - Total number of connectors in the group
 * @param tileSize - Size of one tile in pixels (connectors must fit within this)
 * @returns Pixel offset to apply perpendicular to the connector path
 */
export function getGroupOffset(
  index: number,
  total: number,
  tileSize: number
): number {
  if (total <= 1) {
    return 0;
  }

  // Use 80% of tile to leave padding at edges
  const usableWidth = tileSize * 0.8;
  const spacing = usableWidth / (total - 1);

  return (index - (total - 1) / 2) * spacing;
}
