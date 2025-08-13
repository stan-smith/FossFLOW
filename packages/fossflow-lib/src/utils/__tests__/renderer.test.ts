import { Coords, Size, Scroll } from 'src/types';
import { CoordsUtils, SizeUtils } from 'src/utils';
import { PROJECTED_TILE_SIZE } from 'src/config';
import { getGridSubset, isWithinBounds, screenToIso } from '../renderer';

const getRendererSize = (tileSize: Size, zoom: number = 1): Size => {
  const projectedTileSize = SizeUtils.multiply(PROJECTED_TILE_SIZE, zoom);

  return {
    width: projectedTileSize.width * tileSize.width,
    height: projectedTileSize.height * tileSize.height
  };
};

const getScroll = (coords: Coords): Scroll => {
  return {
    position: coords,
    offset: CoordsUtils.zero()
  };
};

describe('Tests renderer utils', () => {
  test('getGridSubset() works correctly', () => {
    const gridSubset = getGridSubset([
      { x: 5, y: 5 },
      { x: 7, y: 7 }
    ]);

    expect(gridSubset).toEqual([
      { x: 5, y: 5 },
      { x: 5, y: 6 },
      { x: 5, y: 7 },
      { x: 6, y: 5 },
      { x: 6, y: 6 },
      { x: 6, y: 7 },
      { x: 7, y: 5 },
      { x: 7, y: 6 },
      { x: 7, y: 7 }
    ]);
  });

  test('isWithinBounds() works correctly', () => {
    const bounds: Coords[] = [
      { x: 4, y: 4 },
      { x: 6, y: 6 }
    ];

    const withinBounds = isWithinBounds({ x: 5, y: 5 }, bounds);
    const onBorder = isWithinBounds({ x: 4, y: 4 }, bounds);
    const outsideBounds = isWithinBounds({ x: 3, y: 3 }, bounds);

    expect(withinBounds).toBe(true);
    expect(onBorder).toBe(true);
    expect(outsideBounds).toBe(false);
  });

  test('screenToIso() works correctly when mouse is at center of project', () => {
    const zoom = 1;
    const rendererSize = getRendererSize({ width: 10, height: 10 }, zoom);
    const scroll = getScroll({ x: 0, y: 0 });
    const tile = screenToIso({
      mouse: {
        x: rendererSize.width / 2,
        y: rendererSize.height / 2
      },
      zoom,
      scroll,
      rendererSize
    });

    expect(tile).toEqual({ x: 0, y: -0 });
  });

  test('screenToIso() works correctly when mouse is at topLeft corner of project', () => {
    const zoom = 1;
    const rendererSize = getRendererSize({ width: 10, height: 10 }, zoom);
    const scroll = getScroll({ x: 0, y: 0 });
    const tile = screenToIso({
      mouse: {
        x: 0,
        y: 0
      },
      zoom,
      scroll,
      rendererSize
    });

    expect(tile).toEqual({ x: 0, y: 10 });
  });

  test('screenToIso() works correctly when mouse is at topLeft corner of project and zoom is 0.5', () => {
    const zoom = 0.5;
    const rendererSize = getRendererSize({ width: 10, height: 10 }, zoom);
    const scroll = getScroll({ x: 0, y: 0 });
    const tile = screenToIso({
      mouse: {
        x: 0,
        y: 0
      },
      zoom,
      scroll,
      rendererSize
    });

    expect(tile).toEqual({ x: 0, y: 10 });
  });

  test('screenToIso() works correctly when mouse is at center of project and zoom is 0.5 and screen is halfway scrolled', () => {
    const zoom = 1;
    const rendererSize = getRendererSize({ width: 10, height: 10 }, zoom);
    const scroll = getScroll({
      x: rendererSize.width / 2,
      y: rendererSize.height / 2
    });
    const tile = screenToIso({
      mouse: {
        x: rendererSize.width / 2,
        y: rendererSize.height / 2
      },
      zoom,
      scroll,
      rendererSize
    });

    expect(tile).toEqual({ x: 0, y: 10 });
  });
});
