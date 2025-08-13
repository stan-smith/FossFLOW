// This is an entry point for running the app in dev mode.
import React from 'react';
import ReactDOM from 'react-dom/client';
import GlobalStyles from '@mui/material/GlobalStyles';
import { ThemeProvider, createTheme } from '@mui/material';
import { Examples } from './examples';
import { themeConfig } from './styles/theme';

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
    <ThemeProvider theme={createTheme({ ...themeConfig, palette: {} })}>
      <Examples />
    </ThemeProvider>
  </React.StrictMode>
);
