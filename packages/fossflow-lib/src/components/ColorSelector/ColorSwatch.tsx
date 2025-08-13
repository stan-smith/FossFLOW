import React from 'react';
import { Box, Button } from '@mui/material';

export type Props = {
  hex: string;
  isActive?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
};

export const ColorSwatch = ({ hex, onClick, isActive }: Props) => {
  return (
    <Button
      onClick={onClick}
      variant="text"
      size="small"
      sx={{ width: 40, height: 40, minWidth: 'auto' }}
    >
      <Box>
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'grey.600',
            bgcolor: hex,
            width: 28,
            height: 28,
            trasformOrigin: 'center',
            transform: `scale(${isActive ? 1.25 : 1})`,
            borderRadius: '100%'
          }}
        />
      </Box>
    </Button>
  );
};
