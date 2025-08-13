import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Button, Typography } from '@mui/material';
import { Icon as IconI } from 'src/types';

const SIZE = 50;

interface Props {
  icon: IconI;
  onClick?: () => void;
  onMouseDown?: () => void;
}

export const Icon = ({ icon, onClick, onMouseDown }: Props) => {
  return (
    <Button
      variant="text"
      onClick={onClick}
      onMouseDown={onMouseDown}
      sx={{
        userSelect: 'none'
      }}
    >
      <Stack
        sx={{ overflow: 'hidden', justifyContent: 'flex-start', width: SIZE }}
        spacing={1}
      >
        <Box sx={{ width: SIZE, height: SIZE, overflow: 'hidden' }}>
          <Box
            component="img"
            draggable={false}
            src={icon.url}
            alt={`Icon ${icon.name}`}
            sx={{ width: SIZE, height: SIZE }}
          />
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          textOverflow="ellipsis"
        >
          {icon.name}
        </Typography>
      </Stack>
    </Button>
  );
};
