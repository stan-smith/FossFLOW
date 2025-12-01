import React from 'react';
import { GlobalStyles as MUIGlobalStyles } from '@mui/material';
import 'react-quill-new/dist/quill.snow.css';
import { customVars } from 'src/styles/theme';

export const GlobalStyles = () => {
  return (
    <MUIGlobalStyles
      styles={{
        '*, *::before, *::after': {
          boxSizing: 'border-box'
        },
        body: {
          margin: 0,
          padding: 0,
          backgroundColor: customVars.customPalette.diagramBg,
          backgroundImage:
            'radial-gradient(circle at top, rgba(255,255,255,0.18) 0, transparent 55%)',
          backgroundAttachment: 'fixed'
        }
      }}
    />
  );
};
