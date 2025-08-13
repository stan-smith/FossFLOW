import React from 'react';
import { MenuItem as MuiMenuItem, ListItemIcon } from '@mui/material';

export interface Props {
  onClick?: () => void;
  Icon?: React.ReactNode;
  children: string | React.ReactNode;
  disabled?: boolean;
}

export const MenuItem = ({
  onClick,
  Icon,
  children,
  disabled = false
}: Props) => {
  return (
    <MuiMenuItem onClick={onClick} disabled={disabled}>
      <ListItemIcon sx={{ opacity: disabled ? 0.5 : 1 }}>{Icon}</ListItemIcon>
      {children}
    </MuiMenuItem>
  );
};
