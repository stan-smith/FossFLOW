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
  const labelPosition = useMemo(() => {
    const tileIndex = Math.floor(connector.path.tiles.length / 2);
    const tile = connector.path.tiles[tileIndex];

    return getTilePosition({
      tile: connectorPathTileToGlobal(tile, connector.path.rectangle.from)
    });
  }, [connector.path]);

  return (
    <Box
      sx={{ position: 'absolute', pointerEvents: 'none' }}
      style={{
        maxWidth: PROJECTED_TILE_SIZE.width,
        left: labelPosition.x,
        top: labelPosition.y
      }}
    >
      <Label
        maxWidth={150}
        labelHeight={0}
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
  );
};
