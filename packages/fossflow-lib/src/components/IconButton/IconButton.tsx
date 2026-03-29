import React, { useMemo } from 'react';
import { Button, Box, useTheme, useMediaQuery } from '@mui/material';
import Tooltip, { TooltipProps } from '@mui/material/Tooltip';

interface Props {
  name: string;
  Icon: React.ReactNode;
  isActive?: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  tooltipPosition?: TooltipProps['placement'];
  disabled?: boolean;
}

export const IconButton = ({
  name,
  Icon,
  onClick,
  isActive = false,
  disabled = false,
  tooltipPosition = 'bottom'
}: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:768px)');

  // Mobile: 44px minimum touch target (WCAG), Desktop: theme default (38px)
  const buttonSize = isMobile ? 44 : theme.customVars.toolMenu.height;
  const iconSize = isMobile ? 22 : 18;

  const iconColor = useMemo(() => {
    if (disabled) {
      return 'rgba(255,255,255,0.2)';
    }

    if (isActive) {
      return theme.palette.primary.main;
    }

    return 'rgba(255,255,255,0.56)';
  }, [disabled, isActive, theme]);

  return (
    <Tooltip
      title={isMobile ? '' : name}
      placement={tooltipPosition}
      enterDelay={600}
      enterNextDelay={400}
      arrow
    >
      <Button
        variant="text"
        onClick={onClick}
        disabled={disabled}
        sx={{
          borderRadius: isMobile ? 2 : 1.5,
          height: buttonSize,
          width: buttonSize,
          maxWidth: '100%',
          minWidth: 'auto',
          bgcolor: isActive ? 'rgba(59,130,246,0.14)' : 'transparent',
          p: 0,
          m: 0,
          transition: 'all 0.15s ease',
          // Larger active indicator on mobile
          ...(isMobile && isActive && {
            bgcolor: 'rgba(59,130,246,0.2)',
            boxShadow: 'inset 0 -2px 0 0 #3b82f6'
          }),
          '&:hover': {
            bgcolor: isActive
              ? 'rgba(59,130,246,0.2)'
              : 'rgba(255,255,255,0.06)'
          },
          '&:active': {
            bgcolor: 'rgba(255,255,255,0.1)'
          },
          '&.Mui-disabled': {
            opacity: 0.4
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            svg: {
              color: iconColor,
              transition: 'color 0.15s ease',
              width: iconSize,
              height: iconSize
            }
          }}
        >
          {Icon}
        </Box>
      </Button>
    </Tooltip>
  );
};
