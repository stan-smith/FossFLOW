import React from 'react';
import { Menu, MenuItem } from '@mui/material';

interface MenuItemI {
  label: string;
  onClick: () => void;
}

interface Props {
  onClose: () => void;
  anchorEl?: HTMLElement | null;
  menuItems: MenuItemI[];
}

export const ContextMenu = ({
  onClose,
  anchorEl,
  menuItems
}: Props) => {
  return (
    <Menu
      open={!!anchorEl}
      anchorEl={anchorEl}
      onClose={onClose}
    >
      {menuItems.map((item, index) => {
        return <MenuItem key={index} onClick={item.onClick}>{item.label}</MenuItem>;
      })}
    </Menu>
  );
};
