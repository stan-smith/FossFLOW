import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const Searchbox = ({ value, onChange }: Props) => {
  return (
    <TextField
      fullWidth
      placeholder="Search icons"
      value={value}
      onChange={(e) => {
        return onChange(e.target.value as string);
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        )
      }}
    />
  );
};
