import React, { useMemo } from 'react';
import { Button, Box, useTheme } from '@mui/material';
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
      title={name}
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
          borderRadius: 1.5,
          height: theme.customVars.toolMenu.height,
          width: theme.customVars.toolMenu.height,
          maxWidth: '100%',
          minWidth: 'auto',
          bgcolor: isActive ? 'rgba(59,130,246,0.14)' : 'transparent',
          p: 0,
          m: 0,
          transition: 'all 0.15s ease',
          '&:hover': {
            bgcolor: isActive
              ? 'rgba(59,130,246,0.2)'
              : 'rgba(255,255,255,0.06)'
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
              width: 18,
              height: 18
            }
          }}
        >
          {Icon}
        </Box>
      </Button>
    </Tooltip>
  );
};
