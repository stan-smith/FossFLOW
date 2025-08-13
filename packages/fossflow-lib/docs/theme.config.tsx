import React from 'react';

export default {
  darkMode: false,
  logo: () => {
    return (
      <span
        style={{
          fontFamily: 'Arial, sans-serif',
          letterSpacing: '-0.02em',
          fontWeight: 'bold',
          fontSize: '1.2em'
        }}
      >
        Isoflow Developer Documentation
      </span>
    );
  },
  nextThemes: {
    defaultTheme: 'light'
  },
  project: {
    link: 'https://github.com/markmanx/isoflow'
  },
  feedback: {
    content: null
  },
  editLink: {
    component: () => {
      return null;
    }
  },
  footer: {
    component: null
  }
};
