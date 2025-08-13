import React from 'react';
import { GlobalStyles as MUIGlobalStyles } from '@mui/material';
import 'react-quill/dist/quill.snow.css';

export const GlobalStyles = () => {
  return (
    <MUIGlobalStyles
      styles={{
        div: {
          boxSizing: 'border-box'
        }
      }}
    />
  );
};
