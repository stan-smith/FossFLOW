import { getConnectorGroups, getGroupOffset } from '../connectorGroups';
import { Connector } from 'src/types';

const TILE_SIZE = 100; // matches UNPROJECTED_TILE_SIZE

const makeConnector = (
  id: string,
  fromItem: string,
  toItem: string,
  customColor?: string
): Connector => ({
  id,
  anchors: [
    { id: `${id}-a1`, ref: { item: fromItem } },
    { id: `${id}-a2`, ref: { item: toItem } }
  ],
  ...(customColor ? { customColor } : {})
});

const makeTileConnector = (
  id: string,
  fromTile: { x: number; y: number },
  toTile: { x: number; y: number }
): Connector => ({
  id,
  anchors: [
    { id: `${id}-a1`, ref: { tile: fromTile } },
    { id: `${id}-a2`, ref: { tile: toTile } }
  ]
});

describe('getConnectorGroups', () => {
  it('should return empty map for empty array', () => {
    const result = getConnectorGroups([]);
    expect(result.size).toBe(0);
  });

  it('should return index=0, total=1 for single connector', () => {
    const result = getConnectorGroups([makeConnector('c1', 'item1', 'item2')]);
    expect(result.get('c1')).toEqual({ index: 0, total: 1 });
  });

  it('should group two connectors between same items', () => {
    const result = getConnectorGroups([
      makeConnector('c1', 'item1', 'item2'),
      makeConnector('c2', 'item1', 'item2')
    ]);
    expect(result.get('c1')).toEqual({ index: 0, total: 2 });
    expect(result.get('c2')).toEqual({ index: 1, total: 2 });
  });

  it('should group connectors regardless of anchor order', () => {
    const result = getConnectorGroups([
      makeConnector('c1', 'item1', 'item2'),
      makeConnector('c2', 'item2', 'item1')
    ]);
    expect(result.get('c1')).toEqual({ index: 0, total: 2 });
    expect(result.get('c2')).toEqual({ index: 1, total: 2 });
  });

  it('should NOT group connectors between different items', () => {
    const result = getConnectorGroups([
      makeConnector('c1', 'item1', 'item2'),
      makeConnector('c2', 'item1', 'item3')
    ]);
    expect(result.get('c1')).toEqual({ index: 0, total: 1 });
    expect(result.get('c2')).toEqual({ index: 0, total: 1 });
  });

  it('should handle 8 connectors between the same two items', () => {
    const connectors = Array.from({ length: 8 }, (_, i) =>
      makeConnector(`c${i}`, 'item1', 'item2')
    );
    const result = getConnectorGroups(connectors);

    for (let i = 0; i < 8; i++) {
      expect(result.get(`c${i}`)).toEqual({ index: i, total: 8 });
    }
  });

  it('should handle tile-based anchors', () => {
    const result = getConnectorGroups([
      makeTileConnector('c1', { x: 0, y: 0 }, { x: 1, y: 1 }),
      makeTileConnector('c2', { x: 0, y: 0 }, { x: 1, y: 1 }),
      makeTileConnector('c3', { x: 2, y: 2 }, { x: 3, y: 3 })
    ]);
    expect(result.get('c1')).toEqual({ index: 0, total: 2 });
    expect(result.get('c2')).toEqual({ index: 1, total: 2 });
    expect(result.get('c3')).toEqual({ index: 0, total: 1 });
  });

  it('should handle mixed groups', () => {
    const result = getConnectorGroups([
      makeConnector('c1', 'A', 'B'),
      makeConnector('c2', 'A', 'B'),
      makeConnector('c3', 'A', 'B'),
      makeConnector('c4', 'A', 'C'),
      makeConnector('c5', 'A', 'C'),
      makeConnector('c6', 'D', 'E')
    ]);

    expect(result.get('c1')).toEqual({ index: 0, total: 3 });
    expect(result.get('c2')).toEqual({ index: 1, total: 3 });
    expect(result.get('c3')).toEqual({ index: 2, total: 3 });
    expect(result.get('c4')).toEqual({ index: 0, total: 2 });
    expect(result.get('c5')).toEqual({ index: 1, total: 2 });
    expect(result.get('c6')).toEqual({ index: 0, total: 1 });
  });
});

describe('getGroupOffset', () => {
  it('should return 0 for single connector', () => {
    expect(getGroupOffset(0, 1, TILE_SIZE)).toBe(0);
  });

  it('should return symmetric offsets for two connectors', () => {
    const o0 = getGroupOffset(0, 2, TILE_SIZE);
    const o1 = getGroupOffset(1, 2, TILE_SIZE);
    expect(o0).toBeLessThan(0);
    expect(o1).toBeGreaterThan(0);
    expect(o0).toBe(-o1);
  });

  it('should return correct offsets for 8 connectors', () => {
    const offsets = Array.from({ length: 8 }, (_, i) =>
      getGroupOffset(i, 8, TILE_SIZE)
    );

    // Verify symmetry: offset[i] === -offset[7-i]
    for (let i = 0; i < 4; i++) {
      expect(offsets[i]).toBeCloseTo(-offsets[7 - i], 10);
    }

    // Verify monotonically increasing
    for (let i = 1; i < 8; i++) {
      expect(offsets[i]).toBeGreaterThan(offsets[i - 1]);
    }
  });

  it('should fit all connectors within one tile', () => {
    for (const total of [2, 3, 4, 5, 6, 7, 8]) {
      const offsets = Array.from({ length: total }, (_, i) =>
        getGroupOffset(i, total, TILE_SIZE)
      );
      const minOffset = Math.min(...offsets);
      const maxOffset = Math.max(...offsets);
      const totalSpread = maxOffset - minOffset;

      // Total spread must fit within the tile (using 80% of tile)
      expect(totalSpread).toBeLessThanOrEqual(TILE_SIZE * 0.8);
    }
  });

  it('should center the group around 0', () => {
    for (const total of [2, 3, 4, 5, 6, 7, 8]) {
      const sum = Array.from({ length: total }, (_, i) =>
        getGroupOffset(i, total, TILE_SIZE)
      ).reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(0, 10);
    }
  });

  it('should scale with tile size', () => {
    const offset100 = getGroupOffset(0, 4, 100);
    const offset200 = getGroupOffset(0, 4, 200);
    expect(offset200).toBeCloseTo(offset100 * 2);
  });
});

describe('8 parallel connectors with individual colors', () => {
  const colors = [
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
    '#FF00FF', '#00FFFF', '#FFA500', '#800080'
  ];

  it('should allow 8 connectors between same nodes with different colors', () => {
    const connectors = colors.map((color, i) =>
      makeConnector(`c${i}`, 'item1', 'item2', color)
    );

    expect(connectors).toHaveLength(8);

    const uniqueColors = new Set(connectors.map((c) => c.customColor));
    expect(uniqueColors.size).toBe(8);

    const groups = getConnectorGroups(connectors);
    for (let i = 0; i < 8; i++) {
      expect(groups.get(`c${i}`)).toEqual({ index: i, total: 8 });
    }
  });

  it('should produce distinct offsets for all 8 connectors', () => {
    const offsets = Array.from({ length: 8 }, (_, i) =>
      getGroupOffset(i, 8, TILE_SIZE)
    );
    const uniqueOffsets = new Set(offsets);
    expect(uniqueOffsets.size).toBe(8);
  });

  it('should serialize 8 connectors between two nodes to JSON and back', () => {
    const connectors = colors.map((color, i) =>
      makeConnector(`c${i}`, 'item1', 'item2', color)
    );

    const json = JSON.stringify({ connectors });
    const parsed = JSON.parse(json);

    expect(parsed.connectors).toHaveLength(8);

    for (let i = 0; i < 8; i++) {
      const c = parsed.connectors[i];
      expect(c.id).toBe(`c${i}`);
      expect(c.anchors[0].ref.item).toBe('item1');
      expect(c.anchors[1].ref.item).toBe('item2');
      expect(c.customColor).toBe(colors[i]);
    }

    // Verify grouping works after deserialization
    const groups = getConnectorGroups(parsed.connectors);
    for (let i = 0; i < 8; i++) {
      expect(groups.get(`c${i}`)).toEqual({ index: i, total: 8 });
    }
  });
});
