import React, { useState, useCallback, useEffect } from 'react';
import { Box, Button, Stack } from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';
import { RichTextEditor } from '../RichTextEditor/RichTextEditor';

interface Props {
  value?: string;
  onChange: (value: string) => void;
  onDone: () => void;
  itemName?: string;
}

export const CommentEditor = ({ value, onChange, onDone, itemName }: Props) => {
  const [localValue, setLocalValue] = useState(value ?? '');

  // Sync local value with external value prop changes
  useEffect(() => {
    setLocalValue(value ?? '');
  }, [value]);

  const handleChange = useCallback((newValue: string) => {
    setLocalValue(newValue);
    onChange(newValue);
  }, [onChange]);

  const handleDone = useCallback(() => {
    onDone();
  }, [onDone]);

  const placeholder = itemName ? `Add comments to ${itemName}` : 'Add comments';

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        p: 2
      }}
    >
      <Stack spacing={2}>
        {/* DONE button and toolbar row */}
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Button
            variant="contained"
            startIcon={<CheckIcon />}
            onClick={handleDone}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark'
              },
              textTransform: 'none',
              fontWeight: 600,
              px: 2,
              py: 1
            }}
          >
            DONE
          </Button>
        </Stack>

        {/* Rich text editor */}
        <Box
          sx={{
            '& .ql-editor.ql-blank::before': {
              content: `"${placeholder}"`,
              fontStyle: 'normal',
              color: 'text.disabled'
            }
          }}
        >
          <RichTextEditor
            value={localValue}
            onChange={handleChange}
            readOnly={false}
            height={150}
          />
        </Box>
      </Stack>
    </Box>
  );
};

