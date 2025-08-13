import {
  MuiColorButtonProps,
  MuiColorInput,
  MuiColorInputProps
} from 'mui-color-input';
import React from 'react';
import { ColorSwatch } from './ColorSwatch';

interface Props extends Omit<MuiColorInputProps, 'ref'> {}

const ColorButtonElement = ({ bgColor, onClick }: MuiColorButtonProps) => {
  return <ColorSwatch hex={bgColor} onClick={onClick} />;
};
export const ColorPicker = ({ value, onChange }: Props) => {
  return (
    <MuiColorInput
      size="small"
      variant="standard"
      format="hex"
      value={value}
      onChange={onChange}
      InputProps={{ disableUnderline: true, type: 'hidden' }}
      Adornment={ColorButtonElement}
    />
  );
};
