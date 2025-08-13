import React, { useMemo } from 'react';
import ReactQuill from 'react-quill';
import { Box } from '@mui/material';

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  height?: number;
  styles?: React.CSSProperties;
}

const tools = ['bold', 'italic', 'underline', 'strike', 'link'];

export const MarkdownEditor = ({
  value,
  onChange,
  readOnly,
  height = 120,
  styles
}: Props) => {
  const modules = useMemo(() => {
    if (!readOnly)
      return {
        toolbar: tools
      };

    return { toolbar: false };
  }, [readOnly]);

  return (
    <Box
      sx={{
        '.ql-toolbar.ql-snow': {
          border: 'none',
          pt: 0,
          px: 0
        },
        '.ql-toolbar.ql-snow + .ql-container.ql-snow': {
          border: '1px solid',
          borderColor: 'grey.300',
          borderTop: 'auto',
          borderRadius: 1.5,
          height,
          color: 'text.secondary'
        },
        '.ql-container.ql-snow': {
          ...(readOnly ? { border: 'none' } : {}),
          ...styles
        },
        '.ql-editor': {
          ...(readOnly ? { p: 0 } : {})
        }
      }}
    >
      <ReactQuill
        theme="snow"
        value={value ?? ''}
        readOnly={readOnly}
        onChange={onChange}
        formats={tools}
        modules={modules}
      />
    </Box>
  );
};
