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
import { PROJECTED_TILE_SIZE, UNPROJECTED_TILE_SIZE } from 'src/config';
import { Label } from 'src/components/Label/Label';
import { ConnectorLabel as ConnectorLabelType } from 'src/types';

interface Props {
  connector: ReturnType<typeof useScene>['connectors'][0];
}

export const ConnectorLabel = memo(({ connector: sceneConnector }: Props) => {
  const connector = useConnector(sceneConnector.id);

  const labels = useMemo(() => {
    if (!connector) return [];
    return getConnectorLabels(connector);
  }, [connector]);

  // Calculate label positions based on percentage and line assignment
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

        let position = getTilePosition({
          tile: connectorPathTileToGlobal(
            tile,
            sceneConnector.path.rectangle.from
          )
        });

        // For double line types, offset labels based on line assignment
        const lineType = connector.lineType || 'SINGLE';
        if (
          (lineType === 'DOUBLE' || lineType === 'DOUBLE_WITH_CIRCLE') &&
          label.line === '2'
        ) {
          // Calculate offset perpendicular to line direction
          const { tiles } = sceneConnector.path;
          if (tileIndex > 0 && tileIndex < tiles.length - 1) {
            const prev = tiles[tileIndex - 1];
            const next = tiles[tileIndex + 1];
            const dx = next.x - prev.x;
            const dy = next.y - prev.y;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;

            // Perpendicular offset (matches the offset in Connector.tsx)
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
  }, [labels, sceneConnector.path, connector?.lineType, connector?.width]);

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
