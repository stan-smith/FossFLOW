import React from 'react';
import { DeleteOutlined as DeleteIcon } from '@mui/icons-material';
import { Button } from '@mui/material';

interface Props {
  onClick: () => void;
}

export const DeleteButton = ({ onClick }: Props) => {
  return (
    <Button
      color="error"
      size="small"
      variant="outlined"
      startIcon={<DeleteIcon color="error" />}
      onClick={onClick}
    >
      Delete
    </Button>
  );
};
