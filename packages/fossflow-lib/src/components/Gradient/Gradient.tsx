import React from 'react';
import { Box, SxProps } from '@mui/material';

interface Props {
  sx?: SxProps;
}

export const Gradient = ({ sx }: Props) => {
  return (
    <Box
      sx={{
        background:
          'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 5%, rgba(255,255,255,0) 100%)',
        ...sx
      }}
    />
  );
};
