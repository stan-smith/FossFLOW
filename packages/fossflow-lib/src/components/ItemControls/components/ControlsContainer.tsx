import React from 'react';
import { Box, Divider } from '@mui/material';

interface Props {
  header?: React.ReactNode;
  children: React.ReactNode;
}

export const ControlsContainer = ({ header, children }: Props) => {
  return (
    <Box
      sx={{
        position: 'relative',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        pb: 2
      }}
    >
      {header && (
        <Box
          sx={{
            width: '100%',
            zIndex: 1,
            position: 'sticky',
            bgcolor: 'background.paper',
            top: 0
          }}
        >
          {header}
          <Divider />
        </Box>
      )}
      <Box
        sx={{
          width: '100%',
          flexGrow: 1
        }}
      >
        <Box sx={{ width: '100%' }}>{children}</Box>
      </Box>
    </Box>
  );
};
