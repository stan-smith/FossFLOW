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
        html: {
          /* Prevent pull-to-refresh and overscroll on mobile */
          overscrollBehavior: 'none',
        },
        body: {
          margin: 0,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          backgroundColor: '#0f1117',
          color: 'rgba(255,255,255,0.92)',
          /* Prevent overscroll bounce on mobile */
          overscrollBehavior: 'none',
          position: 'fixed',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        },
        '#root': {
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        },
        /* Canvas area: prevent all browser touch gestures so our
           pinch-to-zoom and drag-and-drop work without conflict */
        'canvas, [data-renderer], .fossflow-renderer': {
          touchAction: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
          WebkitTouchCallout: 'none',
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
        },
        /* Mobile-specific: disable text selection on interactive elements */
        '@media (max-width: 768px)': {
          'button, [role="button"], .MuiButtonBase-root': {
            WebkitTapHighlightColor: 'transparent',
            WebkitTouchCallout: 'none',
          }
        }
      }}
    />
  );
};
