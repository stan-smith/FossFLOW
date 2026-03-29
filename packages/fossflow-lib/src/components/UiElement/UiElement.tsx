import React from 'react';
import { Card, SxProps } from '@mui/material';

interface Props {
  children: React.ReactNode;
  sx?: SxProps;
  style?: React.CSSProperties;
}

export const UiElement = ({ children, sx, style }: Props) => {
  return (
    <Card
      sx={{
        borderRadius: 2.5,
        border: '1px solid rgba(255,255,255,0.08)',
        backgroundColor: 'rgba(26, 27, 35, 0.85)',
        backdropFilter: 'blur(20px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.04) inset',
        p: 0,
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
        '&:hover': {
          borderColor: 'rgba(255,255,255,0.12)'
        },
        ...sx
      }}
      style={style}
    >
      {children}
    </Card>
  );
};
