import React from 'react';
import { Box } from '@mui/material';
import { Icon } from 'src/types';
import { PROJECTED_TILE_SIZE } from 'src/config';
import { getProjectionCss } from 'src/utils';

interface Props {
  icon: Icon;
}

export const NonIsometricIcon = ({ icon }: Props) => {
  const tileSize = PROJECTED_TILE_SIZE.width;
  const iconSize = PROJECTED_TILE_SIZE.width * 0.7 * (icon.scale || 1);

  return (
    <Box sx={{ pointerEvents: 'none' }}>
      <Box
        sx={{
          position: 'absolute',
          left: -PROJECTED_TILE_SIZE.width / 2,
          top: -PROJECTED_TILE_SIZE.height / 2,
          transformOrigin: 'top left',
          transform: getProjectionCss('isometric')
        }}
      >
        <Box
          component="img"
          src={icon.url}
          alt={`icon-${icon.id}`}
          sx={{ width: iconSize }}
        />
      </Box>
    </Box>
  );
};
