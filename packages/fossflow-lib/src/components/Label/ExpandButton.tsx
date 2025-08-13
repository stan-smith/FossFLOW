import React from 'react';
import { Button as MuiButton, SxProps } from '@mui/material';
import {
  ExpandMore as ReadMoreIcon,
  ExpandLess as ReadLessIcon
} from '@mui/icons-material';

interface Props {
  isExpanded: boolean;
  onClick: () => void;
  sx?: SxProps;
}

export const ExpandButton = ({ isExpanded, onClick, sx }: Props) => {
  return (
    <MuiButton
      sx={{
        px: 0.5,
        py: 0,
        height: 'auto',
        minWidth: 0,
        fontSize: '0.7em',
        bottom: 5,
        right: 5,
        color: 'common.white',
        ...sx
      }}
      onClick={onClick}
    >
      {isExpanded ? (
        <ReadLessIcon sx={{ color: 'common.white' }} />
      ) : (
        <ReadMoreIcon sx={{ color: 'common.white' }} />
      )}
    </MuiButton>
  );
};
