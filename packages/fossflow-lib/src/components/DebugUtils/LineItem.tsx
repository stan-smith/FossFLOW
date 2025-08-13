import React from 'react';
import { Typography, Box } from '@mui/material';
import { Value } from './Value';

interface Props {
  title: string;
  value: string | number;
}

export const LineItem = ({ title, value }: Props) => {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        py: 1,
        borderBottom: (theme) => {
          return `1px solid ${theme.palette.grey[300]}`;
        }
      }}
    >
      <Box
        sx={{
          width: 100
        }}
      >
        <Typography>{title}</Typography>
      </Box>
      <Box
        sx={{
          flexGrow: 1
        }}
      >
        <Value value={value.toString()} />
      </Box>
    </Box>
  );
};
