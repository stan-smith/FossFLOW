import React from 'react';
import { Box } from '@mui/material';
import { useScene } from 'src/hooks/useScene';
import { ColorSwatch } from './ColorSwatch';

interface Props {
  onChange: (color: string) => void;
  activeColor?: string;
}

export const ColorSelector = ({ onChange, activeColor }: Props) => {
  const { colors } = useScene();

  return (
    <Box>
      {colors.map((color) => {
        return (
          <ColorSwatch
            key={color.id}
            hex={color.value}
            onClick={() => {
              return onChange(color.id);
            }}
            isActive={activeColor === color.id}
          />
        );
      })}
    </Box>
  );
};
