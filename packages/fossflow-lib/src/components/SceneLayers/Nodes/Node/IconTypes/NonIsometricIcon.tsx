import React from 'react';
import { Box } from '@mui/material';
import { Icon } from 'src/types';
import { PROJECTED_TILE_SIZE } from 'src/config';
import { getIsoProjectionCss } from 'src/utils';

interface Props {
  icon: Icon;
}

export const NonIsometricIcon = ({ icon }: Props) => {
  return (
    <Box sx={{ pointerEvents: 'none' }}>
      <Box
        sx={{
          position: 'absolute',
          left: -PROJECTED_TILE_SIZE.width / 2,
          top: -PROJECTED_TILE_SIZE.height / 2,
          transformOrigin: 'top left',
          transform: getIsoProjectionCss()
        }}
      >
        <Box
          component="img"
          src={icon.url}
          alt={`icon-${icon.id}`}
          sx={{ width: PROJECTED_TILE_SIZE.width * 0.7 }}
        />
      </Box>
    </Box>
  );
};
