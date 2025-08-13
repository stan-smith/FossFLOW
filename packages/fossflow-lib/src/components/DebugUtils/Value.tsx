import React from 'react';
import { Box, Typography } from '@mui/material';

interface Props {
  value: string;
}

export const Value = ({ value }: Props) => {
  return (
    <Box
      sx={{
        display: 'inline-block',
        bgcolor: 'grey.300',
        wordWrap: 'break-word',
        py: 0.25,
        px: 0.5,
        border: (theme) => {
          return `1px solid ${theme.palette.grey[400]}`;
        },
        borderRadius: 2,
        maxWidth: 200
      }}
    >
      <Typography sx={{ fontSize: '0.8em' }} variant="body2">
        {value}
      </Typography>
    </Box>
  );
};
