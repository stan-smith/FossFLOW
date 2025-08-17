import React from 'react';
import { Icon as IconI } from 'src/types';
import { Grid, Box } from '@mui/material';
import { Icon } from './Icon';

interface Props {
  icons: IconI[];
  onMouseDown?: (icon: IconI) => void;
  onClick?: (icon: IconI) => void;
  onDoubleClick?: (icon: IconI) => void;
  hoveredIndex?: number;
  onHover?: (index: number) => void;
}

export const IconGrid = ({ icons, onMouseDown, onClick, onDoubleClick, hoveredIndex, onHover }: Props) => {
  return (
    <Grid container>
      {icons.map((icon, index) => {
        const isHovered = hoveredIndex === index;
        return (
          <Grid item xs={3} key={icon.id}>
            <Box
              sx={{
                backgroundColor: isHovered ? 'action.hover' : 'transparent',
                borderRadius: 1,
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={() => onHover?.(index)}
            >
              <Icon
                icon={icon}
                onClick={() => {
                  onClick?.(icon);
                }}
                onMouseDown={() => {
                  onMouseDown?.(icon);
                }}
                onDoubleClick={() => {
                  onDoubleClick?.(icon);
                }}
              />
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
};
