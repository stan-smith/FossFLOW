import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { useScene } from 'src/hooks/useScene';
import { connectorPathTileToGlobal, getTilePosition } from 'src/utils';
import { PROJECTED_TILE_SIZE } from 'src/config';
import { Label } from 'src/components/Label/Label';

interface Props {
  connector: ReturnType<typeof useScene>['connectors'][0];
}

export const ConnectorLabel = ({ connector }: Props) => {
  const centerLabelPosition = useMemo(() => {
    const tileIndex = Math.floor(connector.path.tiles.length / 2);
    const tile = connector.path.tiles[tileIndex];

    return getTilePosition({
      tile: connectorPathTileToGlobal(tile, connector.path.rectangle.from)
    });
  }, [connector.path]);

  const startLabelPosition = useMemo(() => {
    if (!connector.startLabel) return null;
    const tiles = connector.path.tiles;
    if (tiles.length < 2) return null;
    
    // Use second tile position for start label to offset from node
    const tile = tiles[Math.min(1, tiles.length - 1)];
    return getTilePosition({
      tile: connectorPathTileToGlobal(tile, connector.path.rectangle.from)
    });
  }, [connector.path, connector.startLabel]);

  const endLabelPosition = useMemo(() => {
    if (!connector.endLabel) return null;
    const tiles = connector.path.tiles;
    if (tiles.length < 2) return null;
    
    // Use second-to-last tile position for end label to offset from node
    const tile = tiles[Math.max(tiles.length - 2, 0)];
    return getTilePosition({
      tile: connectorPathTileToGlobal(tile, connector.path.rectangle.from)
    });
  }, [connector.path, connector.endLabel]);

  return (
    <>
      {/* Center label (existing description) */}
      {connector.description && (
        <Box
          sx={{ position: 'absolute', pointerEvents: 'none' }}
          style={{
            maxWidth: PROJECTED_TILE_SIZE.width,
            left: centerLabelPosition.x,
            top: centerLabelPosition.y
          }}
        >
          <Label
            maxWidth={150}
            labelHeight={connector.centerLabelHeight || 0}
            sx={{
              py: 0.75,
              px: 1,
              borderRadius: 2
            }}
          >
            <Typography color="text.secondary" variant="body2">
              {connector.description}
            </Typography>
          </Label>
        </Box>
      )}
      
      {/* Start label */}
      {connector.startLabel && startLabelPosition && (
        <Box
          sx={{ position: 'absolute', pointerEvents: 'none' }}
          style={{
            maxWidth: PROJECTED_TILE_SIZE.width,
            left: startLabelPosition.x,
            top: startLabelPosition.y
          }}
        >
          <Label
            maxWidth={100}
            labelHeight={connector.startLabelHeight || 0}
            sx={{
              py: 0.5,
              px: 0.75,
              borderRadius: 1,
              backgroundColor: 'background.paper',
              opacity: 0.9
            }}
          >
            <Typography color="text.secondary" variant="caption">
              {connector.startLabel}
            </Typography>
          </Label>
        </Box>
      )}
      
      {/* End label */}
      {connector.endLabel && endLabelPosition && (
        <Box
          sx={{ position: 'absolute', pointerEvents: 'none' }}
          style={{
            maxWidth: PROJECTED_TILE_SIZE.width,
            left: endLabelPosition.x,
            top: endLabelPosition.y
          }}
        >
          <Label
            maxWidth={100}
            labelHeight={connector.endLabelHeight || 0}
            sx={{
              py: 0.5,
              px: 0.75,
              borderRadius: 1,
              backgroundColor: 'background.paper',
              opacity: 0.9
            }}
          >
            <Typography color="text.secondary" variant="caption">
              {connector.endLabel}
            </Typography>
          </Label>
        </Box>
      )}
    </>
  );
};
