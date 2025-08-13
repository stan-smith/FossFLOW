// This is an entry point for the Docker image build.
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Box } from '@mui/material';
import GlobalStyles from '@mui/material/GlobalStyles';
import Isoflow, { INITIAL_DATA } from 'src/Isoflow';
import { icons, colors } from './examples/initialData';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <GlobalStyles
      styles={{
        body: {
          margin: 0
        }
      }}
    />
    <Box sx={{ width: '100vw', height: '100vh' }}>
      <Isoflow initialData={{ ...INITIAL_DATA, icons, colors }} />
    </Box>
  </React.StrictMode>
);
