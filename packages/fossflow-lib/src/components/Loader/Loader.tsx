import React from 'react';
import { Box, CircularProgress, CircularProgressProps } from '@mui/material';

interface Props {
  size?: number;
  color?: CircularProgressProps['color'];
  isInline?: boolean;
}

export const Loader = ({ size = 1, color = 'primary', isInline }: Props) => {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: isInline ? 'auto' : '100%',
        height: isInline ? 'auto' : '100%'
      }}
    >
      <CircularProgress size={size * 20} color={color} />
    </Box>
  );
};
