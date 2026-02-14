import React, { useMemo } from 'react';
import ReactQuill from 'react-quill-new';
import { Box } from '@mui/material';
import RichTextEditorErrorBoundary from './RichTextEditorErrorBoundary';

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  height?: number;
  styles?: React.CSSProperties;
}

// Rich text formatting tools
const tools = [
  'bold',
  'italic',
  'underline',
  'strike',
  'link',
  { header: [1, 2, 3, false] },
  { list: 'ordered' },
  { list: 'bullet' },
  'blockquote',
  'code-block'
];

// Formats that Quill should recognize
const formats = [
  'bold',
  'italic',
  'underline',
  'strike',
  'link',
  'header',
  'list',
  'bullet',
  'blockquote',
  'code-block'
];

export const RichTextEditor = ({
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
    <RichTextEditorErrorBoundary>
      <Box
        sx={{
          '.ql-toolbar.ql-snow': {
            border: 'none',
            pt: 0,
            px: 0,
            pb: 1 // Add padding below toolbar to prevent overlap, might remove or make configurable at some point
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
            whiteSpace: 'pre-wrap', // Preserve multiple spaces and tabs
            ...(readOnly ? { p: 0 } : {}),
            padding: '12px 15px' // Add consistent padding to prevent text overlap with tooltips
          },
          '.ql-tooltip': {
            zIndex: 1000 // Ensure tooltips appear above content but don't obscure text
          }
        }}
      >
        <ReactQuill
          theme="snow"
          value={value ?? ''}
          readOnly={readOnly}
          onChange={onChange}
          formats={formats}
          modules={modules}
        />
      </Box>
    </RichTextEditorErrorBoundary>
  );
};
