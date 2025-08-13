import { createTheme, ThemeOptions } from '@mui/material';

interface CustomThemeVars {
  appPadding: {
    x: number;
    y: number;
  };
  toolMenu: {
    height: number;
  };
  customPalette: {
    [key in string]: string;
  };
}

declare module '@mui/material/styles' {
  interface Theme {
    customVars: CustomThemeVars;
  }

  interface ThemeOptions {
    customVars: CustomThemeVars;
  }
}

export const customVars: CustomThemeVars = {
  appPadding: {
    x: 40,
    y: 40
  },
  toolMenu: {
    height: 40
  },
  customPalette: {
    diagramBg: '#f6faff',
    defaultColor: '#a5b8f3'
  }
};

const createShadows = () => {
  const shadows = Array(25)
    .fill('none')
    .map((shadow, i) => {
      if (i === 0) return 'none';

      return `0px 10px 20px ${i - 10}px rgba(0,0,0,0.25)`;
    }) as Required<ThemeOptions>['shadows'];

  return shadows;
};

export const themeConfig: ThemeOptions = {
  customVars,
  shadows: createShadows(),
  typography: {
    h2: {
      fontSize: '4em',
      fontStyle: 'bold',
      lineHeight: 1.2
    },
    h5: {
      fontSize: '1.3em',
      lineHeight: 1.2
    },
    body1: {
      fontSize: '0.85em',
      lineHeight: 1.2
    },
    body2: {
      fontSize: '0.75em',
      lineHeight: 1.2
    }
  },
  palette: {
    secondary: {
      main: '#df004c'
    }
  },
  components: {
    MuiCard: {
      defaultProps: {
        elevation: 0,
        variant: 'outlined'
      }
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: 'white'
        }
      }
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
        disableTouchRipple: true
      }
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        variant: 'contained',
        disableRipple: true,
        disableTouchRipple: true
      },
      styleOverrides: {
        root: {
          textTransform: 'none'
        }
      }
    },
    MuiSvgIcon: {
      defaultProps: {
        color: 'action'
      },
      styleOverrides: {
        root: {
          width: 17,
          height: 17
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined'
      },
      styleOverrides: {
        root: {
          '.MuiInputBase-input': {}
        }
      }
    }
  }
};

export const theme = createTheme(themeConfig);
