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
          'linear-gradient(0deg, rgba(26,27,35,1) 0%, rgba(26,27,35,1) 5%, rgba(26,27,35,0) 100%)',
        ...sx
      }}
    />
  );
};
