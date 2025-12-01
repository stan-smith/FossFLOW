import React, { useMemo } from 'react';
import { Box, Paper, Fade } from '@mui/material';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { useScene } from 'src/hooks/useScene';
import { useResizeObserver } from 'src/hooks/useResizeObserver';
import { getSelectedItems, getSelectedConnectors, getSelectionCenter } from 'src/utils/selection';
import { AlignmentTools } from './AlignmentTools';
import { ArrangementTools } from './ArrangementTools';
import { GroupingTools } from './GroupingTools';
import { EdgeEditingTools } from './EdgeEditingTools';

export const FloatingToolbar = () => {
  const uiState = useUiStateStore((state) => state);
  const scene = useScene();
  const rendererEl = useUiStateStore((state) => state.rendererEl);
  const { size: rendererSize } = useResizeObserver(rendererEl);

  const selectedItems = useMemo(() => {
    return getSelectedItems(uiState);
  }, [uiState]);

  const selectedConnectors = useMemo(() => {
    return getSelectedConnectors(uiState, scene);
  }, [uiState, scene]);

  const selectionCenter = useMemo(() => {
    if (selectedItems.length > 0) {
      return getSelectionCenter(selectedItems, scene, rendererSize);
    }
    return null;
  }, [selectedItems, scene, rendererSize]);

  const hasSelection = selectedItems.length > 0 || selectedConnectors.length > 0;

  if (!hasSelection || !selectionCenter) {
    return null;
  }

  // Position toolbar above selection center
  const toolbarTop = Math.max(20, selectionCenter.y - 80);
  const toolbarLeft = Math.max(20, Math.min(selectionCenter.x - 200, rendererSize.width - 420));

  return (
    <Fade in={hasSelection}>
      <Paper
        elevation={4}
        sx={{
          position: 'absolute',
          top: toolbarTop,
          left: toolbarLeft,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          p: 1,
          zIndex: 1000,
          pointerEvents: 'auto'
        }}
      >
        {selectedItems.length > 0 && (
          <>
            <AlignmentTools items={selectedItems} />
            <ArrangementTools items={selectedItems} />
            <GroupingTools items={selectedItems} />
          </>
        )}
        {selectedConnectors.length > 0 && (
          <EdgeEditingTools connectorIds={selectedConnectors} />
        )}
      </Paper>
    </Fade>
  );
};

