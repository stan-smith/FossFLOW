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
        borderRadius: 2,
        boxShadow: 1,
        borderColor: 'grey.400',
        p: 0,
        ...sx
      }}
      style={style}
    >
      {children}
    </Card>
  );
};
