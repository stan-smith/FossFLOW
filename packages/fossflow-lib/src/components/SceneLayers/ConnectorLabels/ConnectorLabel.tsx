import React, { useMemo, memo } from 'react';
import { Box, Typography } from '@mui/material';
import { useScene } from 'src/hooks/useScene';
import { useConnector } from 'src/hooks/useConnector';
import {
  connectorPathTileToGlobal,
  getTilePosition,
  getConnectorLabels,
  getLabelTileIndex
} from 'src/utils';
import { getGroupOffset } from 'src/utils/connectorGroups';
import { PROJECTED_TILE_SIZE, UNPROJECTED_TILE_SIZE } from 'src/config';
import { Label } from 'src/components/Label/Label';
import { ConnectorLabel as ConnectorLabelType } from 'src/types';

/**
 * Calculate the perpendicular unit vector at a point along a tile path.
 * Matches the same calculation used in Connector.tsx for path offsetting.
 */
const getPerpendicularAt = (
  tiles: { x: number; y: number }[],
  i: number
): { dx: number; dy: number } => {
  const curr = tiles[i];
  let dirX = 0;
  let dirY = 0;

  if (i > 0 && i < tiles.length - 1) {
    const prev = tiles[i - 1];
    const next = tiles[i + 1];
    dirX = ((curr.x - prev.x) + (next.x - curr.x)) / 2;
    dirY = ((curr.y - prev.y) + (next.y - curr.y)) / 2;
  } else if (i === 0 && tiles.length > 1) {
    dirX = tiles[1].x - curr.x;
    dirY = tiles[1].y - curr.y;
  } else if (i === tiles.length - 1 && tiles.length > 1) {
    const prev = tiles[i - 1];
    dirX = curr.x - prev.x;
    dirY = curr.y - prev.y;
  }

  const len = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
  return { dx: -dirY / len, dy: dirX / len };
};

interface Props {
  connector: ReturnType<typeof useScene>['connectors'][0];
  groupIndex?: number;
  groupTotal?: number;
}

export const ConnectorLabel = memo(({ connector: sceneConnector, groupIndex = 0, groupTotal = 1 }: Props) => {
  const connector = useConnector(sceneConnector.id);

  const labels = useMemo(() => {
    if (!connector) return [];
    return getConnectorLabels(connector);
  }, [connector]);

  // Calculate label positions based on percentage, group offset, and line assignment
  const labelPositions = useMemo(() => {
    if (!connector) return [];

    return labels
      .map((label) => {
        const tileIndex = getLabelTileIndex(
          sceneConnector.path.tiles.length,
          label.position
        );
        const tile = sceneConnector.path.tiles[tileIndex];

        if (!tile) return null;

        // Apply group perpendicular offset in tile space before projection
        let labelTile = { x: tile.x, y: tile.y };
        if (groupTotal > 1) {
          const { tiles } = sceneConnector.path;
          const perp = getPerpendicularAt(tiles, tileIndex);
          const offsetInTiles = getGroupOffset(groupIndex, groupTotal, 1.0);
          labelTile = {
            x: labelTile.x + perp.dx * offsetInTiles,
            y: labelTile.y + perp.dy * offsetInTiles
          };
        }

        let position = getTilePosition({
          tile: connectorPathTileToGlobal(
            labelTile,
            sceneConnector.path.rectangle.from
          )
        });

        // For double line types, offset labels based on line assignment
        const lineType = connector.lineType || 'SINGLE';
        if (
          (lineType === 'DOUBLE' || lineType === 'DOUBLE_WITH_CIRCLE') &&
          label.line === '2'
        ) {
          const { tiles } = sceneConnector.path;
          if (tileIndex > 0 && tileIndex < tiles.length - 1) {
            const prev = tiles[tileIndex - 1];
            const next = tiles[tileIndex + 1];
            const dx = next.x - prev.x;
            const dy = next.y - prev.y;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;

            const connectorWidthPx =
              (UNPROJECTED_TILE_SIZE / 100) * (connector.width || 15);
            const offset = connectorWidthPx * 3;
            const perpX = -dy / len;
            const perpY = dx / len;

            position = {
              x: position.x - perpX * offset,
              y: position.y - perpY * offset
            };
          }
        }

        return { label, position };
      })
      .filter(
        (
          item
        ): item is {
          label: ConnectorLabelType;
          position: { x: number; y: number };
        } => {
          return item !== null;
        }
      );
  }, [labels, sceneConnector.path, connector?.lineType, connector?.width, groupIndex, groupTotal]);

  return (
    <>
      {labelPositions.map(({ label, position }) => {
        return (
          <Box
            key={label.id}
            sx={{ position: 'absolute', pointerEvents: 'none' }}
            style={{
              maxWidth: PROJECTED_TILE_SIZE.width,
              left: position.x,
              top: position.y
            }}
          >
            <Label
              maxWidth={150}
              labelHeight={label.height || 0}
              showLine={label.showLine !== false}
              sx={{
                py: 0.75,
                px: 1,
                borderRadius: 2,
                backgroundColor: 'background.paper',
                opacity: 0.95
              }}
            >
              <Typography color="text.secondary" variant="body2">
                {label.text}
              </Typography>
            </Label>
          </Box>
        );
      })}
    </>
  );
});
