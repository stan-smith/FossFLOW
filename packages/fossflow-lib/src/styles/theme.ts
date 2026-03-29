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

// Check if mobile at theme creation time (used for initial values)
const isMobileViewport = typeof window !== 'undefined' && window.innerWidth <= 768;

export const customVars: CustomThemeVars = {
  appPadding: {
    x: isMobileViewport ? 8 : 24,
    y: isMobileViewport ? 8 : 24
  },
  toolMenu: {
    height: isMobileViewport ? 44 : 38
  },
  customPalette: {
    diagramBg: '#0f1117',
    defaultColor: '#6c8cff'
  }
};

const createShadows = () => {
  const shadows = Array(25)
    .fill('none')
    .map((shadow, i) => {
      if (i === 0) return 'none';

      return `0px ${i * 2}px ${i * 4}px rgba(0,0,0,0.4)`;
    }) as Required<ThemeOptions>['shadows'];

  return shadows;
};

// Accent colors
const accentBlue = '#3b82f6';
const accentViolet = '#8b5cf6';
const surfaceBg = '#1a1b23';
const surfaceBorder = 'rgba(255,255,255,0.08)';

export const themeConfig: ThemeOptions = {
  customVars,
  shadows: createShadows(),
  transitions: {
    duration: {
      shortest: 50,
      shorter: 100,
      short: 150,
      standard: 200,
      complex: 250,
      enteringScreen: 150,
      leavingScreen: 100
    }
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h2: {
      fontSize: '3.5em',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em'
    },
    h5: {
      fontSize: '1.2em',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em'
    },
    body1: {
      fontSize: '0.85em',
      lineHeight: 1.4,
      fontWeight: 400
    },
    body2: {
      fontSize: '0.75em',
      lineHeight: 1.4,
      fontWeight: 400
    }
  },
  palette: {
    mode: 'dark',
    primary: {
      main: accentBlue,
      light: '#60a5fa',
      dark: '#2563eb'
    },
    secondary: {
      main: accentViolet,
      light: '#a78bfa',
      dark: '#7c3aed'
    },
    background: {
      default: '#0f1117',
      paper: surfaceBg
    },
    text: {
      primary: 'rgba(255,255,255,0.92)',
      secondary: 'rgba(255,255,255,0.56)'
    },
    divider: surfaceBorder,
    action: {
      active: 'rgba(255,255,255,0.56)',
      hover: 'rgba(255,255,255,0.06)',
      selected: 'rgba(59,130,246,0.16)',
      disabled: 'rgba(255,255,255,0.2)',
      disabledBackground: 'rgba(255,255,255,0.04)'
    }
  },
  shape: {
    borderRadius: 10
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0f1117'
        }
      }
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
        variant: 'outlined'
      },
      styleOverrides: {
        root: {
          backgroundColor: surfaceBg,
          borderColor: surfaceBorder,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)'
        }
      }
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: surfaceBg
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
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
          letterSpacing: '-0.01em'
        },
        contained: {
          backgroundColor: accentBlue,
          '&:hover': {
            backgroundColor: '#2563eb'
          }
        }
      }
    },
    MuiSvgIcon: {
      defaultProps: {
        color: 'action'
      },
      styleOverrides: {
        root: {
          width: 18,
          height: 18
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined'
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: surfaceBorder
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255,255,255,0.16)'
            },
            '&.Mui-focused fieldset': {
              borderColor: accentBlue
            }
          },
          '.MuiInputBase-input': {
            color: 'rgba(255,255,255,0.92)'
          }
        }
      }
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(26, 27, 35, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${surfaceBorder}`,
          borderRadius: 10
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.06)'
          }
        }
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: surfaceBorder
        }
      }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(26, 27, 35, 0.95)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${surfaceBorder}`,
          borderRadius: 6,
          fontSize: '0.75rem',
          fontWeight: 500,
          padding: '6px 10px'
        },
        arrow: {
          color: 'rgba(26, 27, 35, 0.95)'
        }
      }
    }
  }
};

export const theme = createTheme(themeConfig);
