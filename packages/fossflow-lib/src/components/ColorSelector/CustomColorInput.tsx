import React, { useState, useEffect } from 'react';
import { Box, TextField, IconButton, Tooltip } from '@mui/material';
import { Colorize as ColorizeIcon } from '@mui/icons-material';
import { ColorPicker } from './ColorPicker';

interface EyeDropper {
  open: (options?: { signal?: AbortSignal }) => Promise<{ sRGBHex: string }>;
}

declare global {
  interface Window {
    EyeDropper?: {
      new (): EyeDropper;
    };
  }
}

interface Props {
  value: string;
  onChange: (color: string) => void;
}

export const CustomColorInput = ({ value, onChange }: Props) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleEyeDropper = async () => {
    if (!window.EyeDropper) return;
    const eyeDropper = new window.EyeDropper();
    try {
      const result = await eyeDropper.open();
      onChange(result.sRGBHex);
    } catch (e) {
      // User canceled or failed
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    // If it's a valid hex, update immediately
    if (/^#[0-9A-F]{6}$/i.test(newValue)) {
      onChange(newValue);
    }
  };

  const handleBlur = () => {
    // On blur, if invalid, revert to prop value
    if (!/^#[0-9A-F]{6}$/i.test(localValue)) {
      setLocalValue(value);
    }
  };

  const hasEyeDropper = typeof window !== 'undefined' && !!window.EyeDropper;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <ColorPicker value={value} onChange={onChange} />
      <TextField
        value={localValue}
        onChange={handleTextChange}
        onBlur={handleBlur}
        variant="standard"
        size="small"
        InputProps={{
          disableUnderline: true,
          sx: { 
            fontSize: '0.875rem',
            color: 'text.secondary',
            width: '80px'
          }
        }}
      />
      {hasEyeDropper && (
        <Tooltip title="Pick color from screen">
          <IconButton onClick={handleEyeDropper} size="small">
            <ColorizeIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};
