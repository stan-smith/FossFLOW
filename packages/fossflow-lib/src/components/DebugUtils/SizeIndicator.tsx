import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import { useDiagramUtils } from 'src/hooks/useDiagramUtils';

const BORDER_WIDTH = 6;

export const SizeIndicator = () => {
  const { getUnprojectedBounds } = useDiagramUtils();
  const diagramBoundingBox = useMemo(() => {
    return getUnprojectedBounds();
  }, [getUnprojectedBounds]);

  return (
    <Box
      sx={{
        position: 'absolute',
        border: `${BORDER_WIDTH}px solid red`
      }}
      style={{
        width: diagramBoundingBox.width,
        height: diagramBoundingBox.height,
        left: diagramBoundingBox.x - BORDER_WIDTH,
        top: diagramBoundingBox.y - BORDER_WIDTH
      }}
    />
  );
};
