import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import { Coords } from 'src/types';
import { getTilePosition } from 'src/utils';
import { useIcon } from 'src/hooks/useIcon';

interface Props {
  iconId: string;
  tile: Coords;
}

export const DragAndDrop = ({ iconId, tile }: Props) => {
  const { iconComponent } = useIcon(iconId);

  const tilePosition = useMemo(() => {
    return getTilePosition({ tile, origin: 'BOTTOM' });
  }, [tile]);

  return (
    <Box
      sx={{
        position: 'absolute'
      }}
      style={{ left: tilePosition.x, top: tilePosition.y }}
    >
      {iconComponent}
    </Box>
  );
};
