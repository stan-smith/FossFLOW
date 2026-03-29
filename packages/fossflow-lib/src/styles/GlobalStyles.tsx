import React from 'react';
import { GlobalStyles as MUIGlobalStyles } from '@mui/material';
import 'react-quill-new/dist/quill.snow.css';

export const GlobalStyles = () => {
  return (
    <MUIGlobalStyles
      styles={{
        '@import': "url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap')",
        '*, *::before, *::after': {
          boxSizing: 'border-box'
        },
        body: {
          margin: 0,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          backgroundColor: '#0f1117',
          color: 'rgba(255,255,255,0.92)'
        },
        /* Custom scrollbar */
        '::-webkit-scrollbar': {
          width: '6px',
          height: '6px'
        },
        '::-webkit-scrollbar-track': {
          background: 'transparent'
        },
        '::-webkit-scrollbar-thumb': {
          background: 'rgba(255,255,255,0.12)',
          borderRadius: '3px'
        },
        '::-webkit-scrollbar-thumb:hover': {
          background: 'rgba(255,255,255,0.2)'
        }
      }}
    />
  );
};
