import { useMemo } from 'react';
import { Coords, Size, ProjectionOrientationEnum } from 'src/types';
import {
  getBoundingBox,
  getIsoProjectionCss,
  getTilePosition
} from 'src/utils';
import { UNPROJECTED_TILE_SIZE } from 'src/config';

interface Props {
  from: Coords;
  to: Coords;
  originOverride?: Coords;
  orientation?: keyof typeof ProjectionOrientationEnum;
}

export const useIsoProjection = ({
  from,
  to,
  originOverride,
  orientation
}: Props): {
  css: React.CSSProperties;
  position: Coords;
  gridSize: Size;
  pxSize: Size;
} => {
  const gridSize = useMemo(() => {
    return {
      width: Math.abs(from.x - to.x) + 1,
      height: Math.abs(from.y - to.y) + 1
    };
  }, [from, to]);

  const origin = useMemo(() => {
    if (originOverride) return originOverride;

    const boundingBox = getBoundingBox([from, to]);

    return boundingBox[3];
  }, [from, to, originOverride]);

  const position = useMemo(() => {
    const pos = getTilePosition({
      tile: origin,
      origin: orientation === 'Y' ? 'TOP' : 'LEFT'
    });

    return pos;
  }, [origin, orientation]);

  const pxSize = useMemo(() => {
    return {
      width: gridSize.width * UNPROJECTED_TILE_SIZE,
      height: gridSize.height * UNPROJECTED_TILE_SIZE
    };
  }, [gridSize]);

  return {
    css: {
      position: 'absolute',
      left: position.x,
      top: position.y,
      width: `${pxSize.width}px`,
      height: `${pxSize.height}px`,
      transform: getIsoProjectionCss(orientation),
      transformOrigin: 'top left'
    },
    position,
    gridSize,
    pxSize
  };
};
